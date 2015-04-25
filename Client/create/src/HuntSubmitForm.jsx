'use strict';
/* jshint quotmark: false */

var $ = require('jquery');
var React = require('react');
var Btn = require('./Btn');
var Alert = require('react-bootstrap').Alert;

module.exports = React.createClass({
  getInitialState: function() {
    return {
      showSaveAlert: false
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
      success: function(data) {
        if (window.location.pathname.split('/')[1] === 'create') {
          var huntId = data.split('/')[3];
          this.moveToEditScreen(huntId);
        } else {
          this.setState({showSaveAlert: true});
        }
      }.bind(this),
      error: function(error) {
        console.error('Error:', error);
      }
    });
  },
  moveToEditScreen: function(huntId) {
    window.location.href = window.location.origin + '/edit/' + huntId;
  },
  dismissSaveAlert: function() {
    this.setState({showSaveAlert: false});
  },
  render: function() {
    var btnLabel = "Save hunt";
    var btnStyle = {
      float: 'right',
      position: 'absolute',
      right: '40px',
      top: '16px',
      backgroundColor: '#ffa600',
      color: '#fff',
      fontWeight: '500',
      borderRadius: '2px',
      fontSize: '1.4em'
    };

    if (this.state.showSaveAlert) {
      return (
      <Alert bsStyle='success' onDismiss={this.dismissSaveAlert} dismissAfter={3500}>
        <p>Successfully saved the hunt!</p>
      </Alert>
      );
    } else {
        return (
        <div>
          <Btn label={btnLabel} newStyle={btnStyle} clickHandler={this.handleSubmit} />
        </div>
      );
    }
  }
});
