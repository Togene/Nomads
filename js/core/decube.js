function decube(p0, p1, p2, p3){
    var geometry = new THREE.BoxGeometry( .05, .05, .05 );
    var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    
    
    this.p0 = new THREE.Mesh( geometry, material );
    this.p0.position.copy(p0);
    this.p1 = new THREE.Mesh( geometry, material );
    this.p1.position.copy(p1);
    this.p2 = new THREE.Mesh( geometry, material );
    this.p2.position.copy(p2);
    this.p3 = new THREE.Mesh( geometry, material );
    this.p3.position.copy(p3);

    scene.add( this.p0 );
    scene.add( this.p1 );
    scene.add( this.p2 );
    scene.add( this.p3 );
}

decube.prototype.set_parent = function(p){
    this.parent = p;
};

decube.prototype.update = function(delta){

}
