var test_trees = [];

function TestTree(){
    var shader = get_data("instance_shader");
    var buffer = create_buffer();
    var attributes = [];

    var num_trees = 1;

    for(var i = 0; i < num_trees; i++){
        
        var tree = new gameobject("tree");
        
        var rand = new p_random(1);
        var x = random_range(-1, 1);
        var z = random_range(-1, 1);
        //console.log(z);

        test_trees.push(tree);
        tree.transform.position = new THREE.Vector3(15, 1.25, z);
        tree.transform.scale = new THREE.Vector3(5,5,5);
        tree.transform.rotation = new quaternion(0, 90, 0, 1);
        
        create_face(0, tree, buffer, attributes);
        create_face(45, tree, buffer, attributes);
        create_face(135, tree, buffer, attributes);
        
        //leaves = new gameobject("leaves");
        
        //tree.add_child(leaves);

        //leaves.transform.position = new THREE.Vector3(0, pixel*52, 0);
        tree.get_component("aabb");

        //var leaves_decomposer = new decomposer(
        //    [ MapToSS(3, 0),],
        //    new THREE.Vector2(1, 1),
        //    [ new THREE.Color(0x008B00) ],
        //    new THREE.Vector3(0, 0, 0),
        //    leaves.transform,
        //    0,
        //    attributes,
        //    buffer.index,
        //);
        
       // leaves.add_component(leaves_decomposer);
        tree.add_component(new aabb(tree.transform, 1, 1, 1, true, 0xFFFFFF, true));
        
        //PopulateBuffer(
        //    new THREE.Vector3(0, 0, 0),
        //    new THREE.Vector3(0, 0, 0),
        //    new THREE.Vector3(10, 10, 10), 
        //    buffer, 
        //    leaves_decomposer
        //);
    }

    
    CreateInstance("Test", solid_sprites, buffer, attributes, SpriteSheetSize, shader, 1, false, false);

}

function create_face(y_rot, tree, buffer, attributes){
    
    var root = new gameobject("root");
    var trunk = new gameobject("trunk");
    var branch = new gameobject("branch");

    tree.add_child(root);
    root.add_child(trunk);
    trunk.add_child(branch);

    root.transform.rotation = new quaternion(0, y_rot, 0, 1 );
    
    var root_decomposer = new decomposer(
        [ MapToSS(0, 0),],
        new THREE.Vector2(1, 1),
        [ new THREE.Color(0x78664c) ],
        new THREE.Vector3(0, 0, 0),
        root.transform,
        1,
        attributes,
        buffer.index,
    );
    
    root.add_component(root_decomposer);

    PopulateBuffer(
        root.transform.get_transformed_position(), 
        root.transform.get_transformed_rotation(), 
        new THREE.Vector3(5, 5, 5), 
        buffer, 
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
        buffer.index,
    );
    
    trunk.add_component(trunk_decomposer);

    PopulateBuffer(
        trunk.transform.get_transformed_position(), 
        trunk.transform.get_transformed_rotation(),  
        new THREE.Vector3(5, 5, 5),
        buffer, 
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
        buffer.index,
    );
    
    branch.add_component(branch_decomposer);

    PopulateBuffer(
        branch.transform.get_transformed_position(),
        branch.transform.get_transformed_rotation(),  
        new THREE.Vector3(5, 5, 5),
        buffer, 
        branch_decomposer);

    return branch.transform.get_transformed_position().y;
}

function flora_update(delta){
  
   for(var i = 0; i < test_trees.length; i++){
       // test_trees[i].transform.position.y = Math.sin(game_time);
        //test_trees[i].transform.rotation.y += 1;
   }
//  
}