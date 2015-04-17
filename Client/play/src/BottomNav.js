'use strict';
/* jshint quotmark: false */

var React = require('react');
var Link = require('react-router').Link;

module.exports = React.createClass({displayName: "exports",
  render: function () {
    return (                   
      React.createElement("div", {id: "bottomNav"}, 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-xs-4"}, 
            React.createElement("span", null, React.createElement(Link, {to: "status"}, "Status"))
          ), 
          React.createElement("div", {className: "col-xs-4"}, 
            React.createElement("span", null, React.createElement(Link, {to: "clues"}, "Clues"))
          ), 
          React.createElement("div", {className: "col-xs-4"}, 
            React.createElement("span", null, React.createElement(Link, {to: "map"}, "Map"))
          )
        )
      )      
    );
  }
});
