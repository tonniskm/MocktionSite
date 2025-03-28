var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var quotesRouter = require('./routes/quotes');
var callESPNRouter = require('./routes/callESPN');
var callESPNProjRouter = require('./routes/callESPNProj');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/quotes', quotesRouter);
app.use('/call',callESPNRouter);
app.use('/callProj',callESPNProjRouter);
app.use('/', indexRouter);
 
module.exports = app;

// app.listen(5432)