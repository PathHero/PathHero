'use strict';
/* jshint quotmark: false */

var React = require('react');
var TitleBox = require('./TitleBox');
var Actions = require('./RefluxActions');

module.exports = React.createClass({displayName: "exports",
  numOfClues: function() {
    var currentPin = this.props.hunt.pins[this.props.hunt.currentPinIndex];
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
    var currentPin = this.props.hunt.pins[this.props.hunt.currentPinIndex];
    var currentClue = currentPin.clues[this.props.hunt.currentClueIndex];

    var backBtn = null;
    var nextBtn = null;
    if (this.hasPrevClue()) {
      backBtn = (React.createElement("button", {onClick: this.prevClue, className: "btn btn-default"}, "Back"));                    
    }
    if (this.hasNextClue()) {
      nextBtn = (React.createElement("button", {onClick: this.nextClue, className: "btn btn-default"}, "Next"));
    }
    return (
      React.createElement("div", {id: "playerContainer"}, 
        React.createElement("div", {className: "clue-container"}, 
          React.createElement("div", {className: "clue-header"}, 
            React.createElement("h1", null)
          ), 
          React.createElement(TitleBox, {title: "Clue " + (this.props.hunt.currentClueIndex + 1) + " of " +  this.numOfClues()}, 
            currentClue
          ), 
            backBtn, nextBtn
        )
      )
    );
  }
});
