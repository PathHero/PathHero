'use strict';

var express = require('express');
var subdomain = require('express-subdomain');
var serverConfig = require('../util/serverConfig');

module.exports.addSubdomain = function(app) {
  var router = express.Router();

  router.get('/', function(req, res) {
    console.log('getting choose a hunt');
    res.send('Choose a hunt');
  });

  router.get('/:huntid', function(req, res) {
    var huntid = req.params.huntid;
    console.log('getting hunt game:', huntid);
    res.send('playing hunt ' + huntid);
  });

  app.use(subdomain(serverConfig.playSubdomain, router));
};
