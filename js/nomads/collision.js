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
    floor_collision_check(delta)
}

function floor_collision_check(delta){
    if(collision_tree != undefined && player != undefined) {
        collision_tree.forEach(function(e){
            floor_narrow_check(e, delta);
        });
    }
}

function floor_narrow_check(e, delta){
    if(e != undefined){
        var l = e.get_component("aabb");
        var lb = e.get_component("rigidbody");
        var lr = e.get_component("ray");

        var r = floor.get_component("aabb");
        var intersection = r.ray_intersect(lr);

        if(intersection.val){
            lr.set_intersecting(true);

            if(e.name == "player"){
                lb.ground(intersection.y, true);
            } else {
                lb.ground(intersection.y, false);
            }
        } 
    }
}

function player_collision_check(delta){
    if(player != undefined){
        near = [];
        near_debug = [];

        rangecheck.x = player.transform.position.x
        rangecheck.y = player.transform.position.z;
        collision_tree.query(rangecheck, near, near_debug);

        near.splice( near.indexOf(player), 1 );
        near.splice( near.indexOf(floor), 1 );

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

var normal;

//! Fix Intersection bug before trying to work with RigidBody
function narrow_collision_check(near, e, delta){
    if(e != undefined){
        var l = e.get_component("aabb");
        var lb = e.get_component("rigidbody");
        var lr = e.get_component("ray");

        l.set_colliding(false);
    
        for(var i = 0; i < near.length; i++) {

            var r = near[i].get_component("aabb");
            var rb = near[i].get_component("rigidbody");

            var l_r_collsion = l.intersect(r);
            var l_r_swpt_collisiion = l.swept_intersect(lb, r);
            
            e.transform.position.x += lb.velocity.x * l_r_swpt_collisiion.val * delta;
            e.transform.position.z += lb.velocity.z * l_r_swpt_collisiion.val * delta;

            var r_time = 1.0 - l_r_swpt_collisiion.val;

           // //deflection.vx *= r_time;
           // lb.velocity.y *= r_time;
//
           // if(Math.abs(l_r_swpt_collisiion.nx) > 0.0001){lb.velocity.x = -lb.velocity.x};
           // if(Math.abs(l_r_swpt_collisiion.nz) > 0.0001){lb.velocity.z = -lb.velocity.z};
//
           // var mag = Math.sqrt(
           //     lb.velocity.x * lb.velocity.x + 
           //     lb.velocity.y * lb.velocity.y + 
           //     lb.velocity.z * lb.velocity.z) * r_time;
//
           // var dot_p = lb.velocity.x * l_r_swpt_collisiion.ny + 
           //             lb.velocity.y * l_r_swpt_collisiion.nx + 
           //             lb.velocity.z * lb.velocity.y;
           // //normal = l_r_collsion.normal;
           // //console.log(normal);
           // if(l_r_collsion.result){
           //     //Handle Left
           //     l.set_colliding(true);
           //     //Handle Right
           //     r.set_colliding(true);
           //
           //     collision_response(lb, rb, normal, delta);
           //
           //     return;
           // } else {
           //     //last step before a collision
           //     //since collision results in a zero normal vector
           //     normal = l_r_collsion.normal;
           // }

            var intersection = r.ray_intersect(lr);

            if(intersection.val){
                lr.set_intersecting(true);
    
                if(e.name == "player"){
                    lb.ground(intersection.y, true);
                } else {
                    lb.ground(intersection.y, false);
                }
            } 

            r.set_colliding(false);
        }
    }
}

function collision_response(lb, rb, n, delta){

    //no rigidbodies, no collision
    if(lb == null && rb == null){return;}

    //Handle Nulls and Kenetics
    if(rb == null && lb != null){
        lb.flip_velocity(n, delta);
    }
    else if(lb == null && rb != null){
        rb.flip_velocity(n, delta);
    } else {
        var lb_dir = lb.get_direction();
        var rb_dir = rb.get_direction();

        rb.add_force(lb.get_magnitude()/rb.mass, lb_dir);
        lb.add_force(rb.get_magnitude()/lb.mass, n);
    }
}
