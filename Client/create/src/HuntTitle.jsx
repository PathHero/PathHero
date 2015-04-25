'use strict';
/* jshint quotmark: false */

var React = require('react');
var Actions = require('../RefluxActions');

module.exports = React.createClass({
  onComponentDidMount: function() {
    this.refs.titleEdit.getDOMNode().focus();
  },
  onBlur: function() {
    var newTitle = this.refs.titleEdit.getDOMNode().value;
    Actions.updateHuntAtKey(newTitle, 'huntName');
  },
  render: function() {
    var title = (
      <input 
        id="hunt-title" 
        ref="titleEdit" 
        onBlur={this.onBlur}
        placeholder="Ex: Secrets of San Francisco" 
        size="39"
        defaultValue={this.props.hunt.huntName} 
        key={this.props.hunt._id}
      />
    );

    return (
      <div>
        <h2>Hunt Title</h2>
        {title}
      </div>
    );
  }
});
