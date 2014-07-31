<?php
//data sent from maps.js
$address = $_POST['address'];
$lat = $_POST['sentLat'];
$lng = $_POST["sentLng"];
$name = $_POST["name"];

//db password / connection
include "db.php";

//prevent injection
$address = mysql_real_escape_string( $address,$connection );
$name = mysql_real_escape_string( $name,$connection);

// Select all the rows in the markers table
$query = "SELECT * FROM map WHERE 1";
$result = mysql_query($query);
if (!$result) {
  die('Invalid query: ' . mysql_error());
}


// Iterate through the rows, printing XML nodes for each
$latArray = array();
$lngArray = array();
while ($row = mysql_fetch_assoc($result)){
  // ADD TO XML DOCUMENT NODE
  $latArray[] = $row['lat'];
  $lngArray[] = $row['lng'];
}

//checks to make sure address not already in database
if ( (in_array($lat, $latArray)) && (in_array($lng, $lngArray)) ){
  echo "There is already a Hidden Gem at this location. Currently there can only be one Hidden Gem per address";

}
//if not, adds it the to the database.
else{
  $insert = "INSERT INTO map (id, name, address, lat, lng) VALUES ( '', '$name', '$address', '$lat', '$lng')";

  $insertResult = mysql_query($insert);
  if (!$insertResult) {
    die('Invalid query: ' . mysql_error());
  }

}
 ?>
