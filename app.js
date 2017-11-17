// Load environment variables
require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var exphbs = require('express-handlebars');
var session = require('express-session');
var MySQLStore = require('express-mysql-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

// Initialize App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout:'layout' }));
app.set('view engine', 'handlebars');

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // this line must be immediately after any of the bodyParser middlewares!

// cookie-parser
app.use(cookieParser());

// Session Store
var sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Express Session; TODO: randomize secret
app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false,
    store: sessionStore
}));

// Passport Init
app.use(passport.initialize());
app.use(passport.session());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// define routes
var index = require('./routes/index');
var users = require('./routes/users');

// pass authentication information to all views
app.use(function(req, res, next){
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});

// set up routes
app.use('/', index);
app.use('/users', users);

// set up authentication
passport.use(new localStrategy({
    usernameField: 'lg_email',
    passwordField: 'lg_pw'
    },
    function(email, password, done){
        const mysql = require('./db.js');
        // get users password from the database
        mysql.pool.query('SELECT id, password FROM users WHERE email = ?', [email], function(err, result){
            if(err){
                done(err);
                return;
            }

            // email account not found
            if(result.length === 0){
                done(null, false);
                return;
            }

            // compare user's saved password with input password
            const hash = result[0].password.toString();
            bcrypt.compare(password, hash, function(err, response){
                // return user id if match
                if(response === true){
                    return done(null, {user_id: result[0].id});
                } else {
                    return done(null, false);
                }
            });
        });
    }
));

// Set port and start server
app.set('port', 8000);
app.listen(app.get('port'), function(){
    console.log('Server started on port ' + app.get('port'));
});