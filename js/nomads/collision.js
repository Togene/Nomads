var collision_tree;
var nearest = [];
var nearest_debug = [];
var rangecheck;
function collision_init(){
    collision_tree = new quad_tree(new rectangle(0, 0, 50000, 50000), 1000);
    rangecheck =  new circle(0, 0, 100);
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
        collision_tree.forEach(function(element){
            
            near = [];
            near_debug = [];
            
            rangecheck.x = element.transform.position.x;
            rangecheck.y = element.transform.position.z;

            collision_tree.query(rangecheck, near, near_debug);

            narrow_collision_check(near, element, delta);
        });
    }
}


//l = left
//r = right
//l_body = left 
function narrow_collision_check(near, e, delta){

        if(near.length > 0) {
        var l = e.get_component("aabb");
        var l_body = e.get_component("rigidbody");

        l.set_colliding(false);

        for(var i = 0; i < near.length; i++){
            
            var r = near[i].get_component("aabb");
            var r_body = near[i].get_component("rigidbody");

            //if its the same object u dont wana collide with itself ._.
            if(l == r || r == l){continue;}

            if(l.intersects(r)){
                l.set_colliding(true);
                r.set_colliding(true);

                if(r_body != null) {
                    
                    var direction;
                    var mag;

                    if(l_body != null){
                        direction = l_body.get_direction();
                        mag = l_body.get_magnitude();
                    } else {
                        direction = r_body.get_flip_direction();
                        mag = r_body.get_magnitude();
                    }

                    direction.y = 0;

                    r_body.add_force(mag, direction);
                }

                if(l_body != null) {
                    var direction;
                    var mag;

                    if(r_body != null){
                        direction = r_body.get_direction();
                        mag = r_body.get_magnitude();
                    } else {
                        direction = l_body.get_flip_direction();
                         mag = l_body.get_magnitude();
                    }

                    direction.y = 0;

                    l_body.add_force(25, direction);
                }

                return;
            }
            
            l.set_colliding(false);
            r.set_colliding(false);
        }
    }
}


//function narrow_collision_check(delta){
//    if(nearest.length > 0) {
//        var l = player.get_component("aabb");
//        var l_body = player.get_component("rigidbody");
//
//        l.set_colliding(false);
//
//        for(var i = 0; i < nearest.length; i++){
//            
//            var r = nearest[i].get_component("aabb");
//            var r_body = nearest[i].get_component("rigidbody");
//
//            //if its the same object u dont wana collide with itself ._.
//            if(l === r || r === l){
//                continue;
//            }
//
//            if(l.intersects(r)){
//                l.set_colliding(true);
//                r.set_colliding(true);
//
//                if(r_body != null) r_body.add_force(l_body.get_magnitude() * 0.25, get_player_direction());
//                return;
//            }
//            
//            l.set_colliding(false);
//            r.set_colliding(false);
//        }
//    }
//}