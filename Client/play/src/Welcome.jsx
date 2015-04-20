'use strict';
/* jshint quotmark: false */

var React = require('react');
var Title = require('./Title');
var Link = require('react-router').Link;

module.exports = React.createClass({
  render: function () {

    var windowHeight = {
      height: window.innerHeight
    };

    return (
      <div>
        <div id="welcome-msg-container" style={windowHeight}> 
          <div id="welcome-text">
            <Title title={this.props.hunt.huntName}/>
            <div id="start-btn">
              <button className="btn"><Link to="status">Start Hunt</Link></button>
            </div>          
          </div>
          {/*<HuntSummaryContainer hunt={this.props.hunt}/> */}      
        
        </div>
      </div>
    );
  }
});
