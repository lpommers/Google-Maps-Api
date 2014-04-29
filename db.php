<?php

$address = $_POST['address'];
$lat = $_POST['sentLat'];
$lng = $_POST["sentLng"];
$name = $_POST["name"];

function parseToXML($htmlStr)
{
  $xmlStr=str_replace('<','&lt;',$htmlStr);
  $xmlStr=str_replace('>','&gt;',$xmlStr);
  $xmlStr=str_replace('"','&quot;',$xmlStr);
  $xmlStr=str_replace("'",'&#39;',$xmlStr);
  $xmlStr=str_replace("&",'&amp;',$xmlStr);
  return $xmlStr;
}

$connection = mysql_connect("localhost", "root", "root");
if (!$connection) {
  die('Not connected : ' . mysql_error());
}

$db_selected = mysql_select_db("map-api", $connection);
if (!$db_selected) {
  die ('Can\'t use db : ' . mysql_error());
}

// Select all the rows in the markers table
$query = "SELECT * FROM map WHERE 1";
$result = mysql_query($query);
if (!$result) {
  die('Invalid query: ' . mysql_error());
}
if (!empty($lat)){
  $insert = "INSERT INTO map (id, name, address, lat, lng) VALUES ( '', '$name', '$address', '$lat', '$lng')";

  $insertResult = mysql_query($insert);
  if (!$insertResult) {
    die('Invalid query: ' . mysql_error());
  }

}


header("Content-type: text/xml");

echo "<markers>";

// Iterate through the rows, printing XML nodes for each
while ($row = @mysql_fetch_assoc($result)){
  // ADD TO XML DOCUMENT NODE
  echo '<marker ';
  echo 'name="' . parseToXML($row['name']) . '" ';
  echo 'address="' . parseToXML($row['address']) . '" ';
  echo 'lat="' . $row['lat'] . '" ';
  echo 'lng="' . $row['lng'] . '" ';
  echo '/>';
}

// End XML file
echo '</markers>';


 ?>
