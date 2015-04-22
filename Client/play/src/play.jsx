'use strict';
/* jshint quotmark: false */

var React = require('react');
var Router = require('react-router');
var DefaultRoute = require('react-router').DefaultRoute;
var Route = require('react-router').Route;
var PlayerApp = require('./PlayerApp');
var Welcome = require('./Welcome');
var Status = require('./Status');
var CluesContainer = require('./CluesContainer');
var PlayerMap = require('./PlayerMap');

var routes = (
  <Route handler={PlayerApp}>
    <DefaultRoute handler={Welcome}/>
    <Route name="status" handler={Status}/>
    <Route name="clues" handler={CluesContainer}/>
    <Route name="map" handler={PlayerMap}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler />, document.getElementById('player-app'));
});
