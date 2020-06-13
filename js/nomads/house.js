var houses = [];

function house_create(p, q, save = true) {
    var shader = get_data("instance_shader");
    shader.extra.trans = true;

    var buffer = create_buffer();
    var attributes = [];

    var house = new gameobject("house");

    house.transform.scale = new THREE.Vector3(1, 1, 1);
    house.transform.position = new THREE.Vector3(
        p.x,
        p.y,
        p.z
    );

    console.log(house.transform.position);

    house.transform.rotation = new quaternion(0, 0, 0, 1);

    var half_x = house.transform.scale.x / 2;
    var half_y = house.transform.scale.y / 2;
    var half_z = house.transform.scale.z / 2;

    var block_out = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ];

    create_grid(
        new THREE.Vector3(0, 0, 0).add(house.transform.position),
        0, new THREE.Vector3(1, 0, 0),
        90, new THREE.Vector3(1, 0, 0), 3, 3, house, buffer, attributes, block_out);

    CreateInstance("Test", solid_sprites, buffer, attributes, sprite_sheet_size, shader, 5, false, false);

    houses.push(house);

    if (save) {
        antlion_add_to_manifest(house.toJSON());
    }

    return house;
}

function create_grid(pos, dagree, axis, inner_dag, inner_axis, size_x, size_y, object, buffer, attributes, block_out, extra_rot = null) {

    var grid_object = new gameobject("grid");

    grid_object.transform.position = new THREE.Vector3().copy(pos);
    grid_object.transform.rotation = new quaternion(0, 0, 0, 1, axis, dag_to_rad(dagree));
    grid_object.transform.scale = new THREE.Vector3(1, 1, 1);

    for (var i = 0; i < size_x; i++) {
        for (var j = 0; j < size_y; j++) {
            var new_face = create_house_face(inner_dag, inner_axis,
                new THREE.Vector3(0, 0, 0), grid_object, buffer, attributes);
            new_face.transform.position = new THREE.Vector3(i - (size_x / 2) + 0.5, -.5, j - (size_y / 2) + 0.5);
        }
    }

    if (extra_rot != null) grid_object.transform.rotation = grid_object.transform.rotation.q_mul(extra_rot);

    var collider = new aabb(grid_object.transform, size_x / 2, .05, size_y / 2, true, 0x00ffff, true);
    grid_object.add_component(collider);

    physics_objects.push(grid_object);
    broad_quad_tree_insert(grid_object);

    object.add_child(grid_object);
}

function create_house_face(dagree, axis, offset, parent, buffer, attributes) {

    var face = new gameobject("grid_face");

    face.transform.rotation = new quaternion(0, 0, 0, 1,
        axis, dag_to_rad(dagree));

    face.transform.position = new THREE.Vector3().copy(offset);

    var face_decomposer = new decomposer(
        [MapToSS(0, 1), ],
        new THREE.Vector2(1, 1), [new THREE.Color(0x78664c)],
        new THREE.Vector3(0, 0, 0),
        face.transform,
        1,
        attributes,
        buffer.index,
        0,
    );

    face.add_component(face_decomposer);

    PopulateBuffer(
        face.transform.get_transformed_position(),
        face.transform.get_transformed_rotation(),
        new THREE.Vector3(5, 5, 5),
        buffer,
        face_decomposer);

    parent.add_child(face);

    return face;
}

function box_update(delta) {
    if (houses != undefined) {
        for (var i = 0; i < houses.length; i++) {}
    }
}