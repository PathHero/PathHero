'use strict';
/* jshint quotmark: false */
/* jshint expr: true */
/* jshint latedef: false */

// Aliasing for shorthand reference
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;

var HuntBox = React.createClass({
  getInitialState: function() {
    return {data: pins};
  },
  render: function() {
    return (
      <div className="huntBox">
        <HuntMap />
        <ClueBox data={this.state.data} />
      </div>
    );
  }
});

var HuntMap = React.createClass({
  render: function() {
    return (
      <div id="gMap" className="col-xs-6">
      </div>  
    );
  }
});

var ClueBox = React.createClass({
  componentDidMount: function() {
    gMap.addEventListener('addMarker', function(newPinIndex) {
      var pin = {
        "text": "Another place to go",
        "answer": "Golden Gate Park",
        "clues": ['Check out the zen garden', 'Go boating in the lake'],
        "location": [37.8181, 122.3467]
      };
      this.props.data.push(pin);
      this.setState({data: this.props.data});
    }.bind(this));
  },
  render: function() {
    return (
      <div>
        <div id="hunt-info-container" className="col-xs-6">
          <div id="hunt-title-container">
            <h2>Hunt Description</h2>
            <span id="hunt-title">Discover SFs most beautiful views</span>
            <div className="tour-summary-container">
              <h2>Tour Summary</h2>
              <div className="summary-box">
                <p>Duration: 2 hours</p>
                <p>Distance: 2.8 miles</p>
                <p>Locations: {this.props.data.length}</p>              
              </div>
            </div>
          </div>
          <div id="pin-container">
            <h2>Pins</h2>
            <PinList data={this.props.data} /> 
          </div>
        </div>
      </div>
    );
  }
});

var PinList = React.createClass({
  render: function() {
    var pinNodes = this.props.data.map(function(pin, index) {
      return (
        <Pin index={index} answer={pin.answer} clues={pin.clues} 
             location={pin.location} key={index}>
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

var Pin = React.createClass({
  getInitialState: function() {
    return {
      clues: this.props.clues,
      editMode: false,
      showSetLocation: false
    };
  },
  handleClue: function(e) {
    var newClue = this.refs.clueInput.getDOMNode().value;
    this.props.clues.push(newClue);
    this.setState({clues: this.props.clues});
    React.findDOMNode(this.refs.clueInput).value = '';
  },
  deleteClue: function (clueNumber) {
    this.props.clues.splice(clueNumber-1, 1);
    this.setState({clues: this.props.clues});
  },
  toggleEdit: function() {
    this.setState({editMode: !this.state.editMode});
  },
  render: function() {
    var clueNodes = this.props.clues.map(function(clue, index) {
      return (
        <Clue ref="test3" index={index} clueNumber={index+1} text={clue} key={index} 
          editMode={this.state.editMode}
          deleteClue={this.deleteClue}
          toggleEdit={this.toggleEdit} />
      );
    }.bind(this));

    return (
      <div ref="something" className="pinContainer">
        <Accordion>
          <Panel 
            header={"Pin " + (this.props.index+1) + ": " + this.props.answer} 
            eventKey={this.props.index}>
          {clueNodes}
          <input type="text" ref="clueInput" />
          <Btn label={"Add Clue"} clickHandler={this.handleClue} />
          </Panel>
        </Accordion>  
      </div>
    );
  }
});

var Clue = React.createClass({
  deleteClue: function() {
    this.props.deleteClue(this.props.clueNumber);
  },
  toggleEdit: function() {
    this.props.toggleEdit();
  },
  render: function() {
    var editBtn;
    var text;
    if (this.props.editMode) {
      editBtn = (<button className="btn" onClick={this.toggleEdit}>Save</button>);
      text = (<input type="text" onClick={this.toggleEdit}>
        dangerouslySetInnerHTML={{__html: this.props.text}}</input>)
    } else {
      editBtn = (<button className="btn" onClick={this.toggleEdit}>Edit</button>);
      text = this.props.text;
    }
    return (
      <div className="row">
        <div className="col-xs-2">
          Clue {this.props.clueNumber}:
        </div>
        <div className="col-xs-6">
          {text}
        </div>
        <div className="col-xs-4"> 
          {editBtn}
          <Btn clickHandler={this.deleteClue} label={"Delete"} />
        </div>
      </div>
    );
  }
});

var Btn = React.createClass({
  propTypes: {
    clickHandler: React.PropTypes.func,
    label: React.PropTypes.string,
    newClass: React.PropTypes.string
  },
  render: function() {
    var classString = 'btn';
    if (this.props.newClass) {
      classString += ' ' + this.props.newClass;
    }
    return (
      <button className="btn" type="button" 
        onClick={this.props.clickHandler}>{this.props.label}
      </button>
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
];

React.render(
  <HuntBox/>, document.getElementById('app-container')
  );
