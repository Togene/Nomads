function edge (v, v0, v1, face){
    this.max = v;
    this.v0 = v0;
    this.v1 = v1;

    this.face = face;

    var d = new THREE.Vector3();
   // this.normal_arrow = new THREE.ArrowHelper( d, d, .25, 0x00FF00 );
   // this.normal_arrow.visible = false;
    //this.normal_arrow.cone.visible = false;
   // scene.add( this.normal_arrow );
}

edge.prototype.get_vector = function(){
    return this.v1.clone().sub(this.v0);
}

edge.prototype.dot = function(n){
    return this.get_vector().dot(n);
}

edge.prototype.get_centre = function(){
    return this.v1.clone().add(this.v0).multiplyScalar(0.5);
}

edge.prototype.clean_up = function(n){
    if(Math.abs(n.y) < 0.0001){n.y = 0;}
    if(Math.abs(n.z) < 0.0001){n.z = 0;}
    if(Math.abs(n.x) < 0.0001){n.x = 0;}

    return n;
}

edge.prototype.get_normal = function(c){
    var centre = this.get_centre();
    return this.clean_up(centre.clone().sub(c).normalize());
}

edge.prototype.face_normal = function(){
    return this.face.n;
}

edge.prototype.debug_normal = function(c){
   // this.normal_arrow.visible = true;
   // this.normal_arrow.position.copy(this.get_centre());
   // this.normal_arrow.setDirection(this.get_normal(c));
}

edge.prototype.name = "edge";