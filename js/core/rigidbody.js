
var cutoff = 0.0001;
var godmode = false;

function rigidbody(mass, isKin){
    this.mass = mass;
    this.isKinematic = isKin;
    
    this.acceleration = new THREE.Vector3(0,0,0);
    this.velocity = new THREE.Vector3(0,0,0);

    //where he looks and where he goes are diffrent
    //you can look one way and pushed another way
    this.direction = new THREE.Vector3(0,0,0);
    this.vec = new THREE.Vector3();
    
    this.old_parent_position = new THREE.Vector3();
    this.new_parent_position = new THREE.Vector3();
    this.parent = null;
}

rigidbody.prototype.set_parent = function(p){
    this.parent = p;
};

rigidbody.prototype.update = function(delta){

    if(!this.parent.get_component("aabb").colliding){
            //drag --------------------
            this.velocity.x -= this.velocity.x * 10.0 * delta;
            this.velocity.z -= this.velocity.z * 10.0 * delta;
            this.velocity.y -= 9.8 * 20.0 * delta; // 100.0 = mass
        //drag -------------------
    
        this.old_parent_position = this.parent.transform.position.clone();
    
        this.forward(this.velocity.z * delta);
        this.right(this.velocity.x * delta);
        this.parent.transform.position.y += ( this.velocity.y * delta ); 
        
        this.new_parent_position = this.parent.transform.position.clone();
    
    
        this.direction = this.new_parent_position.clone().sub(this.old_parent_position).normalize();
    
        if(Math.abs(this.direction.x) < 0.01){this.direction.x = 0;}
        if(Math.abs(this.direction.z) < 0.01){this.direction.z = 0;}
    
        //should be connected with collider here
        //means rigid bodies and colliders are interlinked
        if ( this.parent.transform.position.y <= 0  && !godmode) {
            this.velocity.y = 0;
            this.parent.transform.position.y = 0;
        }

    } else {
        console.log("def colliding");
        //this.velocity.x = 0;
        //this.velocity.z = 0;
        //this.velocity.y = 0;
    }

}

rigidbody.prototype.forward = function(distance){
    var z = this.parent.transform.rotation.get_forward();
    z.y = 0;
    this.parent.transform.position.addScaledVector(z, distance);
}

rigidbody.prototype.right = function(distance){
    var x = this.parent.transform.rotation.get_left();
    x.y = 0;
    this.parent.transform.position.addScaledVector(x, distance);
}

rigidbody.prototype.get_direction = function(){
    var dir = this.direction.clone();

    dir.x *= -1;
    
    return dir;
}

rigidbody.prototype.get_flip_direction = function(){
    var dir = this.direction.clone();

    dir.x *= -1;

    return dir.negate();
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

rigidbody.prototype.update_transform = function(delta){
    this.parent.transform.position.x += this.velocity.x * delta;
    this.parent.transform.position.y += this.velocity.y * delta;
    this.parent.transform.position.z += this.velocity.z * delta;
}


rigidbody.prototype.name = "rigidbody";