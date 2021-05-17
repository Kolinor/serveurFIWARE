const express = require('express');
const router = express.Router();
const { insertAllEntities, deleteAllEntities } = require('./lib/orion');
const { getJcdecaux } = require('./lib/JCDecaux');
const { getOpenData } = require('./lib/openData');

const putAll = async (req, res) => {
    const responseA = await insertAllEntities(await getJcdecaux());
    const responseB = await insertAllEntities(await getOpenData());

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