'use strict';
/* jshint quotmark: false */

var React = require('react');
var Status = require('./Status');
var Actions = require('../RefluxActions');

module.exports = React.createClass({
  numOfClues: function() {
    var currentPinIndex = this.props.hunt.currentPinIndex;
    var numOfPins = this.props.hunt.pins.length;
    currentPinIndex = Math.min(currentPinIndex, numOfPins-1);
    var currentPin = this.props.hunt.pins[currentPinIndex];
    return currentPin.clues.length;
  },
  hasPrevClue: function() {
    return this.props.hunt.currentClueIndex > 0;
  },
  hasNextClue: function() {
    return this.props.hunt.currentClueIndex < (this.numOfClues() - 1);
  },
  prevClue: function() {
    Actions.updateHuntAtKey(this.props.hunt.currentClueIndex - 1, 'currentClueIndex');
  },
  nextClue: function() {
    Actions.updateHuntAtKey(this.props.hunt.currentClueIndex + 1, 'currentClueIndex');
  },
  render: function () {  

    var currentPinIndex = this.props.hunt.currentPinIndex;
    var numOfPins = this.props.hunt.pins.length;
    currentPinIndex = Math.min(currentPinIndex, numOfPins-1);
    var currentPin = this.props.hunt.pins[currentPinIndex];
    var currentClue = currentPin.clues[this.props.hunt.currentClueIndex];

    var backBtn = (<a className="no-prev-clue">Back</a>);
    var nextBtn = (<a className="no-next-clue">Next</a>);

    if (this.hasPrevClue()) {
      backBtn = (<a href="#" onClick={this.prevClue} className="has-prev-clue">Back</a>);                    
    }
    if (this.hasNextClue()) {
      nextBtn = (<a href="#" onClick={this.nextClue} className="has-next-clue">Next</a>);
    }

    return (
      
        <div id="clue-container">
          <div className="clue-header">
            <h1>Target {currentPinIndex+1}</h1>                
          </div>
 
          <div className="clue-num-container">
            <h2>Clue {this.props.hunt.currentClueIndex + 1} of {this.numOfClues()}</h2>
              <div className="next-prev-link-container">
                {backBtn}{nextBtn}   
              </div>
          </div>         
  
          <div className="current-clue-txt">
            {currentClue}
          </div>
            
          <hr></hr>

          <Status hunt={this.props.hunt}/>
        </div>      
      
    );
  }
});
