'use strict';
/* jshint quotmark: false */

var React = require('react');
var Title = require('./Title');
var HuntSummaryContainer = require('./HuntSummaryContainer');
var Link = require('react-router').Link;

module.exports = React.createClass({
  render: function () {      
    return (
      <div>
        <div id="welcome-msg-container">  
          <div id="welcome-text">
            <Title title={this.props.hunt.huntName}/>
          </div>      
          <div id="start-btn">
            <button><Link to="clues">Start</Link></button>
          </div>          
        </div>
        <HuntSummaryContainer hunt={this.props.hunt}/>
      </div>
    );
  }
});
