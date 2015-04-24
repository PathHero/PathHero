'use strict';
/* jshint quotmark: false */

var React = require('react/addons');
var Clue = require('./Clue');
var Btn = require('./Btn');
var Panel = require('react-bootstrap').Panel;
var Actions = require('../RefluxActions');
var gMap = require('../../../lib/gMapLib');
var mapImg = require('../../../lib/mapMarkers.js');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

module.exports = React.createClass({
  componentDidMount: function() {
    if (this.props.editMode) {
      React.findDOMNode(this.refs.locationName).focus();
    }
  },
  handleNewClue: function() {
    var newClue = this.refs.clueInput.getDOMNode().value;
    React.findDOMNode(this.refs.clueInput).value = '';
    Actions.addClue(newClue, this.props.pinIndex);
    React.findDOMNode(this.refs.clueInput).focus();  
  },
  resultTextOnChange: function(){
    var newResultText = this.refs.resultText.getDOMNode().value;
    Actions.updatePinAtKey(newResultText, this.props.pinIndex, 'resultText');
  },
  onLocationChange: function() {
    if (this.props.editMode) {
      var locationName = this.refs.locationName.getDOMNode().value;
      Actions.updatePinAtKey(locationName, this.props.pinIndex, 'answer');
      this.setState({editLocationMode: false});
    }
  },
  removePin:function(){
    Actions.removePin(this.props.pinIndex);
    gMap.remove(this.props.pinIndex);
  },
  render: function() {
    var pinHeader;
    if (this.props.editMode) {
      pinHeader = (<span>
                     <img src={mapImg[this.props.pinIndex]} width="42" />
                     <input type="text" ref="locationName" onChange={this.onLocationChange}
                            placeholder="Location Name"
                            value={this.props.pin.answer} />
                      <span>
                        <i className="fa fa-remove" onClick={this.removePin}></i>
                      </span>
                   </span>);
    } else {
      pinHeader = (<span>Pin {this.props.pinIndex+1}: {this.props.pin.answer}
                   </span>);
    }


    var clueNodes = this.props.pin.clues.map(function(clue, clueIndex) {
      return (
        <Clue clue={clue} pinIndex={this.props.pinIndex} 
        clueIndex={clueIndex} key={clueIndex}/>
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
          <div className="col-xs-10 pin-text-area">
            <textarea rows="2" ref="clueInput" placeholder="Ex: A former defensive point"/>
          </div>
          <div className="col-xs-1 pin-button-area">
            <Btn label={"Add Clue"} newStyle={addClue} clickHandler={this.handleNewClue} />
          </div>       
        </div>
        <div className="bold-title">Answer</div>
        <textarea col="38" rows="4" ref="resultText" 
                  defaultValue={this.props.pin.resultText}
                  placeholder="Ex: Great job! The bar on the corner has the best martinis."
                  onChange={this.resultTextOnChange}/>
        <div>
          
        </div>
        </Panel>
      </div>
    );
  }
});
