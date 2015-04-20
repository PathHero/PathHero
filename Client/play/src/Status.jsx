'use strict';
/* jshint quotmark: false */

var React = require('react');
var gMap = require('../../../lib/gMapLib');
var TitleBox = require('./TitleBox');
var List = require('./List');
var PinSuccess = require('./PinSuccess');
var HuntSuccess = require('./HuntSuccess');
var HuntSummaryContainer = require('./HuntSummaryContainer');
var Actions = require('../RefluxActions');
var ProgressBar = require('./ProgressBar');

var HITDISTANCE = 0.20;

module.exports = React.createClass({
  getCurrentPinIndex: function() {
    var currentPinIndex = this.props.hunt.currentPinIndex;
    var numOfPins = this.props.hunt.pins.length;
    return Math.min(currentPinIndex, numOfPins-1);
  },
  updateDistance: function() {
    var currentPinIndex = this.getCurrentPinIndex();
    var currentPin = this.props.hunt.pins[currentPinIndex];
    var nextGeo = currentPin.geo;

    gMap.getDistanceToLatLng(function (value) {
      var playerAtLocation = false;
      var huntComplete = false;
      if (value < HITDISTANCE) {
        clearInterval(this.updateInterval);
        Actions.updateHuntAtKey(this.props.hunt.currentPinIndex + 1, 'currentPinIndex');
        playerAtLocation = true;
        value = 0;
      }
      if (playerAtLocation && this.props.hunt.currentPinIndex >= (this.props.hunt.pins.length - 1)) {
        huntComplete = true;
      }
      this.setState({
        playerAtLocation: playerAtLocation, 
        distanceToNextPin: value,
        huntComplete: huntComplete
      });
    }.bind(this), nextGeo);
  },
  getInitialState: function() {
    return {
      playerAtLocation: false,
      huntComplete: false,
      distanceToNextPin: 0.00,
    };
  },
  componentWillMount: function() {
    this.updateDistance();
    if (!this.state.playerAtLocation) {
      this.updateInterval = setInterval(this.updateDistance, 5000);
    }
  },
  componentWillUnmount: function() {
    clearInterval(this.updateInterval);
  },
  render: function () {
    var numOfLocations = this.props.hunt.pins.length;
    var listItemArray = [ numOfLocations + " locations left", 
                          this.state.distanceToNextPin + " miles to next location"];
    var locationStatus;    
    var locationSummary = (
      <TitleBox title="Status">
        <List listItemArray={listItemArray} />
      </TitleBox>
    );

    if (!this.state.playerAtLocation) {
      locationStatus = locationSummary;
    } else {
      locationStatus = (<PinSuccess hunt={this.props.hunt} huntComplete={this.state.huntComplete}/>);
    }
    
    var huntStatus = null;
    if (this.state.huntComplete) {
      huntStatus = (<HuntSuccess/>);
    }

    return (
      <div>
        {locationStatus}
        {huntStatus}
        <HuntSummaryContainer hunt={this.props.hunt}/>
        <ProgressBar hunt={this.props.hunt}/>
      </div>
    );
  }
});
