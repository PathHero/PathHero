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
  _id: ''
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

var HuntBox = React.createClass({displayName: "HuntBox",
  mixins: [Reflux.ListenerMixin],
  getInitialState: function() {
    return {
      data: pins,
      _id: hunt._id,
      title: hunt.huntName,
      desc: hunt.huntDesc
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
                        title: data.huntName});
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
      React.createElement("div", {className: "huntBox"}, 
        React.createElement(Navbar, {brand: "Path Hero"}, 
          React.createElement(Nav, {right: true}, 
            React.createElement(NavItem, {eventKey: 1, href: "#"}, "Create hunt"), 
            React.createElement(NavItem, {eventKey: 2, href: "/hunts"}, "View hunts"), 
            React.createElement(NavItem, {eventKey: 3, href: "#"}, "Profile"), 
            React.createElement(NavItem, null, "Logout")
          )
        ), 
        React.createElement(HuntMap, null), 
        React.createElement(ClueBox, {data: this.state.data, 
                  title: this.state.title, 
                  _id: this.state._id, 
                  desc: this.state.desc})
      )
    );
  }
});

var HuntMap = React.createClass({displayName: "HuntMap",
  componentDidMount: function() {
    gMap.startGMap({lng: -33.73, lat: 149.02});
    gMap.getGeolocation(gMap.setCenter);
  },
  render: function() {
    return (
      React.createElement("div", {id: "gMap", className: "col-xs-6"}
      )  
    );
  }
});

