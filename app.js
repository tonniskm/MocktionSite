var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var quotesRouter = require('./routes/quotes');
var callESPNRouter = require('./routes/callESPN');
var callESPNProjRouter = require('./routes/callESPNProj');
var rajanRouter = require('./routes/fullRajan')
var rajanRouterRaw = require('./routes/fullRajanRaw')
var rajanProjFull = require('./routes/rajanProjFull')

var app = express();
 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors({origin:'*',credentials:true,methods:'GET'}))
// app.use(cors({
//     origin: 'https://rajan-records.vercel.app', // use your actual domain name (or localhost), using * is not recommended
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
//     credentials: true
// }))
app.use(cors())

app.use('/test',rajanProjFull)
app.use('/quotes', quotesRouter);
app.use('/call',callESPNRouter);
app.use('/callProj',callESPNProjRouter);
app.use('/', indexRouter);
app.use('/projrajan',rajanRouter)
app.use('/rawrajan',rajanRouterRaw)
 
module.exports = app;

// app.listen(5432)