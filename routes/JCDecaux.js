const express = require('express');
const router = express.Router();
const request = require('request');

// const arrayEach = (array, iterator) => {
//     for (let i = 0; i < array.length; i += 1) {
//         const item = array[i];
//         if (iterator(item, i) === false) {
//             return false;
//         }
//     }
//
//     return true;
// };
//
// const objectEach = (object, fn) => arrayEach(Object.keys(object), (key, i) => fn(key, object[key], i));

const requete = (url) => {
    return new Promise((resolve, reject) => {
        request({
            url,
            method: 'GET'
        }, function (err, res, body) {
            if (err) {
                reject(err);
                return;
            }
            resolve(body);
        });
    });
}

const formatUrlJCDecaux = (arrVille, keyAPI) => {
    const arrUrl = [];
    arrVille.forEach(ville => {
        arrUrl.push(`https://api.jcdecaux.com/vls/v3/stations?contract=${ville}&apiKey=${keyAPI}`);
    });
    return arrUrl;
}

const getData = new Promise((resolve, reject) => {
    const arrVille = [
        'amiens',
        'cergy-pontoise',
        'creteil',
        'lyon',
        'marseille',
        'mulhouse',
        'nancy',
        'nantes',
        'rouen',
        'toulouse'
    ];
    const keyAPI = "038ff7cd8c57ac264bbb324b1266fc077ad8885b";
    const urls = formatUrlJCDecaux(arrVille, keyAPI);
    const arrProm = [];
    const res = [];
    let dataParsed;

    urls.forEach(url => {
        arrProm.push(requete(url));
    });
    Promise.all(arrProm).then((values) => {
        values.forEach((value) => {
            dataParsed = JSON.parse(value);
            dataParsed.forEach((data) => {
                res.push(data);
            });
        })
    });
    resolve(res);
});

const formatDataToOrion = (arrData) => {
    let arr = [];
    let newObj = {}
    let date = new Date();
    let d = date.toJSON();

    arrData.forEach((data, idx) => {
        if (idx === 0) console.log(data);
        newObj.id = `${data.number}-BikeHireDockingStation-${data.contractName}-${d}`;
        newObj.type = "BikeHireDockingStation";
        newObj.status = {
            "value": data.status
        };
        newObj.connected = {
            "value" : data.connected
        };
        newObj.availableBikeNumber = {
            "value" : data.totalStands.availabilities.bikes,
            "mechanicalBikes" : data.totalStands.availabilities.mechanicalBikes,
            "electricalBikes" : data.totalStands.availabilities.electricalBikes,
            "metadata" : {
                "timestamp": {
                    "type" : "Datetime",
                    "value" : data.lastUpdate
                }
            }

        };
        newObj.capacity = {
            "value" : data.totalStands.capacity

        };
        newObj.freeSlotNumber = {
            "value" : data.totalStands.availabilities.stands
        };
        newObj.location = {
            "type": "geo:json",
            "value": {
                "type": "Point",
                "coordinates": [data.position.longitude, data.position.latitude]
            }
        };
        newObj.address = {
            "type": "Postal Address",
            "value" : {
                "addressLocality" : data.contractName,
                "streetAddress" : data.address
            }
        };
        newObj.dateCreated = {
            "type": "DateTime",
            "value": d
        };
        newObj.dateModified = {
            "type": "DateTime",
            "value": data.lastUpdate
        };
        newObj.Stationname = {
            "value" : data.name
        };
        arr.push(newObj);
        newObj = {};
    });
    return arr;
}

router.get('/', async function(req, res, next) {
    const arrData = await getData;
    const data = formatDataToOrion(arrData);
    res.send(data);
});

module.exports = router;
