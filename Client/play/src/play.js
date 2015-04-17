'use strict';
/* jshint quotmark: false */

var React = require('react');
var Router = require('react-router');
var DefaultRoute = require('react-router').DefaultRoute;
var Route = require('react-router').Route;
var PlayerApp = require('./PlayerApp');
var Welcome = require('./Welcome');
var Status = require('./Status');
var Clues = require('./Clues');
var PlayerMap = require('./PlayerMap');


var routes = (
  React.createElement(Route, {handler: PlayerApp}, 
    React.createElement(DefaultRoute, {handler: Welcome}), 
    React.createElement(Route, {name: "status", handler: Status}), 
    React.createElement(Route, {name: "clues", handler: Clues}), 
    React.createElement(Route, {name: "map", handler: PlayerMap})
  )
);

Router.run(routes, function (Handler) {
  React.render(React.createElement(Handler, null), document.getElementById('player-app'));
});
