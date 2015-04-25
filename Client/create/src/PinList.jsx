'use strict';
/* jshint quotmark: false */

var React = require('react/addons');
var Pin = require('./Pin');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

module.exports = React.createClass({
  render: function() {
    var pinNodes;
    if (this.props.pins.length === 0) {
      pinNodes = (<div id="pin-prompt" className="row"><div className="col-sm-1"><i className="fa fa-arrow-left"></i></div><div className="col-sm-11"><span>Click on the map to add your first pin</span></div></div>);
    } else {
      pinNodes = this.props.pins.map(function(pin, index) {
        return (
          <Pin pinIndex={index} pin={pin} key={index}></Pin>
        );
      }, this);
    }
    return (
      <div className="pinList">
        <ReactCSSTransitionGroup transitionName="dynamicListItem">
        {pinNodes}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
});
