function structures_init(){

}

var floor;

function TestStructures(){
    var floor_shader = get_data("instance_shader");
    var buffer = create_buffer();
    var attributes = [];

    var floor_grid_size = 100;
    var spacing = 2;

    floor = new gameobject("floor");

    for(var i = 0; i < floor_grid_size; i++){
        for(var j = 0; j < floor_grid_size; j++){

            var floor_square = new gameobject("floor_square");

            var x = (i * spacing) - (floor_grid_size/2) * spacing;
            var z = (j * spacing) - (floor_grid_size/2) * spacing;

            floor_square.transform.position = new THREE.Vector3(x + 20, 0, z + 20);
            floor_square.transform.rotation = new quaternion(0, 0, 0, 1, 
                new THREE.Vector3(1, 0, 0), dag_to_rad(90));

            floor_square.transform.scale = new THREE.Vector3(2,2,2);

            var floor_square_decomposer = new decomposer(
                [ MapToSS(0, 3),],
                new THREE.Vector2(3, 1),
                [ new THREE.Color(0x855E42) ],
                new THREE.Vector3(0, 0, 0),
                floor_square.transform,
               1,
               attributes,
               buffer.index,
            );

            floor_square.add_component(floor_square_decomposer);
            floor.add_child(floor_square);
            
            PopulateBuffer(
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, 0), 
                floor_square.transform.scale,
                buffer, 
                floor_square_decomposer);
            }
        }

        floor.add_component(new aabb(floor.transform,
            100,
            0.15,
            100, true, 0xFFFFFF, true))

    CreateInstance(
        "Test", 
        animated_sprites, 
        buffer, 
        attributes, 
        sprite_sheet_size , 
        floor_shader, 
        3, 
        false, 
        false);

}

function structures_update(){

}