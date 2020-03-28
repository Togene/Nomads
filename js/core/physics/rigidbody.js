
var cutoff = 0.0001;
var godmode = false;
var bugs = [] //* anything currently stuck to this body
var min_vel = 0.5;

const GRAVITY = 6.8;
const GRAVITY_ACC = 10;

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
    this.colliding = false;
    this.grounded = false;
}

rigidbody.prototype.set_parent = function(p){
    this.parent = p;
};

rigidbody.prototype.update = function(delta){
    var col = player.get_component("aabb");

        //*-------------------- Caps -----------------------
        this.cap(delta);
        //*-------------------- Caps -----------------------

        this.old_parent_position = this.parent.transform.position.clone();

        if(col.colliding){

        } else {
            //drag --------------------
            this.velocity.x -= this.velocity.x * (10.0) * delta;
            this.velocity.z -= this.velocity.z * (10.0) * delta;
            //drag -------------------
        }

        //update the collider before the actaul gameobject
        //that way it can check collision in advance
        //this.update_aabb_position(delta);
        //col.set_projection(new THREE.Vector3(1.1, 1.1, 1.1));
        this.step(delta);

        this.new_parent_position = this.parent.transform.position.clone();
        //------------------ Capture New Position ------------------ 
    
        this.velocity_direction = this.new_parent_position.sub(this.old_parent_position).clone().normalize();

        //should be connected with collider here
        //means rigid bodies and colliders are interlinked
        if (this.parent.transform.position.y <= -50) {
            this.velocity.y = 0;
            this.parent.transform.position.y = 10;
        } else {
            if(!this.grounded){
                this.velocity.y -= (GRAVITY * GRAVITY_ACC) * delta;
            } else {
                //this.velocity.y = 0;
            }
        }   

        //*-------------------- Caps -----------------------
        this.cap(delta);
        //*-------------------- Caps -----------------------
}

rigidbody.prototype.get_step_y = function(delta){
    return (GRAVITY * GRAVITY_ACC) * delta;
}

rigidbody.prototype.cap = function(delta){
    if(Math.abs(this.velocity_direction.x) < 0.2){this.velocity_direction.x = 0;}
    if(Math.abs(this.velocity_direction.z) < 0.2){this.velocity_direction.z = 0;}
    if(Math.abs(this.velocity_direction.y) < 0.2){this.velocity_direction.y = 0;}
    
    if(Math.abs(this.velocity.x) < 0.1){this.velocity.x = 0;}
    if(Math.abs(this.velocity.z) < 0.1){this.velocity.z = 0;}
    if(Math.abs(this.velocity.y) < 0.1){this.velocity.y = 0;}

    //if(this.parent.name == "player")
    //    console.log(this.velocity);
}

rigidbody.prototype.step = function(delta){
    this.forward(-(this.velocity.z * delta));
    this.right(-(this.velocity.x * delta));
    this.parent.transform.position.y += (this.velocity.y * delta); 
}

//grab a vector with velocity's added
rigidbody.prototype.get_step = function(vec, delta){
    this.add_forward(vec, -(this.velocity.z * delta));
    this.add_right(vec, -(this.velocity.x * delta));
    vec.y += (this.velocity.y * delta); 
    return vec;
}

//grab a vector with velocity's added
rigidbody.prototype.reverse_step = function(vec, delta){

    this.add_forward(vec, (this.velocity.z * delta));
    this.add_right(vec, (this.velocity.x * delta));
    vec.y -= (this.velocity.y * delta); 

    return vec;
}

rigidbody.prototype.add_forward = function(v, distance){
    var vec = new THREE.Vector3();
    vec.setFromMatrixColumn( camera.matrix, 0 );
    vec.crossVectors( camera.up, vec );

    v.addScaledVector(vec, distance);
}

rigidbody.prototype.add_right = function(v, distance){
    var vec = new THREE.Vector3();
    vec.setFromMatrixColumn( camera.matrix, 0 );
    v.addScaledVector(vec, distance);
}


rigidbody.prototype.forward = function(distance){
    var vec = new THREE.Vector3();
    vec.setFromMatrixColumn( camera.matrix, 0 );
    vec.crossVectors( camera.up, vec );
    this.parent.transform.position.addScaledVector(vec, distance);
}


rigidbody.prototype.right = function(distance){
    var vec = new THREE.Vector3();
    vec.setFromMatrixColumn( camera.matrix, 0 );
    this.parent.transform.position.addScaledVector(vec, distance);
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

    var forward = new THREE.Vector3();
    forward.setFromMatrixColumn( camera.matrix, 0 );
    forward.crossVectors( camera.up, forward );

    var right = new THREE.Vector3();
    right.setFromMatrixColumn( camera.matrix, 0 );

    var pos_clone = this.parent.transform.position.clone();
    var col = this.parent.get_component("aabb");

    var projection_mag = 1.1; //! 1 second in the future? or .1 steps in the future?

    pos_clone.addScaledVector(forward, -((this.velocity.z * projection_mag) * delta));
    pos_clone.addScaledVector(right, -((this.velocity.x * projection_mag) * delta));
    pos_clone += (this.velocity.y * delta);
 
    col.direct_position_set(pos_clone);
}

// Get current direction of velocity with added direction from rotation

rigidbody.prototype.get_direction = function(){
    return this.velocity.clone().normalize();
}
// Get current direction of velocity with added direction from rotation
rigidbody.prototype.get_flip_direction = function(){
    return this.get_direction().negate().normalize();
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
rigidbody.prototype.add_force = function(f, d, delta){
    d.normalize();

    if(Math.abs(d.z) < 0.05){d.z = 0;}
    if(Math.abs(d.x) < 0.05){d.x = 0;}

    this.velocity.x += (f) * d.x;
    this.velocity.y += (f) * d.y;
    this.velocity.z += (f) * d.z;
}

rigidbody.prototype.ground = function(y, isplayer){

    var diffrence = Math.abs(this.parent.transform.position.y - y);
    var col = this.parent.get_component("aabb");
   
    //! .1 + collider size (which is 1)
    if(diffrence < (col.h + .1)){

        this.parent.transform.position.y = y + ( this.parent.transform.scale.y/2 + .01);
        this.velocity.y = 0;

        if(isplayer) {
            canJump = true;
        }
    }
}

rigidbody.prototype.set_grounded = function(bool){
    this.grounded = bool;
}

rigidbody.prototype.flip_velocity = function(normal, delta){

   // console.log("poop", normal, vec_test);

    if(Math.abs(this.velocity.z) < 1){
       // this.velocity.z -= get_step_z();
    }

    if(Math.abs(this.velocity.x) < 1){
       // this.velocity.x -= get_step_x();
    }

    this.velocity.z *= -1.1;
    this.velocity.x *= -1.1;
    //this.velocity.y *= -(1);
}

//good for water/climbing
rigidbody.prototype.null_velocity = function(delta, null_y){
    this.velocity.z -= this.velocity.z;
    this.velocity.x -= this.velocity.x;
    this.null_y(delta);
}

rigidbody.prototype.null_y = function(delta){
    this.velocity.y = 0;
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