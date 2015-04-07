
  var gMap = {}
  gMap.travelButtonList = [];
  gMap.travelMode = 'WALKING';
  gMap.map;
  gMap.pathLatLng = [];
  gMap.directionsDisplay;
  gMap.directionsService;
  gMap.markers = [];
  gMap.distance = [];
  gMap.duration = [];

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
        stylers: [ { hue: "#00ffe6" }, { saturation: -20 } ]
      },{
        featureType: "road",
        elementType: "geometry",
        stylers: [ { lightness: 100 }, { visibility: "simplified" } ]
      },{
        featureType: "road",
        elementType: "labels",
        stylers: [ { visibility: "off" } ]
      }
    ];

    var styledMap = new google.maps.StyledMapType(mapStyles,{name: "Styled Map"});
    gMap.map.mapTypes.set('map_style', styledMap);
    gMap.map.setMapTypeId('map_style');

    //----------------------------------
    //events
    //----------------------------------
    google.maps.event.addListener(gMap.map, 'click', function(event) {
      //makeMarker(event.latLng);
      if(gMap.pathLatLng.length < 10){
        gMap.pathLatLng.push(event.latLng);
      }
      gMap.createPath();
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
      gMap.travelMode= 'BICYCLING';
    },true);

    new gMap.CenterControl('BOTTOM_LEFT', 'D', function(){
      gMap.travelMode= 'DRIVING';
    },true);

    new gMap.CenterControl('BOTTOM_LEFT', 'T', function(){
      gMap.travelMode= 'TRANSIT';
    },true);

  }

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
        };
      }
      callback();
    });
    gMap.map.controls[google.maps.ControlPosition[position]].push(controlUI);
  }


  gMap.createPath = function (){
    if(gMap.directionsDisplay instanceof google.maps.DirectionsRenderer){
      var oldPath = gMap.directionsDisplay;
    }
    gMap.directionsDisplay = new google.maps.DirectionsRenderer({
      map: gMap.map,
      draggable: true,

      markerOptions: {
          title: 'Marker',
          icon: {
            url: "https://s3.amazonaws.com/old.cdn.content/pb/f85b4a1ca1094d22e6c6839e934f048b.png",
            scaledSize: new google.maps.Size(20,20),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(10,10)
          }
      }
    });
    //creating waypoints to place on the map
    var waypoints = [];
    for (var i = 1; i < gMap.pathLatLng.length-1; i++) {
      waypoints.push({ location: gMap.pathLatLng[i] });
    };
    gMap.directionsService = new google.maps.DirectionsService();

    var request = {
        origin : gMap.pathLatLng[0],
        destination : gMap.pathLatLng[gMap.pathLatLng.length-1], // can be latLng or string (this is required)
        travelMode : google.maps.TravelMode[gMap.travelMode],
        waypoints : waypoints
    };

    gMap.directionsService.route(request, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        gMap.directionsDisplay.setDirections(response);
        gMap.emptyMarkers();
        gMap.makeMarker(response.routes[0].legs[0].start_location);
        for (var i = 0; i < response.routes[0].legs.length; i++) {
          gMap.makeMarker(response.routes[0].legs[i].end_location);
          gMap.distance[i] = response.routes[0].legs[i].distance.value;
          gMap.duration[i] = response.routes[0].legs[i].duration.value;
        };
        oldPath.setMap(null);
      }else{
        gMap.pathLatLng.pop(); //remove the last waypoint added
      }
      google.maps.event.addListener(gMap.directionsDisplay, 'directions_changed', function() {
        if(gMap.directionsDisplay.directions.routes){
          gMap.pathLatLng[0] = gMap.directionsDisplay.directions.routes[0].legs[0].start_location
        }
        for (var i = 1; i <= gMap.directionsDisplay.directions.routes[0].legs.length; i++) {
          gMap.pathLatLng[i] = gMap.directionsDisplay.directions.routes[0].legs[i-1].end_location
        };
        gMap.emptyMarkers();
        gMap.createPath();
      });
    });
  }

  gMap.makeMarker = function (latLng){

    var markerImage = {
      url: 'https://cdn2.iconfinder.com/data/icons/snipicons/500/map-marker-512.png',
      scaledSize: new google.maps.Size(40,40),
      origin: new google.maps.Point(0,0),
      anchor: new google.maps.Point(20,50)
    };

    var index = gMap.markers.length;
    var marker = new google.maps.Marker({
      map: gMap.map,
      icon: markerImage,
      position: latLng,
      title: 'marker ' + index
    });
    gMap.markers.push(marker);
    google.maps.event.addListener(marker, 'click', function() {
      console.log(index);
    });

  }
  gMap.emptyMarkers = function (){
    for (var i = 0; i < gMap.markers.length; i++) {
      gMap.markers[i].setMap(null);
    };
    gMap.markers.length = 0;
  }

  gMap.getGeolocation = function (callback){
    var pos = new google.maps.LatLng(-33.73, 149.02);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position){
        //console.log(position)
        pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        callback(pos);
      });
    }else{
      callback(pos);
    }
  }
  gMap.select = function (index){
  }
  gMap.remove = function (index){
    //debugger
    var array = gMap.exportMap();
    var lastHalf = array.splice(index);
    array.pop();
    var newArray = array.concat(lastHalf);
    gMap.importMap(newArray);
  }
  gMap.getDistance = function (index){
    index = index || 0;
    var total = 0;
    for (var i = index; i < gMap.distance.length; i++) {
      total += gMap.distance[i];
    };
    total = total * 100;
    total = total / 1609.34;
    total = Math.floor(total);
    total = total / 100;
    return total;
  }
  gMap.getDuration = function (index){
    index = index || 0;
    var total = 0;
    for (var i = index; i < gMap.duration.length; i++) {
      total += gMap.duration[i];
    };
    return total;
  }
  gMap.importMap = function (markerArray){
    gMap.pathLatLng=[];
    //emptyMarkers();
    //directionsDisplay.setMap(null);

    for (var i = 0; i < markerArray.length; i++) {
      console.log(markerArray[i][0],markerArray[i][1]);
      gMap.pathLatLng.push(new google.maps.LatLng(markerArray[i][0], markerArray[i][1]));
    };
    gMap.createPath();
  }
  gMap.exportMap = function (){
    var exportedArray = [];
    for (var i = 0; i < gMap.markers.length; i++) {
      exportedArray.push([gMap.markers[i].getPosition().lat(), gMap.markers[i].getPosition().lng()]);
    };
    return exportedArray;
  }
