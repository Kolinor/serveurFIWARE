const { requete } = require('./request');

const getData = async () => {
    const url = "https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&q=&rows=200&facet=name&facet=is_installed&facet=is_renting&facet=is_returning&facet=nom_arrondissement_communes&exclude.is_installed=NON";

    const res = await requete(url, 'GET');
    const data = JSON.parse(res);
    return data;
};

const formatDataToOrion = (datas) => {
    let arr = [];
    let newObj = {}
    let date = new Date();
    let d = date.toJSON();
    const regex = /[,'-()/]/gm;

    datas.records.forEach((data, idx) => {
        newObj.id = `${data.fields.stationcode}-BikeHireDockingStation-${data.fields.nom_arrondissement_communes}-${d}`;
        newObj.type = "BikeHireDockingStation";
        newObj.status = {
            "value": null
        };
        newObj.connected = {
            "value" : data.fields.is_installed === 'OUI'
        };
        newObj.availableBikeNumber = {
            "value" : data.fields.numbikesavailable,
            "metadata" : {
                "timestamp": {
                    "type" : "Datetime",
                    "value" : data.record_timestamp
                }
            }

        };
        newObj.mechanicalBikes = {
            "value" : data.fields.mechanical,
        };
        newObj.electricalBikes = {
            "value": data.fields.ebike,
        };
        newObj.capacity = {
            "value" : data.fields.capacity

        };
        newObj.freeSlotNumber = {
            "value" : data.fields.numdocksavailable
        };
        newObj.location = {
            "type": "geo:json",
            "value": {
                "type": "Point",
                "coordinates": [data.geometry.coordinates]
            }
        };
        newObj.address = {
            "type": "PostalAddress",
            "value" : {
                "addressLocality" : data.fields.name.replace(regex, ' '),
                "streetAddress" : data.fields.nom_arrondissement_communes.replace(regex, ' ')
            }
        };
        newObj.dateCreated = {
            "type": "DateTime",
            "value": d
        };
        newObj.dateModified = {
            "type": "DateTime",
            "value": data.fields.duedate
        };
        newObj.Stationname = {
            "value" : data.fields.name.replace(regex, ' ')
        };
        arr.push(newObj);
        newObj = {};
    });
    return arr;
};

const getOpenData = async () => {
    const arrData = await getData();
    return formatDataToOrion(arrData);
};

module.exports = {
    getOpenData
};