var geocoder;
var map;
var lat;
var lng;
var start = new google.maps.LatLng(55.706212, 12.537616);


function addToDb(){

  var address = document.getElementById("address").value;
  console.log(address);

  geocoder.geocode( {"address" : address}, function(results, status){

    if (status == google.maps.GeocoderStatus.OK){


      var xhr;
      if (window.XMLHttpRequest) { // Mozilla, Safari, ...
          xhr = new XMLHttpRequest();
      };

      //post data that will be sent

      var name = document.getElementById("name").value;
      var data = "address=" + address + "&sentLat=" + Number(results[0].geometry.location.k) + "&sentLng=" + Number(results[0].geometry.location.A) + "&name=" + name;
      console.log(data);
      xhr.open("POST", "db.php", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(data);
      xhr.onreadystatechange = display_data;
      function display_data() {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            document.getElementById("suggestion").innerHTML = xhr.responseText;
          } else {
            alert('There was a problem with the request.');
          }
        }
      }


    } else {
      alert("there's a problem here");
    }
  });
}


function initialize(){
  geocoder = new google.maps.Geocoder;

  var mapOptions = {
    center: start,
    zoom: 13
  };

  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

  var homeMarker = new google.maps.Marker({
            position: start,
            map: map,
            title: "Hello, Inga LLAMA"
          });
  var homeContent = '<div id="content">'+
    '<h1 id="firstHeading" class="firstHeading">The Inga-LLAMA</h1>'+
    '<div id="bodyContent">'+
    '<p>This is where I live with the wonderfully wild Inga-LLAMA</p>'+
    '</div>'+
    '</div>';

  var infoWindow = new google.maps.InfoWindow({
    content: homeContent
  });


  showAllPoints();


  google.maps.event.addListener(homeMarker, 'click', function() {
          infoWindow.open(map,homeMarker);
          });
}



//you may not need this much longer..
function codeAddress(){
  var address = document.getElementById("address").value;
  geocoder.geocode( {"address" : address}, function(results, status){
    if (status == google.maps.GeocoderStatus.OK){
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
        animation: google.maps.Animation.DROP
      });
    } else {
      alert("there's a problem here");

    }
  });
}

function showAllPoints(){
  downloadUrl("db.php", function (data){
    var xml = data.responseXML;
    var markers = xml.documentElement.getElementsByTagName("marker");
    for(var i = 0; i < markers.length; i++){
      var name = markers[i].getAttribute("name");
      console.log(name);
      var address = markers[i].getAttribute("address");

      var innerContent = '<div>'+
    '<h1 class="firstHeading">' + name  + '</h1>'+
    '<div>'+
    '</div>'+
    '</div>';

    var infoWindow = new google.maps.InfoWindow({
      content: innerContent
    });

      var point = new google.maps.LatLng(
        parseFloat(markers[i].getAttribute("lat")),
        parseFloat(markers[i].getAttribute("lng")));
      var html = "<b>" + name + "</b> <br/>" + address;
      var marker = new google.maps.Marker({
        map: map,
        position: point,
        title: name
      });



       bindInfoWindow(marker, map, infoWindow, html);
    }
  });
}

function downloadUrl(url, callback){
  var request = window.ActiveXObject ?
  new ActiveXObject("Microsoft.XMLHTTP") :
  new XMLHttpRequest;

  request.onreadystatechange = function (){
    if (request.readyState == 4) {
      request.onreadystatechange = doNothing;
      callback(request, request.status);
    }
  };
  request.open("POST", url, true);
  request.send(null)
}

function bindInfoWindow(marker, map, infoWindow, html) {
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
}

function doNothing(){
  ;
}



//actually loads the map when win/dom is ready
google.maps.event.addDomListener(window, 'load', initialize);