
var express = require('express');
var router = express.Router();

// User Profile
router.get('/profile', verifyAuthentication(), function(req, res, next){
    res.render('profile', {title: 'Profile'});
});

// Restrict unauthorized access to particular pages
function verifyAuthentication(){
    return (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.redirect('/login');
    }
}

module.exports = router;