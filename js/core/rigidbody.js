
var cutoff = 0.0001;
var godmode = false;
var bugs = [] //* anything currently stuck to this body
var min_vel = 0.5;

function rigidbody(mass, isKin){
    this.mass = mass;
    this.isKinematic = isKin;
    
    this.acceleration = new THREE.Vector3(0,0,0);
    this.velocity = new THREE.Vector3(0,0,0);

    //where he looks and where he goes are diffrent
    //you can look one way and pushed another way
    this.velocity_direction = new THREE.Vector3(0,0,0);
    this.vec = new THREE.Vector3();
    
    this.old_parent_position = new THREE.Vector3();
    this.new_parent_position = new THREE.Vector3();
    this.parent = null;
}

rigidbody.prototype.set_parent = function(p){
    this.parent = p;
};

rigidbody.prototype.update = function(delta){
        var sign = 1;
            
        if(this.parent.get_component("aabb").colliding){
            //this.velocity.z *= 0.7;
            //this.velocity.x *= 0.7;
            sign = -1.01;
        } else {
            sign = 1;

        }

        //drag --------------------
        this.velocity.x -= this.velocity.x * (10.0) * delta;
        this.velocity.z -= this.velocity.z * (10.0) * delta;
        this.velocity.y -= 9.8 * (20.0) * delta; // 100.0 = mass
        //drag -------------------

        //TODO: Tweak threshhold value
        var z = (this.velocity.z * sign);
        var x = (this.velocity.x * sign); 

        this.old_parent_position = this.parent.transform.position.clone();

        //update the collider before the actaul gameobject
        //that way it can check collision in advance
        this.update_aabb_position(delta);
        this.forward(z * delta);
        this.right(x* delta);

        this.parent.transform.position.y += ( this.velocity.y * delta ); 
        

        this.new_parent_position = this.parent.transform.position.clone();
        //------------------ Capture New Position ------------------ 
    
        this.velocity_direction = (this.new_parent_position.sub(this.old_parent_position)).clone().normalize();
        
        //*-------------------- Cap Direction -----------------------
        if(Math.abs(this.velocity_direction.x) < 0.01){this.velocity_direction.x = 0;}
        if(Math.abs(this.velocity_direction.z) < 0.01){this.velocity_direction.z = 0;}

        if(Math.abs(this.velocity.x) < 0.01){this.x = 0;}
        if(Math.abs(this.velocity.z) < 0.01){this.z = 0;}

        //*-------------------- Cap Direction -----------------------

        //should be connected with collider here
        //means rigid bodies and colliders are interlinked
        if (this.parent.transform.position.y <= 0) {
            this.velocity.y = 0;
            this.parent.transform.position.y = 0;
        }


}

rigidbody.prototype.forward = function(distance){
    var z = this.parent.transform.rotation.get_forward();
    this.parent.transform.position.addScaledVector(z, distance);
}

rigidbody.prototype.right = function(distance){
    var x = this.parent.transform.rotation.get_left();
    this.parent.transform.position.addScaledVector(x, distance);
}

rigidbody.prototype.backward = function(distance){
    var z = this.parent.transform.rotation.get_back();
    this.parent.transform.position.addScaledVector(z, distance);
}

rigidbody.prototype.left = function(distance){
    var x = this.parent.transform.rotation.get_right();
    this.parent.transform.position.addScaledVector(x, distance);
}

rigidbody.prototype.update_aabb_position = function(delta){
    var pos_clone = this.parent.transform.position.clone();
    var col = this.parent.get_component("aabb");

    var z = this.parent.transform.rotation.get_forward();
    var x = this.parent.transform.rotation.get_left();
    //var y = this.parent.transform.rotation.get_down();

    var projection_mag = 1.25; //! 1 second in the future? or .1 steps in the future?

    pos_clone.addScaledVector(z, (this.velocity.z * projection_mag) * delta);
    pos_clone.addScaledVector(x, (this.velocity.x * projection_mag) * delta);
    //pos_clone.addScaledVector(y, (this.velocity.y * projection_mag) * delta);
 
    col.direct_position_set(pos_clone);
}

// Get current direction of velocity with added direction from rotation
rigidbody.prototype.get_direction = function(delta){
    return this.direction.clone();
}

// Get current direction of velocity with added direction from rotation
rigidbody.prototype.get_flip_direction = function(delta){
    return this.direction.clone().negate();
}

rigidbody.prototype.get_negated_velocity = function(){
    return this.velocity.clone().negate();
}

rigidbody.prototype.get_magnitude = function(){
    return this.velocity.length();
}

rigidbody.prototype.set_velocity = function(v){
    this.velocity = v.clone();
}

// f : force
// d : direction
rigidbody.prototype.add_force = function(f, d){
    d.normalize();
    this.velocity.x += f * d.x;
    this.velocity.y += f * d.y;
    this.velocity.z += f * d.z;
}

//push transform without velocity
rigidbody.prototype.rigid_push = function(f, d, delta){
   //this.velocity.z += 10 * this.direction.z * delta;
} 

//Rigid body force transfering, called by colliders
//the less the body knows about the body the better
rigidbody.prototype.transfer_force = function(r){
    var direction = r.direction.clone().normalize();
    direction.x *= -1;

    this.add_force(r.get_magnitude()/2, direction);
}

rigidbody.prototype.update_transform = function(delta){
    this.parent.transform.position.x += this.velocity.x * delta;
    this.parent.transform.position.y += this.velocity.y * delta;
    this.parent.transform.position.z += this.velocity.z * delta;
}


rigidbody.prototype.name = "rigidbody";