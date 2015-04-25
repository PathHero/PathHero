'use strict';
/* jshint quotmark: false */

var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <ul id="hunt-details">
        <li>{' '+this.props.hunt.pins.length} locations</li>
        <li>{' '+this.props.hunt.huntInfo.huntDistance} miles</li>
        <li>{this.props.hunt.huntInfo.huntTimeEst} hours walk</li>
      </ul>
    );
  }
});
