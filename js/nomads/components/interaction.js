function interaction(trigger){
    
    this.parent = null;
    this.trigger = trigger;
    this.look_arrow = new THREE.ArrowHelper( 
        new THREE.Vector3(),
        new THREE.Vector3(),
        1, 0x00ff00 );

    scene.add( this.look_arrow );
}

interaction.prototype.update = function(delta){
    if(this.trigger.colliding){
        console.log("Hey There! my name is " + this.parent.name);
    }
    //this.parent.transform.rotation.y += .01;
    var new_rot = this.parent.transform.get_look_direction(
        player.transform.position, 
        new THREE.Vector3(0, 1, 0), true);
    
    this.parent.transform.rotation = this.parent.transform.rotation.slerp(new_rot, delta*5, true)
    
    this.look_arrow.position.copy(this.parent.transform.position);

    this.look_arrow.setDirection(this.parent.transform.get_transformed_rotation().get_forward());
}

interaction.prototype.set_parent = function(p){
    this.parent = p;
};

interaction.prototype.name = "interaction";