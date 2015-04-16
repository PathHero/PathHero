'use strict';
/* jshint quotmark: false */

var React = require('react');
var Btn = require('./Btn');
var Actions = require('./RefluxActions');

module.exports = React.createClass({displayName: "exports",
  getInitialState: function() {
    return {
      editLocationMode: false,
    };
  },
  inputLocation: function() {
    if (this.state.editLocationMode) {
      var locationName = this.refs.locationName.getDOMNode().value;
      Actions.updatePinAtKey(locationName, this.props.pinIndex, 'answer');
      this.setState({editLocationMode: false});
    } else {
      this.setState({editLocationMode: true});
    }
  },
  render: function() {
    var locationInput;
    if (this.state.editLocationMode) {
      locationInput = (React.createElement("form", null, React.createElement("input", {type: "text", ref: "locationName", 
                          defaultValue: this.props.pin.answer}), 
                       React.createElement(Btn, {label: "Save", clickHandler: this.inputLocation})));
    } else {
      locationInput = (React.createElement(Btn, {label: "Set location name", clickHandler: this.inputLocation}));
    }
    return (
      (locationInput)
    );
  }
});
