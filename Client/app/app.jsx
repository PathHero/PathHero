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
    gMap.addEventListener('addMarker', function() {
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
      showSetLocation: false
    };
  },
  handleClue: function() {
    var newClue = this.refs.clueInput.getDOMNode().value;
    this.props.clues.push(newClue);
    this.setState({clues: this.props.clues});
    React.findDOMNode(this.refs.clueInput).value = '';
  },
  deleteClue: function (index) {
    this.props.clues.splice(index, 1);
    this.setState({clues: this.props.clues});
  },
  render: function() {
    var clueNodes = this.props.clues.map(function(clue, index) {
      return (
        <Clue index={index} text={clue} key={index} 
          editMode={this.state.editMode} toggleEdit={this.toggleEdit}
          deleteClue={this.deleteClue} />
      );
    }.bind(this));

    return (
      <div className="pinContainer">
        <Accordion>
          <Panel 
            header={"Pin " + (this.props.index+1) + ": " + this.props.answer} 
            eventKey={this.props.index}>
          {clueNodes}
          <textarea col="35" row="30" ref="clueInput" />
          <Btn label={"Add Clue"} clickHandler={this.handleClue} />
          </Panel>
        </Accordion>  
      </div>
    );
  }
});

var Clue = React.createClass({
  getInitialState: function() {
    return {
      clueText: this.props.text,
      editMode: false
    };
  },
  toggleEdit: function(editedClue) {
    if (this.state.editMode === true) {
      this.setState({clueText: editedClue, editMode: false});
    } else {
      this.setState({clueText: this.state.clueText, editMode: true});
    }
  },
  deleteClue: function() {
    this.props.deleteClue(this.props.index);
  },
  render: function() {
    return (

          <ClueDetails index={this.props.index} text={this.state.clueText} 
            editMode={this.state.editMode} 
            toggleEdit={this.toggleEdit} />
    );
  }
});

var ClueDetails = React.createClass({
  getInitialState: function() {
    return {value: this.props.text};
  },
  toggleEdit: function() {
    if (this.props.editMode) {
      var editedClue = this.refs.clueEdit.getDOMNode().value;
      this.props.toggleEdit(editedClue);
    } else {
      this.props.toggleEdit();
    }
  },
  handleInput: function(e) {
    this.setState({value: e.target.value});
  },
  render: function() {
    var editBtn;
    var text;
    if (this.props.editMode) {
      editBtn = (<button className="btn" onClick={this.toggleEdit}>Save</button>);
      text = (<textarea cols="35" ref="clueEdit" defaultValue={this.props.text} 
                onChange={this.handleInput} />);
    } else {
      editBtn = (<button className="btn" onClick={this.toggleEdit}>Edit</button>);
      text = this.props.text;
    }
    return (
      <div className="clueDetails">
        <div className="row">
          <div className="col-xs-2">
            Clue {this.props.index+1}:
          </div>
          <div className="col-xs-6">
            {text}
          </div>
          <div className="col-xs-4"> 
            {editBtn}
            <Btn clickHandler={this.deleteClue} label={"Delete"} />
          </div>
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
      <button className="btn" type="button" onClick={this.props.clickHandler}>
        {this.props.label}
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
