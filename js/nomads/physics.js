//Get the Init from workers
var rigidbodies = [];
var gravity = 5.8;
var air_density = 1.225; ///

function calc_terminal(o){
    return Math.sqrt( (2*o.mass*gravity) / (air_density * 50 * 2));
}

function rigidbodies_insert(o){
    rigidbodies.push(o);
}

function physics_update(delta){
        for(var i in rigidbodies){
            if(!rigidbodies[i].isKin)
                add_gravity(rigidbodies[i], delta);
        }
}

function add_gravity(o, delta){
        if(o.velocity.y < calc_terminal(o)){
            o.velocity.y -= gravity * o.mass * delta;
        } else{
            o.velocity.y = gravity * o.mass * delta;
        }
}


