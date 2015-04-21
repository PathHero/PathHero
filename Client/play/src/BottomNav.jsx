'use strict';
/* jshint quotmark: false */

var React = require('react');
var Link = require('react-router').Link;

module.exports = React.createClass({

  getInitialState: function() {
    return {
      active: false
    };
  },

  handleClick: function() { //ignoring params:  event
    this.setState({active: !this.state.active});
  },

  render: function () {
    return (                   
      <div id="bottomNav">
        <div className="navButton navButtonStatus">
          <Link to="status">
            <i className="fa fa-list-ul"></i>
            <span>
                STATUS
            </span>
          </Link>
        </div>
        <div className="navButton navButtonMap">
          <Link to="map">
            <i className="fa fa-map-marker"></i>
            <span>
              MAP
            </span>
          </Link>
        </div>
      </div> 
    );
  }
});
