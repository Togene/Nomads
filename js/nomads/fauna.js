var test_crabs = [];

function TestCreatures(){
    var crab_shader = get_data("instance_shader");
    var buffer = create_buffer();
    var attributes = [];

    var num_crabs = 0;
    var spacing = 3;

    for(var i = 0; i < num_crabs; i++){
        for(var j = 0; j < num_crabs; j++){

        var crab = new gameobject("crab");
                        
        test_crabs.push(crab);

        var x = (i * spacing) - (num_crabs/2) * spacing;
        var z = (j * spacing) - (num_crabs/2) * spacing;
            
        crab.transform.position = new THREE.Vector3(x + 20, 0, z + 20);
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

        crab.add_component(new aabb(crab.transform, .5, .5, .5, true, 0x00FF00, true));
        crab.add_component(new rigidbody(1, false));
        crab.add_component(crab_decomposer);
        crab.add_component(new ray(crab.transform.position, new THREE.Vector3(0, -1, 0)));
            
        PopulateBuffer(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 0), 
            crab.transform.scale,
            buffer, 
            crab_decomposer);
        }
    }

    CreateInstance(
    "Test", 
    animated_sprites, 
    buffer, 
    attributes, 
    sprite_sheet_size , 
    crab_shader, 
    0, 
    true, 
    false);
}

function fauna_update(delta){

    if(test_crabs.length != 0){
        for(var i = 0; i < test_crabs.length; i++){
        }
    }

}