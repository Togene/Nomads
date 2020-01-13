
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


function game_bootstrap(data){
    
    game_resources = data;
    
    controller_init();
    player_init();
    sky_init();
    physics_init();
    collision_init();
    shader_init();

    //scene.add(cube1);
   // scene.add(cube2);
    scene.add(solid_sprites);
    scene.add(animated_sprites);

    console.log("%cGame Initialized", 'color: #DAA45C');
    
    //newobject1.transform.position = new THREE.Vector3(0,0,0);
    //newobject1.transform.scale = new THREE.Vector3(1,10.5,1);

    //newobject2.transform.position = new THREE.Vector3(0,1,0);
    //newobject1.add_child(newobject2);
    
   //for(var i = 0; i < Scene.length; i++){
   //    Scene[i].information();
   //}
    
    //cube1.matrix = newobject1.transform.get_transformation().toMatrix4();
    //cube2.matrix = newobject2.transform.get_transformation().toMatrix4();
    //cube1.matrixAutoUpdate = false;
    //cube2.matrixAutoUpdate = false;

    TestCreatures();
    TestTree();
    TestStructures();
    TestNPC();
    
    for(var i = 0; i < Scene.length; i++){
        //Scene[i].information();
        if(Scene[i].has_component("aabb"))
            broad_quad_tree_insert(Scene[i]);

        if(Scene[i].has_component("rigidbody")){
            rigidbodies_insert(Scene[i].get_component("rigidbody"));
        }
    }
}

/*
    all background updates done here, 
    normal update is where inner game stuff will take place
*/
function game_update(delta){
    game_time += delta * game_speed;

    collision_update(delta);
    player_update(delta);
    movement(delta);
    physics_update(delta);
    shader_update(delta);
    update(delta);

    for(var i = 0; i < Scene.length; i++){
        Scene[i].update(delta);
    }
    update_sky(delta);
}

function update(delta){
   // newobject1.transform.rotation.y += .5;
    //cube1.matrix = newobject1.transform.get_transformation().toMatrix4();
   // cube2.matrix = newobject2.transform.get_transformation().toMatrix4();

    fauna_update(delta);
    flora_update(delta);
}



