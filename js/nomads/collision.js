
var collision_tree;
var player_range;
var nearest = [];
var nearest_debug = [];

function collision_init(){
    collision_tree = new quad_tree(
        new rectangle(0, 0, 50000, 50000), 1000);
    
    player_range = new circle(
        player.transform.position.x, 
        player.transform.position.z,
        50);
}   

function broad_quad_tree_insert(o){
    collision_tree.insert(o);
}

function collision_update(delta){

    broad_collision_check(delta);
    narrow_collision_check(delta);
}

function broad_collision_check(delta){
    
    if(collision_tree != undefined){

        player_range.x = player.transform.position.x; 
        player_range.y = player.transform.position.z;

        nearest = [];
        nearest_debug = [];
        
        collision_tree.query(player_range, nearest, nearest_debug);
    }
}

function narrow_collision_check(delta){
    if(nearest.length > 0) {
        var l = player.get_component("aabb");

        l.set_colliding(false);

        for(var i = 0; i < nearest.length; i++){
            
            var r = nearest[i].get_component("aabb");
            
            if(l === r || r === l){
                continue;
            }

            if(l.intersects(r)){
                l.set_colliding(true);
                r.set_colliding(true);
                return;
            }
            
            l.set_colliding(false);
            r.set_colliding(false);
        }
    }
}