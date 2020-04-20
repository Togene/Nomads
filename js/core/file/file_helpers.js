var loaded_data;

function save(data, name, type){
    $.ajax({
        type : "POST",
        url : "js/core/file/php_save.php",
        data : {
            json : JSON.stringify(data, null, "\t"),
            name : name,
            type : type
        },
        success: function () {
            console.log("saving successful.");
        }
    });
}

function load(name, type, callback){
    $.ajax({
        type : "GET",
        url : "js/core/file/php_load.php",
        data : {name : name, type : type},
        success: function (data) {
            var json = JSON.parse(data);

            if(json.result === 'ok'){
                callback(json.data);
            } else {
                console.error("loading failed.", json.data);
            }

        },
    });
}

function remove(name, type){
    $.ajax({
        type : "GET",
        url : "js/core/file/php_delete.php",
        data : {name : name, type : type},
        dataType: 'json', 
        success: function (response) {
            if(response.status == true){
                console.log("%cfile removed.", 'color: #FF0000');
            } else {
                console.error("something went wrong.");
            }

        },
    });
}

