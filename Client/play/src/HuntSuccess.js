'use strict';
/* jshint quotmark: false */

var React = require('react');

module.exports = React.createClass({displayName: "exports",
  render: function () {
    return (
      React.createElement("div", null, 
        React.createElement("h1", null, "You've completed the hunt!"), 
        React.createElement("p", null, "Congratulations")
      )
    );
  }
});
