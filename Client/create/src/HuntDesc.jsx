'use strict';
/* jshint quotmark: false */

var React = require('react');
var Actions = require('../RefluxActions');

module.exports = React.createClass({
  onBlur: function() {
    var newDesc = this.refs.descEdit.getDOMNode().value;
    Actions.updateHuntAtKey(newDesc, 'huntDesc');
  },
  render: function() {
    var desc = (
      <textarea 
        id="hunt-desc" 
        ref="descEdit" 
        onBlur={this.onBlur} 
        placeholder="Ex: This adventurous challenge takes you from the
          the inner streets of San Francisco to the tranquil peace of local parks,
          and ends back in the city after weaving around the coastline."
        cols="83"
        rows="6"
        defaultValue={this.props.hunt.huntDesc} 
        key={this.props.hunt._id} 
      />
    );

    return (
      <div>
        <h2>Hunt Description</h2>
        <p>{desc}</p>
      </div>
    );
  }
});
