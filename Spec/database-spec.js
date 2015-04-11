'use strict';
/* jshint expr:true */
var testPath = require('../testPathHelper');

// Setup
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();

// To stub out Monk style promises
var MonkPromise = require('mpromise');
var makeMonkPromise = function() {
  var monkPromise = new MonkPromise();
  monkPromise.success = monkPromise.onFulfill;
  monkPromise.error = monkPromise.onReject;
  return monkPromise;
};

// Stub out all the DB calls
var proxyquire =  require('proxyquire'); // To mock out the DB connection
var dbStub = {};
var stubMethods = {};
stubMethods.id = function() {return {str:'dummyID'};};
stubMethods.findOne = sinon.stub();
stubMethods.find = sinon.stub();
stubMethods.remove = sinon.stub();
stubMethods.insert = sinon.stub();
stubMethods.update = sinon.stub();
stubMethods.findAndModify = sinon.stub();
dbStub.get = function() {return stubMethods;};

// Module to test (using procxy require since we need to override the Monk dependency)
var database = proxyquire(testPath + 'Server/util/database.js', { 'monk': function(){return dbStub;}});


// Tests
// reused Monk style Promise
var monkPromise;
beforeEach('Setup the mocked promise', function(){
  monkPromise = makeMonkPromise();
});
// Module being tested
describe('Hunt Database Methods', function() {
  // Unit tests
  describe('Get Hunt by ID', function() {
    beforeEach('Setup the mocked promise', function(){
      stubMethods.findOne.returns(monkPromise);
    });
    it('Should return a hunt object', function() {
      monkPromise.fulfill({hunt:true});
      return database.getHuntById('asdf').should.eventually.deep.equal({hunt:true});
    });
    it('Should return an error', function() {
      monkPromise.reject('Forced to fail');
      return database.getHuntById('asdf').should.be.rejected;
    });
  });

  describe('Remove a Hunt by ID', function() {
    beforeEach('Setup the mocked promise', function(){
      stubMethods.remove.returns(monkPromise);
    });
    it('Should return a hunt object', function() {
      monkPromise.fulfill({hunt:true});
      return database.removeHuntbyId('asdf').should.eventually.deep.equal({hunt:true});
    });
    it('Should return an error', function() {
      monkPromise.reject('Forced to fail');
      return database.removeHuntbyId('asdf').should.be.rejected;
    });
  });

  describe('Get All hunts for a user', function() {
    beforeEach('Setup the mocked promise', function(){
      stubMethods.find.returns(monkPromise);
    });
    it('Should return an array of hunts', function() {
      monkPromise.fulfill([{hunt:1}, {hunt:2}]);
      return database.getUserHunts('asdf').should.eventually.have.length(2);
    });
    it('Should return an empty array', function() {
      monkPromise.fulfill([]);
      return database.getUserHunts('asdf').should.eventually.have.length(0);
    });
    it('Should return an error', function() {
      monkPromise.reject('Forced to fail');
      return database.getUserHunts('asdf').should.be.rejected;
    });
  }); //return array of hunts

  describe('Update a hunt with new info', function() {
    beforeEach('Setup the mocked promise', function(){
      stubMethods.update.returns(monkPromise);
    });
    it('Should return a hunt', function() {
      monkPromise.fulfill({hunt:true});
      return database.updateHunt('asdf').should.eventually.deep.equal({hunt:true});
    });
    it('Should return an error', function() {
      monkPromise.reject('Forced to fail');
      return database.updateHunt('asdf').should.be.rejected;
    });
  }); //returns hunt

  describe('Add a new hunt', function() {
    beforeEach('Setup the mocked promise', function(){
      stubMethods.insert.returns(monkPromise);
    });
    it('Should return the URL property', function() {
      monkPromise.fulfill({url:'myUrl'});
      return database.addHunt({}).should.eventually.equal('myUrl');
    });
    xit('Should generate a URL', function(done) {
      monkPromise.fulfill({url:1});
      database.addHunt({}).should.be.fulfilled.then(function() {
        stubMethods.insert.getCall(0).args[0].url.should.equal('http://play.pathhero.com/dummyID');
      }).should.notify(done);
    });
    it('Should return an error', function() {
      monkPromise.reject('Forced to fail');
      return database.addHunt({}).should.be.rejected;
    });
  });
});

describe('Hunt User Methods', function() {
  var tempSecret;
  describe ('Find or Create a new user - these test are slow by design (bcrypt)', function() {
    beforeEach('Setup the mocked promise', function(){
      stubMethods.findAndModify.returns(monkPromise);
    });
    it('Should create a hash of the password', function(done) {
      monkPromise.fulfill({test:true});
      database.findOrCreateUser('test', 'mypass').should.be.fulfilled
      .then(function() {
        tempSecret = stubMethods.findAndModify.getCall(0).args[1].$setOnInsert.secret;
        tempSecret.length.should.equal(60);
      }).should.notify(done);
    });
    it('Should create a dummy hash if no password is given', function(done) {
      monkPromise.fulfill({test:true});
      database.findOrCreateUser('test').should.be.fulfilled
      .then(function() {
        var secret = stubMethods.findAndModify.getCall(0).args[1].$setOnInsert.secret;
        secret.length.should.equal(60);
      }).should.notify(done);
    });
    it('Should return an error', function() {
      monkPromise.reject('Forced to fail');
      return database.findOrCreateUser().should.be.rejected;
    });
  });

  describe('Validate a username and password', function() {
    beforeEach('Setup the mocked promise', function(){
      stubMethods.findOne.returns(monkPromise);
    });
    it('Should return a null id', function() {
      var dummySecret = '$2a$10$alyHIMMFmX4dDzTB8FwtBu2UxL1oQzdiM9lYjI66XfUDit7n2z1Tu';
      monkPromise.fulfill({secret:dummySecret});
      return database.validateUser('joe', 'otherpass').should.eventually
      .have.deep.property('id', null);
    });
    it('Should return a null id', function() {
      monkPromise.fulfill({});
      return database.validateUser('joe', 'otherpass').should.eventually
      .have.deep.property('id', null);
    });
    it('Should return a truthy id', function() {
      monkPromise.fulfill({userid:'joe',secret:tempSecret});
      return database.validateUser('joe', 'mypass').should.eventually
      .have.deep.property('id', 'joe');
    });
  });
});
