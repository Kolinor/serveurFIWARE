const { requete } = require('./request');

const insertAll = async (entities) => {
    const objToSend = {
        "actionType": "append",
        "entities": entities
    }
    const reponse = await requete('http://localhost:1026/v2/op/update', 'PUT', objToSend);
    return reponse;
}

module.exports = {
    insertAll
};