var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");
var liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname,'public'));
liveReloadServer.server.once("connection",() => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    },100);
});


// actual code below


var indexRouter = require('./routes/index');

var app = express();
app.use(connectLiveReload());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,'public')));

app.use('/', indexRouter);

module.exports = app;
