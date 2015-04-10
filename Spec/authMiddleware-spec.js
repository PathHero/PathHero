'use strict';
/* jshint expr:true */
var testPath = require('../testPathHelper');

// Setup
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

// Mock setup
var app = {use: sinon.spy()}; // App spy
var passport = {
  initialize: sinon.spy(),
  session: sinon.spy(),
  use: sinon.spy()
};
var FacebookStrategy = {Strategy: sinon.spy()};
var GitHubStrategy = {Strategy: sinon.spy()};
var GoogleStrategy = {Strategy: sinon.spy()};
var TwitterStrategy = {Strategy: sinon.spy()};
var LocalStrategy = {Strategy: sinon.spy()};

// Require with our mocks
var proxyquire =  require('proxyquire');
var authMiddleware = proxyquire(testPath + 'Server/src/authMiddleware.js', {
  'passport': passport,
  'passport-facebook': FacebookStrategy,
  'passport-github': GitHubStrategy,
  'passport-google-oauth': GoogleStrategy,
  'passport-twitter': TwitterStrategy,
  'passport-local': LocalStrategy
});

// Tests
// Module being tested
describe('Auth middleware', function() {
  // Trigger our spies
  before('Inject app spy', function() {
    authMiddleware.addAuth(app);
  });

  describe('Play Middleware', function() {
    it('Should use the express app', function() {
      app.use.should.have.been.calledTwice;
    });
    it('Should add a facebook strategy', function() {
      FacebookStrategy.Strategy.should.have.been.calledWithNew;
    });
    it('Should add a github strategy', function() {
      GitHubStrategy.Strategy.should.have.been.calledWithNew;
    });
    it('Should add a google strategy', function() {
      GoogleStrategy.Strategy.should.have.been.calledWithNew;
    });
    it('Should add a twitter strategy', function() {
      TwitterStrategy.Strategy.should.have.been.calledWithNew;
    });
    it('Should add a local strategy', function() {
      LocalStrategy.Strategy.should.have.been.calledWithNew;
    });
    it('Should initialize the passport', function() {
      passport.initialize.should.have.been.calledOnce;
    });
    it('Should add passport sessions', function() {
      passport.session.should.have.been.calledOnce;
    });
  });
});
