var db = require('../db.js');
var bcrypt = require('bcryptjs');
const saltRounds = 10;

var User = {
};

module.exports = User;

// create user in database
module.exports.createUser = function(newUser, callback){
    // hash password
    bcrypt.hash(newUser.password, saltRounds, function (err, hash) {
        newUser.password = hash;
        // Save user to database
        db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [newUser.name, newUser.email, newUser.password], function(err, results){
            newUser.id = results.insertId;
            callback(err, results);
        }); 
    });
};

// retrieve user from database by email
module.exports.getUserByEmail = function(email, callback){
    db.query('SELECT * FROM users WHERE email = ?', [email], function(err, results){
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