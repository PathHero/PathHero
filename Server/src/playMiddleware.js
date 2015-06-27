'use strict';

var express = require('express');
var subdomain = require('express-subdomain');
var serverConfig = require('../util/serverConfig');
var db = require('../util/database');
var path = require('path');
var cors = require('cors');


module.exports.addSubdomain = function(app) {
  var router = express.Router();
  router.use(cors());
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
    res.render(path.resolve(__dirname + '/../../Client/play/index.hbs'));
  });

  router.get('/:huntid', function(req, res) {
    console.log('entering GET params');
    var huntid = req.params.huntid;
    console.log('getting hunt game:', huntid);
    db.getHuntById(huntid)
    .then(function(data) {
      if (Object.keys(data).length === 0) {
        console.log('No hunt with that ID. Redirecting to /');
        res.redirect('/');
      } else {
        console.log('Hunt found sending play view');
        res.render(path.resolve(__dirname + '/../../Client/play/player.hbs'));
      }
    })
    .fail(function(error) {
      console.log(error);
      res.redirect('/');
    });
  });

  app.use(subdomain(serverConfig.playSubdomain, router));
};
