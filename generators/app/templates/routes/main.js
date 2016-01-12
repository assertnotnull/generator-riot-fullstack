var express = require('express');
var router = express.Router();
var bundles = require('../bundle.result.json');

module.exports = function() {

    router.get('/', function(req, res) {
        res.render('main', {
            title: 'Main',
            bundle: bundles
        });
    });

    return router;
};
