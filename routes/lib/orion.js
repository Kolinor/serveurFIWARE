const { requete } = require('./request');

const deleteAnEntity = async (id) => {
    const url = 'http://localhost:1026/v2/entities/' + id;
    return await requete(url, 'DELETE');
};

const insertAllEntities = async (entities) => {
    const objToSend = {
        "actionType": "append",
        "entities": entities
    };
    const reponse = await requete('http://localhost:1026/v2/op/update', 'POST', objToSend);
    return reponse;
};

const deleteAllEntities = async () => {
    const reponse = await requete('http://localhost:1026/v2/entities', 'GET');
    const reponseParsed = JSON.parse(reponse);

    reponseParsed.forEach(async (value) => await deleteAnEntity(value.id));
};

module.exports = {
    insertAllEntities,
    deleteAllEntities
};