'use strict';
/* jshint quotmark: false */

var React = require('react');
var PinList = require('./PinList');
var HuntSubmitForm = require('./HuntSubmitForm');
var gMap = require('../../../lib/gMapLib');
var Actions = require('../RefluxActions');

var windowHeight = {
  minHeight: window.innerHeight
};

module.exports = React.createClass({
  updateHuntInfo: function() {
    var huntInfo = {
      huntTimeEst: gMap.getDuration(),
      huntDistance: gMap.getDistance()
    };
    Actions.updateHuntAtKey(huntInfo, 'huntInfo');
  },
  componentDidMount: function() {
    gMap.addEventListener('addMarker', function(latLng) {
      var geo = {
        lat: latLng.lat(),
        lng: latLng.lng(),
      };
      var pin = {
        "answer": "",
        "resultText": "",
        "clues": [],
        "geo": geo,
      };
      Actions.addPin(pin);
      this.updateHuntInfo();
    }.bind(this));

    gMap.addEventListener('dragEvent', function(latLngArray) {
      latLngArray.forEach(function(latLng, index) {
        var geo = {
          lat: latLng.lat(),
          lng: latLng.lng(),
        };
        Actions.updatePinAtKey(geo, index, 'geo');
      });
      this.updateHuntInfo();
    }.bind(this));

    if (window.location.pathname.split('/')[1] === 'create') {
      if (this.props.hunt.editMode) {
        this.refs.titleEdit.getDOMNode().focus();
      }
    }
  },
  onChangeTitle: function() {
    var newTitle = this.refs.titleEdit.getDOMNode().value;
    Actions.updateHuntAtKey(newTitle, 'huntName');
  },
  onChangeDesc: function() {
    var newDesc = this.refs.descEdit.getDOMNode().value;
    Actions.updateHuntAtKey(newDesc, 'huntDesc');
  },
  render: function() {
    var title, desc, url;
    if (this.props.hunt.editMode) {
      title = (<input id="hunt-title" ref="titleEdit" onChange={this.onChangeTitle}
                      placeholder="Ex: Secrets of San Francisco" size="39"
                      value={this.props.hunt.huntName} key={this.props.hunt._id} />);
    } else {
      title = (<span id="hunt-title">{this.props.hunt.huntName}</span>);
    }

    if (this.props.hunt.editMode) {
      desc = (<textarea id="hunt-desc" ref="descEdit" onChange={this.onChangeDesc} 
                        placeholder="Ex: This adventurous challenge takes you from the
                        the inner streets of San Francisco to the tranquil peace of local parks, 
                        and ends back in the city after weaving around the coastline."
                        cols="83" rows="6" value={this.props.hunt.huntDesc} 
                        key={this.props.hunt._id} />);
    } else {
      desc = (<span id="hunt-desc">{this.props.hunt.huntDesc}</span>);
    }

    if (!this.props.hunt.url) {
      url = '';
    } else {
      url = (
        <div className="tour-summary-container">
          <h2>Hunt URL:</h2>
          <a className="editModeURL" href={this.props.hunt.url}>{this.props.hunt.url}</a>
        </div>);
    }

    return (
      <div className="clueBox">
        <div id="hunt-info-container" className="col-xs-6" style={windowHeight}>
          <HuntSubmitForm hunt={this.props.hunt} editMode={this.props.hunt.editMode} />
          <ul id="hunt-details">
            <li>{' '+this.props.hunt.pins.length} locations</li>
            <li>{' '+this.props.hunt.huntInfo.huntDistance} miles</li>
            <li>{this.props.hunt.huntInfo.huntTimeEst} hours walk</li>
          </ul>
          
          <div id="hunt-title-container">
            {url}
            <div className="tour-summary-container">
              <h2>Hunt Title</h2>
              {title}
              <h2>Hunt Description</h2>
              <p>{desc}</p>
              <div>
              </div>
            </div>
          </div>
          <div id="pin-container">
            <h2>Pins</h2>
            <PinList pins={this.props.hunt.pins} editMode={this.props.hunt.editMode} /> 
          </div>
        </div>
      </div>
    );
  }
});
