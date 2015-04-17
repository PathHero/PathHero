'use strict';
/* jshint quotmark: false */

var React = require('react');
var Link = require('react-router').Link;
var $ = require('jquery');

module.exports = React.createClass({
  
  render: function () {
    return (                   
      <div id="bottomNav">
        <div className="parent2">
            <div className="test1">
              <Link to="status">
              <i className="fa fa-list-ul"></i>
              STATUS</Link>            
            </div>
            <div className="test2">
              <Link to="clues">
                <i className="fa fa-question"></i>
                CLUES  
              </Link>
            </div>
            <div className="test3">
              <Link to="map">
                <i className="fa fa-map-marker"></i>
                MAP
              </Link>
            </div>
          <div className="mask">
            <i className="fa fa-home fa-2x"></i>
          </div>
        </div>
      </div> 
    );
  }
});
