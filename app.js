var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// 路由
var index = require('./routes/index');
var upload = require('./routes/upload');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); 
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//页面导航
app.use('/', index);
// 上传图片
app.use('/upload', upload);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.log('error');
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    console.log('run dev model');
    app.use(function(err, req, res, next) {
        console.log('dev res:' + res.status);
        // res.status(404);
        // res.send('404 not find:'+err.message);
        // res.redirect('html/error.html');
        res.status(404);
        res.render('404');
        // next();
    });
}

// production error handler
// no stacktraces leaked to user
if (app.get('env') === 'production') {
    console.log('run pro model');
    app.use(function(err, req, res, next) {
        console.log('pro res:' + res.status);
        res.status(404);
        res.redirect('html/404.html').end();
    });
}

module.exports = app;