'use strict';
/* jshint quotmark: false */

var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var BottomNav = require('./BottomNav');
var Actions = require('../RefluxActions');
var playStore = require('../RefluxStore');
var Reflux = require('reflux');
var $ = require('jquery');

module.exports = React.createClass({
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
        url: 'http://create.pathhero.com'+window.location.pathname
      })
      .done(function(data) {
        Actions.replaceHunt(data);
      });
    }
  },
  render: function () {
    var display = (<div>Loading...</div>);
    if (this.state.hunt.huntName) {
      display = (<div>
                  <div id="player-container">
                    <RouteHandler hunt={this.state.hunt}/>
                  </div>
                  <BottomNav/>
                </div>);
    }

    return (
      <div>{display}</div>
    );
  }
});
