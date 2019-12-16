var collision_tree;
var nearest = [];
var nearest_debug = [];
var mag_mult = 2.2;
var rangecheck;

function collision_init(){
    collision_tree = 
    new quad_tree(new rectangle(0, 0, 50000, 50000), 1000);
    rangecheck = new circle(0, 0, 100);
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
    
            rangecheck.x = e.transform.position.x
            rangecheck.y = e.transform.position.z;
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

            if(near[i] == e || e == near[i]){
                continue;
            }

            if(l.intersect(r)){
                l.set_colliding(true);
                r.set_colliding(true);
            }
        }

        l.set_colliding(false);
    }
}
