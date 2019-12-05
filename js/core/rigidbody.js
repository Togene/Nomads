
function rigidbody(mass, isKin){
    this.mass = mass;
    this.isKinematic = isKin;
    
    this.acceleration = new THREE.Vector3(0,0,0);
    this.velocity = new THREE.Vector3(0,0,0);

    this.parent = null;
}

rigidbody.prototype.set_parent = function(p){
    this.parent = p;
};

rigidbody.prototype.update = function(delta){

    //drag --------------------
        this.velocity.x *= 0.96;
        this.velocity.y *= 0.96;
        this.velocity.z *= 0.96;
    //drag -------------------

    //directly update transform position here <--
    this.update_transform(delta);
}

rigidbody.prototype.get_direction = function(){
    return this.velocity.normalize();
}

rigidbody.prototype.get_flip_direction = function(){
    return this.velocity.setScalar(-1).normalize();
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
    //console.log("Force");
    d.normalize();
    this.velocity.x += f * d.x;
    this.velocity.y += f * d.y;
    this.velocity.z += f * d.z;

    //console.log(this.velocity);
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