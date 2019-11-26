
Scene = [];
const SpriteSheetSize = new THREE.Vector2(8, 8);

//------------- Sprite THREE.Object3D holders ---------
var animated_sprites = new THREE.Object3D();
var solid_sprites = new THREE.Object3D();
//--------------------------------------------

var newobject1 = new gameobject("poop");
var newobject2 = new gameobject();

var geometry = new THREE.BoxGeometry(1,1,1);
var material1 = new THREE.MeshBasicMaterial({color:0x00ff00});
var material2 = new THREE.MeshBasicMaterial({color:0xff0000});

var cube1 = new THREE.Mesh(geometry, material1);
var cube2 = new THREE.Mesh(geometry, material2);

var game_resources;
var game_time = 0;
var game_speed = 2;

var test_trees = [];
var test_crabs = [];

function game_bootstrap(data){
    
    game_resources = data;
    
    controller_init();
    sky_init();

    scene.add(cube1);
    scene.add(cube2);
    scene.add(solid_sprites);
    scene.add(animated_sprites);

    console.log("Game Initialized");

    newobject1.transform.position = new THREE.Vector3(0,0,0);
    newobject1.transform.scale = new THREE.Vector3(1,0.5,1);

    newobject2.transform.position = new THREE.Vector3(0,1,0);
    newobject1.add_child(newobject2);
    
   //for(var i = 0; i < Scene.length; i++){
   //    Scene[i].information();
   //}
    
    cube1.matrix = newobject1.transform.get_transformation().toMatrix4();
    cube2.matrix = newobject2.transform.get_transformation().toMatrix4();
    cube1.matrixAutoUpdate = false;
    cube2.matrixAutoUpdate = false;
    
    TestCreatures();
    TestTree();
}

function TestCreatures(){
    var crab_shader = get_data("instance_shader");
    var buffer = create_buffer();
    var attributes = [];

    for(var i = 0; i < 100; i++){
        var crab = new gameobject("crab");
        test_crabs.push(crab);
        crab.transform.position = new THREE.Vector3(randomRange(-100, 100),0,randomRange(-100, 100)),
        crab.transform.rotation = new quaternion( 0, 0, 0, 1 );
        crab.transform.scale = new THREE.Vector3(5,5,5);

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
        
        crab.add_componenent(crab_decomposer);

        PopulateBuffer(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 0), 
            crab.transform.scale,
            buffer, 
            crab_decomposer);

    }

    CreateInstance(
    "Test", 
    animated_sprites, 
    buffer, 
    attributes, 
    SpriteSheetSize, 
    crab_shader, 
    0, 
    true, 
    false);
}

function TestTree(){

    var shader = get_data("instance_shader");
    var buffer = create_buffer();
    var attributes = [];

    for(var i = 0; i < 122; i++){
        
        var tree = new gameobject("tree");
        test_trees.push(tree);
        tree.transform.position = new THREE.Vector3(randomRange(-100, 100), 0, randomRange(-100, 100));
        tree.transform.scale = new THREE.Vector3(5,5,5);

        create_face(0, tree, buffer, attributes);
        create_face(45, tree, buffer, attributes);
        create_face(135, tree, buffer, attributes);
        
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
            buffer.index,
        );
        
        leaves.add_componenent(leaves_decomposer);

        PopulateBuffer(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(10, 10, 10), 
            buffer, 
            leaves_decomposer);
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
    
    root.add_componenent(root_decomposer);

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
    
    trunk.add_componenent(trunk_decomposer);

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
    
    branch.add_componenent(branch_decomposer);

    PopulateBuffer(
        branch.transform.get_transformed_position(),
        branch.transform.get_transformed_rotation(),  
        new THREE.Vector3(5, 5, 5),
        buffer, 
        branch_decomposer);

    return branch.transform.get_transformed_position().y;
}


/*
    all background updates done here, 
    normal update is where inner game stuff will take place
*/
function game_update(delta){
    game_time += delta * game_speed;


    for(var i = 0; i < Scene.length; i++){
        Scene[i].update();
    }

    shader_update(delta);
    update(delta);
    movement(delta);
    update_sky(delta);
}

function update(delta){
    newobject1.transform.rotation.y += .5;
    cube1.matrix = newobject1.transform.get_transformation().toMatrix4();
    cube2.matrix = newobject2.transform.get_transformation().toMatrix4();

   //for(var i = 0; i < test_trees.length; i++){
   //     test_trees[i].transform.position.y = Math.sin(game_time);
   //     test_trees[i].transform.rotation.y += 1;
   //}
//
   // for(var i = 0; i < test_crabs.length; i++){
   //     test_crabs[i].transform.position.y = Math.sin(game_time);
   //     test_trees[i].transform.rotation.y += 1;
   // }

}

function shader_update(delta){
    if (animated_sprites.children.length != 0) {
        for (var i = 0; i < animated_sprites.children.length; i++) {
            if (animated_sprites.children[i] != undefined) {

                if(animated_sprites.children[i].material != undefined){
                    animated_sprites.children[i].material.uniforms.time.value = game_time;
                }

                if(animated_sprites.children[i].children != undefined){
                    for (var j = 0; j < animated_sprites.children[i].children.length; j++) {
                        
                        if(animated_sprites.children[i].children[j].material != undefined){
                            animated_sprites.children[i].children[j].material.uniforms.time.value = game_time;
                        }
                    }
                }
            }
        }
    }
}


