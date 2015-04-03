'use strict';

var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var uri = require('./database').uri;
var passport = require('./authMiddleware');

module.exports = function(app) {
  // Use sessions and store them in our MongoDB instance
  app.use(session({
    secret: '9u292grbervq3uh5v',
    store: new MongoStore({url: 'mongodb://' + uri})
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  console.log('Serving Static Folder:', __dirname + '/../../Client/');
  app.use(express.static(__dirname + '/../../Client/'));
};
