'use strict';
/* jshint quotmark: false */

var React = require('react');
var Link = require('react-router').Link;


module.exports = React.createClass({displayName: "exports",
  incrementPinInLocalStorage: function() {    
    this.props.incrementPinInLocalStorage();
  },
  render: function () {
    var currentPin = Number.parseInt(this.props.hunt.get('currentPin'));
    var currentPinIndex = currentPin - 1;
    var answer = this.props.hunt.pins[currentPinIndex].answer;

    return (
      React.createElement("div", null, 
        React.createElement("h1", null, "Success! You're at the correct location"), 
        React.createElement("p", null, "The answer was ", answer), 
        React.createElement("button", {className: "btn btn-default"}, React.createElement(Link, {to: "clues"}, "Start next location"))
      )
    );
  }
});
