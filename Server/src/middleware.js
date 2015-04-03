'use strict';

var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);
var uri = require('../util/database').uri;
var passport = require('./authMiddleware');
var playDomain = require('./playMiddleware');
var createDomain = require('./createMiddleware');

module.exports = function(app) {
  app.use(cookieParser());
  app.use(bodyParser.json());
  // Use sessions and store them in our MongoDB instance
  app.use(session({
    secret: '9u292grbervq3uh5v',
    store: new MongoStore({url: 'mongodb://' + uri})
  }));

  passport.addAuth(app);
  playDomain.addSubdomain(app);
  createDomain.addSubdomain(app);

  console.log('Serving Static Folder:', __dirname + '/../../Client/');
  app.use(express.static(__dirname + '/../../Client/'));
};
