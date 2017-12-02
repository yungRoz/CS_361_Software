var db = require('../db.js');
var bcrypt = require('bcryptjs');
const saltRounds = 10;
var User = {};

module.exports = User;

// create user in database
module.exports.createUser = function(newUser, callback){
    // hash password
    bcrypt.hash(newUser.password, saltRounds, function (err, hash) {
        if(err) throw err;

        newUser.password = hash;
        // Save user to database
        db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [newUser.name, newUser.email, newUser.password], function(err, results){
            if (err) throw err;

            newUser.id = results.insertId;
            callback(err, results);
        });
    });
};

// retrieve user from database by email
module.exports.getUserByEmail = function(email, callback){
    db.query('SELECT * FROM users WHERE email = ?', [email], function(err, results){
        if(err) throw err;

        var user = results[0];
        if(user){
            user.password = user.password.toString();
        }
        callback(err, user);
    });
};

// retrieve user from database by id
module.exports.getUserById = function(id, callback){
    db.query('SELECT * FROM users WHERE id = ?', [id], function(err, results){
        if(err) throw err;

        var user = results[0];
        if(user){
            user.password = user.password.toString();
        }
        callback(err, user);
    });
};

// compare input password with password saved in database
module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if(err) throw err;

        callback(null, isMatch);
    });
};

// get lectures from user's active course
module.exports.getActiveCourseLectures = function(user, callback){
    db.query('SELECT title, youtubeURL, isWatched FROM users u\
            INNER JOIN users_lectures ul ON u.id = ul.userID\
            INNER JOIN lectures l ON ul.lectureID = l.id\
            WHERE l.courseID = u.activeCourse AND u.id = ?',
            [user.id],
            function(err, results){
        if(err) throw err;

        var watchedLectures = [];
        var nextLecture;

        results.forEach(element => {
            console.log(element.title);
            if(element.isWatched){
                watchedLectures.push(element);
            } else {
                nextLecture = element;
                callback(watchedLectures, nextLecture);
                return;
            }
        });

    });
};

// get users active projects
// module.exports.getUserProjects = function(user, callback) {
//   db.query('SELECT id, title FROM users u\
//           INNER JOIN users-projects up ON u.id = up.userID\
//           INNER JOIN projects p ON up.projectID = p.id\
//           WHERE p.courseID = u.activeCourse AND u.id = ?',
//           [user.id],
//           function(err, results){
//       if(err) throw err;
//       callback(results);
//       return;
//
//   });
// };
