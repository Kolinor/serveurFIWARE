const { requete } = require('./request');

const deleteAnEntity = async (id) => {
    const url = 'http://localhost:1026/v2/entities/' + id;
    return await requete(url, 'DELETE');
};

const insertAllEntities = async (entities) => {
    const objToSend = {
        actionType: "append",
        entities: []
    };
    let error;
    console.log(entities.length);

    for (const entity of entities) {
        const idx = entities.indexOf(entity);
        objToSend.entities.push(entity);
        if (idx % 300 === 0) {
            error = await requete('http://localhost:1026/v2/op/update', 'POST', objToSend);
            if(error) console.error(error);
            objToSend.entities = [];
            continue;
        }
        if (idx === entities.length-1) {
            error = await requete('http://localhost:1026/v2/op/update', 'POST', objToSend);
            if(error) console.error(error);
        }
    }
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