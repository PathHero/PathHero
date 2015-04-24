'use strict';
var CEvent = require('./CEventLib');

var gMap = {};

//EVENTS HANDLING
gMap.cEvent = new CEvent();
gMap.cEvent.events.addMarker = [];
gMap.cEvent.events.dragEvent = [];
gMap.cEvent.events.clickMarker = [];
//shorten the function calls for the event handler
gMap.removeEventListener = function(events, callback){
  gMap.cEvent.removeEventListener(events,callback);
};
gMap.addEventListener = function(events, callback){
  gMap.cEvent.addEventListener(events,callback);
};
gMap.trigger = function(events,args){
  gMap.cEvent.trigger(events,args);
};

gMap.map = null;
gMap.markers = [];

gMap.distance = [];
gMap.duration = [];

gMap.pathLatLng = [];
gMap.travelMode = 'WALKING';
gMap.travelButtonList = [];

gMap.directionsDisplay = null;
gMap.directionsService = null;
gMap.currentLocationMarker = null;
gMap.highlightedMarker = null;
gMap.disableAddPins = false;

gMap.markerImgList = require('./mapMarkers');
gMap.markerImgDefault = gMap.markerImgList[0];
gMap.pointImg = 'http://pathhero.com/lib/point.png';

gMap.startGMap = function (pos){
  //can be -> BICYCLING, DRIVING, TRANSIT, WALKING
  //----------------------------------
  //creatig the Map
  //----------------------------------
  var mapOptions = {
    center: pos,
    zoom: 12,
    backgroundColor: '#568',
    disableDoubleClickZoom : true,
    disableDefaultUI: true,
    keyboardShortcuts: false
  };
  gMap.map = new google.maps.Map(document.getElementById('gMap'),mapOptions);
  
  //----------------------------------
  //styling the Map
  //----------------------------------
  var mapStyles = [
    {
      'featureType': 'road.highway',
      'stylers': [
        { 'hue': '#ffa200' },
        { 'saturation': -13 },
        { 'lightness': 44 }
      ]
    }
  ];

  var styledMap = new google.maps.StyledMapType(mapStyles,{name: 'Styled Map'});
  gMap.map.mapTypes.set('map_style', styledMap);
  gMap.map.setMapTypeId('map_style');

  //----------------------------------
  //events
  //----------------------------------
  var clickStack = [];
  var runClickStack = function(){
    if(clickStack.length === 0){
      runClickStack.running = false;
      return;
    }
    var stackPiece = clickStack.shift();
    if(gMap.pathLatLng.length < 9){
      gMap.pathLatLng.push(stackPiece);
      gMap.createPath(function(){
        gMap.trigger('addMarker', [stackPiece]);
        console.log('added Marker');
        runClickStack();
      });
    }
  };
  runClickStack.running = false;
  google.maps.event.addListener(gMap.map, 'click', function(event) {
    //makeMarker(event.latLng);
    if(!gMap.disableAddPins){
      clickStack.push(event.latLng);
      if(!runClickStack.running){
        runClickStack.running = true;
        runClickStack();
      }
    }
  });

  //----------------------------------
  //adding custom GUI elements
  //----------------------------------

  new gMap.CenterControl('TOP_LEFT', '-', function(){
    gMap.map.setZoom(gMap.map.getZoom()-1);
  });

  new gMap.CenterControl('TOP_LEFT', '+', function(){
    gMap.map.setZoom(gMap.map.getZoom()+1);
  });

  // new gMap.CenterControl('BOTTOM_LEFT', 'T', function(){
  //   gMap.travelMode= 'TRANSIT';
  // },true);

};

//------------------------
//functions
//------------------------
gMap.setCenter = function(pos) {
  gMap.map.setCenter(pos);
};

gMap.CenterControl = function (position,text, callback, addToList,startAsActive) {

  // Set CSS for the control border
  var controlUI = document.createElement('div');
  controlUI.className = 'gMapInactiveButton';
  if(startAsActive){
    controlUI.className = 'gMapActiveButton';
  }

  // Set CSS for the control interior
  var controlText = document.createElement('div');
  controlText.className = 'gMapText';
  controlText.innerHTML = text;
  controlUI.appendChild(controlText);
  if(addToList){
    gMap.travelButtonList.push(controlUI);
  }
  // Setup the click event listeners: simply set the map to
  // Chicago
  google.maps.event.addDomListener(controlUI, 'click', function(){
    if(addToList){
      for (var i = 0; i < gMap.travelButtonList.length; i++) {
        gMap.travelButtonList[i].className = 'gMapInactiveButton';
        if(gMap.travelButtonList[i] === controlUI){
          controlUI.className = 'gMapActiveButton';
        }
      }
    }
    callback();
  });
  gMap.map.controls[google.maps.ControlPosition[position]].push(controlUI);
};

