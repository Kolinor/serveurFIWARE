const { requete } = require('./request');

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
        arrProm.push(requete(url, 'GET'));
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
    const regex = /[,'-()/]/gm;

    arrData.forEach((data, idx) => {
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
            "metadata" : {
                "timestamp": {
                    "type" : "Datetime",
                    "value" : data.lastUpdate
                }
            }

        };
        newObj.mechanicalBikes = {
            "value": data.totalStands.availabilities.mechanicalBikes
        };
        newObj.electricalBikes = {
            "value": data.totalStands.availabilities.electricalBikes
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
            "type": "PostalAddress",
            "value" : {
                "addressLocality" : data.contractName.replace(regex, ' '),
                "streetAddress" : data.address.replace(regex, ' ')
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
            "value" : data.name.replace(regex, ' ')
        };
        arr.push(newObj);
        newObj = {};
    });
    return arr;
};

const getJcdecaux = async () => {
    const arrData = await getData;
    return formatDataToOrion(arrData);
};

module.exports = {
    getJcdecaux
};