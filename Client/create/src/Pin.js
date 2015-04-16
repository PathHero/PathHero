'use strict';
/* jshint quotmark: false */

var React = require('react');
var Clue = require('./Clue');
var NameLocation = require('./NameLocation');
var Btn = require('./Btn');
var Accordion = require('react-bootstrap').Accordion;
var Panel = require('react-bootstrap').Panel;
var Actions = require('./RefluxActions');

module.exports = React.createClass({displayName: "exports",
  handleNewClue: function() {
    var newClue = this.refs.clueInput.getDOMNode().value;
    React.findDOMNode(this.refs.clueInput).value = '';
    Actions.addClue(newClue, this.props.pinIndex);
  },
  resultTextOnChange: function(){
    var newResultText = this.refs.resultText.getDOMNode().value;
    Actions.updatePinAtKey(newResultText, this.props.pinIndex, 'resultText');
  },
  render: function() {
    var clueNodes = this.props.pin.clues.map(function(clue, clueIndex) {
      return (
        React.createElement(Clue, {clue: clue, pinIndex: this.props.pinIndex, 
        clueIndex: clueIndex, key: clueIndex})
      );
    }, this);

    return (
      React.createElement("div", {className: "pinContainer"}, 
        React.createElement(NameLocation, {pin: this.props.pin, pinIndex: this.props.pinIndex}), 
        React.createElement(Accordion, null, 
          React.createElement(Panel, {header: "Pin " + (this.props.pinIndex + 1) + ": " + this.props.pin.answer}, 
          clueNodes, 
          React.createElement("textarea", {col: "35", row: "30", ref: "clueInput"}), 
          React.createElement(Btn, {label: "Add Clue", clickHandler: this.handleNewClue}), 
          React.createElement("div", null, "Answer"), 
          React.createElement("textarea", {col: "35", row: "30", ref: "resultText", defaultValue: this.props.pin.resultText, onChange: this.resultTextOnChange})
          )
        )
      )
    );
  }
});
