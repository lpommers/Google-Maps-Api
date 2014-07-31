var geocoder, map;
var map;
var infoWindows = [];
var google;
var start = new google.maps.LatLng(55.706212, 12.537616);
var ActiveXObject;

function doNothing(){
}

//closes the info windows before another is opened. Only one info window is open at a time
function closeAllInfoWindows(){
  for (var i =0; i < infoWindows.length; i++){
    infoWindows[i].close();
  }
}

//binds infowindow content to the appropriate content
function bindInfoWindow(marker, map, infoWindow, html) {
  google.maps.event.addListener(marker, 'click', function() {
    closeAllInfoWindows();
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
}

//takes user input and turns it into a google map location, and sets the infowindow
function codeAddress(){
  var address = document.getElementById("address").value;
  var name = document.getElementById("name").value;
  //content of the info window
  var html = "<b>" + name + "</b> <br/>" + address;
  var innerContent = '<div>'+
    '<h1 class="firstHeading">' + name  + '</h1>'+
    '<div>'+
    '</div>'+
    '</div>';

  var infoWindow = new google.maps.InfoWindow({
    content: innerContent
  });

  //coding the address and creating map pin
  geocoder.geocode( {"address" : address}, function(results, status){
    if (status === google.maps.GeocoderStatus.OK){
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
        animation: google.maps.Animation.DROP
      });
      infoWindows.push(infoWindow);
       bindInfoWindow(marker, map, infoWindow, html);

       map.setCenter({lat : results[0].geometry.location.k, lng: results[0].geometry.location.B});
    } else {
      alert("there's a problem here");

    }
  });
}

//adds the points/name to the db via ajax request.
//we geocode the location into lat/long then send it along with the name as a post to addPoint.php
function addToDb(){
  var xhr;
  var address = document.getElementById("address").value;

  geocoder.geocode( {"address" : address}, function(results, status){
    if (status === google.maps.GeocoderStatus.OK){
      if (window.XMLHttpRequest) { // Mozilla, Safari, ...
          xhr = new XMLHttpRequest();
      }
      console.log(results[0]);
      //post data that will be sent
      var name = document.getElementById("name").value;
      var data = "address=" + address + "&sentLat=" + Number(results[0].geometry.location.k).toFixed(6) + "&sentLng=" + Number(results[0].geometry.location.B).toFixed(6) + "&name=" + name;
      //open the connection
      xhr.open("POST", "_/php/addPoint.php", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(data);
      console.log(data);
      //response
      xhr.onreadystatechange = function()  {
        // response complete and ready
        if (xhr.readyState === 4) {
          if ( (xhr.status === 200) && (xhr.response.length === 0) ) {
            document.getElementById("suggestion").innerHTML = xhr.responseText;
              codeAddress();
          }
          else if ((xhr.status === 200) && (xhr.response.length > 0)) {
            //document.getElementById("suggestion").innerHTML = alert(xhr.responseText);
            alert(xhr.responseText);
          }
          else {
            alert('There was a problem with the request.');
          }
        }
      };
    } else {
      alert("there's a problem here");
    }
  });
}

function downloadUrl(url, callback){
  //if ie
  var request = window.ActiveXObject ?
  new ActiveXObject("Microsoft.XMLHTTP") :
  new XMLHttpRequest ();

  request.onreadystatechange = function (){
    if (request.readyState === 4) {
      request.onreadystatechange = doNothing;
      callback(request, request.status);
    }
  };
  request.open("POST", url, true);
  request.send(null);
}

//starts the google map, grabbing all points already in the databse
function initialize(){
  geocoder = new google.maps.Geocoder();

  var mapOptions = {
    center: start,
    zoom: 13,
    scrollwheel: false
  };

  //grabs all the points from the database and creates markers for them
  function showAllPoints(){
    downloadUrl("_/php/allPoints.php", function (data){
      var xml = data.responseXML;
      var markers = xml.documentElement.getElementsByTagName("marker");
      //goes through each point - makes info window and marker
      for(var i = 0; i < markers.length; i++){
        var name = markers[i].getAttribute("name");

        var address = markers[i].getAttribute("address");

        var innerContent = '<div>'+
      '<h1 class="firstHeading">' + name  + '</h1>'+
      '<div>'+
      '</div>'+
      '</div>';

      var infoWindow = new google.maps.InfoWindow({
        content: innerContent
      });
        //setting the points for the marker
        var point = new google.maps.LatLng(
          parseFloat(markers[i].getAttribute("lat")),
          parseFloat(markers[i].getAttribute("lng")));
        var html = "<b>" + name + "</b> <br/>" + address;
        var marker = new google.maps.Marker({
          map: map,
          position: point,
          animation: google.maps.Animation.DROP,
          title: name
        });
        infoWindows.push(infoWindow);
         bindInfoWindow(marker, map, infoWindow, html);
      }
    });
}

  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  console.log(map);

  showAllPoints();

}


//actually loads the map when win/dom is ready
google.maps.event.addDomListener(window, 'load', initialize);
var submitButton = document.getElementById("new-hidden-gem");
submitButton.addEventListener('click', function(){
  addToDb();
});

