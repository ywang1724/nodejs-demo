var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
//var session = require('express-session');
//var connect = require('connect');
//var SessionStore = require("session-mongoose")(express);
//var store = new SessionStore({
//    url: "mongodb://localhost/session",
//    interval: 120000 // expiration check worker run interval in millisec (default: 60000)
//});

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//app.use(cookieParser());
app.use(cookieSession({secret : 'ywang1724.com'}));
// configure session provider
//app.use(express.session({
//    store: store,
//    cookie: { maxAge: 900000 } // expire session in 15 min or 900 seconds
//}));
app.use(function(req, res, next){
    res.locals.user = req.session.user;
    var err = req.session.error;
    delete req.session.error;
    res.locals.message = '';
    if (err) {
        res.locals.message = '<div class="alert alert-error">' + err + '</div>';
    }
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/login', routes);
app.use('/users', users);
app.use('/logout', routes);
app.use('/home', routes);

/// catch 404 and forward to error handler
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
