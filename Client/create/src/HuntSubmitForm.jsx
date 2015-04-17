'use strict';
/* jshint quotmark: false */

var $ = require('jquery');
var React = require('react');
var Btn = require('./Btn');
var Alert = require('react-bootstrap').Alert;
var Actions = require('../RefluxActions');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      showCreateAlert: false,
      showEditAlert: false
    };
  },
  handleSubmit: function() {
    if (this.props.editMode === true) {
      delete this.props.hunt.editMode; // not sent to db but will be refreshed
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
        success: function(data) {
          if (window.location.pathname.split('/')[1] === 'create') {
            this.setState({showCreateAlert: true, url: data});
          } else {
            Actions.toggleEditMode(false);
            this.setState({showEditAlert: true});
          }
        }.bind(this),
        error: function(error) {
          console.error('Error:', error);
        }
      });
    } else if (this.props.editMode === false) {
      Actions.toggleEditMode(true);
    } 
  },
  moveToEditScreen: function() {
    var newHuntID = this.state.url.split('/')[3];
    window.location.href = window.location.origin + '/edit/' + newHuntID;
  },
  dismissEditAlert: function() {
    this.setState({showEditAlert: false});
  },
  render: function() {
    var btnLabel = "Edit hunt";
    var btnStyle = {
      float: 'right'
    };
    if (this.state.showCreateAlert) {
      return (
        <Alert bsStyle='success'>
        <p>Successfully created a hunt!</p>
        <Btn label={"Click to edit and play this hunt"}
        clickHandler={this.moveToEditScreen} />
        </Alert>
      );
    }

    if (this.state.showEditAlert) {
      return (
      <Alert bsStyle='success' onDismiss={this.dismissEditAlert} dismissAfter={3500}>
        <p>Successfully edited the hunt!</p>
      </Alert>
      );
    }

    if (this.props.editMode) {
      btnLabel = "Save hunt";
    }
    return (
      <div>
        <Btn label={btnLabel} newStyle={btnStyle} clickHandler={this.handleSubmit} />
      </div>
    );
  }
});
