
var express = require('express');
var router = express.Router();

// User Profile
router.get('/profile', verifyAuthentication(), function(req, res, next){
    res.render('profile', {title: 'Profile'});
});

// Projects Page
router.get('/projects', function(req, res){
    res.render('projects', {title: 'Projects'});
});

// Restrict unauthorized access to particular pages
function verifyAuthentication(){
    return (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.redirect('/login');
    }
}

module.exports = router;