'use strict';
/* jshint quotmark: false */

var React = require('react');
var PinList = require('./PinList');
var HuntSubmitForm = require('./HuntSubmitForm');
var gMap = require('../../../lib/gMapLib');
var Actions = require('../RefluxActions');

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
                      value={this.props.hunt.huntName} key={this.props.hunt._id} />);
    } else {
      title = (<span id="hunt-title">{this.props.hunt.huntName}</span>);
    }

    if (this.props.hunt.editMode) {
      desc = (<textarea id="hunt-desc" ref="descEdit" onChange={this.onChangeDesc} 
                        cols="35" row="5" value={this.props.hunt.huntDesc} 
                        key={this.props.hunt._id} />);
    } else {
      desc = (<span id="hunt-desc">{this.props.hunt.huntDesc}</span>);
    }

    if (!this.props.hunt.url) {
      url = '';
    } else {
      url = (<h2>Hunt URL: <a href={this.props.hunt.url}>{this.props.hunt.url}</a></h2>);
    }

    return (
      <div>
        <div id="hunt-info-container" className="col-xs-6">
          <HuntSubmitForm hunt={this.props.hunt} editMode={this.props.hunt.editMode} />
          <div id="hunt-title-container">
            {url}
            <h2>Hunt Title</h2>
              {title}
            <div className="tour-summary-container">
              <h2>Tour Summary</h2>
              <div className="summary-box">
                <p>Description: {desc}</p>
                <p>Duration: {this.props.hunt.huntInfo.huntTimeEst} hours</p>
                <p>Distance: {this.props.hunt.huntInfo.huntDistance} miles</p>

                <p>Locations: {this.props.hunt.pins.length}</p>              
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
