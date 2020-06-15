function crab_create(){
    var crab_shader = get_data("instance_shader");
    var buffer = create_buffer();
    var attributes = [];

    var crab = new gameobject("crab");
                    
    crab.transform.position = new THREE.Vector3(0, 0, 0);
    crab.transform.rotation = new quaternion(0, random_range(-45, 45), 0, 1);
    crab.transform.scale = new THREE.Vector3(1,1,1);

    var crab_decomposer = new decomposer(
        [ MapToSS(0, 0),],
        new THREE.Vector2(3, 1),
        [ new THREE.Color(0xff5a5b) ],
        new THREE.Vector3(0, 0, 0),
        crab.transform,
        0,
        attributes,
        buffer.index,
    );

    crab.add_component(new rigidbody(1, false));
    crab.add_component(crab_decomposer);
    
    var anim;

    crab.add_component(anim =  new animator(
        [
            new animation_sequence("walk", [new animation("walk", 0, 3)], 2, true), 
            new animation_sequence("death", [ new animation("dead_start", 3, 3), new animation("dead_end", 6, 1)], 2, false)
        ], 
        crab_decomposer));

    PopulateBuffer(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0), 
        crab.transform.scale,
        buffer, 
        crab_decomposer,
        anim.current_animation,
    );

    //CreateInstance(
    //animated_sprites, 
    //buffer, 
    //attributes, 
    //sprite_sheet_size , 
    //crab_shader, 
    //0, 
    //true, 
    //false);

    return crab;
}

