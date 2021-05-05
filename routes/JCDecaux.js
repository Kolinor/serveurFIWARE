const express = require('express');
const router = express.Router();
const { getJcdecaux } = require('./lib/JCDecaux');

const jcdecaux = async (req, res) => {
    try {
        res.send(await getJcdecaux());
    } catch(err) {
        console.error(err);
    }
};

router
    .route('/')
    .get(jcdecaux);

module.exports = router;