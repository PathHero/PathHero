'use strict';
/* jshint quotmark: false */

var React = require('react');
var PinList = require('./PinList');
var HuntSubmitForm = require('./HuntSubmitForm');
var Btn = require('./Btn');
var gMap = require('../../lib/gMapLib');
var Actions = require('./RefluxActions');

module.exports = React.createClass({displayName: "exports",
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
    gMap.addEventListener('directionsChanged', function() {
      this.setState({editTitleMode: this.state.editTitleMode});
    }.bind(this));
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
      title = (React.createElement("input", {id: "hunt-title", ref: "titleEdit", 
                  defaultValue: this.props.hunt.huntName}));
      titleBtn = (React.createElement(Btn, {label: "Save", clickHandler: this.toggleEditTitle}));
    } else {
      title = (React.createElement("span", {id: "hunt-title"}, this.props.hunt.huntName));
      titleBtn = (React.createElement(Btn, {label: "Edit title", clickHandler: this.toggleEditTitle}));
    }

    if (this.state.editDescMode) {
      desc = (React.createElement("textarea", {cols: "35", row: "5", id: "hunt-desc", ref: "descEdit", 
                defaultValue: this.props.hunt.huntDesc}));
      descBtn = (React.createElement(Btn, {label: "Save", clickHandler: this.toggleDesc}));
    } else {
      desc = (React.createElement("span", {id: "hunt-desc"}, this.props.hunt.huntDesc));
      descBtn = (React.createElement(Btn, {label: "Edit description", clickHandler: this.toggleDesc}));
    }

    if (!this.props.hunt.url) {
      url = '';
    } else {
      url = (React.createElement("h2", null, "Hunt URL: ", React.createElement("a", {href: this.props.hunt.url}, this.props.hunt.url)));
    }

    return (
      React.createElement("div", null, 
        React.createElement("div", {id: "hunt-info-container", className: "col-xs-6"}, 
          React.createElement("div", {id: "hunt-title-container"}, 
            url, 
            React.createElement("h2", null, "Hunt Title"), 
              title, 
              titleBtn, 
            React.createElement("div", {className: "tour-summary-container"}, 
              React.createElement("h2", null, "Tour Summary"), 
              React.createElement("div", {className: "summary-box"}, 
                React.createElement("p", null, "Description: ", desc, descBtn), 
                React.createElement("p", null, "Duration: ", gMap.getDuration(), " hours"), 
                React.createElement("p", null, "Distance: ", gMap.getDistance(), " miles"), 
                React.createElement("p", null, "Locations: ", this.props.hunt.pins.length)
              ), 
            React.createElement(HuntSubmitForm, {hunt: this.props.hunt})
            )
          ), 
          React.createElement("div", {id: "pin-container"}, 
            React.createElement("h2", null, "Pins"), 
            React.createElement(PinList, {pins: this.props.hunt.pins})
          )
        )
      )
    );
  }
});
