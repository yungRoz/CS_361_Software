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
var bcrypt = require('bcryptjs');

var index = require('./routes/index');
var users = require('./routes/users');

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

// Express Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: sessionStore
}));

// Passport Init
app.use(passport.initialize());
app.use(passport.session());

// pass authentication information to all views
app.use(function(req, res, next){
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// set up routes
app.use('/', index);
app.use('/users', users);

// Set port and start server
app.set('port', 8000);
app.listen(app.get('port'), function(){
    console.log('Server started on port ' + app.get('port'));
});