'use strict';
/* jshint quotmark: false */

var React = require('react');
var Btn = require('./Btn');
var Actions = require('./RefluxActions');

module.exports = React.createClass({
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
      locationInput = (<form><input type="text" ref="locationName" 
                          defaultValue={this.props.pin.answer} />
                       <Btn label={"Save"} clickHandler={this.inputLocation} /></form>);
    } else {
      locationInput = (<Btn label={"Set location name"} clickHandler={this.inputLocation} />);
    }
    return (
      (locationInput)
    );
  }
});
