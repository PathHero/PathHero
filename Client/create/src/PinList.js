'use strict';
/* jshint quotmark: false */

var React = require('react');
var Pin = require('./Pin');

module.exports = React.createClass({displayName: "exports",
  render: function() {
    var pinNodes = this.props.pins.map(function(pin, index) {
      return (
        React.createElement(Pin, {pinIndex: index, pin: pin, key: index}
        )
      );
    }, this);
    return (
      React.createElement("div", {className: "pinList"}, 
        pinNodes
      )
    );
  }
});
