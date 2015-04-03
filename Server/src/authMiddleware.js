'use strict';

var passport = require('passport');
var db = require('../util/database');
var secrets = require('../util/secrets.js');
var FacebookStrategy = require('passport-facebook').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var LocalStrategy = require('passport-local').Strategy;

var oauthLogin = function(accessToken, refreshToken, profile, done) {
  db.findOrCreateUser(profile.id).then(function(id){
    return done(null, id);
  }).fail(function(error){
    return done(error);
  });
};

var initalizeStrategies = function() {
  passport.use(new FacebookStrategy(secrets.facebook, oauthLogin));
  passport.use(new GitHubStrategy(secrets.github, oauthLogin));
  passport.use(new GoogleStrategy(secrets.google, oauthLogin));
  passport.use(new TwitterStrategy(secrets.twitter, oauthLogin));
  passport.use(new LocalStrategy(function(username, password, done) {
    db.validateUser(username, password, function(err, id, message){
      if (err) {
        return done(err);
      } else if (!id) {
        return done(null, false, message);
      } else {
        return done(null, id);
      }
    });
  }));
  return passport;
};

module.exports = initalizeStrategies();
