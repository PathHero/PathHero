'use strict';
/* jshint quotmark: false */

var React = require('react');
var Link = require('react-router').Link;

module.exports = React.createClass({
  render: function () {
    return (                   
      <div id="bottomNav">
        <div className="row">
          <div className="col-xs-4">
            <span><Link to="status">Status</Link></span>
          </div>
          <div className="col-xs-4">
            <span><Link to="clues">Clues</Link></span>
          </div>
          <div className="col-xs-4">
            <span><Link to="map">Map</Link></span>
          </div>
        </div>
      </div>      
    );
  }
});
