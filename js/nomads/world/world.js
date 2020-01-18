//Get the Init from workers
var WORLD = [];

const map_index =
        [2, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0];

this.addEventListener("message", function(evt) {
    //check which function to call from data[0]
    var token = evt.data[0];
    
    if(token == "update"){
        setTimeout(world_update, 0); // <-- start the map update
    } else if(token == "init"){
        setTimeout(world_init, 0); // <-- start the map update
    }
});

//for water and other enviromental effects
function world_update(){
        console.log("%cWorld Generation Updating", 'color: #FFC911');
        //setTimeout(map_update, 1000);
};

//for water and other enviromental effects
function world_init(){
    var npc_shader = get_data("instance_shader");
    console.log("%cWorld Generation Initialized", 'color: #FFC9DE');
 //   setTimeout(physics_update, 1000);
    setTimeout(world_update, 0);
};