var ClueBox = React.createClass({displayName: "ClueBox",
  mixins: [Reflux.connect(store)],
  getInitialState: function() {
    return {
      data: this.props.data,
      editTitleMode: false,
      editDescMode: false,
      desc: 'Dummy description',
      _id: this.props._id
    };
  },
  componentDidMount: function() {
    gMap.addEventListener('addMarker', function() {
      // var geo = gMap.select(this.props.data.length);
      var pin = {
        "hiddenName": "",
        "answer": "",
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
    if (this.state.editTitleMode) {
      title = (React.createElement("input", {id: "hunt-title", ref: "titleEdit", 
                  defaultValue: this.props.title}));
      titleBtn = (React.createElement(Btn, {label: "Save", clickHandler: this.toggleEditTitle}));
    } else {
      title = (React.createElement("span", {id: "hunt-title"}, this.props.title));
      titleBtn = (React.createElement(Btn, {label: "Edit title", clickHandler: this.toggleEditTitle}));
    }

    if (this.state.editDescMode) {
      desc = (React.createElement("input", {id: "hunt-desc", ref: "descEdit", 
                defaultValue: this.props.desc}));
      descBtn = (React.createElement(Btn, {label: "Save", clickHandler: this.toggleDesc}));
    } else {
      desc = (React.createElement("span", {id: "hunt-desc"}, this.props.desc));
      descBtn = (React.createElement(Btn, {label: "Edit description", clickHandler: this.toggleDesc}));
    }
    return (
      React.createElement("div", null, 
        React.createElement("div", {id: "hunt-info-container", className: "col-xs-6"}, 
          React.createElement("div", {id: "hunt-title-container"}, 
            React.createElement("h2", null, "Hunt Title"), 
              title, 
              titleBtn, 
            React.createElement("div", {className: "tour-summary-container"}, 
              React.createElement("h2", null, "Tour Summary"), 
              React.createElement("div", {className: "summary-box"}, 
                React.createElement("p", null, "Description: ", desc, descBtn), 
                React.createElement("p", null, "Duration: ", gMap.getDuration(), " hours"), 
                React.createElement("p", null, "Distance: ", gMap.getDistance(), " miles"), 
                React.createElement("p", null, "Locations: ", this.props.data.length)
              ), 
            React.createElement(HuntSubmitForm, {pins: this.props.data, 
                            title: this.props.title, 
                            desc: this.props.desc, 
                            _id: this.props._id})
            )
          ), 
          React.createElement("div", {id: "pin-container"}, 
            React.createElement("h2", null, "Pins"), 
            React.createElement(PinList, {data: this.props.data})
          )
        )
      )
    );
  }
});

var HuntSubmitForm = React.createClass({displayName: "HuntSubmitForm",
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
    alertMsg = (React.createElement(Alert, {bsStyle: "success", dismissAfter: 2000}, 
          "Successfully created a hunt! You can" + ' ' + 
          "continue to edit your hunt or send out this link to friends."
          )); 
    }
    return (
      React.createElement("div", null, 
        alertMsg, 
        React.createElement(Btn, {label: "Submit hunt", clickHandler: this.handleSubmit})
      )
    );
  }
});

var PinList = React.createClass({displayName: "PinList",
  getInitialState: function() {
    return {
      data: this.props.data,
    };
  },
  render: function() {
    var pinNodes = this.props.data.map(function(pin, index, data) {
      return (
        React.createElement(Pin, {data: data, index: index, answer: pin.answer, 
          clues: pin.clues, key: index}
        )
      );
    });
    return (
      React.createElement("div", {className: "pinList"}, 
        pinNodes
      )
    );
  }
});

var Pin = React.createClass({displayName: "Pin",
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
  render: function() {
    var index = this.props.index;
    var clueNodes = this.props.clues.map(function(clue, index) {
      return (
        React.createElement(Clue, {data: this.state.data, parentIndex: this.props.index, index: index, 
          text: clue, key: index, editMode: this.state.editMode, 
          toggleEdit: this.toggleEdit, deleteClue: this.deleteClue})
      );
    }.bind(this));

    return (
      React.createElement("div", {className: "pinContainer"}, 
        React.createElement(NameLocation, {editLocationMode: this.state.editLocationMode, 
                         answer: this.state.data[index].name, inputLocation: this.inputLocation}), 
        React.createElement(Accordion, null, 
          React.createElement(Panel, {onDoubleClick: this.nameLocation, eventKey: index, 
            header: "Pin " + (index+1) + ": " +this.state.data[index].answer}, 
          clueNodes, 
          React.createElement("textarea", {col: "35", row: "30", ref: "clueInput"}), 
          React.createElement(Btn, {label: "Add Clue", clickHandler: this.handleNewClue})
          )
        )
      )
    );
  }
});

var NameLocation = React.createClass({displayName: "NameLocation",
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
      locationInput = (React.createElement("form", null, React.createElement("input", {type: "text", ref: "locationName", 
                          onChange: this.handleLocationName, 
                          defaultValue: this.props.answer}), 
                       React.createElement(Btn, {label: "Save", clickHandler: this.inputLocation})));
    } else {
      locationInput = (React.createElement(Btn, {label: "Set location name", clickHandler: this.inputLocation}));
    }
    return (
      (locationInput)
    );
  }
});

var Btn = React.createClass({displayName: "Btn",
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
      React.createElement("button", {className: "btn", type: "button", onClick: this.props.clickHandler}, 
        this.props.label
      )
    );
  }
});

var Clue = React.createClass({displayName: "Clue",
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
      editBtn = (React.createElement("button", {className: "btn", onClick: this.toggleEdit}, "Save"));
      text = (React.createElement("textarea", {cols: "35", ref: "clueEdit", defaultValue: this.props.text, 
                onChange: this.handleInput}));
    } else {
      editBtn = (React.createElement("button", {className: "btn", onClick: this.toggleEdit}, "Edit"));
      text = (this.props.data[this.props.parentIndex].clues[this.props.index]);
    }
    if (this.props.editMode) {

    } else {
    }
    return (
      React.createElement("div", {className: "clueDetails"}, 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-xs-2"}, 
            "Clue ", this.props.index+1, ":"
          ), 
          React.createElement("div", {className: "col-xs-6"}, 
          text
          ), 
          React.createElement("div", {className: "col-xs-4"}, 
            editBtn, 
            React.createElement(Btn, {clickHandler: this.deleteClue, label: "Delete"})
          )
        )
      )
    );
  }
});


var pins = [];
/*
var pins = [
  {
    "answer": "Bay Bridge",
    "hiddenName": "",
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
  React.createElement(HuntBox, null), document.getElementById('app-container')
  );
