'use strict';
/* jshint quotmark: false */

var React = require('react');

module.exports = React.createClass({displayName: "exports",
  render: function () {
    return (
      React.createElement("div", null, 
        React.createElement("h2", null, this.props.title), 
        React.createElement("div", null, this.props.children)
      )
    );
  }
});
