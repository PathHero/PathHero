'use strict';

var express = require('express');

module.exports = function(app) {
  console.log('Serving Static Folder:', __dirname + '/../../Client/');
  app.use(express.static(__dirname + '/../../Client/'));
};
