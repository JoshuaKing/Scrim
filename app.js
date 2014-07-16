var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var redis = require('redis');
var db = redis.createClient(10441, "angelfish.redistogo.com");
db.auth("5c4121f133421b3593b2bf68af64be7b", function() {console.log("DB Connected");});


var routes = require('./routes/index');
var team = require('./routes/team');
var jsonapi = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
    secret : "joshcoenjosh",
    cookie : {
        path : '/',
        httpOnly : true,
        secure : false,
        maxAge : 300000000000 // A long ass fucking time
    }
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/team', team);
app.use('/api', jsonapi);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
