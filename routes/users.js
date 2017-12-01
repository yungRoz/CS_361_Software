var db = require('../db.js');
var express = require('express');
var router = express.Router();

var User = require('../models/user.js');

// User Profile
router.get('/profile', verifyAuthentication(), function(req, res, next){
    res.render('profile', {title: 'Profile'});
});

// Lessons Page
router.get('/lessons', verifyAuthentication(), function(req, res){
    User.getActiveCourseLectures(req.user, function(watchedLectures, nextLecture){
        console.log(watchedLectures);
        console.log(nextLecture);
        res.render('lessons', {title: 'Lessons',
                watchedLectures: watchedLectures,
                nextLecture: nextLecture});
    });
});

// lecture page
router.get('/lecture', verifyAuthentication(), function(req, res){
    res.render('lecture', {title: 'Lecture'});
});

// Projects Page
router.get('/projects', verifyAuthentication(), function(req, res){
  var projects = []
  db.query("SELECT * FROM users_projects INNER JOIN projects ON users_projects.projectID = projects.id INNER JOIN users ON users_projects.userID = users.id WHERE projects.courseID = users.activeCourse AND users.id=?", [req.user.id], function(err, result){
    if(err) throw err;
    for(var i = 0; i < result.length; i++){
      projects.push({id: result[i].projectID, title: result[i].title});
    }
    res.render('projects/index', {projects});
  });
});

// Projects Details Page
router.get('/projects/details', verifyAuthentication(), function(req, res, next){
    db.query('SELECT * FROM projects WHERE id=?', [req.query.id], function(err, result){
    res.render('projects/details', {title: result[0].title, instructions: result[0].description});
  });
});

// Restrict unauthorized access to particular pages
function verifyAuthentication(){
    return (req, res, next) => {
        if (req.isAuthenticated()){
            return next();
        }else{
            res.redirect('/login');
        }
    }
}

module.exports = router;