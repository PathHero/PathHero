'use strict';
/* jshint quotmark: false */

var React = require('react');

module.exports = React.createClass({
  render: function () {
    return <h2>{this.props.title}</h2>;
  }
});
