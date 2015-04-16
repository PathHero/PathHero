'use strict';
/* jshint quotmark: false */

var React = require('react');
var gMap = require('../../lib/gMapLib');

module.exports = React.createClass({displayName: "exports",
  getInitialState: function() {
    return {
      style: {
        height: window.innerHeight,
        width: '50%'
      }
    };
  },
  componentDidMount: function() {
    gMap.startGMap({lng: -33.73, lat: 149.02});
    gMap.getGeolocation(gMap.setCenter);
  },
  render: function() {
    return (
      React.createElement("div", {id: "gMap", style: this.state.style, className: "col-xs-6"}
      )
    );
  }
});
