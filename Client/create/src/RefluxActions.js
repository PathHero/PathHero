'use strict';

var Reflux = require('reflux');

module.exports = Reflux.createActions([
  'updateHuntAtKey',
  'updatePinAtKey',
  'addPin',
  'removePin',
  'updateClue',
  'addClue',
  'removeClue',
  'fetchHunt',
  'replaceHunt',
]);
