'use strict';
/* jshint quotmark: false */
/* jshint expr: true */
/* jshint latedef: false */

var Hunt = {
  huntName: "Discover SFs most beautiful views",
  huntDesc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt, quidem tenetur dolorem ea eaque at explicabo. Necessitatibus quaerat aliquam repellendus, ipsam cum deleniti, voluptatem culpa nostrum recusandae sed iure architecto.",
  huntInfo: {
    numOfLocations: 3,
    huntTimeEst: 3,    
    huntDistance: 2,
  }, 
  pins: [
    {
      answer: "Bay Bridge",
      geo: {
        lat: 10.809870897,
        lng: 23.0987070
      },
      clues: [
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. In similique corporis vitae minus laborum odio recusandae quibusdam voluptatum error amet, dolore, perferendis, rerum ad officia tempore veritatis nostrum quae nihil.", 
        "Consectetur adipisicing elit. Voluptatum earum atque iusto nesciunt labore non explicabo optio consequuntur, quis aspernatur qui ad architecto, doloribus asperiores deleniti. Quas delectus, ad animi.", 
        "Amet, consectetur adipisicing elit. Dignissimos exercitationem totam magni sequi fugiat in quam perspiciatis minima reprehenderit repellat dolores, dolore eos, aspernatur inventore et architecto doloremque. Porro, modi."
      ]                    
    },
    {
      answer: "Golden Gate Bridge",
      geo: {
        lat: 10.742342,
        lng: 23.09870897
      },
      clues: [
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. In similique corporis vitae minus laborum odio recusandae quibusdam voluptatum error amet, dolore, perferendis, rerum ad officia tempore veritatis nostrum quae nihil.", 
        "Consectetur adipisicing elit. Voluptatum earum atque iusto nesciunt labore non explicabo optio consequuntur, quis aspernatur qui ad architecto, doloribus asperiores deleniti. Quas delectus, ad animi.", 
        "Amet, consectetur adipisicing elit. Dignissimos exercitationem totam magni sequi fugiat in quam perspiciatis minima reprehenderit repellat dolores, dolore eos, aspernatur inventore et architecto doloremque. Porro, modi."
      ]                    
    },
    {
      answer: "In the Park",
      geo: {
        lat: 10.87098,
        lng: 23.90808
      },
      clues: [
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. In similique corporis vitae minus laborum odio recusandae quibusdam voluptatum error amet, dolore, perferendis, rerum ad officia tempore veritatis nostrum quae nihil.", 
        "Consectetur adipisicing elit. Voluptatum earum atque iusto nesciunt labore non explicabo optio consequuntur, quis aspernatur qui ad architecto, doloribus asperiores deleniti. Quas delectus, ad animi.", 
        "Amet, consectetur adipisicing elit. Dignissimos exercitationem totam magni sequi fugiat in quam perspiciatis minima reprehenderit repellat dolores, dolore eos, aspernatur inventore et architecto doloremque. Porro, modi."
      ]                    
    },
  ],
};

var Router = window.ReactRouter;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;


var PlayerApp = React.createClass({displayName: "PlayerApp",  
  getInitialState: function() {    
    return {hunt: false};
  },

  componentWillMount: function() {
    
    $.ajax({
      method: 'GET',
      url: 'http://create.wettowelreactor.com'+window.location.pathname,
      context: document.body
    }).done(function(data) {
                  
      data.storage = {};

      data.set = function(key, value) {
        this.storage[key] = value;
        localStorage.setItem(key, value);
      };
      data.get = function(key) {
        if (this.storage[key] !== undefined) {
          return this.storage[key];

        } else if (localStorage[key] !== undefined) {
          this.storage[key] = localStorage[key];
          return localStorage[key];

        } else {
          this.set(key, 0);
          return 0;
        }
      };

      this.setState({hunt: data});

    }).bind(this);

    gMap.importMap([[37.7902554,-122.42340160000003],[37.7902554,-122.42340160000003]]);
  },

  render: function () {

    var display = (React.createElement("div", null, "Loading..."));

    if (this.state.hunt) {
      display = (React.createElement("div", {id: "playerApp"}, React.createElement(RouteHandler, {hunt: this.state.hunt})));
    }

    return (
      React.createElement("div", null, display)
    );
  }
});

var BottomNav = React.createClass({displayName: "BottomNav",
  render: function () {
    return (                   
      React.createElement("div", {id: "bottomNav"}, 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-xs-4"}, 
            React.createElement("span", null, React.createElement(Link, {to: "status"}, "Status"))
          ), 
          React.createElement("div", {className: "col-xs-4"}, 
            React.createElement("span", null, React.createElement(Link, {to: "clues"}, "Clues"))
          ), 
          React.createElement("div", {className: "col-xs-4"}, 
            React.createElement("span", null, React.createElement(Link, {to: "map"}, "Map"))
          )
        )
      )      
    );
  }
});

var Title = React.createClass({displayName: "Title",
  render: function () {
    return React.createElement("h2", null, this.props.title);
  }
});

var TitleBox = React.createClass({displayName: "TitleBox",
  render: function () {
    return (
      React.createElement("div", null, 
        React.createElement("h2", null, this.props.title), 
        React.createElement("div", null, this.props.children)
      )
    );
  }
});