gMap.createPath = function (callback){
  callback = callback || function(){};
  if(gMap.directionsDisplay instanceof google.maps.DirectionsRenderer){
    var oldPath = gMap.directionsDisplay;
  }
  var directionsRendererConfig = {
    map: gMap.map,
    draggable : false,
    preserveViewport: true,
    markerOptions: {
        title: 'Marker',
        icon: {
          url: gMap.pointImg,
          scaledSize: new google.maps.Size(16,16),
          origin: new google.maps.Point(0,0),
          anchor: new google.maps.Point(8,8),
          zIndex: 0
        }
    }
  };
  if(!gMap.disableAddPins){
    directionsRendererConfig.draggable = true;
  }
  gMap.directionsDisplay = new google.maps.DirectionsRenderer(directionsRendererConfig);
  //creating waypoints to place on the map
  var waypoints = [];
  for (var i = 1; i < gMap.pathLatLng.length-1; i++) {
    waypoints.push({ location: gMap.pathLatLng[i] });
  }
  gMap.directionsService = new google.maps.DirectionsService();

  var request = {
      origin : gMap.pathLatLng[0],
      destination : gMap.pathLatLng[gMap.pathLatLng.length-1], // can be latLng or string (this is required)
      travelMode : google.maps.TravelMode[gMap.travelMode],
      waypoints : waypoints
  };

  //GET ROUTES
  gMap.directionsService.route(request, function(response, status) {
    //IF REQUEST IS OK
    if (status === google.maps.DirectionsStatus.OK) {
      gMap.directionsDisplay.setDirections(response);
      gMap.emptyMarkers();
      gMap.makeMarker(response.routes[0].legs[0].start_location, gMap.markerImgList[0]);
      if(gMap.pathLatLng.length === 1){//this handles an edge case we will need to fix this later
        gMap.makeMarker(response.routes[0].legs[0].end_location, gMap.markerImgList[0]);
        gMap.distance[0] = 0;
      }else{
        for (var i = 0; i < response.routes[0].legs.length; i++) {
          gMap.makeMarker(response.routes[0].legs[i].end_location, gMap.markerImgList[i+1]);
          gMap.distance[i] = response.routes[0].legs[i].distance.value;
          gMap.duration[i] = response.routes[0].legs[i].duration.value;
        }
      }
      if(oldPath){
        oldPath.setMap(null);
      }
    }
    //IF REQUEST FAILED
    else{
      console.error('Error with gMap.createPath: Status:', google.maps.DirectionsStatus, ': Response:',response);
      gMap.pathLatLng.pop(); //remove the last waypoint added
    }
    //AFTER REQUEST

    //CALLBACK
    callback();
    gMap.trigger('dragEvent', [gMap.pathLatLng]);

    //EVENTS
    google.maps.event.addListener(gMap.directionsDisplay, 'directions_changed', function() {
      if(gMap.directionsDisplay.directions.routes){
        gMap.pathLatLng[0] = gMap.directionsDisplay.directions.routes[0].legs[0].start_location;
      }
      if(gMap.pathLatLng.length === 1){//this handles an edge case we will need to fix this later
        gMap.pathLatLng[0] = gMap.directionsDisplay.directions.routes[0].legs[0].end_location;
      }
      else{
        for (var i = 1; i <= gMap.directionsDisplay.directions.routes[0].legs.length; i++) {
          gMap.pathLatLng[i] = gMap.directionsDisplay.directions.routes[0].legs[i-1].end_location;
        }
      }
      gMap.emptyMarkers();
      gMap.createPath(function() {
        gMap.trigger('dragEvent', [gMap.pathLatLng]);
      });
    });
  });
};

gMap.makeMarker = function (latLng,img){
  img = img || gMap.markerImgDefault;
  var lat = latLng.lat() || 10;
  var markerImage = {
    url: img,
    scaledSize: new google.maps.Size(40,40),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(20,50),
    zIndex: lat
  };

  var index = gMap.markers.length;
  var marker = new google.maps.Marker({
    map: gMap.map,
    icon: markerImage,
    position: latLng,
    title: 'marker ' + index
  });

  gMap.markers.push(marker);
  //-------------------
  //events
  //-------------------
  google.maps.event.addListener(marker, 'click', function() {
    gMap.trigger('clickMarker', [index]);
  });
};
gMap.emptyMarkers = function (){
  for (var i = 0; i < gMap.markers.length; i++) {
    gMap.markers[i].setMap(null);
  }
  gMap.distance.length = 0;
  gMap.duration.length = 0;
  gMap.markers.length = 0;
};

