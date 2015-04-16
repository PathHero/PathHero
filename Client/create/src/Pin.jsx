'use strict';
/* jshint quotmark: false */

var React = require('react');
var Clue = require('./Clue');
var NameLocation = require('./NameLocation');
var Btn = require('./Btn');
var Accordion = require('react-bootstrap').Accordion;
var Panel = require('react-bootstrap').Panel;
var Actions = require('./RefluxActions');

module.exports = React.createClass({
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
        <Clue clue={clue} pinIndex={this.props.pinIndex} 
        clueIndex={clueIndex} key={clueIndex}/>
      );
    }, this);

    return (
      <div className="pinContainer">
        <NameLocation pin={this.props.pin} pinIndex={this.props.pinIndex} />
        <Accordion>
          <Panel header={"Pin " + (this.props.pinIndex + 1) + ": " + this.props.pin.answer} >
          {clueNodes}
          <textarea col="35" row="30" ref="clueInput" />
          <Btn label={"Add Clue"} clickHandler={this.handleNewClue} />
          <div>Answer</div>
          <textarea col="35" row="30" ref="resultText" defaultValue={this.props.pin.resultText} onChange={this.resultTextOnChange}/>
          </Panel>
        </Accordion>  
      </div>
    );
  }
});
