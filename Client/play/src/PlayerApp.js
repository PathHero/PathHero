'use strict';
/* jshint quotmark: false */

var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var BottomNav = require('./BottomNav');
var Actions = require('./RefluxActions');
var playStore = require('./RefluxStore');
var Reflux = require('reflux');
var $ = require('jquery');

module.exports = React.createClass({displayName: "exports",
  mixins: [Reflux.ListenerMixin],
  onStatusChange: function(status) {
    this.setState({hunt:status});
  },
  componentWillMount: function() {
    this.listenTo(playStore, this.onStatusChange, this.onStatusChange);
  },
  componentDidMount: function(){
    if (!this.state.hunt.huntName) {
      $.ajax({
        method: 'GET',
        url: 'http://create.wettowelreactor.com:3000'+window.location.pathname
      })
      .done(function(data) {
        Actions.replaceHunt(data);
      });
    }
  },
  render: function () {
    var display = (React.createElement("div", null, "Loading..."));
    if (this.state.hunt.huntName) {
      display = (React.createElement("div", null, 
                  React.createElement("div", {id: "player-container"}, 
                    React.createElement(RouteHandler, {hunt: this.state.hunt})
                  ), 
                  React.createElement(BottomNav, null)
                ));
    }

    return (
      React.createElement("div", null, display)
    );
  }
});
