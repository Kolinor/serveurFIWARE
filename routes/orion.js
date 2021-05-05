const express = require('express');
const router = express.Router();
const { insertAll } = require('./lib/orion');
const { getJcdecaux } = require('./lib/JCDecaux');

const putAll = async (req, res) => {
    const entities = await getJcdecaux();
    const response = await insertAll(entities);
    res.send(response);
};

router
    .route('/InsertAll')
    .put(putAll);

module.exports = router;