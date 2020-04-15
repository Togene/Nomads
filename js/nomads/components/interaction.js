function interaction(trigger){
    
    this.parent = null;
    this.trigger = trigger;
    this.look_arrow = new THREE.ArrowHelper( 
        new THREE.Vector3(),
        new THREE.Vector3(),
        1, 0x00ff00 );

    scene.add( this.look_arrow );

    this.dailogue = create_dailogue("Hey There!",
    { 
        fontsize: 22, borderColor: {r:0, g:0, b:0, a:1.0}, 
    backgroundColor: {r:0, g:0, b:0, a:1.0} } );
   
    scene.add(this.dailogue);

    this.dailogue.visible = false;
}

interaction.prototype.update = function(delta){
    //if(this.trigger.colliding){
//
    //    var anim = this.parent.get_component("animator");
//
    //    if(anim != null){
    //        if(anim.get_current_index() != 1){
    //            anim.set_animation_sequence(1);
    //        }
    //    }
//
    //    this.dailogue.visible = true;
    //    this.dailogue.position.copy(this.parent.transform.position);
    //    this.dailogue.position.y += .5;
//
    //    var e = new THREE.Vector3(
    //        player.transform.position.x, 
    //        this.parent.transform.position.y, 
    //        player.transform.position.z);
//
    //    this.parent.transform.look_at(e, new THREE.Vector3(0, 1, 0), true);
//
    //    //this.look_arrow.position.copy(this.parent.transform.position);
//
    //   // this.look_arrow.setDirection(this.parent.transform.rotation.get_forward());
    //} else {
    //    this.dailogue.visible = false;
//
    //    var anim = this.parent.get_component("animator");
//
    //    if(anim != null){
    //        if(anim.get_current_index() != 0){
    //            anim.set_animation_sequence(0);
    //        }
    //    }
    //}

}

interaction.prototype.set_parent = function(p){
    this.parent = p;
};



interaction.prototype.name = "interaction";