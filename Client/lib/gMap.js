
var gMap = function(){

  getGeolocation(startGMap);
  
  var lastLocationClicked;
  var markerCords = [];
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
      addMarker(event.latLng, 'Count ' + markerCords.length);
    });

    //----------------------------------
    //adding custom GUI elements
    //----------------------------------


    var tagForZoomOut = document.createElement('div');
    var controlForZoomOut = new CenterControl(tagForZoomOut, '-', function(){
      map.setZoom(map.getZoom()-1);
    });

    var tagForZoomIn = document.createElement('div');
    var controlForZoomIn = new CenterControl(tagForZoomIn, '+', function(){
      map.setZoom(map.getZoom()+1);
    });

    var tagForWalk = document.createElement('div');
    var controlForWalk = new CenterControl(tagForWalk, 'W', function(){
      travelMode = 'WALKING';
    },true,true);
    
    var tagForBicycle = document.createElement('div');
    var controlForBicycle = new CenterControl(tagForBicycle, 'B', function(){
      travelMode= 'BICYCLING';
    },true);
    
    var tagForDrive = document.createElement('div');
    var controlForDrive = new CenterControl(tagForDrive, 'D', function(){
      travelMode= 'DRIVING';
    },true);

    var tagForTransit = document.createElement('div');
    var controlForTransit = new CenterControl(tagForTransit, 'T', function(){
      travelMode= 'TRANSIT';
    },true);

    //adding the events tags to the Map
    
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(tagForZoomOut);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(tagForZoomIn);
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(tagForWalk);
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(tagForBicycle);
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(tagForDrive);
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(tagForTransit);
  }




  //------------------------
  //functions
  //------------------------

  function calcRoute() {

    var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
    var directionsService = new google.maps.DirectionsService();
  
    directionsDisplay.setMap(map);

    var start = markerCords[markerCords.length-2];
    var end = markerCords[markerCords.length-1];
    var request = {
        origin:start,
        destination:end,
        travelMode: google.maps.TravelMode[travelMode],
    };
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }
    });
  }

  function addMarker (latLng, title){
    var id = markerCords.length;
    markerCords.push(latLng);
    var size = {
      height: 40,
      width: 40
    }

    var image = {
      url: 'https://cdn2.iconfinder.com/data/icons/snipicons/500/map-marker-512.png',
      scaledSize: new google.maps.Size(size.width,size.height),
      origin: new google.maps.Point(0,0),
      anchor: new google.maps.Point(size.width/2,size.height)
    };

    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: title,
        icon: image,
    });

    google.maps.event.addListener(marker, 'click', function() {
      console.log(id);
    });
    if(!!lastLocationClicked){
      calcRoute();
    }
    lastLocationClicked = latLng;
  }

  function CenterControl (controlDiv, text, callback, addToList,startAsActive) {

    // Set CSS for the control border
    var controlUI = document.createElement('div');
    controlUI.className = 'gMapInactiveButton gMapButton';
    if(startAsActive){
      controlUI.className = 'gMapActiveButton gMapButton';
    }
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '200px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.marginLeft = '10px';
    controlUI.style.textAlign = 'center';
    controlUI.style.width = '35px';
    controlUI.style.height = '35px';
    controlUI.style.marginTop = '10px';


    controlUI.title = 'Click to recenter the map';

    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior
    var controlText = document.createElement('div');
    controlText.className = 'gMapText';
    controlText.style.color = 'rgb(255,255,255)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.style.paddingBottom = '5px';

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

}


