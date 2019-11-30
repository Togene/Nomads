
var collision_tree;
var player_range;
var nearest = [];
var nearest_debug = [];

var colliding = false;

function collision_init(){
    collision_tree = new quad_tree(
        new rectangle(0, 0, 50000, 50000), 1000);
    
    player_range = new circle(
        controls.getObject().position.x, 
        controls.getObject().position.z,
        2);
}   

function far_quad_tree_insert(o){
    console.log("adding: ", o);
    collision_tree.insert(o);
}

function collision_update(delta){
    if(collision_tree != undefined){
        player_range.x = controls.getObject().position.x; 
        player_range.y = controls.getObject().position.z;

        nearest = [];
        nearest_debug = [];
        
        collision_tree.query(player_range, nearest, nearest_debug);

        if(nearest.length != 0){colliding = true;} else {colliding = false;}
        if(nearest.length > 0)
            console.log(nearest_debug);
            //console.clear();

    }

}