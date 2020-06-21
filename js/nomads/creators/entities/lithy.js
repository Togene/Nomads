function lithy_create(p, q){
    var npc = new gameobject("npc", 
    new THREE.Vector3
    (
        p.x,
        p.y,
        p.z
    ));

    var npc_decomposer = new decomposer(
        get_meta().lithy,
        SPRITE,
        DYNAMIC_BUFFER, 
        DYNAMIC_ATTRIBUTES,
    );

    //npc.add_component(new rigidbody(0, false));
    npc.add_component(npc_decomposer);
    npc.add_component(
        anim =  new animator([
            new animation_sequence("idle", [new animation("idle", 0, 4)], 8, true),
            new animation_sequence("wave", [new animation("wave", 4, 2)], 8, true), 
        ], 
        npc_decomposer));


    return npc;
}
