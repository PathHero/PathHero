'use strict';
/* jshint quotmark: false */

var $ = require('jquery');
var React = require('react');
var Btn = require('./Btn');
var Alert = require('react-bootstrap').Alert;

module.exports = React.createClass({displayName: "exports",
  getInitialState: function() {
    return {
      showAlert: false
    };
  },
  handleSubmit: function() {
    var dataType = 'text';
    if (window.location.pathname.split('/')[1] === 'edit') {
      dataType = 'json';
    }
    $.ajax({
      url: window.location.href,
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(this.props.hunt),
      dataType: dataType,
      success: function(data) { // ignoring params: data
        if (window.location.pathname.split('/')[1] === 'create') {
          this.setState({showAlert: true, url: data});
        } else {
          // insert edit success handling here
        }
      }.bind(this),
      error: function(error) {
        console.error('Error:', error);
      }
    });
  },
  moveToEditScreen: function() {
    var newHuntID = this.state.url.split('/')[3];
    window.location.href = window.location.origin + '/edit/' + newHuntID;
  },
  render: function() {
    if (this.state.showAlert) {
      return (
        React.createElement(Alert, {bsStyle: "success"}, 
        React.createElement("p", null, "Successfully created a hunt!"), 
        React.createElement(Btn, {label: "Click to edit and play this hunt", 
        clickHandler: this.moveToEditScreen})
        )
      );
    }
    return (
      React.createElement("div", null, 
        React.createElement(Btn, {label: "Submit hunt", clickHandler: this.handleSubmit})
      )
    );
  }
});
