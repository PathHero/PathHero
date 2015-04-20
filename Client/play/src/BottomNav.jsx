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

    var statusNavTransform;
    var cluesNavTransform;
    var mapNavTransform;
    var maskTransform;

    if (this.state.active) {
      statusNavTransform = {
        transform: 'translate(-95px, 0px)'
      };
      cluesNavTransform = {
        transform: 'translate(-75px,-75px)'
      };
      mapNavTransform = {
        transform: 'translate(0px,-95px )'
      };
      maskTransform = {
        background: '#D53D06'
      };
    } else {
      statusNavTransform = {
        transform: 'none'
      };
      cluesNavTransform = {
        transform: 'none'
      };
      mapNavTransform = {
        transform: 'none'
      };
      maskTransform = {
        background:'#D53D06'
      };
    }

    return (                   
      <div id="bottomNav">
        <div className="nav-item-container" onTouchStart={this.handleClick}> 
          {/* onClick={this.handleClick}*/}
          <div className="mask" style={maskTransform}>
           <i className="fa fa-bars fa-2x"></i>
          </div>

          <Link to="status" className="status-nav" style={statusNavTransform}>
            <i className="fa fa-list-ul"></i>
            STATUS
          </Link>  

          <Link to="clues" className="clues-nav" style={cluesNavTransform}>
            <i className="fa fa-question"></i>
            CLUES
          </Link>  

          <Link to="map" className="map-nav" style={mapNavTransform}>
            <i className="fa fa-map-marker"></i>
            MAP          
          </Link>  

        </div>
      </div> 
    );
  }
});
