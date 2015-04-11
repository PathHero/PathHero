'use strict';

var express = require('express');
var subdomain = require('express-subdomain');
var serverConfig = require('../util/serverConfig');
var db = require('../util/database');
var path = require('path');

module.exports.addSubdomain = function(app) {
  var router = express.Router();

  router.use('/static', express.static(__dirname + '/../../Client/play/static'));

  router.get('/hunts', function(req, res) {
    db.getAllHunts()
    .then(function(data) {
      res.send(data);
    })
    .fail(function(error) {
      res.send(error);
    });
  });

  router.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../../Client/play/index.html'));
  });

  router.get('/:huntid', function(req, res) {
    var huntid = req.params.huntid;
    console.log('getting hunt game:', huntid);
    db.getHuntById(huntid)
    .then(function(data) {
      if (Object.keys(data).length === 0) {
        console.log('No hunt with that ID. Redirecting to /');
        res.redirect('/');
      } else {
        console.log('Hunt found sending play view');
        res.sendFile(path.resolve(__dirname + '/../../Client/play/player.html'));
      }
    })
    .fail(function(error) {
      console.log(error);
      res.redirect('/');
    });
  });

  app.use(subdomain(serverConfig.playSubdomain, router));
};
