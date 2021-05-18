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
    const reponse = await requete('http://localhost:1026/v2/types', 'GET');
    const [reponseParsed] = JSON.parse(reponse);

    if(!reponseParsed) return;

    const i = (reponseParsed.count / 1000);
    const arr = [];
    for (let y = 0; y < i; y++) arr.push(y);

    for (const value of arr) {
        const reponseA = await requete('http://localhost:1026/v2/entities?limit=1000', 'GET');
        const reponseAParsed = JSON.parse(reponseA);

        for (const value of reponseAParsed) {
            await deleteAnEntity(value.id);
        }
    }
};

module.exports = {
    insertAllEntities,
    deleteAllEntities
};