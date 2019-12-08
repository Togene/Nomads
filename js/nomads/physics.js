//Get the Init from workers
var rigidbodies = [];
var gravity = 5.8;
var air_density = 1.225; ///

function calc_terminal(o){
    return Math.sqrt( (2*o.mass*gravity) / (air_density * 1 * 0.47));
}

function rigidbodies_insert(o){
    rigidbodies.push(o);
}

function physics_update(delta){
    for(var i in rigidbodies){
        if(!rigidbodies[i].isKin){
            //add_gravity(rigidbodies[i], delta);
        }
    }
}

function add_gravity(o, delta){
    if(o.velocity.y < calc_terminal(o)) {
        var collider = o.parent.get_component("aabb");

        if(!collider.colliding){
            o.add_force(gravity * o.mass * delta, new THREE.Vector3(0, -1, 0));
        }
    }
    
}

