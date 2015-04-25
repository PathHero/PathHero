'use strict';
/* jshint quotmark: false */

var React = require('react/addons');
var Clue = require('./Clue');
var Btn = require('./Btn');
var Panel = require('react-bootstrap').Panel;
var Actions = require('../RefluxActions');
var gMap = require('../../../lib/gMapLib');
var mapImg = require('../../../lib/mapMarkers.js');
var PinArrivalMessage = require('./PinArrivalMessage');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

module.exports = React.createClass({
  handleNewClue: function() {
    var newClue = this.refs.clueInput.getDOMNode().value;
    React.findDOMNode(this.refs.clueInput).value = '';
    Actions.addClue(newClue, this.props.pinIndex);
    React.findDOMNode(this.refs.clueInput).focus();  
  },
  onBlur: function() {
    var locationName = this.refs.locationName.getDOMNode().value;
    Actions.updatePinAtKey(locationName, this.props.pinIndex, 'answer');
  },
  removePin:function(){
    Actions.removePin(this.props.pinIndex);
    gMap.remove(this.props.pinIndex);
  },
  render: function() {
    var pinHeader = (
      <span>
        <img src={mapImg[this.props.pinIndex]} width="42" />
        <input 
          type="text" 
          ref="locationName" 
          onBlur={this.onBlur}
          placeholder="Location Name"
          defaultValue={this.props.pin.answer}
        />
        <span>
          <i className="fa fa-remove" onClick={this.removePin}></i>
        </span>
      </span>
    );

    var clueNodes = this.props.pin.clues.map(function(clue, clueIndex) {
      var key = '' + this.props.pinIndex + clueIndex + this.props.pin.clues.length;
      return (
        <Clue clue={clue} pinIndex={this.props.pinIndex} 
        clueIndex={clueIndex} key={key}/>
      );
    }, this);

    var addClue = {
      position: 'relative',
      top: '10',
      left: '-55',
      backgroundColor: '#ffa600',
      color: '#fff',
      fontWeight: '500',
      borderRadius: '2px',
      fontSize: '1em'
    };

    return (
      <div className="pinContainer">
        <Panel header={pinHeader}>
        <ReactCSSTransitionGroup transitionName="dynamicListItem">
        {clueNodes}
        </ReactCSSTransitionGroup>

        <div className="bold-title">
          Clue {this.props.pin.clues.length + 1}
        </div>
        <div className="row">
          <div className="col-xs-10 addClue-text-area">
            <textarea rows="2" ref="clueInput" placeholder="Ex: A former defensive point"/>
          </div>
          <div className="col-xs-1 addClue-button-area">
            <Btn label={"Add Clue"} newStyle={addClue} clickHandler={this.handleNewClue} />
          </div>       
        </div>

        <PinArrivalMessage pin={this.props.pin} pinIndex={this.props.pinIndex}/>
        </Panel>
      </div>
    );
  }
});
