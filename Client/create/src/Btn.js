'use strict';
/* jshint quotmark: false */

var React = require('react');

module.exports = React.createClass({displayName: "exports",
  propTypes: {
    clickHandler: React.PropTypes.func,
    label: React.PropTypes.string,
    newClass: React.PropTypes.string
  },
  render: function() {
    var classString = 'btn';
    if (this.props.newClass) {
      classString += ' ' + this.props.newClass;
    }
    return (
      React.createElement("button", {className: "btn", type: "button", onClick: this.props.clickHandler}, 
        this.props.label
      )
    );
  }
});
