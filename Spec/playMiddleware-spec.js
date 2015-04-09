'use strict';
/* jshint expr:true */

// Setup
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

// Mock the express app
var app = {use: sinon.spy()}; // App spy
var getSpy = sinon.spy();
var expressMock = {
  Router: function(){return {get: getSpy};} // Mock Express Router
};
var subdomain = sinon.spy();

// Require with our mocks
var proxyquire =  require('proxyquire');
var playMiddleware = proxyquire('../Server/src/playMiddleware.js', {
  'express': expressMock,
  'express-subdomain': subdomain
});

// Tests
// Module being tested
describe('Play subdomain middleware', function() {
  // Trigger our spies
  before('Inject app spy', function() {
    playMiddleware.addSubdomain(app);
  });

  describe('Play Middleware', function() {
    it('Should use the express app', function() {
      app.use.should.have.been.calledOnce;
    });
    it('Should add a subdomain to the express app', function() {
      subdomain.should.have.been.calledOnce;
    });
    it('Should add a GET route for "/"', function() {
      getSpy.should.have.been.calledWith('/');
    });
    it('Should add a GET route for "/:huntid"', function() {
      getSpy.should.have.been.calledWith('/:huntid');
    });
  });
});
