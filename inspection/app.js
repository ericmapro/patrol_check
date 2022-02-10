var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var webapps = require('./routes/webapp');
var sysbases = require('./routes/sysbase');
var parols = require('./routes/parol');
var monitorpoints = require('./routes/monitorpoint');
var sectors = require('./routes/sector');
var alarms = require('./routes/alarm');
var relays = require('./routes/relay');
var persons = require('./routes/person');
var cards = require('./routes/card');
var cams = require('./routes/cam');
var currencys = require('./routes/currency');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({ limit: '50mb',extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/webapps', webapps);
app.use('/sysbases', sysbases);
app.use('/parols', parols);
app.use('/monitorpoints', monitorpoints);
app.use('/sectors', sectors);
app.use('/alarms', alarms);
app.use('/relays', relays);
app.use('/persons', persons);
app.use('/cards', cards);
app.use('/cams', cams);
app.use('/currencys', currencys);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
