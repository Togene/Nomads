var collision_tree;
var nearest = [];
var nearest_debug = [];
var mag_mult = 2.2;
var rangecheck;

function collision_init(){
    collision_tree = 
    new quad_tree(new rectangle(0, 0, 50000, 50000), 1000);
    rangecheck = new circle(0, 0, 20);
}   

function broad_quad_tree_insert(o){
    collision_tree.insert(o);
}

function collision_update(delta){
  // broad_collision_check(delta);
    if(player != undefined){
        near = [];
        near_debug = [];
        
        rangecheck.x = player.transform.position.x
        rangecheck.y = player.transform.position.z;
        collision_tree.query(rangecheck, near, near_debug);

        near.splice( near.indexOf(player), 1 );
        //console.log(near);
        narrow_collision_check(near, player, delta);
    }

}

function broad_collision_check(delta){
   // if(collision_tree != undefined && player != undefined) {
   //     collision_tree.forEach(function(e){
//
   //     });
   // }
}

//! Fix Intersection bug before trying to work with RigidBody
function narrow_collision_check(near, e, delta){
    if(e != undefined){
        var l = e.get_component("aabb");
        l.set_colliding(false);
        var lb = e.get_component("rigidbody");

        for(var i = 0; i < near.length; i++){
            var r = near[i].get_component("aabb");

            if(l.intersect(r)){
                l.set_colliding(true);
                lb.flip_velocity()
                r.set_colliding(true);
                return;
            }

            r.set_colliding(false);
        }

       // lb.set_colliding(false);
   
    }
}
