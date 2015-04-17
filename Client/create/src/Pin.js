'use strict';
/* jshint quotmark: false */

var React = require('react');
var Clue = require('./Clue');
var Btn = require('./Btn');
var Accordion = require('react-bootstrap').Accordion;
var Panel = require('react-bootstrap').Panel;
var Actions = require('./RefluxActions');

module.exports = React.createClass({displayName: "exports",
  getInitialState: function() {
    return {
      editLocationMode: true,
    };
  },
  handleNewClue: function() {
    var newClue = this.refs.clueInput.getDOMNode().value;
    React.findDOMNode(this.refs.clueInput).value = '';
    React.findDOMNode(this.refs.clueInput).focus();
    Actions.addClue(newClue, this.props.pinIndex);
  },
  resultTextOnChange: function(){
    var newResultText = this.refs.resultText.getDOMNode().value;
    Actions.updatePinAtKey(newResultText, this.props.pinIndex, 'resultText');
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
    var pinHeader, btnLabel;

    if (this.state.editLocationMode) {
      btnLabel = "Set location";
      pinHeader = (React.createElement("span", null, "Pin ", this.props.pinIndex+1, ":",  
                     React.createElement("input", {type: "text", ref: "locationName", 
                             defaultValue: this.props.pin.answer})
                   ));
    } else {
      btnLabel = "Edit location";
      pinHeader = (React.createElement("span", null, "Pin ", this.props.pinIndex+1, ": ", this.props.pin.answer
                   ));
    }

    pinHeader = (React.createElement("span", null, pinHeader, 
                   React.createElement(Btn, {label: btnLabel, clickHandler: this.inputLocation})
                 ));

    var clueNodes = this.props.pin.clues.map(function(clue, clueIndex) {
      return (
        React.createElement(Clue, {clue: clue, pinIndex: this.props.pinIndex, 
        clueIndex: clueIndex, key: clueIndex})
      );
    }, this);

    return (
      React.createElement("div", {className: "pinContainer"}, 
        React.createElement(Panel, {header: pinHeader}, 
        clueNodes, 
        React.createElement("textarea", {col: "35", row: "30", ref: "clueInput"}), 
        React.createElement(Btn, {label: "Add Clue", clickHandler: this.handleNewClue}), 
        React.createElement("div", null, "Answer"), 
        React.createElement("textarea", {col: "35", row: "30", ref: "resultText", 
                  defaultValue: this.props.pin.resultText, 
                  onChange: this.resultTextOnChange})
        )
      )
    );
  }
});
