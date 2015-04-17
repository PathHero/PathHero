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

var HITDISTANCE = 26;

module.exports = React.createClass({
  getInitialState: function() {
    return {
      playerAtLocation: false,
      huntComplete: false,
      distanceToNextPin: 0.00,
    };
  },
  componentWillMount: function() {
    var currentPinIndex = this.props.hunt.currentPinIndex;
    var currentPin = this.props.hunt.pins[currentPinIndex];
    var nextGeo = currentPin.geo;
    gMap.getDistanceToLatLng(function (value) {
      var playerAtLocation = false;
      var huntComplete = false;
      if (value < HITDISTANCE) {
        playerAtLocation = true;
        value = 0;
      }
      if (playerAtLocation && this.props.hunt.currentPinIndex === (this.props.hunt.pins.length - 1)) {
        huntComplete = true;
      }
      this.setState({
        playerAtLocation: playerAtLocation, 
        distanceToNextPin: value,
        huntComplete: huntComplete
      });
    }.bind(this), nextGeo);
  },
  componentWillUnmount: function() {
    if (this.state.playerAtLocation && !this.state.huntComplete) {
      Actions.updateHuntAtKey(this.props.hunt.currentPinIndex + 1, 'currentPinIndex');
    }
  },

  render: function () {
    var numOfLocations = this.props.hunt.pins.length;
    var listItemArray = [ numOfLocations + " locations left", 
                          this.state.distanceToNextPin + " miles to next location"];
    var locationStatus;    
    var locationSummary = (
      <TitleBox title="Location Summary">
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
      </div>
    );
  }
});
