
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
    //directly update transform position here <--
    this.update_transform(delta);
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