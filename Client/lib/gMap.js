  'use strict';

  var gMap = {};
  
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

  gMap.markerImgList = [
    'http://static.iconsplace.com/icons/preview/orange/number-1-filled-256.png',
    'http://static.iconsplace.com/icons/preview/orange/number-2-filled-256.png',
    'http://static.iconsplace.com/icons/preview/orange/number-3-filled-256.png',
    'http://static.iconsplace.com/icons/preview/orange/number-4-filled-256.png',
    'http://static.iconsplace.com/icons/preview/orange/number-5-filled-256.png',
    'http://static.iconsplace.com/icons/preview/orange/number-6-filled-256.png',
    'http://static.iconsplace.com/icons/preview/orange/number-7-filled-256.png',
    'http://static.iconsplace.com/icons/preview/orange/number-8-filled-256.png',
    'http://static.iconsplace.com/icons/preview/orange/number-9-filled-256.png',
    'http://static.iconsplace.com/icons/preview/orange/number-10-filled-256.png',
    'http://static.iconsplace.com/icons/preview/orange/number-11-filled-256.png'
  ];
  gMap.markerImgDefault = gMap.markerImgList[0];

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
        stylers: [ { hue: '#00ffe6' }, { saturation: -20 } ]
      },{
        featureType: 'road',
        elementType: 'geometry',
        stylers: [ { lightness: 100 }, { visibility: 'simplified' } ]
      },{
        featureType: 'road',
        elementType: 'labels',
        stylers: [ { visibility: 'off' } ]
      }
    ];

    var styledMap = new google.maps.StyledMapType(mapStyles,{name: 'Styled Map'});
    gMap.map.mapTypes.set('map_style', styledMap);
    gMap.map.setMapTypeId('map_style');

    //----------------------------------
    //events
    //----------------------------------
    google.maps.event.addListener(gMap.map, 'click', function(event) {
      //makeMarker(event.latLng);
      if(gMap.pathLatLng.length < 10){
        gMap.pathLatLng.push(event.latLng);
        gMap.createPath(function(){
            gMap.trigger('addMarker', [event.latLng]);
        });
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

    new gMap.CenterControl('BOTTOM_LEFT', 'W', function(){
      gMap.travelMode = 'WALKING';
    },true,true);

    new gMap.CenterControl('BOTTOM_LEFT', 'B', function(){
      gMap.travelMode = 'BICYCLING';
    },true);

    new gMap.CenterControl('BOTTOM_LEFT', 'D', function(){
      gMap.travelMode = 'DRIVING';
    },true);

    // new gMap.CenterControl('BOTTOM_LEFT', 'T', function(){
    //   gMap.travelMode= 'TRANSIT';
    // },true);

  };

  //------------------------
  //functions
  //------------------------

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
    gMap.directionsDisplay = new google.maps.DirectionsRenderer({
      map: gMap.map,
      draggable: true,
      preserveViewport: true,
      markerOptions: {
          title: 'Marker',
          icon: {
            url: 'https://s3.amazonaws.com/old.cdn.content/pb/f85b4a1ca1094d22e6c6839e934f048b.png',
            scaledSize: new google.maps.Size(20,20),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(10,10),
            zIndex: 0
          }
      }
    });
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

      //EVENTS
      google.maps.event.addListener(gMap.directionsDisplay, 'directions_changed', function() {
        if(gMap.directionsDisplay.directions.routes){
          gMap.pathLatLng[0] = gMap.directionsDisplay.directions.routes[0].legs[0].start_location;
        }
        //debugger
        if(gMap.pathLatLng.length === 1){//this handles an edge case we will need to fix this later
          gMap.pathLatLng[0] = gMap.directionsDisplay.directions.routes[0].legs[0].end_location;
        }
        else{
          for (var i = 1; i <= gMap.directionsDisplay.directions.routes[0].legs.length; i++) {
            gMap.pathLatLng[i] = gMap.directionsDisplay.directions.routes[0].legs[i-1].end_location;
          }
        }
        gMap.emptyMarkers();
        gMap.createPath();
      });
    });
  };

  gMap.makeMarker = function (latLng,img){
    img = img || gMap.markerImgDefault;
    var lat = latLng.lat() || 10;
    console.log(latLng);
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
      console.log(index);
      gMap.trigger('clickMarker', [index]);
    });
  };
  gMap.emptyMarkers = function (){
    for (var i = 0; i < gMap.markers.length; i++) {
      gMap.markers[i].setMap(null);
    }
    gMap.markers.length = 0;
  };

  gMap.getGeolocation = function (callback){
    var pos = new google.maps.LatLng(-33.73, 149.02);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position){
        pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        callback(pos);
      });
    }else{
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
    //To remove we need to remove from the array and redraw
    //This is so by default you remove index 0
    index = index || 0;
    //this exports the Map so we have all the data we need in a clean way
    var array = gMap.exportMap();
    //this will remove the element we want to remove
    array.splice(index,1);
    //this will clean the  board and redraw with the new data
    gMap.importMap(array);
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
  gMap.showCurrentLocation = function(){
    setTimeout(function(){
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
        gMap.showCurrentLocation();
      });
    },5000);
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

  //EVENTS HANDLING
  gMap.events = {};
  gMap.events.addMarker = [];
  gMap.events.clickMarker = [];

  gMap.removeEventListener = function(events, callback){
    if(gMap.events[events]){
      for (var i = 0; i < gMap.events[events].length; i++) {
        if(gMap.events[events][i].toString() === callback.toString()){ 
          if(i === 0){
            gMap.events[events].shift();
          }else if (i === gMap.events[events].length-1){
            gMap.events[events].pop();
          }else{
            gMap.events[events].splice(i,1);
          }
          return undefined; 
        }
      }
    }
  };
  gMap.addEventListener = function(events, callback){
    if(gMap.events[events]){
      for (var i = 0; i < gMap.events[events].length; i++) {
        if(gMap.events[events][i].toString() === callback.toString()){ 
          return undefined; 
        }
      }
      gMap.events[events].push(callback);
    }
  };
  gMap.trigger = function(events,args){
     if(gMap.events[events]){
      for (var i = 0; i < gMap.events[events].length; i++) {
        if(gMap.events[events][i]){
          gMap.events[events][i].apply(this,args);
        }
      }
    }   
  };
