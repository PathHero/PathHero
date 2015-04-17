'use strict';
/* jshint quotmark: false */

var React = require('react');
var TitleBox = require('./TitleBox');
var List = require('./List');


module.exports = React.createClass({
  render: function () {
    var numOfLocations = this.props.hunt.pins.length;
    var huntTimeEst = this.props.hunt.huntInfo.huntTimeEst;
    var huntDistance = this.props.hunt.huntInfo.huntDistance;
    var listItemArray = [ numOfLocations + " locations", 
                          huntTimeEst + " hr to completion", 
                          huntDistance + " miles"];
    return (      
      <div id="huntSummaryContainer">
        <TitleBox title="Hunt Summary">            
          <List listItemArray={listItemArray} />
        </TitleBox>
        <div id="hunt-description-container">
          <TitleBox title="Hunt Description">
            <div>
              {this.props.hunt.huntDesc}
            </div>
          </TitleBox>            
        </div>
      </div>
    ); 
  }
});
