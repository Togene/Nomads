function sphere(transform, r, trigger){
    var transform_clone = transform.clone();
    transform_clone.scale = new THREE.Vector3(1,1,1);

    this.centre = transform.get_transformed_position().clone();
    this.radius = r;

    this.parent = null;

    this.colliding = false;
    this.isTrigger = trigger;

    var geometry = new THREE.SphereGeometry( r, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    this.sphere_debug = new THREE.Mesh( geometry, material );
    this.sphere_debug.position.copy(this.centre);
    this.sphere_debug.material.wireframe = true;
    this.sphere_debug.material.transparent = true;
    this.sphere_debug.visible = false;
    console.log("huh?");

    scene.add( this.sphere_debug );
}

sphere.prototype.set_colliding = function(bool){
    this.colliding = bool;
}

sphere.prototype.set_visule_color = function(hex){
    //this.visule.material.color = new THREE.Color(hex);
    this.sphere_debug.material.color = new THREE.Color(hex);
}

sphere.prototype.update = function(delta){
    var transform_clone = this.parent.transform.clone();
    transform_clone.scale = new THREE.Vector3(1,1,1);

    this.centre = transform_clone.get_transformed_position().clone();
    this.sphere_debug.position.copy(this.centre);

    if(this.colliding){
        this.set_visule_color(0xff0000);
    } else {
        this.set_visule_color(0xFFFFFF);
    }
}

sphere.prototype.set_parent = function(p){
    this.parent = p;
};

sphere.prototype.name = "sphere";