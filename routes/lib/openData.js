const { requete } = require('./request');

const getData = async () => {
    const url = "https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&q=&rows=200&facet=name&facet=is_installed&facet=is_renting&facet=is_returning&facet=nom_arrondissement_communes&exclude.is_installed=NON"

    const res = await requete(url, 'GET');
    console.log(res);
    return res;
};

const formatDataToOrion = (arrData) => {
    let arr = [];
    let newObj = {}
    let date = new Date();
    let d = date.toJSON();
    const regex = /[,'-()/]/gm;

    arrData.forEach((data, idx) => {
        newObj.id = `${data.records.fields.stationcode}-${data.records.fields.nom_arrondissement_communes}-${d}`;
        newObj.type = "BikeHireDockingStation";
        newObj.status = {
            "value": null
        };
        newObj.connected = {
            "value" : data.records.fields.is_installed
        };
        newObj.availableBikeNumber = {
            "value" : data.records.fields.numbikesavailable,
            "metadata" : {
                "timestamp": {
                    "type" : "Datetime",
                    "value" : data.records.record_timestamp
                }
            }

        };
        newObj.mechanicalBikes = {
            "value" : data.records.fields.mechanical,
        };
        newObj.electricalBikes = {
            "value": data.records.fields.ebike,
        };
        newObj.capacity = {
            "value" : data.records.fields.capacity

        };
        newObj.freeSlotNumber = {
            "value" : data.records.fields.numdocksavailable
        };

        newObj.location = {
            "type": "geo:json",
            "value": {
                "type": "Point",
                "coordinates": [data.records.geometry.coordinates]
            }
        };
        newObj.address = {
            "type": "PostalAddress",
            "value" : {
                "addressLocality" : data.records.fields.name,
                "streetAddress" : data.records.fields.nom_arrondissement_communes
            }
        };

        newObj.dateCreated = {
            "type": "DateTime",
            "value": null
        };
        newObj.dateModified = {
            "type": "DateTime",
            "value": data.records.duedate
        };
        newObj.Stationname = {
            "value" : data.records.fields.name
        };
        arr.push(newObj);
        newObj = {};
    });
    return arr;
};

const getOpenData = async () => {
    const arrData = await getData;
    console.log(arrData);
    return formatDataToOrion(arrData);
};

module.exports = {
    getOpenData
};