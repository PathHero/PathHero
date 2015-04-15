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


var PlayerApp = React.createClass({  
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

    var display = (<div>Loading...</div>);

    if (this.state.hunt) {
      display = (<div id="playerApp"><RouteHandler hunt={this.state.hunt}/></div>);
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
      <div id="huntSummaryContainer">
        <TitleBox title="Hunt Summary">            
          <List listItemArray={listItemArray} />
        </TitleBox>
        <div id="hunt-description-container">
          <TitleBox title="Hunt Description">
            <div>
              {this.state.hunt.huntDesc}
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
      <div>
        <TitleBox title="Location Summary">            
          <List listItemArray={listItemArray} />
        </TitleBox>



        <HuntSummaryContainer/>

        <BottomNav/>
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

        <HuntSummaryContainer/>

      </div>
    );
  }
});

var Clues = React.createClass({
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
    var backBtn = (<button onClick={this.changeLocalStorage.bind(this, -1)} className="btn btn-default">Back</button>);                    
    var nextBtn = (<button onClick={this.changeLocalStorage.bind(this, 1)} className="btn btn-default">Next</button>);
    var twoButtons = (<div><button onClick={this.changeLocalStorage.bind(this, -1)} className="btn btn-default">Back</button><button onClick={this.changeLocalStorage.bind(this, 1)} className="btn btn-default">Next</button></div>);
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
            <h1>Under the Bridge</h1>                
          </div>
          <TitleBox title={"Clue " + (this.clueIndex + 1) + " of " +  this.pin.clues.length}>
            {currentClue}
          </TitleBox>
            {btnsToDisplay}        
        </div>
        <BottomNav/>
      </div>
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
  React.render(<Handler/>, document.getElementById('player-container'));
});










