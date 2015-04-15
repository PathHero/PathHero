'use strict';
/* jshint quotmark: false */
/* jshint expr: true */
/* jshint latedef: false */

// Aliasing for shorthand reference
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Nav = ReactBootstrap.Nav;
var Navbar = ReactBootstrap.Navbar;
var NavItem = ReactBootstrap.NavItem;
var Alert = ReactBootstrap.Alert;

var hunt = {
  data: [],
  huntName: 'Stored name',
  huntDesc: '',
  _id: '',
  answer: []
};

var actions = Reflux.createActions(
  ["updateTitle", "updateDesc"]
);

var store = Reflux.createStore({
  listenables: [actions],
  onUpdateTitle: function(newTitle) {
    hunt.huntName = newTitle;
    this.trigger({hunt: hunt});
  },
  onUpdateDesc: function(newDesc) {
    hunt.huntDesc = newDesc;
    this.trigger({hunt: hunt});
  },
  getInitialState: function () {
    return {hunt:hunt};
  }
});

var HuntBox = React.createClass({
  mixins: [Reflux.ListenerMixin],
  getInitialState: function() {
    return {
      data: pins,
      _id: hunt._id,
      title: hunt.huntName,
      desc: hunt.huntDesc,
      url: hunt.url
    };
  },
  componentDidMount: function() {
    var route = window.location.pathname.split('/')[1] || null;
    var huntID;
    if (route === 'edit') {
      huntID =  window.location.pathname.split('/')[2] || null;
      $.ajax({
        url: window.location.origin + '/' + huntID,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
          this.setState({data: data.pins, 
                        _id: data._id, 
                        title: data.huntName,
                        desc: data.huntDesc,
                        url: data.url
                      });
          this.forceUpdate();
        }.bind(this),
        error: function() {
        }
      });
    }

    this.listenTo(store, this.onUpdateTitle);
    this.listenTo(store, this.onUpdateDesc);
  },
  onUpdateTitle: function(hunt) {
    this.setState({title: hunt.hunt.huntName});
  },
  onUpdateDesc: function(hunt) {
    this.setState({desc: hunt.hunt.huntDesc});
  },
  render: function() {
    return (
      <div className="huntBox">
        <Navbar brand="Path Hero">
          <Nav right>
            <NavItem eventKey={1} href="#">Create hunt</NavItem>
            <NavItem eventKey={2} href="/hunts">View hunts</NavItem>
            <NavItem eventKey={3} href='#'>Profile</NavItem>
            <NavItem>Logout</NavItem>
          </Nav>
        </Navbar>
        <HuntMap />
        <ClueBox data={this.state.data} 
                  title={this.state.title} 
                  _id={this.state._id} 
                  desc={this.state.desc} 
                  url={this.state.url} />
      </div>
    );
  }
});

var HuntMap = React.createClass({
  componentDidMount: function() {
    gMap.startGMap({lng: -33.73, lat: 149.02});
    gMap.getGeolocation(gMap.setCenter);
  },
  render: function() {
    return (
      <div id="gMap" className="col-xs-6">
      </div>  
    );
  }
});

