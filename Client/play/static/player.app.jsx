'use strict';
/* jshint quotmark: false */
/* jshint expr: true */
/* jshint latedef: false */


var Router = window.ReactRouter;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;


var PlayerApp = React.createClass({  
  getInitialState: function() { 
    var hunt = {
      huntName: null,
      huntDesc: null,
      huntInfo: {
        numOfLocations: null,
        huntTimeEst: null,    
        huntDistance: null,
      }, 
      pins: [
        {
          hiddenName: null, 
          answer: null,
          geo: {
            lat: null,
            lng: null
          },
          timeToNextPin: null,
          distanceToNextPin: null,
          clues: []                    
        }
      ]
    };
    hunt.storage = {};
    return {hunt: hunt};
  },

  componentWillMount: function() {
    
    $.ajax({
      method: 'GET',
      url: 'http://create.wettowelreactor.com:3000'+window.location.pathname
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

    }.bind(this));
  },

  render: function () {

    var display = (<div>Loading...</div>);

    if (this.state.hunt.huntName) {
      display = (<div>
                  <div id="player-container">
                    <RouteHandler hunt={this.state.hunt}/>
                  </div>
                  <BottomNav/>
                </div>);
    }

    return (
      <div>{display}</div>
    );
  }
});

var BottomNav = React.createClass({
  render: function () {
    return (                   
      <div id="bottomNav">
        <div className="row">
          <div className="col-xs-4">
            <span><Link to="status">Status</Link></span>
          </div>
          <div className="col-xs-4">
            <span><Link to="clues">Clues</Link></span>
          </div>
          <div className="col-xs-4">
            <span><Link to="map">Map</Link></span>
          </div>
        </div>
      </div>      
    );
  }
});

var Title = React.createClass({
  render: function () {
    return <h2>{this.props.title}</h2>;
  }
});

var TitleBox = React.createClass({
  render: function () {
    return (
      <div>
        <h2>{this.props.title}</h2>
        <div>{this.props.children}</div>
      </div>
    );
  }
});

var List = React.createClass({
  render: function () {
    return (
      <div>
        <ul>
        {this.props.listItemArray.map(function(listItem) {
            return (<li>{listItem}</li>);
          })
        }
        </ul>
      </div>
    );
  }
});

var HuntSummaryContainer = React.createClass({
  render: function () {
    var numOfLocations = this.props.hunt.huntInfo.numOfLocations;
    var huntTimeEst = this.props.hunt.huntInfo.huntTimeEst;
    var huntDistance = this.props.hunt.huntInfo.huntDistance;
    var listItemArray = [ numOfLocations + " locations", 
                          huntTimeEst + " hr to completion", 
                          huntDistance + " miles"];
    return (      
      <div id="huntSummaryContainer">
        <TitleBox title="Hunt Summary">            
          <List listItemArray={listItemArray} />
        </TitleBox>
        <div id="hunt-description-container">
          <TitleBox title="Hunt Description">
            <div>
              {this.props.hunt.huntDesc}
              {this.numOfLocations}
            </div>
          </TitleBox>          
        </div>
      </div>
    ); 
  }
});

var Status = React.createClass({
  getInitialState: function() {
    return {
      playerAtLocation: false,
      huntComplete: false,
      distanceToNextPin: 0.00,
      currentPin: null
    }
  },

  getHuntStatus: function() {
    var currentPin = Number.parseInt(this.props.hunt.get('currentPin'));   
  },

  getCurrentPin: function() {
    var currentPin = Number.parseInt(this.props.hunt.get('currentPin'));
    this.setState({currentPin: currentPin})
     
  },

  visitedPins: [],  

  componentWillMount: function() {
    gMap.getDistanceByLocation(function (value) {
      var playerAtLocation = false;
      
      var currentPin = Number.parseInt(this.props.hunt.get('currentPin'));
      var nextPin = currentPin + 1;
      var pinsLength = this.props.hunt.pins.length;
      var huntComplete = false;

      if (value < 26){
        playerAtLocation = true;
        
        if (nextPin <= pinsLength) {
          this.props.hunt.set('currentPin', nextPin);        
        }

        if (nextPin > pinsLength) {
          huntComplete = true;
        }

      }

      this.setState({
        distanceToNextPin:value,
        playerAtLocation:playerAtLocation,
        huntComplete: huntComplete
      });
    }.bind(this));

  },

  render: function () {
    var numOfLocations = this.props.hunt.huntInfo.numOfLocations;
    var huntTimeEst = this.props.hunt.huntInfo.huntTimeEst;
    var listItemArray = [ numOfLocations + " locations", 
                          huntTimeEst + " hr to completion", 
                          this.state.distanceToNextPin + " miles"];
    var locationStatus;    
    var locationSummary = (
      <TitleBox title="Location Summary">
        <List listItemArray={listItemArray} />
      </TitleBox>
    );

    if (!this.state.playerAtLocation) {
      locationStatus = locationSummary;
    } else {
      locationStatus = <PinSuccess hunt={this.props.hunt}/>    
    }
    

    var huntStatus = null;
    if (this.state.huntComplete) {
      huntStatus = <HuntSuccess/>;
    }

    return (
      <div>
        {locationStatus}
        {huntStatus}
        <HuntSummaryContainer hunt={this.props.hunt}/>
      </div>
    );
  }
});

