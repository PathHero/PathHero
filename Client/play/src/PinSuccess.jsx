'use strict';
/* jshint quotmark: false */

var React = require('react');
var Link = require('react-router').Link;


module.exports = React.createClass({
  incrementPinInLocalStorage: function() {    
    this.props.incrementPinInLocalStorage();
  },
  render: function () {
    var currentPin = Number.parseInt(this.props.hunt.get('currentPin'));
    var currentPinIndex = currentPin - 1;
    var answer = this.props.hunt.pins[currentPinIndex].answer;

    return (
      <div>
        <h1>Success! You're at the correct location</h1>
        <p>The answer was {answer}</p>
        <button className="btn btn-default"><Link to="clues">Start next location</Link></button>
      </div>
    );
  }
});
