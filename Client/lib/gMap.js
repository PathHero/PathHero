
  
  var travelButtonList = [];
  var travelMode = 'WALKING';
  var map;
  var pathLatLng = [];
  var directionsDisplay;
  var directionsService;

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
      if(pathLatLng.length){
        createPath(event.latLng);
      }
      pathLatLng.push(event.latLng);
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


  function createPath(endLatLng){
    if(directionsDisplay instanceof google.maps.DirectionsRenderer){
      var oldPath = directionsDisplay;
    }
    directionsDisplay = new google.maps.DirectionsRenderer({
      map: map,
      draggable: true,
      markerOptions: {
          title: 'Marker',
          icon: {
            url: 'https://cdn2.iconfinder.com/data/icons/snipicons/500/map-marker-512.png',
            scaledSize: new google.maps.Size(40,40),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(20,40)
          }
      }
    });
    //creating waypoints to place on the map
    var waypoints = [];
    for (var i = 1; i < pathLatLng.length; i++) {
      waypoints.push({
        location: pathLatLng[i]
      });
      // google.maps.event.addListener(waypoints[waypoints.length-1], 'click', function() {
      //   console.log('waypoint number', waypoints.length);
      // });
    };
    google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {  
        console.log('directions_changed')  
    });
    google.maps.event.addListener(directionsDisplay, 'click', function() {  
        console.log('clicked')
    });
    directionsService = new google.maps.DirectionsService();

    var request = {
        origin:pathLatLng[0],
        destination:endLatLng, // can be latLng or string (this is required)
        travelMode: google.maps.TravelMode[travelMode],
        waypoints : waypoints
    };

    directionsService.route(request, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        console.log(response)
        directionsDisplay.setDirections(response);
        oldPath.setMap(null);
      }else{
        pathLatLng.pop(); //remove the last waypoint added
      }
    });
  }


  function getGeolocation (callback){
    var pos = new google.maps.LatLng(-33.73, 149.02);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position){
        console.log(position)
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
  function fillMap(markerArray){

  }
