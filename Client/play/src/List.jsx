'use strict';
/* jshint quotmark: false */

var React = require('react');

module.exports = React.createClass({
  render: function () {
    return (
      <div>
        <ul>
        {this.props.listItemArray.map(function(listItem, index) {
            return (<li key={index}>{listItem}</li>);
          })
        }
        </ul>
      </div>
    );
  }
});
