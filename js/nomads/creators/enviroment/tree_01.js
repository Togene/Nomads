function tree_01_create(p, q){
    var tree = new gameobject("tree", 
    new THREE.Vector3 (p.x, p.y + .5, p.z), 
    new THREE.Vector3(1,1,1), q);

    tree.add_component( new batch_decomposer());

    var face0_batch = new batch_decomposer();
    create_face(0, tree,  face0_batch);

    var face1_batch = new batch_decomposer();
    create_face(45, tree,  face1_batch);

    var face2_batch = new batch_decomposer();
    create_face(135, tree,  face2_batch);

    leaves = new gameobject("leaves", new THREE.Vector3(0, 1.6, 0), 
    new THREE.Vector3(2, 2, 2));
    tree.add_child(leaves);

    var leaves_decomp = new sprite(
        get_meta().tree_01.leaves,
    );
    leaves.add_component(leaves_decomp);

    face0_batch.push(leaves_decomp)
    tree.get_component("batch_decomposer").push(face0_batch);
    tree.get_component("batch_decomposer").push(face1_batch);
    tree.get_component("batch_decomposer").push(face2_batch);

    tree.get_component("batch_decomposer").set_head(true);

    return tree;
}


function create_face(y_rot, tree, batch){
    var root = new gameobject("root");
    var trunk = new gameobject("trunk");
    var branch = new gameobject("branch");

    tree.add_child(root);
    root.add_child(trunk);
    trunk.add_child(branch);

    root.transform.rotation = new quaternion(0, 0, 0, 1, 
        new THREE.Vector3(0, 1, 0), dag_to_rad(y_rot));

    var root_decomp = new solid(
        get_meta().tree_01.root,
        new pass_transforms(
            root.transform.get_transformed_position(), 
            root.transform.get_transformed_rotation(), 
            new THREE.Vector3(5, 5, 5), 
        )
    )
    root.add_component(root_decomp);
    batch.push(root_decomp);

    trunk.transform.position = new THREE.Vector3(0, pixel*3, 0);

    var trunk_decomp = new solid(
        get_meta().tree_01.trunk,
        new pass_transforms(
            trunk.transform.get_transformed_position(), 
            trunk.transform.get_transformed_rotation(),  
            new THREE.Vector3(5, 5, 5),
        )
    );

    trunk.add_component(trunk_decomp);
    batch.push(trunk_decomp);

    branch.transform.position = new THREE.Vector3(0, 1, 0);

    var branch_decomp = new solid(
        get_meta().tree_01.branch,
        new pass_transforms(
            branch.transform.get_transformed_position(),
            branch.transform.get_transformed_rotation(),  
            new THREE.Vector3(5, 5, 5),
        )
    );

    branch.add_component(branch_decomp);
    batch.push(branch_decomp);
    
    return branch.transform.get_transformed_position().y;
}
