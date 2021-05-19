const express = require('express');
const router = express.Router();
const { insertAllEntities, deleteAllEntities } = require('./lib/orion');
const { getJcdecaux } = require('./lib/JCDecaux');
const { getOpenData } = require('./lib/openData');

const putAll = async (req, res) => {
    try {
        await insertAllEntities(await getJcdecaux());
        await insertAllEntities(await getOpenData());
        // const a = await getOpenData();
        //
        // const b = [];
        // for (let i = 0 ; i < 200; i++) b.push(a[i]);
        //
        // console.log(b[68]);
        // console.log(b[69]);
        // console.log(b[70]);
        // await insertAllEntities(b);

        res.send();
    } catch(err) {
        console.error(err);
    }
};

const deleteAll = async (req, res) => {
    await deleteAllEntities();
    res.send();
};

const update = async (req, res) => {
    try {
        await deleteAllEntities();
        await insertAllEntities(await getJcdecaux());
        await insertAllEntities(await getOpenData());
        res.send();
    } catch(err) {
        console.error(err);
    }
};

router
    .route('/InsertAll')
    .put(putAll);

router
    .route('/DeleteAll')
    .delete(deleteAll);

router
    .route('/Update')
    .put(update);

module.exports = router;