'use strict';

var uri = process.env.DBURI || '127.0.0.1:27017/pathhero';
var db = exports.db = require('monk')(uri);

exports.db = db;
exports.uri = uri;
