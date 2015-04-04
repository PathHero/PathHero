
  
  
  var lastLocationClicked;
  var markers = [];
  var routes = [];
  var travelButtonList = [];
  var travelMode = 'WALKING';
  var map;

  

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
      addToPath(event.latLng);
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


    controlUI.title = 'Click to recenter the map';

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

  var markerImage = {
    url: 'https://cdn2.iconfinder.com/data/icons/snipicons/500/map-marker-512.png',
    scaledSize: new google.maps.Size(40,40),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(20,40)
  };
  function fillMap(markerArray){

  }
  function addMarker (latLng, title){
    var marker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: 'Marker',
          icon: markerImage,
      });
      google.maps.event.addListener(marker, 'click', function() {
        console.log('clicked');
        var id = undefined;
        for (var i = 0; i < markers.length; i++) {
          if(marker === markers[i]){
            id = i;
            console.log(id);
          }
        };
        console.log(id)
        removeMarker(id)
      });
    markers.push(marker);
  }

  function addToPath(latLng){

    if(markers.length === 0){
      addMarker(latLng);
    }else{
      createPath(new google.maps.LatLng(markers[markers.length-1].position.lat(), 
        markers[markers.length-1].position.lng()), 
        latLng,
        function(response, directionsDisplay){
          directionsDisplay.setDirections(response);
          var leg = response.routes[ 0 ].legs[ 0 ];
          addMarker(leg.end_location)
        });
    }
  }

  function createPath(startLatLng, endLatLng, callback, insertInTo){
    var directionsDisplay = new google.maps.DirectionsRenderer({
      suppressMarkers: true
    });
    var directionsService = new google.maps.DirectionsService();
  
    directionsDisplay.setMap(map);

    var request = {
        origin:startLatLng,
        destination:endLatLng,
        travelMode: google.maps.TravelMode[travelMode],
    };
    directionsService.route(request, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        callback(response, directionsDisplay);
      }
    });
    if(insertInTo){
      insertInTo = [directionsDisplay,directionsService]
    }else{
      routes.push([directionsDisplay,directionsService]);
    }
  }

  function selectMarker(index){

  }

  function removeMarker(index){

    if(index === markers.length-1){
      markers[markers.length-1].setMap(null);
      markers.pop();
      routes[routes.length-1][0].setMap(null);
      routes.pop();
    }else if (index === 0){
      markers[0].setMap(null);
      markers.shift();
      routes[0][0].setMap(null);
      routes.shift();
    }else{
      //remove the marker
      //remove the path to the left
      //remove the path to the right
      //create a path filling in the gap

      markers[index].setMap(null);
      var markerArray = markers.splice(0,index);
      markers.shift();

      if(routes[index]){
        routes[index][0].setMap(null);
      }if(routes[index-1]){
        routes[index-1][0].setMap(null);
      }

      var routeArray = routes.splice(0,index);
      routes.shift();
      createPath( markerArray[markerArray.length-1].position, 
                  markers[0].position,
                  function(response, directionsDisplay){
                    directionsDisplay.setDirections(response);
                  }),
                  routeArray.length

      markers = markerArray.concat(markers);
      routes = routeArray.concat(routes);
    }
  }

  function startDragMarker(index){

  }
  function endDragMarker(index){

  }
  function getTimeForPath(index){
    //index = index || all
  }
  function getDistanceForPath(index){
    //index = index || all
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
