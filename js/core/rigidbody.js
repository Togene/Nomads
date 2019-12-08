
var cutoff = 0.0001;

function rigidbody(mass, isKin){
    this.mass = mass;
    this.isKinematic = isKin;
    
    this.acceleration = new THREE.Vector3(0,0,0);
    this.velocity = new THREE.Vector3(0,0,0);
    
    //where he looks and where he goes are diffrent
    //you can look one way and pushed another way
    this.direction = new THREE.Vector3(0,0,0);
    this.vec = new THREE.Vector3();
    this.parent = null;
}

rigidbody.prototype.set_parent = function(p){
    this.parent = p;
};

rigidbody.prototype.update = function(delta){

    //drag --------------------
    this.velocity.x -= this.velocity.x  * 10.0 * delta;
    this.velocity.z -= this.velocity.z  * 10.0 * delta;

    //air drag
    this.velocity.y -= this.velocity.y  * 10.0 * delta;
    //drag -------------------

    this.forward(this.velocity.z * delta);
    this.right(this.velocity.x * delta);
}

rigidbody.prototype.get_direction = function(){
    return this.direction;
}

rigidbody.prototype.forward = function(distance){
    var z = this.parent.transform.rotation.get_forward();
    this.parent.transform.position.addScaledVector(z, distance);
}

rigidbody.prototype.right = function(distance){
    var x = this.parent.transform.rotation.get_left();
    this.parent.transform.position.addScaledVector(x, distance);
}

rigidbody.prototype.get_flip_direction = function(){
    
    var flipped_dir = this.velocity.clone();

    flipped_dir.z *= -1;
    flipped_dir.x *= -1;

    return flipped_dir;
}

rigidbody.prototype.get_magnitude = function(){
    return velocity.length();
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

rigidbody.prototype.update_transform = function(delta){
    var collider = this.parent.get_component("aabb");

    if(!collider.colliding){
        this.parent.transform.position.x += this.velocity.x * delta;
        this.parent.transform.position.y += this.velocity.y * delta;
        this.parent.transform.position.z += this.velocity.z * delta;
    }
}


rigidbody.prototype.name = "rigidbody";