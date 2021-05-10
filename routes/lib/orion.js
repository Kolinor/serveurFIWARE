const { requete } = require('./request');

const insertAll = async (entities) => {
    const newArr = [];
    // entities.forEach((entity, idx) => {
    //     if(idx < 300) {
    //         // console.clear();
    //         // if(299) console.log(entity);
    //         // console.log(entity);
    //         newArr.push(entity);
    //     }
    // })

    const objToSend = {
        "actionType": "append",
        "entities": entities
    };
    const reponse = await requete('http://localhost:1026/v2/op/update', 'POST', objToSend);
    return reponse;
}

module.exports = {
    insertAll
};