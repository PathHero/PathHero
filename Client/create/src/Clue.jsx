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

    var clueText = (
      <textarea 
        cols="35" 
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
          <div className="col-xs-7">
            {clueText}
          </div>
          <div className="col-xs-1">
            <i className="fa fa-remove" onClick={this.deleteClue}></i>
          </div>
        </div>
      </div>
    );
  }
});
