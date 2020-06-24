function crab_create(p, q){
    var crab = new gameobject("crab", p, new THREE.Vector3(1,1,1), q);

    //crab.add_component(new rigidbody(1, false));

    crab.add_component(crab_decomposer = new decomposer(
        get_meta().crab,
        SPRITE,
        CRAB_RENDERER
    ));
    
    crab.add_component(new animator([
            new animation_sequence("walk", [new animation("walk", 0, 3)], 2, true), 
            new animation_sequence("death", [ new animation("dead_start", 3, 3), 
            new animation("dead_end", 6, 1)], 2, false)
        ]));

    return crab;
}

