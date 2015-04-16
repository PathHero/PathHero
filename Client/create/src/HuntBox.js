'use strict';
/* jshint quotmark: false */

var $ = require('jquery');
var React = require('react');
var Nav = require('react-bootstrap').Nav;
var Navbar = require('react-bootstrap').Navbar;
var NavItem =require('react-bootstrap').NavItem;
var HuntMap = require('./HuntMap');
var ClueBox = require('./ClueBox');
var Reflux = require('reflux');
var huntStore = require('./RefluxStore');
var Actions = require('./RefluxActions');
var gMap = require('../../lib/gMapLib');

module.exports = React.createClass({displayName: "exports",
  mixins: [Reflux.ListenerMixin],
  onStatusChange: function(status) {
    this.setState({hunt:status});
  },
  componentWillMount: function() {
    this.listenTo(huntStore, this.onStatusChange, this.onStatusChange);
    var route = window.location.pathname.split('/')[1] || null;
    if (route === 'edit') {
      var huntID =  window.location.pathname.split('/')[2] || null;
      $.ajax({
        url: window.location.origin + '/' + huntID,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
          var coordinates = [];
          for (var i = 0; i < data.pins.length; i += 1) {
            var tuple = [data.pins[i].geo.lat, data.pins[i].geo.lng];
            coordinates.push(tuple);
          }
          gMap.importMap(coordinates);
          Actions.replaceHunt(data);
        },
        error: function(error) {
          console.error('ajax request for hunt failed:', error);
        }
      });
    }
  },
  render: function() {
    return (
      React.createElement("div", {className: "huntBox"}, 
        React.createElement(Navbar, {brand: "Path Hero"}, 
          React.createElement(Nav, {right: true}, 
            React.createElement(NavItem, {href: "/create"}, "Create hunt"), 
            React.createElement(NavItem, {href: "/"}, "View hunts"), 
            React.createElement(NavItem, {href: "/logout"}, "Logout")
          )
        ), 
        React.createElement(HuntMap, null), 
        React.createElement(ClueBox, {hunt: this.state.hunt})
      )
    );
  }
});
