'use strict';
/* jshint quotmark: false */

var React = require('react');
var gMap = require('../../../lib/gMapLib');
var TitleBox = require('./TitleBox');
var List = require('./List');
var HuntSummaryContainer = require('./HuntSummaryContainer');

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
      this.setState({
        distanceToNextPin: value,
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
    var listItemArray = [ this.state.distanceToNextPin + " miles from target", numOfLocations + " locations left" ];
                          
    
    var locationSummary = (
      <TitleBox title="Status">
        <List listItemArray={listItemArray} />
      </TitleBox>
    );

        
    return (
      <div>
        {locationSummary}
        <hr></hr>
        <HuntSummaryContainer hunt={this.props.hunt}/>
      </div>
    );
  }
});
