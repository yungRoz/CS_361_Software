// Load environment variables
require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var exphbs = require('express-handlebars');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

// define routes
var routes = require('./routes/index');
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

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session; TODO: randomize secret
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport Init
app.use(passport.initialize());
app.use(passport.session());

// set up routes
app.use('/', routes);
app.use('/users', users);

// Set port and start server
app.set('port', 8000);
app.listen(app.get('port'), function(){
    console.log('Server started on port ' + app.get('port'));
});