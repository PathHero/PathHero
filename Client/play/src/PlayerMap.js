'use strict';
/* jshint quotmark: false */

var React = require('react');
var gMap = require('../../lib/gMapLib');

module.exports = React.createClass({displayName: "exports",
  getInitialState: function() {
    return {
      style: {
          height: window.innerHeight,
          width: window.innerWidth,
          position: 'absolute',
          top: 0,
          left: 0
        }
    };
  }, 
  componentDidMount: function() {
    gMap.startGMap({lng:-33.73, lat:149.02});
    var hunt = this.props.hunt;
    gMap.getGeolocation(function(value){
      gMap.setCenter(value);
      gMap.showCurrentLocation();
      var mapArray = [];
      for (var i = 0; i < hunt.pins.length && i < hunt.currentPin; i++) {
        mapArray.push([hunt.pins[i].geo.lat,hunt.pins[i].geo.lng]);
      }
      if(mapArray.length > 0){
        gMap.importMap(mapArray);
      }
    });
  },

  render: function () {
    return (
      React.createElement("div", {id: "gMap", style: this.state.style})
    );
  }
});
