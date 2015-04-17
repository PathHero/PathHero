'use strict';
/* jshint quotmark: false */

var React = require('react');
var TitleBox = require('./TitleBox');
var List = require('./List');


module.exports = React.createClass({displayName: "exports",
  render: function () {
    var numOfLocations = this.props.hunt.huntInfo.numOfLocations;
    var huntTimeEst = this.props.hunt.huntInfo.huntTimeEst;
    var huntDistance = this.props.hunt.huntInfo.huntDistance;
    var listItemArray = [ numOfLocations + " locations", 
                          huntTimeEst + " hr to completion", 
                          huntDistance + " miles"];
    return (      
      React.createElement("div", {id: "huntSummaryContainer"}, 
        React.createElement(TitleBox, {title: "Hunt Summary"}, 
          React.createElement(List, {listItemArray: listItemArray})
        ), 
        React.createElement("div", {id: "hunt-description-container"}, 
          React.createElement(TitleBox, {title: "Hunt Description"}, 
            React.createElement("div", null, 
              this.props.hunt.huntDesc, 
              this.numOfLocations
            )
          )
        )
      )
    ); 
  }
});
