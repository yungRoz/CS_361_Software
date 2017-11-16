var express = require('express');
var router = express.Router();
var mysql = require('../db.js');

var bcrypt = require('bcryptjs');
const saltRounds = 10;

// Login Page
router.get('/login', function(req, res, next){
    res.render('login');
});

// Login Request Handler
router.post('/login', function(req, res, next){
    const email = req.body.lg_email;
    const password = req.body.lg_pw;
});

// Register Request Handler
router.post('/register', function(req, res, next){
    // Input validation
    req.checkBody('su_fullname', 'Name field cannot be empty.').notEmpty();
    req.checkBody('su_email', 'The email you entered is invalid, please try again.').isEmail();
    req.checkBody('su_email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
    req.checkBody('su_pw', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody('su_pw', 'Password must include one lowercase character, one uppercase character, a number, and a special character.').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i');
    req.checkBody('su_repeat_pw', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody('su_repeat_pw', 'Passwords do not match, please try again.').equals(req.body.su_pw);

    // Display any errors
    var errors = req.validationErrors();
    if(errors){
        console.log('errors: ' + JSON.stringify(errors));
        res.render('login', { errors: errors })
        return;
    }

    const name = req.body.su_fullname;
    const email = req.body.su_email;
    const password = req.body.su_pw;

    // hash password
    bcrypt.hash(password, saltRounds, function(err, hash){
        // Save user to database
        mysql.pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash], function (err, result) {
            if (err) {
                next(err);
                return;
            }

            // render user's home page
            res.render('index');
        });
    });
});

module.exports = router;