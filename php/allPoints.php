<?php

function parseToXML($htmlStr)
{
  $xmlStr=str_replace('<','&lt;',$htmlStr);
  $xmlStr=str_replace('>','&gt;',$xmlStr);
  $xmlStr=str_replace('"','&quot;',$xmlStr);
  $xmlStr=str_replace("'",'&#39;',$xmlStr);
  $xmlStr=str_replace("&",'&amp;',$xmlStr);
  return $xmlStr;
}


//my database connection password details.
include "db.php";

// Select all the rows in the markers table
$query = "SELECT * FROM map WHERE 1";
$result = mysql_query($query);
if (!$result) {
  die('Invalid query: ' . mysql_error());
}


  header("Content-type: text/xml");

  echo "<markers>";



  while ($row = mysql_fetch_assoc($result)){
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
