<?php
   $name = $_GET['name'];
   $type = $_GET['type'];

   $data = file_get_contents($name . '.'. $type);
   echo $data;
?>