var List = React.createClass({displayName: "List",
  render: function () {
    return (
      React.createElement("div", null, 
        React.createElement("ul", null, 
        this.props.listItemArray.map(function(listItem) {
            return (React.createElement("li", null, listItem));
          })
        
        )
      )
    );
  }
});

var HuntSummaryContainer = React.createClass({displayName: "HuntSummaryContainer",
  getInitialState: function() {    
    return {hunt: Hunt};
  },
  render: function () {
    var numOfLocations = this.state.hunt.huntInfo.numOfLocations;
    var huntTimeEst = this.state.hunt.huntInfo.huntTimeEst;
    var huntDistance = this.state.hunt.huntInfo.huntDistance;
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
              this.state.hunt.huntDesc, 
              this.numOfLocations
            )
          )
        )
      )
    ); 
  }
});

var Status = React.createClass({displayName: "Status",
  getInitialState: function() {    
    return {
      hunt: Hunt
    };
  },

  componentWillMount: function() {
    var nextPinDistance = null;
    gMap.getDistanceByLocation(function (value) {
      nextPinDistance = value;
    });
  },

  render: function () {
    var numOfLocations = this.state.hunt.huntInfo.numOfLocations;
    var huntTimeEst = this.state.hunt.huntInfo.huntTimeEst;
    var huntDistance = this.state.hunt.huntInfo.huntDistance;
    var listItemArray = [ numOfLocations + " locations", 
                          huntTimeEst + " hr to completion", 
                          huntDistance + " miles"];
    return (
      React.createElement("div", null, 
        React.createElement(TitleBox, {title: "Location Summary"}, 
          React.createElement(List, {listItemArray: listItemArray})
        ), 



        React.createElement(HuntSummaryContainer, null), 

        React.createElement(BottomNav, null)
      )
    );
  }
});

var Welcome = React.createClass({displayName: "Welcome",
  render: function () {      
    return (
      React.createElement("div", null, 
        React.createElement("div", {id: "welcome-msg-container"}, 
          React.createElement("div", {id: "welcome-text"}, 
            React.createElement(Title, {title: this.props.hunt.huntName})
          ), 
          React.createElement("div", {id: "start-btn"}, 
            React.createElement("button", null, React.createElement(Link, {to: "clues"}, "Start"))
          )
        ), 

        React.createElement(HuntSummaryContainer, null)

      )
    );
  }
});

var Clues = React.createClass({displayName: "Clues",
  hunt: null,
  clueIndex : null,
  pin: null,
  max: null,  
  changeLocalStorage: function(value) {    
    var clueValue = this.clueIndex+value;    
    if (clueValue < this.max && clueValue >= 0) {
      this.hunt.set('currentClue', clueValue);
      this.setState({hunt:Hunt.storage});
    }  
  },
  init: function() {
    this.hunt = this.props.hunt;
    this.clueIndex = Number.parseInt(this.hunt.get('currentClue'));
    this.pin = this.hunt.pins[this.hunt.get('currentPin')];
    this.max = this.pin.clues.length;
  },
  render: function () {    
    this.init();
    var currentClue = this.pin.clues[this.clueIndex];    
    var backBtn = (React.createElement("button", {onClick: this.changeLocalStorage.bind(this, -1), className: "btn btn-default"}, "Back"));                    
    var nextBtn = (React.createElement("button", {onClick: this.changeLocalStorage.bind(this, 1), className: "btn btn-default"}, "Next"));
    var twoButtons = (React.createElement("div", null, React.createElement("button", {onClick: this.changeLocalStorage.bind(this, -1), className: "btn btn-default"}, "Back"), React.createElement("button", {onClick: this.changeLocalStorage.bind(this, 1), className: "btn btn-default"}, "Next")));
    var btnsToDisplay;

    if (this.clueIndex < this.max && this.clueIndex === 0) {
      btnsToDisplay = nextBtn;    
    } else if (this.clueIndex < this.max && this.clueIndex > 0 && this.clueIndex !== this.max-1) {
      btnsToDisplay = twoButtons;
    } else if (this.clueIndex === this.max-1) {
      btnsToDisplay = backBtn;
    }

    return (
      React.createElement("div", {id: "playerContainer"}, 
        React.createElement("div", {className: "clue-container"}, 
          React.createElement("div", {className: "clue-header"}, 
            React.createElement("h1", null, "Under the Bridge")
          ), 
          React.createElement(TitleBox, {title: "Clue " + (this.clueIndex + 1) + " of " +  this.pin.clues.length}, 
            currentClue
          ), 
            btnsToDisplay
        ), 
        React.createElement(BottomNav, null)
      )
    );
  }
});

var routes = (
  React.createElement(Route, {handler: PlayerApp}, 
    React.createElement(DefaultRoute, {handler: Welcome}), 
    React.createElement(Route, {name: "status", handler: Status}), 
    React.createElement(Route, {name: "clues", handler: Clues}), 
    React.createElement(Route, {name: "map", handler: Map})
  )
);

Router.run(routes, function (Handler) {
  React.render(React.createElement(Handler, null), document.getElementById('player-container'));
});










