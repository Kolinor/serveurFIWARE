const request = require('request');

const requete = (url, method, json) => {
    let options = {
        url,
        method
    };
    if (json) {
        options.headers = {
            'Content-Type': 'application/json'
        }
        options.json = true;
        options.body = json;
    }
    return new Promise((resolve, reject) => {
        request(options, function (err, res, body) {
            if (err) {
                reject(err);
                return;
            }
            resolve(body);
        });
    });
}

module.exports = {
    requete
};