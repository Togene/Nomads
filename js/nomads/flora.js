var test_trees = [];

function tree_create(p, q){
    var shader = get_data("instance_shader");
    //var buffer = create_buffer();
    var attributes = [];

    var tree = new gameobject("tree");
    
    test_trees.push(tree);
 
    create_face(0, tree, attributes);
    create_face(45, tree, attributes);
    create_face(135, tree, attributes);
    
    leaves = new gameobject("leaves");
    
    tree.add_child(leaves);

    leaves.transform.position = new THREE.Vector3(0, pixel*52, 0);

    var leaves_decomposer = new decomposer(
        [ MapToSS(3, 0),],
        new THREE.Vector2(1, 1),
        [ new THREE.Color(0x008B00) ],
        new THREE.Vector3(0, 0, 0),
        leaves.transform,
        0,
        attributes,
        DYNAMIC_BUFFER.index,
    );
    
    leaves.add_component(leaves_decomposer);
    
    PopulateBuffer(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(2, 2, 2), 
        DYNAMIC_BUFFER, 
        leaves_decomposer
    );
    
    CreateInstance(solid_sprites, DYNAMIC_BUFFER, attributes, sprite_sheet_size , shader, 1, false, false);
    return tree;
}

function create_face(y_rot, tree, attributes){
    
    var root = new gameobject("root");
    var trunk = new gameobject("trunk");
    var branch = new gameobject("branch");

    tree.add_child(root);
    root.add_child(trunk);
    trunk.add_child(branch);

    root.transform.rotation = new quaternion(0, 0, 0, 1, new THREE.Vector3(0, 1, 0), dag_to_rad(y_rot));
    
    var root_decomposer = new decomposer(
        [ MapToSS(0, 0),],
        new THREE.Vector2(1, 1),
        [ new THREE.Color(0x78664c) ],
        new THREE.Vector3(0, 0, 0),
        root.transform,
        1,
        attributes,
        DYNAMIC_BUFFER.index,
    );
    
    root.add_component(root_decomposer);

    PopulateBuffer(
        root.transform.get_transformed_position(), 
        root.transform.get_transformed_rotation(), 
        new THREE.Vector3(5, 5, 5), 
        DYNAMIC_BUFFER, 
        root_decomposer);
    
        trunk.transform.position = new THREE.Vector3(0, pixel*3, 0);

    var trunk_decomposer = new decomposer(
       [ MapToSS(1, 0),],
        new THREE.Vector2(1, 2),
       [ new THREE.Color(0x78664c) ],
        new THREE.Vector3(0, 0, 0),
        trunk.transform,
        1,
        attributes,
        DYNAMIC_BUFFER.index,
    );
    
    trunk.add_component(trunk_decomposer);

    PopulateBuffer(
        trunk.transform.get_transformed_position(), 
        trunk.transform.get_transformed_rotation(),  
        new THREE.Vector3(5, 5, 5),
        DYNAMIC_BUFFER, 
        trunk_decomposer);

    //5 unit        = 32 pixel
    //1 unit        = 6.4 pixel
    //0.15625 units = 1 pixel
    branch.transform.position = new THREE.Vector3(0, 1, 0);

    var branch_decomposer = new decomposer(
        [ MapToSS(2, 0),],
        new THREE.Vector2(1, 3),
        [ new THREE.Color(0x78664c) ],
        new THREE.Vector3(0, 0, 0),
        branch.transform,
        1,
        attributes,
        DYNAMIC_BUFFER.index,
    );
    
    branch.add_component(branch_decomposer);

    PopulateBuffer(
        branch.transform.get_transformed_position(),
        branch.transform.get_transformed_rotation(),  
        new THREE.Vector3(5, 5, 5),
        DYNAMIC_BUFFER, 
        branch_decomposer);

    return branch.transform.get_transformed_position().y;
}

function flora_update(delta){
  
   for(var i = 0; i < test_trees.length; i++){
        //test_trees[i].transform.position.y = Math.sin(game_time);
        //test_trees[i].transform.rotation.y += .01;
   }

   flora_occlusion();
}

function flora_occlusion(){
    var frustum = new THREE.Frustum();
    frustum.setFromMatrix( 
        new THREE.Matrix4().multiplyMatrices( 
            camera.projectionMatrix, 
            camera.matrixWorldInverse 
        ));


    for(var i = 0; i < test_trees.length; i++){

    }
}