//worked on with the lovely leonard constant and joshua findlay

var express  = require('express');
var app      = express();
var port     = process.env.PORT || 7000;
const MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

var db

mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);
});

mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);
}); 

require('./config/passport')(passport); 

app.use(morgan('dev')); 
app.use(cookieParser()); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('view engine', 'ejs'); 

app.use(session({
    secret: 'rcbootcamp2021b', 
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash()); 

app.listen(port);
console.log(`http://localhost:${port}`);
