function lithy_create(p, q){
    var npc_shader = get_data("instance_shader");
    //var buffer = new instance_buffer();

    var npc = new gameobject("npc");
       
    npc.transform.position = new THREE.Vector3(
        p.x,
        p.y + npc.transform.scale.y/2,
        p.z
    );

    var npc_decomposer = new decomposer(
        [ MapToSS(0, 0),],
        new THREE.Vector2(1, 1),
        [ new THREE.Color(0xffffff) ],
        new THREE.Vector3(0, 0, 0),
        SPRITE,
        DYNAMIC_BUFFER.get_index(),
    );

    npc.add_component(new rigidbody(1, false));
    npc.add_component(npc_decomposer);

    npc.add_component(anim =  new animator([
            new animation_sequence("idle", [new animation("idle", 0, 4)], 8, true),
            new animation_sequence("wave", [new animation("wave", 4, 2)], 8, true), 
        ], 
        npc_decomposer));

    DYNAMIC_BUFFER.append (
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0), 
        new THREE.Vector3(1, 1, 1),
        npc_decomposer
    );

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
