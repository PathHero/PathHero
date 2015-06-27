'use strict';

var app = require('express')();
var middleware = require('./Server/src/middleware');

if (process.env.NODE_ENV === 'production') {
  var SERVERPORT = process.env.PORT || 5000;
  var SERVERURL = process.env.SERVERURL || '0.0.0.0';
} else {
  var SERVERPORT = process.env.PORT || 3000;
  var SERVERURL = process.env.SERVERURL || 'localhost';
}

middleware(app);

app.listen(SERVERPORT, SERVERURL);

console.log('Path hero listening at http://%s:%s', SERVERURL, SERVERPORT);
