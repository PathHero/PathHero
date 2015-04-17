'use strict';
/* jshint quotmark: false */

var React = require('react');
var PinList = require('./PinList');
var HuntSubmitForm = require('./HuntSubmitForm');
var Btn = require('./Btn');
var gMap = require('../../../lib/gMapLib');
var Actions = require('../RefluxActions');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      editTitleMode: false,
      editDescMode: false,
    };
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
    });
  },
  toggleEditTitle: function() {
    var newTitle;
    if (this.state.editTitleMode) {
      newTitle = this.refs.titleEdit.getDOMNode().value;
      // this.setState({title: newTitle, editTitleMode: false});
      Actions.updateHuntAtKey(newTitle, 'huntName');
      this.setState({editTitleMode: false});
    } else {
      this.setState({editTitleMode: true});
    }
  },
  toggleDesc: function() {
    var newDesc;
    if (this.state.editDescMode) {
      newDesc = this.refs.descEdit.getDOMNode().value;
      Actions.updateHuntAtKey(newDesc, 'huntDesc');
      this.setState({editDescMode: false});
    } else {
      this.setState({editDescMode: true});
    }
  },
  render: function() {
    var title, titleBtn;
    var desc, descBtn;
    var url;
    if (this.state.editTitleMode) {
      title = (<input id="hunt-title" ref="titleEdit"
                  defaultValue={this.props.hunt.huntName} />);
      titleBtn = (<Btn label={"Save"} clickHandler={this.toggleEditTitle} />);
    } else {
      title = (<span id="hunt-title">{this.props.hunt.huntName}</span>);
      titleBtn = (<Btn label={"Edit title"} clickHandler={this.toggleEditTitle} />);
    }

    if (this.state.editDescMode) {
      desc = (<textarea cols="35" row="5" id="hunt-desc" ref="descEdit"
                defaultValue={this.props.hunt.huntDesc}  />);
      descBtn = (<Btn label={"Save"} clickHandler={this.toggleDesc} />);
    } else {
      desc = (<span id="hunt-desc">{this.props.hunt.huntDesc}</span>);
      descBtn = (<Btn label={"Edit description"} clickHandler={this.toggleDesc} />);
    }

    if (!this.props.hunt.url) {
      url = '';
    } else {
      url = (<h2>Hunt URL: <a href={this.props.hunt.url}>{this.props.hunt.url}</a></h2>);
    }

    return (
      <div>
        <div id="hunt-info-container" className="col-xs-6">
          <div id="hunt-title-container">
            {url}
            <h2>Hunt Title</h2>
              {title}
              {titleBtn}
            <div className="tour-summary-container">
              <h2>Tour Summary</h2>
              <div className="summary-box">
                <p>Description: {desc}{descBtn}</p>
                <p>Duration: {gMap.getDuration()} hours</p>
                <p>Distance: {gMap.getDistance()} miles</p>
                <p>Locations: {this.props.hunt.pins.length}</p>              
              </div>
            <HuntSubmitForm hunt={this.props.hunt} />
            </div>
          </div>
          <div id="pin-container">
            <h2>Pins</h2>
            <PinList pins={this.props.hunt.pins} /> 
          </div>
        </div>
      </div>
    );
  }
});
