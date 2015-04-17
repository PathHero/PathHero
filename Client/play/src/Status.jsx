'use strict';
/* jshint quotmark: false */

var React = require('react');
var gMap = require('../../lib/gMapLib');
var TitleBox = require('./TitleBox');
var List = require('./List');
var PinSuccess = require('./PinSuccess');
var HuntSuccess = require('./HuntSuccess');
var HuntSummaryContainer = require('./HuntSummaryContainer');
var Actions = require('./RefluxActions');

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
    console.log('inlocation2', !this.state.playerAtLocation);
    if (!this.state.playerAtLocation) {
      gMap.getDistanceByLocation(function (value) {
        console.log('inlocation', HITDISTANCE);
        var playerAtLocation = false;
        var huntComplete = true;
        if (value < HITDISTANCE) {
          playerAtLocation = true;
          value = 0;
        }
        if (playerAtLocation && this.props.hunt.currentPinIndex === this.props.hunt.pins.length - 1) {
          huntComplete = true;
        }
        this.setState({
          playerAtLocation: playerAtLocation, 
          distanceToNextPin: value,
          huntComplete: huntComplete
        });
      }.bind(this), this.props.hunt.currentPinIndex);
    }
  },
  componentWillUnmount: function() {
    if (this.state.playerAtLocation && !this.state.huntComplete) {
      this.setState({playerAtLocation: false});
      Actions.updateHuntAtKey(this.props.hunt.currentPinIndex + 1, 'currentPinIndex');
    }
  },

  render: function () {
    var numOfLocations = this.props.hunt.huntInfo.numOfLocations;
    var huntTimeEst = gMap.getDuration(this.props.hunt.currentPinIndex);
    var listItemArray = [ numOfLocations + " locations", 
                          huntTimeEst + " hr to completion", 
                          this.state.distanceToNextPin + " miles"];
    var locationStatus;    
    var locationSummary = (
      <TitleBox title="Location Summary">
        <List listItemArray={listItemArray} />
      </TitleBox>
    );

    if (!this.state.playerAtLocation) {
      locationStatus = locationSummary;
    } else {
      locationStatus = (<PinSuccess hunt={this.props.hunt}/>);
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
