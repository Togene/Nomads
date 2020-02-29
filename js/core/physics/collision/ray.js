function ray(origin, direction){
    this.origin = origin;
    this.direction = direction;
    this.intersecting = false;
}

ray.prototype.set_intersecting = function(b){
    this.intersecting = b;
}

ray.prototype.set_parent = function(p){
    this.parent = p;
};

ray.prototype.update = function(delta){
    if(this.parent != null){
        var p = this.parent.transform.position;
        if(!p.equals(this.origin)){
            this.origin.copy(p);
        }
    }
}

ray.prototype.origin_set = function(o){ 
    if(!(o instanceof THREE.Vector3)){
        console.error("Must be THREE.Vector3")
    } else {
        this.origin.copy(o);
    }
}

ray.prototype.origin_add = function(o){
    if(!(o instanceof THREE.Vector3)){
        console.error("Must be THREE.Vector3")
    } else {
        this.origin.add(o);
    }
}

ray.prototype.direction_set = function(d){    
    if(!(o instanceof THREE.Vector3)){
        console.error("Must be THREE.Vector3")
    } else {
        this.origin.copy(d);
    }
}


ray.prototype.name = "ray";