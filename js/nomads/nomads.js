
var Scene = [];
var CAMERA_FRUSTUM;

var visible_chunks = [];

var TestQuadTree;

var newobject1 = new gameobject("poop");
var newobject2 = new gameobject();

var geometry = new THREE.BoxGeometry(1,1,1);
var material1 = new THREE.MeshBasicMaterial({color:0x00ff00});
var material2 = new THREE.MeshBasicMaterial({color:0xff0000});

//var cube1 = new THREE.Mesh(geometry, material1);
//var cube2 = new THREE.Mesh(geometry, material2);

var game_resources;
var game_time = 0;
var game_speed = 2;
var physics_objects = [];

var pool = null;
var found = []
var occluders = []

function game_bootstrap(data){
    CAMERA_FRUSTUM = new THREE.Frustum().setFromMatrix(
        new THREE.Matrix4().multiplyMatrices( 
            camera.projectionMatrix, camera.matrixWorldInverse ));

    TestQuadTree = new quad_tree(
        new rectangle(-5000, -5000, 10000, 10000), 25
    )
    
    game_resources = data;

    keyboard_init();
    controller_init();
    pause_init();
    player_init();
    sky_init();
    physics_init();
    collision_init();
    shader_init();
    get_to_work();
    world_init();

    //scene.add(cube1);
    //scene.add(cube2);

    console.log("%cgame initialized", 'color: #FF6438');
    
    //newobject1.transform.position = new THREE.Vector3(0,0,0);
    //newobject1.transform.scale = new THREE.Vector3(1,10.5,1);
    //
    //newobject2.transform.position = new THREE.Vector3(0,1,0);
    //newobject1.add_child(newobject2);
    for(var i = 0; i < Scene.length; i++){
       // Scene[i].information();
    }
    //cube1.matrix = newobject1.transform.get_transformation().toMatrix4();
    //cube2.matrix = newobject2.transform.get_transformation().toMatrix4();
    //cube1.matrixAutoUpdate = false;
    //cube2.matrixAutoUpdate = false;
    
    for(var i = 0; i < Scene.length; i++){
        if(Scene[i].has_component("rigidbody")){
            broad_quad_tree_insert(Scene[i]);
            rigidbodies_insert(Scene[i].get_component("rigidbody"));
        }
    }

   // renderers.forEach(function(renderer) {
   //     scene.add(renderer.mesh)
   //     //renderer.bake_buffer()
   // })
}

/*
    all background updates done here, 
    normal update is where inner game stuff will take place
*/
function game_update(delta){
    game_time += (delta * game_speed);
    movement(delta);
    physics_update(delta);
    update(delta);
    player_update(delta);

    for(var j = 0; j < Scene.length; j++){
        Scene[j].update(delta);
    }

    collision_update(delta);
    world_update(delta);
    update_sky(delta);

    setTimeout(function(){
        quadtree_testing(delta);
    }, 10);

    shader_update(delta);
}

function update(delta){
    if(CAMERA_FRUSTUM != undefined){
        CAMERA_FRUSTUM.setFromMatrix( new THREE.Matrix4().multiplyMatrices( 
            camera.projectionMatrix, camera.matrixWorldInverse ));
    }
    //newobject1.transform.rotation.y += 0.05 * delta;
    //cube1.matrix = newobject1.transform.get_transformation().toMatrix4();
    //cube2.matrix = newobject2.transform.get_transformation().toMatrix4();
}

function quadtree_testing(delta){
    for(var i = 0; i < found.length; i++){
        Scene[found[i].id].get_component("decomposer").derender()
        //scene.remove(found[i].box_helper)
    }

    found = []

    var raycaster = new THREE.Raycaster(
        new THREE.Vector3(0,0,0), 
        new THREE.Vector3(0,0,0), 0, 1000);

    if(TestQuadTree != undefined){
        TestQuadTree.query(
            CAMERA_FRUSTUM,
            found,
            raycaster
        )
    }
}



