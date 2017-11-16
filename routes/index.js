var express = require('express');
var router = express.Router();
var mysql = require('../db.js');

// Home Page
router.get('/', function(req, res){

    mysql.pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
    });

    res.render('index');
});

module.exports = router;