var ClueBox = React.createClass({
  mixins: [Reflux.connect(store)],
  getInitialState: function() {
    return {
      data: this.props.data,
      editTitleMode: false,
      editDescMode: false,
      desc: 'Dummy description',
      _id: this.props._id,
      url: this.props.url
    };
  },
  componentDidMount: function() {
    gMap.addEventListener('addMarker', function() {
      // var geo = gMap.select(this.props.data.length);
      var pin = {
        "answer": "",
        "answerField": "",
        "clues": [],
        "geo": {lat: 12.3, lng: 3.21},
      };
      this.props.data.push(pin);
      if (this.isMounted()) {
        this.setState({data: this.props.data});
      }
    }.bind(this));
  },
  toggleEditTitle: function() {
    var newTitle;
    if (this.state.editTitleMode) {
      newTitle = this.refs.titleEdit.getDOMNode().value;
      // this.setState({title: newTitle, editTitleMode: false});
      actions.updateTitle(newTitle);
      this.setState({editTitleMode: false});
    } else {
      this.setState({editTitleMode: true});
    }
  },
  toggleDesc: function() {
    var newDesc;
    if (this.state.editDescMode) {
      newDesc = this.refs.descEdit.getDOMNode().value;
      actions.updateDesc(newDesc);
      this.setState({editDescMode: false});
    } else {
      this.setState({editDescMode: true});
    }
  },
  render: function() {
    var title, titleBtn;
    var desc, descBtn;
    var url;
    if (this.state.editTitleMode) {
      title = (<input id="hunt-title" ref="titleEdit"
                  defaultValue={this.props.title} />);
      titleBtn = (<Btn label={"Save"} clickHandler={this.toggleEditTitle} />);
    } else {
      title = (<span id="hunt-title">{this.props.title}</span>);
      titleBtn = (<Btn label={"Edit title"} clickHandler={this.toggleEditTitle} />);
    }

    if (this.state.editDescMode) {
      desc = (<textarea cols="35" row="5" id="hunt-desc" ref="descEdit"
                defaultValue={this.props.desc}  />);
      descBtn = (<Btn label={"Save"} clickHandler={this.toggleDesc} />);
    } else {
      desc = (<span id="hunt-desc">{this.props.desc}</span>);
      descBtn = (<Btn label={"Edit description"} clickHandler={this.toggleDesc} />);
    }

    if (!this.props.url) {
      url = '';
    } else {
      url = (<h2>Hunt URL: <a href={this.props.url}>{this.props.url}</a></h2>);
    }

    return (
      <div>
        <div id="hunt-info-container" className="col-xs-6">
          <div id="hunt-title-container">
            {url}
            <h2>Hunt Title</h2>
              {title}
              {titleBtn}
            <div className="tour-summary-container">
              <h2>Tour Summary</h2>
              <div className="summary-box">
                <p>Description: {desc}{descBtn}</p>
                <p>Duration: {gMap.getDuration()} hours</p>
                <p>Distance: {gMap.getDistance()} miles</p>
                <p>Locations: {this.props.data.length}</p>              
              </div>
            <HuntSubmitForm pins={this.props.data} 
                            title={this.props.title} 
                            desc={this.props.desc} 
                            _id={this.props._id} />
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

var HuntSubmitForm = React.createClass({
  getInitialState: function() {
    return {
      showAlert: false
    };
  },
  handleSubmit: function() {
    var dataType = 'text';
    var newHunt = {
      huntName: this.props.title,
      huntDesc: this.props.desc,
      huntInfo: {
        numOfLocations: this.props.pins.length,
        huntTimeEst: 1234,
        huntDistance: 1234
      },
      pins: this.props.pins
    };
    if (window.location.pathname.split('/')[1] === 'edit') {
      newHunt._id = this.props._id;
      dataType = 'json';
    }
    newHunt = JSON.stringify(newHunt);
    console.log(newHunt);
    $.ajax({
      url: window.location.href,
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: newHunt,
      dataType: dataType,
      success: function() { // ignoring params: data
        if (window.location.pathname === '/create') {
          // var newHuntID = data.split('/')[3]; // may use it in the future
          // window.location.href = window.location.origin + '/edit/' + newHuntID;
        } else {
          // insert edit success handling here
        }
      },
      error: function(error) {
        console.error('Error:', error);
      }
    });
  },
  render: function() {
    var alertMsg;
    if (this.state.showAlert) {
    alertMsg = (<Alert bsStyle='success' dismissAfter={2000}>
          Successfully created a hunt! You can 
          continue to edit your hunt or send out this link to friends.
          </Alert>); 
    }
    return (
      <div>
        {alertMsg}
        <Btn label={"Submit hunt"} clickHandler={this.handleSubmit} />
      </div>
    );
  }
});

var PinList = React.createClass({
  getInitialState: function() {
    return {
      data: this.props.data,
    };
  },
  render: function() {
    var pinNodes = this.props.data.map(function(pin, index, data) {
      return (
        <Pin  data={data} index={index} answer={pin.answer} 
          clues={pin.clues} key={index}>
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
      data: this.props.data,
      editLocationMode: false,
      location: this.props.answer
    };
  },
  handleNewClue: function() {
    var newClue = this.refs.clueInput.getDOMNode().value;
    this.state.data[this.props.index].clues.push(newClue);
    this.setState({clues: this.state.data});
    React.findDOMNode(this.refs.clueInput).value = '';
  },
  inputLocation: function(locationName) {
    if (this.state.editLocationMode) {
      this.state.data[this.props.index].answer = locationName;
      this.setState({editLocationMode: !this.state.editLocationMode, 
                      data: this.state.data});
    } else {
      this.setState({editLocationMode: !this.state.editLocationMode});
    }
  },
  deleteClue: function (index) {
    this.state.data[this.props.index].clues.splice(index, 1);
    this.setState({data: this.state.data});
  },
  answerFieldOnChange: function(){
    this.props.data[this.props.index].answerField = this.refs.resultText.getDOMNode().value;
  },
  render: function() {
    var index = this.props.index;
    var clueNodes = this.props.clues.map(function(clue, index) {
      return (
        <Clue data={this.state.data} parentIndex={this.props.index} index={index} 
          text={clue} key={index} editMode={this.state.editMode} 
          toggleEdit={this.toggleEdit} deleteClue={this.deleteClue} />
      );
    }.bind(this));

    return (
      <div className="pinContainer">
        <NameLocation editLocationMode={this.state.editLocationMode} 
                         answer={this.state.data[index].name} inputLocation={this.inputLocation} />
        <Accordion>
          <Panel onDoubleClick={this.nameLocation} eventKey={index}
            header={"Pin " + (index+1) + ": " +this.state.data[index].answer} >
          {clueNodes}
          <textarea col="35" row="30" ref="clueInput" />
          <Btn label={"Add Clue"} clickHandler={this.handleNewClue} />
          <div>Answer</div>
          <textarea col="35" row="30" ref="resultText" onChange={this.answerFieldOnChange}/>
          </Panel>
        </Accordion>  
      </div>
    );
  }
});

var NameLocation = React.createClass({
  getInitialState: function() {
    return {
      value: this.props.answer
    };
  },
  inputLocation: function() {
    var locationName;
    if (this.props.editLocationMode) {
      locationName = this.refs.locationName.getDOMNode().value;
      this.props.inputLocation(locationName);
    } else {
      this.props.inputLocation();
    }
  },
  handleLocationName: function(e) {
    this.setState({location: e.target.value});
  },
  render: function() {
    var locationInput;
    if (this.props.editLocationMode) {
      locationInput = (<form><input type="text" ref="locationName" 
                          onChange={this.handleLocationName} 
                          defaultValue={this.props.answer} />
                       <Btn label={"Save"} clickHandler={this.inputLocation} /></form>);
    } else {
      locationInput = (<Btn label={"Set location name"} clickHandler={this.inputLocation} />);
    }
    return (
      (locationInput)
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

var Clue = React.createClass({
  getInitialState: function() {
    return {
      data: this.props.data,
      editMode: false,
      value: this.props.text
    };
  },
  toggleEdit: function() {
    if (this.state.editMode === true) {
      var editedClue = this.refs.clueEdit.getDOMNode().value;
      this.state.data[this.props.parentIndex].clues[this.props.index] = editedClue;
      this.setState({data: this.state.data, editMode: false});
    } else {
      this.setState({editMode: true});
    }
  },
  handleInput: function(e) {
    this.setState({value: e.target.value});
  },
  deleteClue: function() {
    this.props.deleteClue(this.props.index);
  },
  render: function() {
    var editBtn;
    var text;
    if (this.state.editMode) {
      editBtn = (<button className="btn" onClick={this.toggleEdit}>Save</button>);
      text = (<textarea cols="35" ref="clueEdit" defaultValue={this.props.text} 
                onChange={this.handleInput} />);
    } else {
      editBtn = (<button className="btn" onClick={this.toggleEdit}>Edit</button>);
      text = (this.props.data[this.props.parentIndex].clues[this.props.index]);
    }
    if (this.props.editMode) {

    } else {
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


var pins = [];
/*
var pins = [
  {
    "answer": "Bay Bridge",
    "clues": ['Refurbished in 2013', 'Not the Golden Gate Bridge'],
    "geo": [37.8181, 122.3467]
  },
  {
    "answer": "Transamerica Building",
    "desc": "Pointed building in SF",
    "clues": ['Named after a company', 'In Financial District'],
    "geo": [37.8181, 122.3467]

  }
];
*/

React.render(
  <HuntBox/>, document.getElementById('app-container')
  );
