var express = require('express');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var User = require('../models/user.js');

// Home Page
router.get('/', function(req, res){

    if (req.user) {

      User.getUserByEmail(req.user.email, function(err, user){
        User.getActiveCourseLectures(user, function(wl, lecture) {
          User.getUserProjects(user, function (err, projects) {
            if (err) {
              res.render('index', {title: 'Welcome'});
            } else {
              var locals = {title: 'Welcome'};
              locals.currentLecture = lecture;
              if (projects.length) {
                locals.currentProject = projects[0];
              }
              res.render('index', locals);
            }
          });
        });
      });

    } else {

      res.render('index', {title: 'Welcome'});

    }
});

// Courses Page
router.get('/courses', function(req, res){
    res.render('courses', {title: 'Courses'});
});

// Help Page
router.get('/help', function(req, res){
    res.render('help', {title: 'Help'});
});

// Login Page
router.get('/login', function(req, res, next){
    res.render('login', {title: 'Login'});
});

// Login Request Handler
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failueFlash: 'Invalid username or password.'
}));

// Logout Request Handler
router.get('/logout', function(req, res, next){
    req.logout();

    // destroy session from session store
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
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
        res.render('login', {title: 'Login', errors: errors})
        return;
    }

    var newUser = {
        name: req.body.reg_fullname,
        email: req.body.reg_email,
        password: req.body.reg_pw
    };

    User.createUser(newUser, function(err, result){
        if(err) throw err;

        // Log user in and redirect to personalized home page
        req.login(newUser, function (err) {
            if (err) throw err;
            res.render('index', {title: 'Welcome'});
        });
    });
});

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.getUserById(id, function(err, user){
        done(err, user);
    });
});

// authentication
passport.use(new localStrategy({
    usernameField: 'lg_email',
    passwordField: 'lg_pw'
    },
    function(email, password, done){
        User.getUserByEmail(email, function(err, user){
            if(err){
                return done(err);
            }

            // user with specified email not found
            if(!user){
                return done(null, false);
            }

            // verify password
            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                // return user id if match
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        });
    }
));

module.exports = router;
