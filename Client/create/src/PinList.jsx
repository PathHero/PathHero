'use strict';
/* jshint quotmark: false */

var React = require('react');
var Pin = require('./Pin');

module.exports = React.createClass({
  render: function() {
    var pinNodes;
    if (this.props.pins.length === 0) {
      pinNodes = (<h2>Click on the map to add locations.</h2>);
    } else {
      pinNodes = this.props.pins.map(function(pin, index) {
        return (
          <Pin pinIndex={index} pin={pin} key={index} editMode={this.props.editMode}>
          </Pin>
        );
      }, this);
    }
    return (
      <div className="pinList">
        {pinNodes}
      </div>
    );
  }
});
