'use strict';
/* jshint quotmark: false */

var React = require('react');
var Actions = require('../RefluxActions');

module.exports = React.createClass({
  deleteClue: function() {
    Actions.removeClue(this.props.pinIndex, this.props.clueIndex);
  },
  onClueChange: function(){
    var newText = this.refs.clueEdit.getDOMNode().value;
    Actions.updateClue(newText, this.props.pinIndex, this.props.clueIndex);
  },
  render: function() {
    var clueStyle = {
      marginBottom: '10'
    };

    var removeStyle = {
      textAlign: 'left'
    }

    var clueText = (
      <textarea
        className="clue-text-area"
        ref="clueEdit" 
        value={this.props.clue}
        onChange={this.onClueChange}
        placeholder="Ex: A former defensive point"
      />
    );

    return (
      <div style={clueStyle} className="clueDetails">
        <div className="row">
          <div className="col-xs-12 bold-title">
            Clue {this.props.clueIndex + 1}
          </div>
          <div className="col-xs-10 clue-hint-container">
            {clueText}
          </div>
          <div className="col-xs-1 clue-button-area">
            <i style={removeStyle} className="fa fa-remove remove-shifted" onClick={this.deleteClue}></i>
          </div>
        </div>
      </div>
    );
  }
});
