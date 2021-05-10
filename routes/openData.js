const express = require('express');
const router = express.Router();
const { getOpenData } = require('./lib/openData');

const opendata = async (req, res) => {
    try {
        res.send(await getOpenData());
    } catch(err) {
        console.error(err);
    }
};

router
    .route('/')
    .get(opendata);

module.exports = router;