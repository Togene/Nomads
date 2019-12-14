var collision_tree;
var nearest = [];
var nearest_debug = [];
var mag_mult = 2.2;
function collision_init(){
    collision_tree = 
    new quad_tree(new rectangle(0, 0, 50000, 50000), 1000);
}   

function broad_quad_tree_insert(o){
    collision_tree.insert(o);
}

function collision_update(delta){
    broad_collision_check(delta);
}

function broad_collision_check(delta){
    if(collision_tree != undefined && player != undefined) {
        collision_tree.forEach(function(e){
            near = [];
            near_debug = [];
    
            var rangecheck = new circle(
                e.transform.position.x, e.transform.position.z, 100);
 
            collision_tree.query(rangecheck, near, near_debug);
            narrow_collision_check(near, e, delta);
        });
    }
}

function narrow_collision_check(near, e, delta){
    if(e != undefined){
        var l = e.get_component("aabb");
        for(var i = 0; i < near.length; i++){
            var r = near[i].get_component("aabb");

            if(l.intersect(r)){
                l.set_colliding(true);
                r.set_colliding(true);
            }
        }

        l.set_colliding(false);
    }
}
