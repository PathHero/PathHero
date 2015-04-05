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
    return {data: pins};
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
        <div id="pin-container">
          <h2>Pins</h2>
            <PinList data={this.state.data} /> 
        </div>
      </div>

    </div>
      )
  }
});


var Pin = React.createClass({
  getInitialState: function() {
    return { 
      showTextField: false,
      showAddClueBtn: true
    };
  },
  toggleInput: function() {
    !this.state.showTextField ? this.setState({showTextField: true}) : this.setState({showTextField: false});
    this.state.showAddClueBtn ? this.setState({showAddClueBtn: false}) : this.setState({showAddClueBtn: true});
  },
  render: function() {
  
    var clueNodes = this.props.clues.map(function(clue, index) {
      return (
        <Clue index={index+1} text={clue} key={index}>
        </Clue>
      );
    });
    
    return (
      <div className="pinContainer">
        <Accordion>
          <Panel header={"Pin " + (this.props.index+1) + ": " + this.props.answer} eventKey={this.props.index}>
          {clueNodes}
          {this.state.showTextField ? <Textfield clues={this.props.clues}/>  : null}
          {this.state.showAddClueBtn ? <AddTextFieldBtn toggleInput={this.toggleInput}/>  : null}
          </Panel>
        </Accordion>  
      </div>
      )
  }
})

var AddTextFieldBtn = React.createClass({
  render: function() {
    return (
      <button className="btn btn-default" type="button" onClick={this.props.toggleInput}>Add Clue</button>
      )
  }
})

var Textfield = React.createClass({
  handleClue: function() {
    var newClue = this.refs.clueInput.getDOMNode().value;
    this.props.clues.push(newClue);
    this.setState({clues: clues});
  },
  render: function() {
    return (
      <div className="textField">
        Clue [num]: <input type="text" ref="clueInput" placeholder="Enter a clue" />
        <button className="btn btn-default" type="button" onClick={this.handleClue}>Add</button>
      </div>
      )
  }
})

var Clue = React.createClass({
  render: function() {
    return (

    <div className="clueContainer">
      <div className="row">
        <div className="col-xs-2">
          Clue {this.props.index}:
        </div>
        <div className="col-xs-10">
        {this.props.text}
        </div>
      </div>
    </div>

    )
  }
})

var PinList = React.createClass({
  render: function() {
    var pinNodes = this.props.data.map(function(pin, index) {
      return (
        <Pin index={index} answer={pin.answer} clues={pin.clues} location={pin.location} key={index}>
        </Pin>
      );
    });

    return (
      <div className="pinList">
        {pinNodes}
      </div>
    );
  }
});

var pins = [
  {
    "text": "Landmark used by commuters",
    "answer": "Bay Bridge",
    "clues": ['Refurbished in 2013', 'Not the Golden Gate Bridge'],
    "location": [37.8181, 122.3467]
  },
  {
    "text": "Pointed building in SF",
    "answer": "Transamerica Building",
    "clues": ['Named after a company', 'In Financial District'],
    "location": [37.8181, 122.3467]

  }
]

React.render(
  <HuntBox/>, document.getElementById('app-container')
  );