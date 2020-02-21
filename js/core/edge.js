function edge (v, v0, v1, face){
    this.max = v;
    this.v0 = v0;
    this.v1 = v1;

    this.face = face;
}

edge.prototype.get_vector = function(){
    return this.v1.clone().sub(this.v0);
}

edge.prototype.dot = function(n){
    return this.get_vector().dot(n);
}

edge.prototype.normal = function(){
    return this.face.n;
}