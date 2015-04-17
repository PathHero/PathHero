'use strict';
/* jshint quotmark: false */

var React = require('react');
var Title = require('./Title');
var HuntSummaryContainer = require('./HuntSummaryContainer');
var Link = require('react-router').Link;

module.exports = React.createClass({displayName: "exports",
  render: function () {      
    return (
      React.createElement("div", null, 
        React.createElement("div", {id: "welcome-msg-container"}, 
          React.createElement("div", {id: "welcome-text"}, 
            React.createElement(Title, {title: this.props.hunt.huntName})
          ), 
          React.createElement("div", {id: "start-btn"}, 
            React.createElement("button", null, React.createElement(Link, {to: "clues"}, "Start"))
          )
        ), 
        React.createElement(HuntSummaryContainer, {hunt: this.props.hunt})
      )
    );
  }
});
