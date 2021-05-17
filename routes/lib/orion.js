const { requete } = require('./request');

const deleteAnEntity = async (id) => {
    const url = 'http://localhost:1026/v2/entities/' + id;
    return await requete(url, 'DELETE');
};

const insertAllEntities = async (entities) => {
    const objToSend = {
        "actionType": "append",
        "entities": []
    };
    let error;

    for (const entity of entities) {
        const idx = entities.indexOf(entity);
        objToSend.entities.push(entity);
        if (idx % 200 === 0) {
            error = await requete('http://localhost:1026/v2/op/update', 'POST', objToSend);
            if(error) console.error(error);
            objToSend.entities = [];
            continue;
        }
        if (idx === entities.length) await requete('http://localhost:1026/v2/op/update', 'POST', objToSend);
    }
    // const reponse = await requete('http://localhost:1026/v2/op/update', 'POST', objToSend);
    // return reponse;
};

const deleteAllEntities = async () => {
    const reponse = await requete('http://localhost:1026/v2/entities?limit=1000', 'GET');
    const reponseParsed = JSON.parse(reponse);

    for (const value of reponseParsed) {
        await deleteAnEntity(value.id);
    }
};

module.exports = {
    insertAllEntities,
    deleteAllEntities
};