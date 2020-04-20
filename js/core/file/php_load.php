<?php
   $name = $_GET['name'];
   $type = $_GET['type'];
   $result = 'error';
   $data = '';

   if(file_exists('../../../data/saved/' . $name . '.'. $type)){
      $result = 'ok';
      $data = file_get_contents('../../../data/saved/' . $name . '.'. $type);
   } else {
      
      $file = fopen('../../../data/saved/'. $name . '.'. $type,'w+');
      fwrite($file, json_encode (json_decode ("[\n]")));
      fclose($file);

      $data = file_get_contents('../../../data/saved/' . $name . '.'. $type);
   }

   $array = array(
      'result' => $result,
      'data' => $data,
   );

   echo json_encode($array);

?>