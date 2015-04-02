'use strict';

var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var uri = require('./database').uri;

module.exports = function(app) {
  // Use sessions and store them in our MongoDB instance
  app.use(session({
    secret: '9u292grbervq3uh5v',
    store: new MongoStore({url: 'mongodb://' + uri})
  }));

  console.log('Serving Static Folder:', __dirname + '/../../Client/');
  app.use(express.static(__dirname + '/../../Client/'));
};
