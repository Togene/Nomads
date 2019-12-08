var collision_tree;
var nearest = [];
var nearest_debug = [];

function collision_init(){
    collision_tree = 
    new quad_tree(new rectangle(0, 0, 50000, 50000), 1000);
}   

function broad_quad_tree_insert(o){
    collision_tree.insert(o);
}

function collision_update(delta){

    broad_collision_check(delta);
    narrow_collision_check(delta);
}

function broad_collision_check(delta){
    
    if(collision_tree != undefined) {
        
        collision_tree.forEach(function(e){
            
            near = [];
            near_debug = [];
            var rangecheck =  new circle(0, 0, 100);
            rangecheck.x = e.transform.position.x;
            rangecheck.y = e.transform.position.z;

            collision_tree.query(rangecheck, near, near_debug);

            narrow_collision_check(near, e, delta);

        });
    }
}

function narrow_collision_check(near, e, delta){

}
