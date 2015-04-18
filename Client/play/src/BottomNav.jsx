'use strict';
/* jshint quotmark: false */

var React = require('react');
var Link = require('react-router').Link;
var $ = require('jquery');

module.exports = React.createClass({

  getInitialState: function() {
    return {
      active: false
    }
  },

  handleClick: function(event) {
    this.setState({active: !this.state.active});
  },
  
  render: function () {

    var test1Transform;
    var test2Transform;
    var test3Transform;

    if (this.state.active) {
      test1Transform = {
        transform: 'translate(-95px, 0px)'
      };
      test2Transform = {
        transform: 'translate(-75px,-75px)'
      };
      test3Transform = {
        transform: 'translate(0px,-95px )'
      };
    } else {
      test1Transform = {
        transform: 'none'
      };
      test2Transform = {
        transform: 'none'
      };
      test3Transform = {
        transform: 'none'
      };
    }

    return (                   
      <div id="bottomNav">
        <div className="parent2" onClick={this.handleClick}>
            <div className="test1" style={test1Transform}>
              <Link to="status">
              <i className="fa fa-list-ul"></i>
              STATUS</Link>            
            </div>
            <div className="test2" style={test2Transform}>
              <Link to="clues">
                <i className="fa fa-question"></i>
                CLUES  
              </Link>
            </div>
            <div className="test3" style={test3Transform}>
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
