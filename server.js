'use strict';

var app = require('express')();
var middleware = require('./Server/src/middleware');

var SERVERPORT = process.env.PORT || 3000;
var SERVERURL = process.env.SERVERURL || 'localhost';

middleware(app);

app.listen(3000, SERVERURL);

console.log('Path hero listening at http://%s:%s', SERVERURL, SERVERPORT);
