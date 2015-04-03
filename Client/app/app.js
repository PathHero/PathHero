'use strict';



var Map = React.createClass({
  render: function() {
    return (
      <div className="map">
        Here is a map!
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
      <div className="huntBox">
        <h1>List of clues</h1>
        <ClueList data={this.state.data} />
      </div>
      )
  }
});

var Clue = React.createClass({
  render: function() {
    return (
      <div className="clue">
        <h4 className="clueNumber">
          {this.props.index} - {this.props.location}
        </h4>
      </div>
      )
  }
})

var ClueList = React.createClass({
  render: function() {
    debugger;
    var clueNodes = this.props.data.map(function(clue, index) {
      return (
        <Clue index={index} location={clue.location}>
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
  <HuntBox />, document.getElementById('app-container')
  );