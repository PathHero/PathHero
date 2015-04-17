'use strict';

var Reflux = require('reflux');
var actions = require('./RefluxActions');

module.exports = Reflux.createStore({
  listenables: [actions],
  onUpdateHuntAtKey: function(data, key) {
    this.hunt[key] = data;
    localStorage[this.huntID] = JSON.stringify(this.hunt);
    this.trigger(this.hunt);
  },
  onUpdatePinAtKey: function(data, index, key) {
    this.hunt.pins[index][key] = data;
    localStorage[this.huntID] = JSON.stringify(this.hunt);
    this.trigger(this.hunt);
  },
  // Add a pin at index. Appends to end if no index is provided.
  onAddPin: function(pin, index) {
    if (!index) {
      this.hunt.pins.push(pin);
    } else {
      this.hunt.pins.splice(index, 0, pin);
    }
    localStorage[this.huntID] = JSON.stringify(this.hunt);
    this.trigger(this.hunt);
  },
  // Removes pin at index, pop the last pin if no index is provided.
  onRemovePin: function(index) {
    if (!index) {
      this.hunt.pins.pop();
    } else {
      this.hunt.pins.splice(index, 1);
    }
    localStorage[this.huntID] = JSON.stringify(this.hunt);
    this.trigger(this.hunt);
  },
  onUpdateClue: function(data, pinIndex, clueIndex) {
    this.hunt.pins[pinIndex].clues[clueIndex] = data;
    localStorage[this.huntID] = JSON.stringify(this.hunt);
    this.trigger(this.hunt);
  },
  onAddClue: function(clue, pinIndex, clueIndex) {
    if (!clueIndex) {
      this.hunt.pins[pinIndex].clues.push(clue);
    } else {
      this.hunt.pins[pinIndex].clues.splice(clueIndex, 0, clue);
    }
    localStorage[this.huntID] = JSON.stringify(this.hunt);
    this.trigger(this.hunt);
  },
  onRemoveClue: function(pinIndex, clueIndex) {
    if (!clueIndex) {
      this.hunt.pins[pinIndex].clues.pop();
    } else {
      this.hunt.pins[pinIndex].clues.splice(clueIndex, 1);
    }
    localStorage[this.huntID] = JSON.stringify(this.hunt);
    this.trigger(this.hunt);
  },
  onReplaceHunt: function(hunt) {
    var storedHunt = localStorage.hunt;
    if (storedHunt) {
      hunt.currentPinIndex = JSON.parse(storedHunt).currentPinIndex;
      hunt.currentClueIndex = JSON.parse(storedHunt).currentClueIndex;
    } else {
      hunt.currentPinIndex = 0;
      hunt.currentClueIndex = 0;
    }
    this.hunt = hunt;
    localStorage[this.huntID] = JSON.stringify(this.hunt);
    this.trigger(this.hunt);
  },
  getInitialState: function () {
    this.huntID = window.location.pathname.slice(1);
    var storedHunt = localStorage[this.huntID];
    if (storedHunt) {
      this.hunt = JSON.parse(storedHunt);
    } else {
      this.hunt = {
        currentPinIndex: 0,
        currentClueIndex: 0,
        _id: null,
        creatorId: null,
        url: null,
        huntName: '',
        huntDesc: '',
        huntInfo: {
          huntTimeEst: 0,
          huntDistance: 0
        },
        pins: []
      };
    }
    return this.hunt;
  }
});
