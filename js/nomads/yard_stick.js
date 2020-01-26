var stick = null;

function yard_stick_create(p, q){
    var shader = get_data("instance_shader");
    var buffer = create_buffer();
    var attributes = [];

    stick = new gameobject("yard_stick");
     
    stick.transform.scale = new THREE.Vector3(1,1,1);
    stick.transform.position = new THREE.Vector3(0,0,0);
    stick.transform.rotation = new quaternion(0,0,0,1);
    
    create_face(0, stick, buffer, attributes);
    create_face(45, stick, buffer, attributes);
    create_face(135, stick, buffer, attributes);
    create_face(90, stick, buffer, attributes);

    stick.get_component("aabb");

    stick.add_component(new aabb(stick.transform, 1, 1, 1, true, 0xFFFFFF, true));
    
    CreateInstance("Test", solid_sprites, buffer, attributes, sprite_sheet_size , shader, 5, false, false);
    return stick;
} 

function create_yard_face(y_rot, parent, buffer, attributes){
    
    var face = new gameobject("root");

    parent.add_child(root);

    face.transform.rotation = new quaternion(0, 0, 0, 1, new THREE.Vector3(0, 1, 0), dag_to_rad(y_rot));
    
    var face_decomposer = new decomposer(
        [ MapToSS(0, 0),],
        new THREE.Vector2(1, 1),
        [ new THREE.Color(0x78664c) ],
        new THREE.Vector3(0, 0, 0),
        face.transform,
        1,
        attributes,
        buffer.index,
    );
    
    face.add_component(face_decomposer);

    PopulateBuffer(
        face.transform.get_transformed_position(), 
        face.transform.get_transformed_rotation(), 
        new THREE.Vector3(5, 5, 5), 
        buffer, 
        face_decomposer);
}

function yard_stick_update(delta){
}