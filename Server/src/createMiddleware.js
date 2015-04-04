'use strict';

var express = require('express');
var subdomain = require('express-subdomain');
var serverConfig = require('../util/serverConfig');
var passport = require('./authMiddleware');
var db = require('../util/database');

// Common pattern for resolving promises from DB function calls
var resolvePromise = function(dbPromise, res) {
  dbPromise.then(function(item) {
    res.send(item);
  }).fail(function(error) {
    console.error(error);
    res.end();
  });
};

var checkAuth = function(req, res, next) {
  if (!!req.session.user) {
    next();
  } else {
    res.redirect('/');
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

  router.get('/login', function(req, res) {
    console.log('Get Create Login');
    res.send('Get Create Login');
  });

  // Authenticate a user: strategy is one of
  // ['local', 'facebook', 'github', 'google', 'twitter']
  // Local expects the body to have a username and password in a json object.
  router.post('/login/:strategy', function(req) { // ignored param response
    console.log('Post Create Login');
    var strategy = req.params.strategy;
    passport.authenticate(strategy, 
      {successRedirect: '/', failureRedirect: '/login'}
    );
  });

  router.get('/signup', function(req, res) {
    console.log('Get Signup Login');
    res.send('Get Signup Login');
  });

  // Creates a a local user account for use with local strategy
  // Expects a username and password in the body
  router.post('/signup', function(req, res) {
    console.log('Post Signup Login');
    var username = req.body.username;
    var password = req.body.password;
    
    resolvePromise(db.findOrCreateUser(username, password), res);
  });

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
