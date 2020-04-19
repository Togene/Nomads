var loaded_data;

function save(data, name, type){
    $.ajax({
        type : "POST",
        url : "js/core/file/php_save.php",
        data : {
            json : JSON.stringify(data),
            name : name,
            type : type
        }
    });
}

function load(name, type, callback){
    $.ajax({
        type : "GET",
        url : "js/core/file/php_load.php",
        data : {name : name, type : type},
        success: function (data) {
            console.log("loading successful.");
            callback(data);
        }
    });
}
