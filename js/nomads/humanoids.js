var test_npcs = [];

function TestNPC(){
    var npc_shader = get_data("instance_shader");
    var buffer = create_buffer();
    var attributes = [];

    var num_npcs = 0;
    var spacing = 3;

    for(var i = 0; i < num_npcs; i++){
        for(var j = 0; j < num_npcs; j++){

        var npc = new gameobject("npc");
                        
        test_npcs.push(npc);

        var x = (i * spacing) - (num_npcs/2) * spacing;
        var z = (j * spacing) - (num_npcs/2) * spacing;
            
        npc.transform.position = new THREE.Vector3(x + 20, 0, z + 20);
        npc.transform.rotation = new quaternion(0, 0, 0, 1 );
        npc.transform.scale = new THREE.Vector3(1,1,1);

        var npc_decomposer = new decomposer(
            [ MapToSS(0, 0),],
            new THREE.Vector2(1, 1),
            [ new THREE.Color(0xffffff) ],
            new THREE.Vector3(0, 0, 0),
           npc.transform,
           0,
           attributes,
           buffer.index,
        );

        npc.add_component(new aabb(npc.transform, .5, .5, .5, true, 0x00FF00, true));
        npc.add_component(new rigidbody(1, false));
        npc.add_component(npc_decomposer);
        npc.add_component(new ray(npc.transform.position, new THREE.Vector3(0, -1, 0)));
            
        PopulateBuffer(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 0), 
            npc.transform.scale,
            buffer, 
            npc_decomposer);
        }
    }

    CreateInstance(
    "Test", 
    animated_sprites, 
    buffer, 
    attributes, 
    SpriteSheetSize, 
    npc_shader, 
    4, 
    true, 
    true);
}

function humanoid_update(delta){

    if(test_npcs.length != 0){
        for(var i = 0; i < test_npcs.length; i++){
        }
    }

}