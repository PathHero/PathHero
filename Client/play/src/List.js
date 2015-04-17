'use strict';
/* jshint quotmark: false */

var React = require('react');

module.exports = React.createClass({displayName: "exports",
  render: function () {
    return (
      React.createElement("div", null, 
        React.createElement("ul", null, 
        this.props.listItemArray.map(function(listItem, index) {
            return (React.createElement("li", {key: index}, listItem));
          })
        
        )
      )
    );
  }
});
