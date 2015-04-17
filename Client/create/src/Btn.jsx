'use strict';
/* jshint quotmark: false */

var React = require('react');

module.exports = React.createClass({
  propTypes: {
    clickHandler: React.PropTypes.func,
    label: React.PropTypes.string,
    newClass: React.PropTypes.string,
    newStyle: React.PropTypes.object
  },
  render: function() {
    var classString = 'btn';
    if (this.props.newClass) {
      classString += ' ' + this.props.newClass;
    }
    return (
      <button style={this.props.newStyle} className={classString} type="button" onClick={this.props.clickHandler}>
        {this.props.label}
      </button>
    );
  }
});
