function edge(m, v0, v1){
    this.v0 = v0;
    this.v1 = v1;

    this.max = m;
}

edge.prototype.get_vector = function(){
    return this.v1.clone().sub(this.v0);
}

edge.prototype.dot = function(n){
    var vec = this.v1.clone().sub(this.v0);

    return vec.dot(n);
}

edge.prototype.normalize = function(){
    var vec = this.v1.clone().sub(this.v0).normalize();
    this.v1.copy(vec);
}

edge.prototype.clone = function(){
    return new edge(this.max, this.v0, this.v1);
}

edge.prototype.negate = function(){
    return new edge(this.max, this.v0, this.v1.negate());
}

edge.prototype.cross = function(s){
    var vec = this.v1.clone().sub(this.v0).normalize();
    vec.cross(new THREE.Vector3(0,0,s));
    return vec;
}

edge.prototype.name = "edge";