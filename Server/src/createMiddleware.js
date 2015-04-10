'use strict';

var express = require('express');
var subdomain = require('express-subdomain');
var serverConfig = require('../util/serverConfig');
var passport = require('./authMiddleware').passport;
var bodyParser = require('body-parser');
var db = require('../util/database');

// Common pattern for resolving promises from DB function calls
// By default this will send the result of the promise to response
// you can overide the default by passing in a custom callback.
var resolvePromise = function(dbPromise, res, callback) {
  dbPromise.then(function(item) {
    if (!callback) {
      res.send(item);
    } else {
      callback(item);
    }
  }).fail(function(error) {
    console.error(error);
    res.end();
  });
};

var checkAuth = function(req, res, next) {
  if (!!req.user) {
    console.log('user authed');
    next();
  } else {
    console.log('user not authed');
    res.redirect('/login');
  }
};

module.exports.addSubdomain = function(app) {
  var router = express.Router();

  // returns an array of hunts belonging to the user
  router.get('/', checkAuth, function(req, res) {
    console.log('Get Create /');
    var userid = req.session.user;
    resolvePromise(db.getUserHunts(userid), res);
  });

  // Authenticate a user: strategy is one of
  // ['local', 'facebook', 'github', 'google', 'twitter']
  // Local expects the body to have a username and password in a json object.
  router.post('/login/local', bodyParser.urlencoded({ extended: false }),
    passport.authenticate('local',
      {successRedirect: '/', failureRedirect: '/login'}
    )
  );

  router.get('/login/:strategy/callback', bodyParser.urlencoded({ extended: false }), function(req, res, next) { 
    console.log('Post Create Login callback');
    var strategy = req.params.strategy;
    passport.authenticate(strategy, 
      {successRedirect: '/', failureRedirect: '/login'}
    ).call(null, req, res, next);
  });

  router.get('/login/:strategy', bodyParser.urlencoded({ extended: false }), function(req, res, next) { 
    console.log('Get Create Login');
    var strategy = req.params.strategy;
    passport.authenticate(strategy).call(null, req, res, next);
  });

  router.use('/login', express.static(__dirname + '/../../Client/create/login'));

  // Creates a a local user account for use with local strategy
  // Expects a username and password in the form body
  router.post('/signup', bodyParser.urlencoded({ extended: false }), function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    
    resolvePromise(db.findOrCreateUser(username, password), res, function(doc) {
      if (doc === null) {
        res.redirect('/login');
      } else {
        res.send('user already exists');
      }
    });
  });

  router.use('/signup', express.static(__dirname + '/../../Client/create/signup'));

  router.get('/create', checkAuth, function(req, res) {
    console.log('Get Create Login');
    res.send('Get Create Login');
  });

  // Expects a hunt json object in the body as follows:
  // {
  //    name: String
  //    desc: String
  //    createrId: ID -> matches up to the Users collection id
  //    clues: [
  //      geo: [Lat, Lon]
  //      answer: String
  //      timeEst: Number
  //      hints: [ String, .... ]
  //    ]
  // }
  // 
  //  Returns the hunt url on success
  router.post('/create', checkAuth, function(req, res) {
    console.log('Post Create Login');
    var hunt = req.body.hunt;
    resolvePromise(db.addHunt(hunt), res);
  });

  // Retrieves a hunt based on a hunt id.
  // returns a full hunt object on success
  router.get('/create/:huntid', checkAuth, function(req, res) {
    console.log('Get Create Login for');
    var huntid = req.params.huntid;
      
    resolvePromise(db.getHuntById(huntid), res);
  });

  // Expects a hunt json object in the body as follows:
  // {
  //    _id: ObjectID This should not be modified by the user
  //    name: String
  //    desc: String
  //    createrId: ID -> matches up to the Users collection id
  //    url: String this should not be modified by the user
  //    clues: [
  //      geo: [Lat, Lon]
  //      answer: String
  //      timeEst: Number
  //      hints: [ String, .... ]
  //    ]
  // }
  // 
  // Returns a copy of the updated hunt on success
  router.post('/create/:huntid', checkAuth, function(req, res) {
    console.log('Post Create Login for');
    var huntid = req.params.huntid;
    var hunt = req.body.hunt;

    if (huntid !== hunt._id) {
      console.error('wrong enpoint for this hunt');
      res.end();
    }
    
    resolvePromise(db.updateHunt(hunt), res);
  });

  app.use(subdomain(serverConfig.createSubdomain, router));
};
