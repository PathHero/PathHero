'use strict';

var passport = require('passport');
var db = require('../util/database');
var secrets = require('../util/serverConfig.js');
var FacebookStrategy = require('passport-facebook').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var LocalStrategy = require('passport-local').Strategy;

var oauthLogin = function(accessToken, refreshToken, profile, done) {
  console.log('in oauth strategy');
  db.findOrCreateUser(profile.id).then(function(id){
    return done(null, id);
  }).fail(function(error){
    return done(error);
  });
};

var localLogin = function(username, password, done) {
  db.validateUser(username, password)
  .then(function(data) {
    if(!data.id) {
      return done(null, false, {message: data.message}); 
    } else {
      return done(null, data.id);
    }
  })
  .fail(function(error) {
    console.log('failed localLogin validateUser');
    return done(error);
  });
};

var initalizeStrategies = function() {
  passport.use(new FacebookStrategy(secrets.facebook, oauthLogin));
  passport.use(new GitHubStrategy(secrets.github, oauthLogin));
  passport.use(new TwitterStrategy(secrets.twitter, oauthLogin));
  passport.use(new LocalStrategy(localLogin));
};

module.exports.addAuth = function(app) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  initalizeStrategies();
  
  app.use(passport.initialize());
  app.use(passport.session());
};

// This should not be imported before addAuth has been called.
module.exports.passport = passport;
