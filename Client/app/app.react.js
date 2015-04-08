'use strict';
/* jshint quotmark: false */
/* jshint expr: true */
/* jshint latedef: false */

// Aliasing for shorthand reference
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;

var HuntMap = React.createClass({
  render: function() {
    return (
      <div id="gMap" className="col-md-6">
      </div>  
    );
  }
});

var HuntBox = React.createClass({
  render: function() {
    return (
      <div className="huntBox">
        <HuntMap />
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
        <div id="hunt-info-container" className="col-md-6">
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
    );
  }
});

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

var Pin = React.createClass({
  getInitialState: function() {
    return {
      showTextField: false,
      showAddClueBtn: true,
      clues: this.props.clues,
      showEditBtn: true
    };
  },
  handleClue: function(newClue) {
    this.props.clues.push(newClue);
    this.setState({clues: this.props.clues});
  },
  deleteClueFromState: function (clueNumber) {
    this.props.clues.splice(clueNumber-1, 1);
    this.setState({clues: this.props.clues});
  },
  editClueInState: function() {
    this.setState({showEditBtn: false}); 
  },
  toggleInput: function() {
    !this.state.showTextField ? this.setState({showTextField: true}) : this.setState({showTextField: false});
    this.state.showAddClueBtn ? this.setState({showAddClueBtn: false}) : this.setState({showAddClueBtn: true});
  },
  render: function() {
    var clueNodes = this.props.clues.map(function(clue, index) {
      return (
        <Clue 
          index={index}          
          clueNumber={index+1} 
          text={clue} 
          key={index} 
          showEditBtn={this.state.showEditBtn}
          deleteClueFromState={this.deleteClueFromState}
          editClueInState={this.editClueInState} />
      );
    }.bind(this));
    
    return (
      <div className="pinContainer">
        <Accordion>
          <Panel header={"Pin " + (this.props.index+1) + ": " + this.props.answer} eventKey={this.props.index}>
          {clueNodes}
          {this.state.showTextField ? <Textfield onClueAdd={this.handleClue} index={this.props.clues.length} />  : null}
          {this.state.showAddClueBtn ? <AddTextFieldBtn toggleInput={this.toggleInput}/>  : null}
          </Panel>
        </Accordion>  
      </div>
    );
  }
});


var Clue = React.createClass({
  handleDeleteClue: function() {
    this.props.deleteClueFromState(this.props.clueNumber);
  },
  handleEditClue: function() {
    // this.props.editClueInState(this.props.index);
    this.props.editClueInState();
  },
  render: function() {
    
    return (
      <div className="clueContainer">
        <EditBtn 
          clueNumber={this.props.clueNumber} 
          showEditBtn={this.props.showEditBtn}
          text={this.props.text} 
          handleEditClue={this.handleEditClue} 
          handleDeleteClue={this.handleDeleteClue}  />
      </div>
    );
  }
});

var EditBtn = React.createClass({
  toggleEditButton: function() {
    this.props.handleEditClue();
  },
  render: function() {
    return (
      <div className="row">
        <div className="col-xs-2">
          Clue {this.props.clueNumber}:
        </div>
        <div className="col-xs-6">
          {this.props.text}
        </div>
        <div className="col-xs-4"> 
          {this.props.showEditBtn ? <button className="btn" onClick={this.toggleEditButton}>Edit</button> : null}
          <button className="btn" onClick={this.props.handleDeleteClue}>Delete</button>
        </div>
      </div>
    );
  }
});

var AddTextFieldBtn = React.createClass({
  render: function() {
    return (
      <button className="btn btn-default" type="button" onClick={this.props.toggleInput}>Add Clue</button>
    );
  }
});

var Textfield = React.createClass({
  handleClueTextField: function() {
    var newClue = this.refs.clueInput.getDOMNode().value;
    this.props.onClueAdd(newClue);
    // React.findDOMNode(this.clueInput) = '';
  },
  render: function() {
    // var newClueIndex = clues.length+1;
    return (
      <div className="textField">
        Clue {this.props.index+1}: <input type="text" ref="clueInput" placeholder="Enter a clue" />
        <button className="btn btn-default" type="button" onClick={this.handleClueTextField}>Add</button>
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
];

React.render(
  <HuntBox/>, document.getElementById('app-container')
  );
