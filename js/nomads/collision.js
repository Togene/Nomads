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
    //broad_collision_check(delta);
    player_collision_check(delta);
}

function player_collision_check(delta){
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
    if(collision_tree != undefined && player != undefined) {
        collision_tree.forEach(function(e){
            near = [];
            near_debug = [];
            
            rangecheck.x = e.transform.position.x
            rangecheck.y = e.transform.position.z;
            collision_tree.query(rangecheck, near, near_debug);

            near.splice( near.indexOf(e), 1 );
            narrow_collision_check(near, e, delta);
        });
    }
}

//! Fix Intersection bug before trying to work with RigidBody
function narrow_collision_check(near, e, delta){
    if(e != undefined){
        var l = e.get_component("aabb");
        l.set_colliding(false);

        var lb = e.get_component("rigidbody");

        for(var i = 0; i < near.length; i++){
            var r = near[i].get_component("aabb");
            var rb = near[i].get_component("rigidbody");

            if(l.intersect(r)){
                
                //Handle Left
                l.set_colliding(true);
                //Handle Right
                r.set_colliding(true);

                //no rigidbodies, no collision
                if(lb == null && rb == null){return;}

                //Handle Nulls and Kenetics
                if(rb == null && lb != null){
                    lb.flip_velocity();
                }
                else if(lb == null && rb != null){
                    rb.flip_velocity();
                } else {
                    rb.add_force(lb.get_magnitude()/rb.mass, lb.get_flip_direction());
                    lb.add_force(rb.get_magnitude()/lb.mass, rb.get_flip_direction());
                }

                return;
            }

            r.set_colliding(false);
        }

       // lb.set_colliding(false);
   
    }
}
