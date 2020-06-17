function lithy_create(p, q){
    var npc_shader = get_data("instance_shader");
    var meta = get_meta();
    
    var npc = new gameobject("npc", 
    new THREE.Vector3(
        p.x,
        p.y + 5,
        p.z
    ));

    var npc_decomposer = new decomposer(
        [ MapToSS(0, 0),],
        new THREE.Vector2(1, 1),
        [ new THREE.Color(0xffffff) ],
        new THREE.Vector3(0, 0, 0),
        SPRITE,
        DYNAMIC_BUFFER
    );

    npc.add_component(new rigidbody(1, false));
    npc.add_component(npc_decomposer);

    npc.add_component(anim =  new animator([
            new animation_sequence("idle", [new animation("idle", 0, 4)], 8, true),
            new animation_sequence("wave", [new animation("wave", 4, 2)], 8, true), 
        ], 
        npc_decomposer));

    create_instance (
        ANIMATED_SPRITES, 
        DYNAMIC_BUFFER, 
        npc_decomposer.attributes_refrence, 
        npc_shader, 
        4, 
        true, 
        true
    );

    return npc;
}
