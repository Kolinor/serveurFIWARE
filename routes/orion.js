const express = require('express');
const router = express.Router();
const { insertAllEntities, deleteAllEntities } = require('./lib/orion');
const { getJcdecaux } = require('./lib/JCDecaux');
const { getOpenData } = require('./lib/openData');

const putAll = async (req, res) => {
    let arrEntities = [];
    const a = await getJcdecaux();
    const b = await getOpenData();
    arrEntities = a.concat(arrEntities);
    arrEntities = b.concat(arrEntities);

    const response = await insertAllEntities(arrEntities);
    res.send(response);
};

const deleteAll = async (req, res) => {
    await deleteAllEntities();
    res.send();
};

router
    .route('/InsertAll')
    .put(putAll);

router
    .route('/DeleteAll')
    .delete(deleteAll);

module.exports = router;