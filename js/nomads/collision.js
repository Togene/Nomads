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
        object_collision_check(delta);
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
        var l_b = e.get_component("rigidbody");

        for(var i = 0; i < near.length; i++){
            if(near[i] === e || e === near[i]){ continue; }
        
            var r = near[i].get_component("aabb");
            var r_b = near[i].get_component("rigidbody");

            if(l.intersect(r)){
                l.set_colliding(true);
                r.set_colliding(true);
                
                //transfering player velocity to the rigidbody
                if(r_b != null){
                    
                    if(l_b != null){
                        r_b.transfer_force(l_b);
                    } else {
                        //r_b.add_force(r_b.get_magnitude(), r_b.get_direction(delta));
                    }
                    
                } else {
                    
                }

                return;
            }

            r.set_colliding(false);
            l.set_colliding(false);
        }
    }
}
