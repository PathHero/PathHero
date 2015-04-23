'use strict';
/* jshint quotmark: false */

var React = require('react');
var Clue = require('./Clue');
var Btn = require('./Btn');
var Panel = require('react-bootstrap').Panel;
var Actions = require('../RefluxActions');
var gMap = require('../../../lib/gMapLib');
var mapImg = require('../../../lib/mapMarkers.js');

module.exports = React.createClass({
  componentDidMount: function() {
    if (this.props.editMode) {
      React.findDOMNode(this.refs.locationName).focus();
    }
  },
  handleNewClue: function() {
    var newClue = this.refs.clueInput.getDOMNode().value;
    React.findDOMNode(this.refs.clueInput).value = '';
    Actions.addClue(newClue, this.props.pinIndex);
    React.findDOMNode(this.refs.clueInput).focus();  
  },
  resultTextOnChange: function(){
    var newResultText = this.refs.resultText.getDOMNode().value;
    Actions.updatePinAtKey(newResultText, this.props.pinIndex, 'resultText');
  },
  onLocationChange: function() {
    if (this.props.editMode) {
      var locationName = this.refs.locationName.getDOMNode().value;
      Actions.updatePinAtKey(locationName, this.props.pinIndex, 'answer');
      this.setState({editLocationMode: false});
    }
  },
  removePin:function(){
    Actions.removePin(this.props.pinIndex);
    gMap.remove(this.props.pinIndex);
  },
  render: function() {
    var pinHeader;
    if (this.props.editMode) {
      pinHeader = (<span>
                     <img src={mapImg[this.props.pinIndex]} width="42" />
                     <input type="text" ref="locationName" onChange={this.onLocationChange}
                            value={this.props.pin.answer} />
                      <span>
                        <Btn label="X" clickHandler={this.removePin}/>
                      </span>
                   </span>);
    } else {
      pinHeader = (<span>Pin {this.props.pinIndex+1}: {this.props.pin.answer}
                   </span>);
    }


    var clueNodes = this.props.pin.clues.map(function(clue, clueIndex) {
      return (
        <Clue clue={clue} pinIndex={this.props.pinIndex} 
        clueIndex={clueIndex} key={clueIndex}/>
      );
    }, this);

    var addClue = {
      position: 'relative',
      top: '-22',
      left: '10',
    };

    return (
      <div className="pinContainer">
        <Panel header={pinHeader}>
        {clueNodes}
        <textarea col="35" row="30" ref="clueInput" />
        <Btn label={"Add Clue"} newStyle={addClue} clickHandler={this.handleNewClue} />
        <div>Answer</div>
        <textarea col="35" row="30" ref="resultText" 
                  defaultValue={this.props.pin.resultText} 
                  onChange={this.resultTextOnChange}/>
        <div>
          
        </div>
        </Panel>
      </div>
    );
  }
});
