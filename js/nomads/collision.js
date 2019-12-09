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
}

function broad_collision_check(delta){
    
    if(collision_tree != undefined && player != undefined) {
        player_collision_check(delta);
        //object_collision_check(delta);
    }
}

function object_collision_check(delta){
    collision_tree.forEach(function(e){
            
        near = [];
        near_debug = [];

        var rangecheck = new circle(
            e.transform.position.x, e.transform.position.z, 100);
        
        //console.log(near);
        collision_tree.query(rangecheck, near, near_debug);
        
        //remove player as he is doing his own thing
        near.splice( near.indexOf(player), 1 );

        //remove self from the list
        near.splice( near.indexOf(e), 1 );

        if(near.length != 0) narrow_collision_check(near, e, delta);
    });
}

function player_collision_check(delta){
    near = [];
    near_debug = [];

    var rangecheck = new circle(
        player.transform.position.x, player.transform.position.z, 100);

    collision_tree.query(rangecheck, near, near_debug);

    near.splice( near.indexOf(player), 1 );

    if(near.length != 0) narrow_collision_check(near, player, delta);
}

function narrow_collision_check(near, e, delta){
    if(e != undefined){
        var l = e.get_component("aabb");
        var l_body = e.get_component("rigidbody");
        l.set_colliding(false);

        for(var i = 0; i < near.length; i++){
            if(near[i] === e || e === near[i]){ continue; }
        
            var r = near[i].get_component("aabb");
            var r_body = near[i].get_component("rigidbody");
            r.set_colliding(false);

            if(l.intersect(r)){
                l.set_colliding(true);
                r.set_colliding(true);

                var l_body_dir = new THREE.Vector3();
                var l_body_mag = 5;

                var r_body_dir = new THREE.Vector3();
                var r_body_mag = 5;

                if(l_body != null){
                    l_body_dir = l_body.get_direction().clone();
                    l_body_mag = l_body.get_magnitude();
                }

                if(r_body != null){
                   
                } else {
                    r_body_dir = l_body.get_flip_direction().clone();
                    r_body_mag = l_body.get_magnitude()*1.2;
                }

                if(r_body != null) r_body.add_force(l_body_mag, l_body_dir);
                if(l_body != null) { l_body.add_force(r_body_mag, r_body_dir);
                }
            }
        }
    }
}
