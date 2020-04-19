<?php
   $json = $_POST['json'];
   $name = $_POST['name'];
   $type = $_POST['type'];

   /* sanity check */
   if (json_decode($json) != null)
   {
     $file = fopen($name . '.'. $type,'w+');
     fwrite($file, $json);
     fclose($file);
   }
   else
   {
     // user has posted invalid JSON, handle the error 
   }
?>