
  
  var travelButtonList = [];
  var travelMode = 'WALKING';
  var map;
  var pathLatLng = [];
  var directionsDisplay;
  var directionsService;
  var markers = [];

  function startGMap(pos){
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
    map = new google.maps.Map(document.getElementById('gMap'),mapOptions);
    
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
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');

    //----------------------------------
    //events
    //----------------------------------
    google.maps.event.addListener(map, 'click', function(event) {
      //makeMarker(event.latLng);
      pathLatLng.push(event.latLng);
      createPath();
    });
    //----------------------------------
    //adding custom GUI elements
    //----------------------------------

    new CenterControl('TOP_LEFT', '-', function(){
      map.setZoom(map.getZoom()-1);
    });

    new CenterControl('TOP_LEFT', '+', function(){
      map.setZoom(map.getZoom()+1);
    });

    new CenterControl('BOTTOM_LEFT', 'W', function(){
      travelMode = 'WALKING';
    },true,true);

    new CenterControl('BOTTOM_LEFT', 'B', function(){
      travelMode= 'BICYCLING';
    },true);

    new CenterControl('BOTTOM_LEFT', 'D', function(){
      travelMode= 'DRIVING';
    },true);

    new CenterControl('BOTTOM_LEFT', 'T', function(){
      travelMode= 'TRANSIT';
    },true);

  }

  //------------------------
  //functions
  //------------------------

  function CenterControl (position,text, callback, addToList,startAsActive) {

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
      travelButtonList.push(controlUI);
    }
    // Setup the click event listeners: simply set the map to
    // Chicago
    google.maps.event.addDomListener(controlUI, 'click', function(){
      if(addToList){
        for (var i = 0; i < travelButtonList.length; i++) {
          travelButtonList[i].className = 'gMapInactiveButton';
          if(travelButtonList[i] === controlUI){
            controlUI.className = 'gMapActiveButton';
          }
        };
      }
      callback();
    });
    map.controls[google.maps.ControlPosition[position]].push(controlUI);
  }


  function createPath(){
    if(directionsDisplay instanceof google.maps.DirectionsRenderer){
      var oldPath = directionsDisplay;
    }
    directionsDisplay = new google.maps.DirectionsRenderer({
      map: map,
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
    for (var i = 1; i < pathLatLng.length-1; i++) {
      waypoints.push({ location: pathLatLng[i] });
    };
    directionsService = new google.maps.DirectionsService();

    var request = {
        origin:pathLatLng[0],
        destination:pathLatLng[pathLatLng.length-1], // can be latLng or string (this is required)
        travelMode: google.maps.TravelMode[travelMode],
        waypoints : waypoints
    };

    directionsService.route(request, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        emptyMarkers();
        makeMarker(response.routes[0].legs[0].start_location);
        for (var i = 0; i < response.routes[0].legs.length; i++) {
          makeMarker(response.routes[0].legs[i].end_location);
        };
        oldPath.setMap(null);
      }else{
        pathLatLng.pop(); //remove the last waypoint added
      }
      google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
        if(directionsDisplay.directions.routes){
          pathLatLng[0] = directionsDisplay.directions.routes[0].legs[0].start_location
        }
        for (var i = 1; i <= directionsDisplay.directions.routes[0].legs.length; i++) {
          pathLatLng[i] = directionsDisplay.directions.routes[0].legs[i-1].end_location
        };
        emptyMarkers();
        console.log('changed'); 
        createPath();
      });
    });
  }

  function makeMarker(latLng){

    var markerImage = {
      url: 'https://cdn2.iconfinder.com/data/icons/snipicons/500/map-marker-512.png',
      scaledSize: new google.maps.Size(40,40),
      origin: new google.maps.Point(0,0),
      anchor: new google.maps.Point(20,50)
    };

    var index = markers.length;
    var marker = new google.maps.Marker({
      map: map,
      icon: markerImage,
      position: latLng,
      title: 'marker ' + index
    });
    markers.push(marker);
    google.maps.event.addListener(marker, 'click', function() {
      console.log(index);
    });

  }
  function emptyMarkers(){
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    };
    markers.length = 0;
  }

  function getGeolocation (callback){
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
  function selectMarker(index){

  }
  function removeMarker(index){

  }
  function getTimeAndDistance(index){
    //index = index || all
  }
  function importMap(markerArray){
    pathLatLng=[];
    //emptyMarkers();
    //directionsDisplay.setMap(null);

    for (var i = 0; i < markerArray.length; i++) {
      console.log(markerArray[i][0],markerArray[i][1]);
      pathLatLng.push(new google.maps.LatLng(markerArray[i][0], markerArray[i][1]));
    };
    createPath();
  }
  function exportMap(){
    var exportedArray = [];
    for (var i = 0; i < markers.length; i++) {
      exportedArray.push([markers[i].getPosition().lat(), markers[i].getPosition().lng()]);
    };
    return exportedArray;
  }
