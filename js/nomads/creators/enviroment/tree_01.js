function tree_01_create(p, q){
    var tree = new gameobject("tree", 
    new THREE.Vector3 (p.x, p.y + .5, p.z), 
    new THREE.Vector3(1,1,1), q);
    
    create_face(0, tree);
    create_face(45, tree);
    create_face(135, tree);
    
    leaves = new gameobject("leaves", new THREE.Vector3(0, 1.6, 0));
    leaves.add_component(new decomposer(
        get_meta().tree_01.leaves,
        SPRITE,
        DYNAMIC_BUFFER, 
        DYNAMIC_ATTRIBUTES,
    ));
    tree.add_child(leaves);

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
        get_meta().tree_01.root,
        SOLID,
        STATIC_BUFFER, 
        STATIC_ATTRIBUTES,
        new pass_transforms(
            root.transform.get_transformed_position(), 
            root.transform.get_transformed_rotation(), 
            new THREE.Vector3(5, 5, 5), 
        )
    );
    
    root.add_component(root_decomposer);


    trunk.transform.position = new THREE.Vector3(0, pixel*3, 0);

    var trunk_decomposer = new decomposer(
        get_meta().tree_01.trunk,
        SOLID,
        STATIC_BUFFER, 
        STATIC_ATTRIBUTES,
        new pass_transforms(
            trunk.transform.get_transformed_position(), 
            trunk.transform.get_transformed_rotation(),  
            new THREE.Vector3(5, 5, 5),
        )
    );
    
    trunk.add_component(trunk_decomposer);

    branch.transform.position = new THREE.Vector3(0, 1, 0);

    var branch_decomposer = new decomposer(
        get_meta().tree_01.branch,
        SOLID,
        STATIC_BUFFER, 
        STATIC_ATTRIBUTES,
        new pass_transforms(
            branch.transform.get_transformed_position(),
            branch.transform.get_transformed_rotation(),  
            new THREE.Vector3(5, 5, 5),
        )
    );
    
    branch.add_component(branch_decomposer);

    return branch.transform.get_transformed_position().y;
}
