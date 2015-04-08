'use strict';
/* jshint expr:true */
var testPath = require('../testPathHelper');

// Setup
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

// Stub out all the middleware mixins
var middlewareMocks = {
  './authMiddleware': {addAuth: sinon.spy()},
  './playMiddleware': {addSubdomain: sinon.spy()},
  './createMiddleware': {addSubdomain: sinon.spy()}
};

// Mock the express app
var app = {use: sinon.spy()}; // App spy

// Require with our mocks
var proxyquire =  require('proxyquire');
var middleware = proxyquire(testPath + 'Server/src/middleware.js', middlewareMocks);


// Tests
// Module being tested
describe('Middleware Entry Point', function() {
  // Trigger our spies
  before('Inject app spy', function() {
    middleware(app);
  });

  describe('Express Middleware setup', function() {
    it('Should add a cookie jar', function() {
      app.use.getCall(0).args[0].name.should.equal('cookieParser');
    });
    it('Should add a JSON body parser', function() {
      app.use.getCall(1).args[0].name.should.equal('jsonParser');
    });
    it('Should add an express session', function() {
      app.use.getCall(2).args[0].name.should.equal('session');
    });
  });

  describe('Middleware mixins', function() {
    it('Should call add Authorization middleware', function() {
      middlewareMocks['./authMiddleware'].addAuth
      .should.have.been.calledOnce;
    });
    it('Should add the "play" subdomain middleware', function() {
      middlewareMocks['./playMiddleware'].addSubdomain
      .should.have.been.calledOnce;
    });
    it('Should add the "create" subdomain middleware', function() {
      middlewareMocks['./createMiddleware'].addSubdomain
      .should.have.been.calledOnce;
    });
  });
});
