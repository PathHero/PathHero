'use strict';
/* jshint quotmark: false */

var React = require('react');

module.exports = React.createClass({
  render: function () {
    var pinIndex = this.props.hunt.currentPinIndex;
    var numOfPins = this.props.hunt.pins.length;
    var progress = Math.min(((pinIndex / numOfPins) * 80), 80);

    var barContainer = {
      position: 'relative'
    };

    var outerBar = {
      borderRadius: '8px',
      border: '2px solid DarkGrey',
      backgroundColor: 'LightGrey',
      width: '80%',
      height: '10px',
      margin: '20px auto 5px auto',
      position: 'absolute'
    };

    var innerBar = {
      borderRadius: '8px',
      border: '2px solid DarkGrey',
      backgroundColor: 'Orange',
      width: progress + '%',
      height: '10px',
      margin: '20px auto 5px auto',
      position: 'absolute'
    };

    var hiker = {
      width: '32px',
      height: '32px',
      background: 'url("http://pathhero.com/static/Hiker.png")',
      backgroundSize: '100%',
      backgroundColor: 'transparent',
      backgroundRepeat: 'no-repeat',
      marginLeft: progress + '%',
      position: 'absolute',
      zIndex: '5'
    };

    return (
      <div id="progress-bar" style={barContainer}>
        <div style={outerBar}></div>
        <div style={innerBar}></div>
        <div style={hiker}></div>
      </div>
    );
  }
});
