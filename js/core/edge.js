function edge(m, v0, v1){
    this.v0 = v0;
    this.v1 = v1;

    this.max = m;
}

edge.prototype.get_vector = function(){
    return this.v1.clone().sub(this.v0);
}

//this is correct
edge.prototype.dot = function(n){
    var vec = this.v1.clone().sub(this.v0).normalize();

    return vec.dot(n);
}

edge.prototype.normalize = function(){
    var vec = this.v1.clone().sub(this.v0).normalize();
    this.v1.copy(vec);
}

edge.prototype.clone = function(){
    return new edge(this.max.clone(), this.v0.clone(), this.v1.clone());
}

edge.prototype.debug = function(hex){
    var geometry = new THREE.BoxGeometry( .1, .1, .1 );
    var material = new THREE.MeshBasicMaterial( {color: hex} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.copy(this.v0);
    scene.add( cube );

    var geometry = new THREE.BoxGeometry( .1, .1, .1 );
    var material = new THREE.MeshBasicMaterial( {color: hex} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.copy(this.v1);
    scene.add( cube );
}

edge.prototype.get_edge_normal = function(){
    var vec = this.v1.clone().cross(this.v0).normalize();
    console.log(vec);
    return vec;
}

edge.prototype.name = "edge";