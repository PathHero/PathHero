'use strict';
/* jshint quotmark: false */

var React = require('react');
var TitleBox = require('./TitleBox');
var Clues = require('./Clues');
var gMap = require('../../../lib/gMapLib');
var Status = require('./Status');
var PinSuccess = require('./PinSuccess');
var HuntSuccess = require('./HuntSuccess');
var Actions = require('../RefluxActions');

var HITDISTANCE = 4;
var windowHeight = { height: window.innerHeight }; 

module.exports = React.createClass({

  getInitialState: function() {

    var currentPinIndex = this.props.hunt.currentPinIndex;
    var numOfPins = this.props.hunt.pins.length;
    currentPinIndex = Math.min(currentPinIndex, numOfPins-1);
    var currentPin = this.props.hunt.pins[currentPinIndex];
    var answer = currentPin.answer;
    var resultText = currentPin.resultText;

    return {
      playerAtLocation: false,
      huntComplete: false,
      distanceToNextPin: 0.00,
      answer: answer,
      resultText: resultText

    };
  },
  componentWillMount: function() {
    var currentPinIndex = this.props.hunt.currentPinIndex;
    var numOfPins = this.props.hunt.pins.length;
    currentPinIndex = Math.min(currentPinIndex, numOfPins-1);
    var currentPin = this.props.hunt.pins[currentPinIndex];
    var nextGeo = currentPin.geo;
    gMap.getDistanceToLatLng(function (value) {
      var playerAtLocation = false;
      var huntComplete = false;
      if (value < HITDISTANCE) {
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

  togglePlayerAtLocation: function() {
    this.setState({playerAtLocation: false});


    var currentPinIndex = this.props.hunt.currentPinIndex;
    var numOfPins = this.props.hunt.pins.length;
    currentPinIndex = Math.min(currentPinIndex, numOfPins-1);
    var currentPin = this.props.hunt.pins[currentPinIndex];
    var nextGeo = currentPin.geo;
    gMap.getDistanceToLatLng(function (value) {
      var playerAtLocation = false;
      var huntComplete = false;
      if (value < HITDISTANCE) {
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

    var currentPinIndex = this.props.hunt.currentPinIndex;
    var numOfPins = this.props.hunt.pins.length;
    currentPinIndex = Math.min(currentPinIndex, numOfPins-1);
    var currentPin = this.props.hunt.pins[currentPinIndex];
    var answer = currentPin.answer;
    var resultText = currentPin.resultText;

    this.setState({answer: answer});


  },
  
  render: function () { 

    var numOfLocations = this.props.hunt.pins.length;
    var listItemArray = [ this.state.distanceToNextPin + " miles from target", numOfLocations + " locations left" ];
                          
    var locationStatus;
    var clues = (<Clues hunt={this.props.hunt} />);
    
    if (!this.state.playerAtLocation) {
      locationStatus = clues;
    } else {
      locationStatus = (
        <PinSuccess hunt={this.props.hunt} huntComplete={this.state.huntComplete} togglePlayerAtLocation={this.togglePlayerAtLocation} answer={this.state.answer} resultText={this.state.resultText}/>);
    }

    var huntStatus = null;
    if (this.state.huntComplete) {
      huntStatus = (<HuntSuccess/>);
    }

    return (
      <div id="playerContainer" style={windowHeight}>
        {locationStatus}
        {huntStatus}
      </div>

    );
  }
});