var PinSuccess = React.createClass({
  incrementPinInLocalStorage: function() {    
    this.props.incrementPinInLocalStorage();
  },
  render: function () {
    var currentPin = Number.parseInt(this.props.hunt.get('currentPin'));
    var currentPinIndex = currentPin - 1;
    console.log("CURRENT PIN ", currentPin)
    var answer = this.props.hunt.pins[currentPinIndex].answer;

    return (
      <div>
        <h1>Success! You're at the correct location</h1>
        <p>The answer was {answer}</p>
        <button className="btn btn-default"><Link to="clues">Start next location</Link></button>
      </div>
    );
  }
});

var HuntSuccess = React.createClass({
  render: function () {
    return (
      <div>
        <h1>You've completed the hunt!</h1>
        <p>Congratulations</p>
      </div>
    );
  }
});

var Welcome = React.createClass({
  render: function () {      
    return (
      <div>
        <div id="welcome-msg-container">  
          <div id="welcome-text">
            <Title title={this.props.hunt.huntName}/>
          </div>      
          <div id="start-btn">
            <button><Link to="clues">Start</Link></button>
          </div>          
        </div>
        <HuntSummaryContainer hunt={this.props.hunt}/>
      </div>
    );
  }
});

var Clues = React.createClass({
  hunt: null,
  clueIndex : null,
  pin: null,
  max: null,  
  currentLocation: null,
  changeLocalStoragePin: function(value) {    
    var clueValue = this.clueIndex+value;    
    if (clueValue < this.max && clueValue >= 0) {
      this.hunt.set('currentClue', clueValue);
      this.setState({hunt:this.hunt.storage});
    }  
  },
  init: function() {
    this.hunt = this.props.hunt;
    this.clueIndex = Number.parseInt(this.hunt.get('currentClue'));
    var currentPin = this.hunt.get('currentPin');

    if (currentPin === this.hunt.pins.length) {
      currentPin = currentPin - 1;
    }

    this.pin = this.hunt.pins[currentPin];
    this.max = this.pin.clues.length;
  },
  render: function () {    
    this.init();
    var currentClue = this.pin.clues[this.clueIndex];    
    var backBtn = (<button onClick={this.changeLocalStoragePin.bind(this, -1)} className="btn btn-default">Back</button>);                    
    var nextBtn = (<button onClick={this.changeLocalStoragePin.bind(this, 1)} className="btn btn-default">Next</button>);
    var twoButtons = (<div><button onClick={this.changeLocalStoragePin.bind(this, -1)} className="btn btn-default">Back</button><button onClick={this.changeLocalStoragePin.bind(this, 1)} className="btn btn-default">Next</button></div>);
    var btnsToDisplay;

    if (this.clueIndex < this.max && this.clueIndex === 0) {
      btnsToDisplay = nextBtn;    
    } else if (this.clueIndex < this.max && this.clueIndex > 0 && this.clueIndex !== this.max-1) {
      btnsToDisplay = twoButtons;
    } else if (this.clueIndex === this.max-1) {
      btnsToDisplay = backBtn;
    }

    return (
      <div id="playerContainer">
        <div className="clue-container">
          <div className="clue-header">
            <h1></h1>                
          </div>
          <TitleBox title={"Clue " + (this.clueIndex + 1) + " of " +  this.pin.clues.length}>
            {currentClue}
          </TitleBox>
            {btnsToDisplay}        
        </div>
      </div>
    );
  }
});

var Map = React.createClass({
  getInitialState: function() {
    return {
      style: {
          height: window.innerHeight,
          width: window.innerWidth,
          position: 'absolute',
          top: 0,
          left: 0
        }
    };
  }, 
  componentDidMount: function() {
    gMap.startGMap({lng:-33.73, lat:149.02});
    var hunt = this.props.hunt;
    gMap.getGeolocation(function(value){
      gMap.setCenter(value);
      gMap.showCurrentLocation();
      var mapArray = [];
      for (var i = 0; i < hunt.pins.length && i < hunt.get('currentPin'); i++) {
        mapArray.push([hunt.pins[i].geo.lat,hunt.pins[i].geo.lng]);
      };
      if(mapArray.length > 0){
        gMap.importMap(mapArray);
      }
    });
  },

  render: function () {
    return (
      <div id="gMap" style={this.state.style}></div>
    );
  }
});


var routes = (
  <Route handler={PlayerApp}>
    <DefaultRoute handler={Welcome}/>
    <Route name="status" handler={Status}/>
    <Route name="clues" handler={Clues}/>
    <Route name="map" handler={Map}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('player-app'));
});










