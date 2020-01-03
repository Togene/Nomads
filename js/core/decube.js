function decube(c, min, max, w, d, h){

    this.min = min;
    this.max = max;

    this.dimensions = new THREE.Vector3(w, h, d);

    this.t = new transform(
        new THREE.Vector3().copy(c),
        new THREE.Vector3(1,1,1),
        new quaternion(0,0,0,1),
    );

    var geometry = new THREE.BoxGeometry( .05, .05, .05 );
    var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    
    this.p0 = new THREE.Mesh( geometry, material );
    //this.p1 = new THREE.Mesh( geometry, material );
    //this.p2 = new THREE.Mesh( geometry, material );
    //this.p3 = new THREE.Mesh( geometry, material );
    //this.p4 = new THREE.Mesh( geometry, material );
    //this.p5 = new THREE.Mesh( geometry, material );
    //this.p6 = new THREE.Mesh( geometry, material );
    this.p7 = new THREE.Mesh( geometry, material );

    this.update_points();

    scene.add(this.p0);
    //scene.add(this.p1);
    //scene.add(this.p2);
    //scene.add(this.p3);
    //scene.add(this.p4);
    //scene.add(this.p5);
    //scene.add(this.p6);
    scene.add(this.p7);
}

decube.prototype.set_parent = function(p){
    this.parent = p;
};

decube.prototype.update = function(t, delta){
    this.t = t.clone();
    this.update_points();
}

decube.prototype.update_points = function(){

    this.t.scale = new THREE.Vector3(1,1,1);

    this.min = new THREE.Vector3(
        -this.dimensions.x,
        -this.dimensions.y,
        -this.dimensions.z
    );

    this.min.applyMatrix4 (this.t.get_transformation().toMatrix4());
    //console.log(this.min);

    this.max = new THREE.Vector3(
        this.dimensions.x,
        this.dimensions.y,
        this.dimensions.z
    );

    this.max.applyMatrix4 (this.t.get_transformation().toMatrix4());

    this.p0.position.copy(new THREE.Vector3(
        this.min.x,
        this.min.y,
        this.min.z
    ));

    this.p7.position.copy(new THREE.Vector3(
        this.max.x,
        this.max.y,
        this.max.z
    ));

    //this.p1.position.copy(   new THREE.Vector3(
    //    this.min.x,
    //    this.min.y,
    //    this.dimensions.z
    //));
    //this.p2.position.copy(   new THREE.Vector3(
    //    this.t.position.x + this.dimensions.x,
    //    this.min.y,
    //    this.min.z
    //));
    //this.p3.position.copy(  new THREE.Vector3(
    //    this.t.position.x + this.dimensions.x,
    //    this.min.y,
    //    this.t.position.z + this.dimensions.z
    //));
//
    //this.p4.position.copy(  new THREE.Vector3(
    //    this.max.x,
    //    this.max.y,
    //    this.max.z
    //));
    //this.p5.position.copy(  new THREE.Vector3(
    //    this.max.x,
    //    this.max.y,
    //    this.t.position.z - this.dimensions.z
    //));
    //this.p6.position.copy(  new THREE.Vector3(
    //    this.t.position.x - this.dimensions.x,
    //    this.max.y,
    //    this.t.position.z - this.dimensions.z
    //));
    //this.p7.position.copy( 
    //    new THREE.Vector3(
    //        this.t.position.x - this.dimensions.x,
    //        this.max.y,
    //        this.max.z
    //    ));

}