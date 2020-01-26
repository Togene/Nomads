var box = null;

function box_create(p, q){
    var shader = get_data("instance_shader");
    var buffer = create_buffer();
    var attributes = [];

    box = new gameobject("box");
     
    box.transform.scale = new THREE.Vector3(1,1,1);
    box.transform.position = new THREE.Vector3(0, 0, 0);
    box.transform.rotation = new quaternion(0,0,0,1);
    
    var half_x = box.transform.scale.x/2;
    var half_y = box.transform.scale.y/2;
    var half_z = box.transform.scale.z/2;

    //Back and front
    create_box_face(0, new THREE.Vector3(0,1,0),
     new THREE.Vector3(0,0,-half_z), box, buffer, attributes);

    create_box_face(0, new THREE.Vector3(0,1,0),
     new THREE.Vector3(0,0, half_z), box, buffer, attributes);

    //left and right
    create_box_face(90, new THREE.Vector3(0,1,0), 
    new THREE.Vector3(-half_x,0, 0), box, buffer, attributes);

    create_box_face(90, new THREE.Vector3(0,1,0), 
    new THREE.Vector3(half_x,0, 0), box, buffer, attributes);
    
    //top and bottom
    create_box_face(90, new THREE.Vector3(1,0,0), 
    new THREE.Vector3(0, -half_y, 0), box, buffer, attributes);

    create_box_face(90, new THREE.Vector3(1,0,0),
     new THREE.Vector3(0,half_y, 0), box, buffer, attributes);

    box.add_component(new aabb(box.transform, 0.5, 0.5, 0.5, true, 0xFFFFFF, true));
    
    CreateInstance("Test", solid_sprites, buffer, attributes, sprite_sheet_size , shader, 5, false, false);
    return box;
} 

function create_box_face(y_rot, axis, offset, parent, buffer, attributes){
    
    var face = new gameobject("root");

    parent.add_child(face);

    face.transform.rotation = new quaternion(0, 0, 0, 1, 
        axis, dag_to_rad(y_rot));

    face.transform.position = new THREE.Vector3().copy(offset);

    var face_decomposer = new decomposer(
        [ MapToSS(0, 1),],
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

function box_update(delta){

}