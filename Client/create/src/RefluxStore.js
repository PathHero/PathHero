'use strict';

var Reflux = require('reflux');
var actions = require('./RefluxActions');

module.exports = Reflux.createStore({
  listenables: [actions],
  onUpdateHuntAtKey: function(data, key) {
    this.hunt[key] = data;
    this.trigger(this.hunt);
  },
  onUpdatePinAtKey: function(data, index, key) {
    this.hunt.pins[index][key] = data;
    this.trigger(this.hunt);
  },
  // Add a pin at index. Appends to end if no index is provided.
  onAddPin: function(pin, index) {
    if (index === undefined) {
      this.hunt.pins.push(pin);
    } else {
      this.hunt.pins.splice(index, 0, pin);
    }
    this.trigger(this.hunt);
  },
  // Removes pin at index, pop the last pin if no index is provided.
  onRemovePin: function(index) {
    if (index === undefined) {
      this.hunt.pins.pop();
    } else {
      this.hunt.pins.splice(index, 1);
    }
    this.trigger(this.hunt);
  },
  onUpdateClue: function(data, pinIndex, clueIndex) {
    this.hunt.pins[pinIndex].clues[clueIndex] = data;
    this.trigger(this.hunt);
  },
  onAddClue: function(clue, pinIndex, clueIndex) {
    if (clueIndex === undefined) {
      this.hunt.pins[pinIndex].clues.push(clue);
    } else {
      this.hunt.pins[pinIndex].clues.splice(clueIndex, 0, clue);
    }
    this.trigger(this.hunt);
  },
  onRemoveClue: function(pinIndex, clueIndex) {
    if (clueIndex === undefined) {
      this.hunt.pins[pinIndex].clues.pop();
    } else {
      this.hunt.pins[pinIndex].clues.splice(clueIndex, 1);
    }
    this.trigger(this.hunt);
  },
  onReplaceHunt: function(hunt) {
    this.hunt = hunt;
    this.trigger(this.hunt);
  },
  getInitialState: function () {
    this.hunt = {
       _id: null,
       creatorId: null,
       url: null,
       huntName: '',
       huntDesc: '',
       huntInfo: {
         huntTimeEst: 0,
         huntDistance: 0
       },
       pins: [],
    };
    return this.hunt;
  }
});
