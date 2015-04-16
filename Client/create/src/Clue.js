'use strict';
/* jshint quotmark: false */

var React = require('react');
var Btn = require('./Btn');
var Actions = require('./RefluxActions');


module.exports = React.createClass({displayName: "exports",
  getInitialState: function() {
    return {
      editMode: false,
    };
  },
  toggleEdit: function() {
    if (this.state.editMode) {
      var editedClue = this.refs.clueEdit.getDOMNode().value;
      Actions.updateClue(editedClue, this.props.pinIndex, this.props.clueIndex);
      this.setState({editMode: false});
    } else {
      this.setState({editMode: true});
    }
  },
  deleteClue: function() {
    Actions.removeClue(this.props.pinIndex, this.props.clueIndex);
  },
  render: function() {
    var editBtn;
    var text;
    if (this.state.editMode) {
      editBtn = (React.createElement("button", {className: "btn", onClick: this.toggleEdit}, "Save"));
      text = (React.createElement("textarea", {cols: "35", ref: "clueEdit", defaultValue: this.props.clue}));
    } else {
      editBtn = (React.createElement("button", {className: "btn", onClick: this.toggleEdit}, "Edit"));
      text = this.props.clue;
    }
    return (
      React.createElement("div", {className: "clueDetails"}, 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-xs-2"}, 
            "Clue ", this.props.clueIndex + 1, ":"
          ), 
          React.createElement("div", {className: "col-xs-6"}, 
          text
          ), 
          React.createElement("div", {className: "col-xs-4"}, 
            editBtn, 
            React.createElement(Btn, {clickHandler: this.deleteClue, label: "Delete"})
          )
        )
      )
    );
  }
});
