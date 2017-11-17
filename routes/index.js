var express = require('express');
var router = express.Router();
var mysql = require('../db.js');
var passport = require('passport');

var bcrypt = require('bcryptjs');
const saltRounds = 10;

// Home Page
router.get('/', function(req, res){
    res.render('index', {title: 'Welcome'});
});

// Courses Page
router.get('/courses', function(req, res){
    res.render('courses', {title: 'Courses'});
});

// Login Page
router.get('/login', function(req, res, next){
    res.render('login', {title: 'Login'});
});

// Login Request Handler
router.post('/login', passport.authenticate('local', {
    successRedirect: '/users/profile',
    failureRedirect: '/login'
}));

// Logout Request Handler
router.get('/logout', function(req, res, next){
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

// Register Request Handler
router.post('/register', function(req, res, next){
    // Input validation
    req.checkBody('reg_fullname', 'Name field cannot be empty.').notEmpty();
    req.checkBody('reg_email', 'The email you entered is invalid, please try again.').isEmail();
    req.checkBody('reg_email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
    req.checkBody('reg_pw', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody('reg_pw', 'Password must include one lowercase character, one uppercase character, a number, and a special character.').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i');
    req.checkBody('reg_repeat_pw', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody('reg_repeat_pw', 'Passwords do not match, please try again.').equals(req.body.reg_pw);

    // Display any errors
    var errors = req.validationErrors();
    if(errors){
        console.log('errors: ' + JSON.stringify(errors));
        res.render('login', {title: 'Login', errors: errors})
        return;
    }

    const name = req.body.reg_fullname;
    const email = req.body.reg_email;
    const password = req.body.reg_pw;

    // hash password
    bcrypt.hash(password, saltRounds, function(err, hash){
        // Save user to database
        mysql.pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash], function (err, result){
            if(err){
                next(err);
                return;
            }

            const user_id = result.insertId;

            // Log user in and redirect to personalized home page
            req.login(user_id, function (err) {
                res.redirect('/users/profile')
            });
        });
    });
});

passport.serializeUser(function(user_id, done){
    done(null, user_id);
});

passport.deserializeUser(function(user_id, done){
    done(null, user_id);
});

module.exports = router;