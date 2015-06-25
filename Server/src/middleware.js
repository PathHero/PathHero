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
var sessionKey = require('../util/serverConfig.js').sessionKey;
var flash = require('connect-flash');
var handlebars = require('express-handlebars');
var path = require('path');

module.exports = function(app) {
  app.use(cookieParser());
  app.use(bodyParser.json());
  // Use sessions and store them in our MongoDB instance
  app.use(session({
    secret: sessionKey,
    saveUninitialized: true, 
    resave: true, 
    store: new MongoStore({url: 'mongodb://' + uri})
  }));
  app.use(flash());
  app.engine('.hbs', handlebars({defaultLayout: false, 
                                  partialsDir: __dirname + '/../../Client/create/partials/',
                                  extname: '.hbs'}));
  app.set('view engine', '.hbs');

  passport.addAuth(app);
  playDomain.addSubdomain(app);
  createDomain.addSubdomain(app);
  app.get('/', function(req, res) {
    console.log('dirname is:', __dirname);
    res.render(path.resolve(__dirname + '/../../Client/index.hbs'));
  });

  console.log('Serving Static Folder:', __dirname + '/../../Client/');
  app.use(express.static(__dirname + '/../../Client/'));
};