gMap.getGeolocation = function (callback){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
      pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      callback(pos);
    });
  }else{
    var pos = new google.maps.LatLng(-33.73, 149.02);
    callback(pos);
  }
};
gMap.select = function (index){
  var obj = {};
  if(gMap.markers[index] !== undefined){
    obj.title = gMap.markers[index].title;
    obj.position = {};
    obj.position.lat = gMap.markers[index].getPosition().lat();
    obj.position.lng = gMap.markers[index].getPosition().lng();
    return obj;
  }else{
    return undefined;
  }
};
gMap.remove = function (index){
  //this removes the markers however it correct for the path system recreating a marker if there is only one
  //if there is only one then it will remove that marker and empty the markers else it will remove the one and rerender
  index = index || 0;
  var map = gMap.exportMap();
  var emptied = false;
  if(map.length === 2){
    if(map[0][0] === map[1][0] && map[0][1] === map[1][1]){
      gMap.emptyMarkers();
      gMap.pathLatLng.length = 0;
      gMap.directionsDisplay.setMap(null);
      emptied = true;
    }
  }
  if(!emptied){
    map.splice(index,1);
    gMap.importMap(map);
  }
};
gMap.getDistance = function (index, total){
  index = index || 0;
  if(!total){

    total = 0;
    for (var i = index; i < gMap.distance.length; i++) {
      total += gMap.distance[i];
    }
  }
  //The API gives distance by meter this will change meters into miles.
  total = total / 1609.34;
  return Math.round(total*100)/100;
};
gMap.getDistanceByLocation = function (callback, index, travelMode){
  index = index || 0;
  travelMode = travelMode || 'WALKING';
  gMap.getGeolocation(function(latLng){
    var directionsService = new google.maps.DirectionsService();
    var request = {
        origin : latLng,
        destination : gMap.markers[index].position, // can be latLng or string (this is required)
        travelMode : google.maps.TravelMode[travelMode],
    };
    directionsService.route(request, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        callback(gMap.getDistance(0, response.routes[0].legs[0].distance.value));
      }else{
        console.error('Error with gMap.getDistanceByLocation: Status:', google.maps.DirectionsStatus, ': Response:',response);
        callback(-1);
      }
    });
  });
};
gMap.getDistanceToLatLng = function (callback, latLng, travelMode){
  travelMode = travelMode || 'WALKING';
  gMap.getGeolocation(function(currLatLng){
    var directionsService = new google.maps.DirectionsService();
    var request = {
        origin : currLatLng,
        destination : new google.maps.LatLng(latLng.lat, latLng.lng), // can be latLng or string (this is required)
        travelMode : google.maps.TravelMode[travelMode],
    };
    directionsService.route(request, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        var total = response.routes[0].legs[0].distance.value;
        total = total / 1609.34;
        callback(Math.round(total*100)/100);
      }else{
        console.error('Error with gMap.getDistanceByLocation: Status:', google.maps.DirectionsStatus, ': Response:',response);
        callback(-1);
      }
    });
  });
};
gMap.showCurrentLocation = function(){
  gMap.getGeolocation(function(latLng){
    var markerImage = {
      url: 'https://cdn2.iconfinder.com/data/icons/snipicons/500/map-marker-512.png',
      scaledSize: new google.maps.Size(40,40),
      origin: new google.maps.Point(0,0),
      anchor: new google.maps.Point(20,50)
    };
    var marker = new google.maps.Marker({
      map: gMap.map,
      icon: markerImage,
      position: latLng,
      title: 'Current Location'
    });
    if (gMap.currentLocationMarker){
      gMap.currentLocationMarker.setMap(null);
    }
    gMap.currentLocationMarker = marker;
  });
};

gMap.getDuration = function (index){
  index = index || 0;
  var total = 0;
  for (var i = index; i < gMap.duration.length; i++) {
    total += gMap.duration[i];
  }
  //changing seconds to hours
  total = (total / 60) / 60;
  return Math.round(total*100)/100;
};
gMap.importMap = function (markerArray){
  gMap.pathLatLng=[];
  for (var i = 0; i < markerArray.length; i++) {
    gMap.pathLatLng.push(new google.maps.LatLng(markerArray[i][0], markerArray[i][1]));
  }
  gMap.createPath();
};
gMap.exportMap = function (){
  var exportedArray = [];
  for (var i = 0; i < gMap.markers.length; i++) {
    exportedArray.push([gMap.markers[i].getPosition().lat(), gMap.markers[i].getPosition().lng()]);
  }
  return exportedArray;
};
gMap.appImportMap = function(obj){
  var pins = obj.pins;
  var pinArray = [];
  for (var i = 0; i < pins.length; i++) {
    pinArray.push( [ pins[i].geo.lat, pins[i].geo.lng ] );
  }
  gMap.importMap(pinArray);
};
gMap.appExportMap = function(index){
  return {
    lat : gMap.markers[index].getPosition().lat(), 
    lng : gMap.markers[index].getPosition().lng()
  };
};

module.exports = gMap;
