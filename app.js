var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nconf = require('nconf');
var winston = require('winston');
var nunjucks = require('nunjucks');
var popular = require('./routes/popular');
var ig = require('instagram-node').instagram();
ig.use({"client_id":"f085d81a778942f9b538976570e9d5fa",
"client_secret": "f431a981922f4cc0925d1c6d98f71de8"});

const MongoClient = require('mongodb').MongoClient;

var db;


MongoClient.connect('mongodb://<nawak>:<ohno3104>@ds013545.mlab.com:13545/star-wars-quotes', function(err, database){
    if (err) return console.log(err)
    db = database
    app.listen(3000, function(){
    winston.log('listening on 3000')
    })
});
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

nunjucks.configure('views', {
    autoescape:true,
    express:app
});

nconf.env("__");

nconf.file("config.json");

nconf.defaults({
  "http":{
    "port":3000
  }
});

winston.info("Initialised nconf");
winston.info('HTTP Configuration', nconf.get("http"));
winston.add(winston.transports.File,{filename:"error.log", level:nconf.get("logger:fileLevel")});
winston.error("Something went wrong");
//winston.add(winston.transports.Mail,
//    {   "to":"email@domain.com",
//        "username"})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/popular', popular);

app.use('/', index);
app.use('/users', users);

app.get(path, callback);

app.get('/', function(req,res){
    res.sendFile(index.html)
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(bodyParser.urlencoded({extended: true}));

app.post('/quotes', function(req,res) {
  winston.info(req.body)
    db.collection('quotes').save(req.body, function(err,result){
        if (err) return winston.error(err);

        winston.info('saved to database');
    res.redirect('/');
    })
});

module.exports = app;
