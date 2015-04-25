'use strict';
/* jshint quotmark: false */

var React = require('react');
var PinList = require('./PinList');
var HuntSubmitForm = require('./HuntSubmitForm');
var gMap = require('../../../lib/gMapLib');
var Actions = require('../RefluxActions');
var HuntDesc = require('./HuntDesc');
var HuntTitle = require('./HuntTitle');
var HuntDetails = require('./HuntDetails');

var windowHeight = {
  minHeight: window.innerHeight
};

module.exports = React.createClass({
  updateHuntInfo: function() {
    var huntInfo = {
      huntTimeEst: gMap.getDuration(),
      huntDistance: gMap.getDistance()
    };
    Actions.updateHuntAtKey(huntInfo, 'huntInfo');
  },
  addAddMarkerEvent: function() {
    gMap.addEventListener('addMarker', function(latLng) {
      var geo = {
        lat: latLng.lat(),
        lng: latLng.lng(),
      };
      var pin = {
        "answer": "",
        "resultText": "",
        "clues": [],
        "geo": geo,
      };
      Actions.addPin(pin);
      this.updateHuntInfo();
    }.bind(this));
  },
  addDragMarkerEvent: function() {
    gMap.addEventListener('dragEvent', function(latLngArray) {
      latLngArray.forEach(function(latLng, index) {
        var geo = {
          lat: latLng.lat(),
          lng: latLng.lng(),
        };
        Actions.updatePinAtKey(geo, index, 'geo');
      });
      this.updateHuntInfo();
    }.bind(this));
  },
  componentDidMount: function() {
    this.addAddMarkerEvent();
    this.addDragMarkerEvent();
  },
  render: function() {
    var url;
    if (!this.props.hunt.url) {
      url = null;
    } else {
      url = (
        <div className="tour-summary-container">
          <h2>Hunt URL:</h2>
          <a className="editModeURL" href={this.props.hunt.url}>{this.props.hunt.url}</a>
        </div>);
    }

    return (
      <div className="clueBox">
        <div id="hunt-info-container" className="col-xs-6" style={windowHeight}>
          <HuntSubmitForm hunt={this.props.hunt}/>
          <HuntDetails hunt={this.props.hunt}/>
          
          <div id="hunt-title-container">
            {url}
            <div className="tour-summary-container">
              <HuntTitle hunt={this.props.hunt}/>
              <HuntDesc hunt={this.props.hunt}/>
            </div>
          </div>
          <div id="pin-container">
            <h2>Pins</h2>
            <PinList pins={this.props.hunt.pins}/> 
          </div>
        </div>
      </div>
    );
  }
});
