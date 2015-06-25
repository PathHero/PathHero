'use strict';

var express = require('express');
var subdomain = require('express-subdomain');
var serverConfig = require('../util/serverConfig');
var passport = require('./authMiddleware').passport;
var bodyParser = require('body-parser');
var db = require('../util/database');
var cors = require('cors');
var path = require('path');

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

  //CORS
  router.use(cors());

  router.use('/static', express.static(__dirname + '/../../Client/create/static'));

  router.get('/', checkAuth, function(req, res) {
    var userid = req.user;
    db.getUserHunts(userid)
    .then(function(data) {
      if (data.length === 0) {
        res.redirect('/create');
      } else {
        res.render(path.resolve(__dirname + '/../../Client/create/index.hbs'));
      }
    })
    .fail(function(error) {
      console.log('error in get "/":', error);
      res.render(path.resolve(__dirname + '/../../Client/create/index.hbs'));
    });
  });  

  // returns an array of hunts belonging to the user
  router.get('/hunts', function(req, res) {
    console.log('Get Player Hunts');
    var userid = req.user;
    resolvePromise(db.getUserHunts(userid), res);
  });

  // Authenticate a user: strategy is one of
  // ['local', 'facebook', 'github', 'google', 'twitter']
  // Local expects the body to have a username and password in a json object.
  router.post('/login/local', function logAuthLocal(req, res, next) {
    console.log('post request to /login/local');
    next();
  }, bodyParser.urlencoded({ extended: false }),
    passport.authenticate('local',
      {successRedirect: '/', failureRedirect: '/login', failureFlash: true})
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

  router.get('/login', function(req, res) {
    res.render(path.resolve(__dirname + '/../../Client/create/login.hbs'), {message: req.flash('error')});
  });

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

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

  router.get('/signup', function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../../Client/create/signup.html'));
  });

  // Expects a hunt json object in the body as defined in database.js
  // 
  //  Returns the hunt url on success
  router.post('/create', checkAuth, function(req, res) {
    console.log('Post Create Login');
    var hunt = req.body;
    hunt.creatorId = req.user;    
    resolvePromise(db.addHunt(hunt), res);
  });

  router.get('/create', checkAuth, function(req, res) {
    res.render(path.resolve(__dirname + '/../../Client/create/create.hbs'));
  });
  
  // Retrieves a hunt based on a hunt id.
  // returns a full hunt object on success
  router.get('/:huntid', function(req, res) {
    console.log('Get Create Login for');
    var huntid = req.params.huntid;
      
    resolvePromise(db.getHuntById(huntid), res);
  });

  router.get('/edit/:huntid', checkAuth, function(req, res) {
    var huntid = req.params.huntid;
    console.log('getting hunt game:', huntid);
    db.getHuntById(huntid)
    .then(function(data) {
      console.log('DEBUG++++++++', typeof data, data);
      if (typeof data !== 'object' || Object.keys(data).length === 0) {
        res.redirect('/');
      } else {
        res.render(path.resolve(__dirname + '/../../Client/create/create.html'));
      }
    })
    .fail(function(error) { 
      console.log(error);
      res.redirect('/');
    });
  });

  // Expects a hunt json object in the body as defined in database.js
  // 
  // Returns a copy of the updated hunt on success
  router.post('/edit/:huntid', checkAuth, function(req, res) {
    console.log('Post Create Login for');
    var huntid = req.params.huntid;
    var hunt = req.body;
    hunt._id = huntid;
    if (hunt.creatorId !== req.user) {
      console.log('user tried to modify a hunt they don\'t own');
      res.send({update: false});
      return;
    }
    
    resolvePromise(db.updateHunt(hunt), res, function(count) {
      if (count === 1) {
        res.send({update: true});
      } else {
        res.send({update: false});
      }
    });
  });

  app.use(subdomain(serverConfig.createSubdomain, router));
};
