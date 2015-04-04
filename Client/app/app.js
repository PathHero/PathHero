'use strict';

// Aliasing for shorthand reference
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;

var Map = React.createClass({
  render: function() {
    return (
      <div id="map-container" className="col-sm-6">
          <img src="img/map.png" alt="" />
      </div>  

    );
  }
});

var HuntBox = React.createClass({
  render: function() {
    return (
      <div className="huntBox">
        <Map />
        <ClueBox />
      </div>
    );
  }
});

var ClueBox = React.createClass({
  getInitialState: function() {
    return {data: clues};
  },
  render: function() {
    return (
    <div>
      <div id="hunt-info-container" className="col-sm-6">
        <div id="hunt-title-container">
          <h2>Hunt Description</h2>
          <span id="hunt-title">Discover SFs most beautiful views</span>

      <div className="tour-summary-container">
        <h2>Tour Summary</h2>
        <div className="summary-box">
          <p>Duration: 2 hours</p>
          <p>Distance: 2.8 miles</p>
          <p>Clues: 3</p>              
        </div>
      </div>
        </div>
      </div>

      <div id="pin-container">
        <h2>Pins</h2>
          <ClueList data={this.state.data} /> 
      </div>
    </div>
      )
  }
});


var Clue = React.createClass({
  render: function() {
    return (
      <div className="clue">
      Pin {this.props.index}: {this.props.location}
        <Accordion>
          <Panel header={this.props.answer} eventKey={this.props.index}>
          {this.props.answer}
          Placeholder value
          </Panel>
        </Accordion>  
              
            
        
      </div>
      )
  }
})

var ClueList = React.createClass({
  render: function() {
    var clueNodes = this.props.data.map(function(clue, index) {
      return (
        <Clue index={index} answer={clue.answer} location={clue.location} key={index}>
        </Clue>
      );
    });

    return (
      <div className="clueList">
        {clueNodes}
      </div>
    );
  }
});

var clues = [
  {
    "text": "Landmark used by commuters",
    "answer": "Bay Bridge",
    "hints": ['Refurbished in 2013', 'Not the Golden Gate Bridge'],
    "location": [37.8181, 122.3467]
  },
  {
    "text": "Pointed building in SF",
    "answer": "Transamerica Building",
    "hints": ['Named after a company', 'In Financial District'],
    "location": [37.8181, 122.3467]

  }
]

React.render(
  <HuntBox/>, document.getElementById('app-container')
  );