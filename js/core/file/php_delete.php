<?php
    $name = $_GET['name'];
    $type = $_GET['type'];
    $response = array('status'=>true);

    if(file_exists('../../../data/saved/' . $name . '.'. $type)){
        unlink('../../../data/saved/'. $name . '.'. $type);
        $response['status'] = true;
    }
    
    echo json_encode($response);
?>