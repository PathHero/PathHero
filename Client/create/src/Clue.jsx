'use strict';
/* jshint quotmark: false */

var React = require('react');
var Actions = require('../RefluxActions');

module.exports = React.createClass({
  deleteClue: function() {
    Actions.removeClue(this.props.pinIndex, this.props.clueIndex);
  },
  onBlur: function(){
    var newText = this.refs.clueEdit.getDOMNode().value;
    Actions.updateClue(newText, this.props.pinIndex, this.props.clueIndex);
  },
  render: function() {
    var clueStyle = {
      marginBottom: '10'
    };

    var removeStyle = {
      textAlign: 'left'
    };

    var clueText = (
      <textarea
        className="clue-text-area"
        ref="clueEdit" 
        defaultValue={this.props.clue}
        onBlur={this.onBlur}
        placeholder="Ex: A former defensive point"
      />
    );

    return (
      <div style={clueStyle} className="clueDetails">
        
        <div className="bold-title">
          Clue {this.props.clueIndex + 1}
        </div>
        
        {clueText}
        
        <div className="clue-button-area">
          <i style={removeStyle} className="fa fa-remove remove-shifted" onClick={this.deleteClue}></i>
        </div>
        
      </div>
    );
  }
});
