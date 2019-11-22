
Scene = [];

//------------- Sprite THREE holders ---------
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
const SpriteSheetSize = new THREE.Vector2(8, 8);
var root = new gameobject();
var game_resources;
var game_time = 0;
var game_speed = 2;

//launch async then bootstrap init
antlion_init();

//setting up keybutton events
//input_init();

function game_bootstrap(data){

    game_resources = data;
    
    scene.add(cube1);
    scene.add(cube2);

    console.log("Game Initialized");

    newobject1.transform.position = new THREE.Vector3(0,0,0);
    newobject1.transform.scale = new THREE.Vector3(1,0.5,1);

    newobject2.transform.position = new THREE.Vector3(0,1,0);
    newobject1.add_child(newobject2);

//    for(var i = 0; i < Scene.length; i++){
//        Scene[i].information();
//    }

    cube1.matrix = newobject1.transform.get_transformation().toMatrix4();
    cube2.matrix = newobject2.transform.get_transformation().toMatrix4();
    cube1.matrixAutoUpdate = false;
    cube2.matrixAutoUpdate = false;

    //TestCreatures();
    TesTTree();
}

function TestCreatures(){
    var crab_shader = get_data("instance_shader");
    var buffer = create_buffer();

    for(var i = 0; i < 1000; i++){
        var crab = new gameobject("crab");
        
        crab.transform.position = new THREE.Vector3(randomRange(-100, 100),0,randomRange(-100, 100)),
        crab.transform.rotation = new quaternion( 0, 0, 0, 1 );
        crab.transform.scale = new THREE.Vector3(5,5,5);

        var decomposer = {
            ssIndex : [ MapToSS(0, 0),],
            animationFrames : new THREE.Vector2(3, 1),
            colors : [ new THREE.Color(0xff5a5b) ],
            centre_offset :   new THREE.Vector3(0, 0, 0),
            type :    0,
            matrix : crab.transform.get_transformation().toMatrix4()
        };
        
        PopulateBuffer(
            crab.transform.position, 
            crab.transform.rotation, 
            crab.transform.scale,
            buffer, 
            decomposer)
    }

    CreateInstance("Test", animated_sprites, buffer, SpriteSheetSize, crab_shader, 0, true, false)

    scene.add(animated_sprites);
}

function TesTTree(){

    var crab_shader = get_data("instance_shader");
    var buffer = create_buffer();

    for(var i = 0; i < 100; i++){
        var vec = new THREE.Vector3(randomRange(-100, 100), 0, randomRange(-100, 100));
        create_face(0, vec, buffer);
        create_face(45, vec, buffer);
        create_face(135, vec, buffer);
        
        var leaves_decomposer = {
            ssIndex : [ MapToSS(0, 0),],
            animationFrames : new THREE.Vector2(1, 1),
            colors : [ new THREE.Color(0x78664c) ],
            centre_offset : new THREE.Vector3(0, 0, 0),
            matrix : root.transform.get_transformation().toMatrix4(),
            type : 1,
        };
    
        PopulateBuffer(
            root.transform.get_transformed_position(), 
            root.transform.get_transformed_rotation(), 
            new THREE.Vector3(5, 5, 5), 
            buffer, 
            leaves_decomposer);
 
    }

    CreateInstance("Test", solid_sprites, buffer, SpriteSheetSize, crab_shader, 1, false, false)

    scene.add(solid_sprites);
}

function create_face(y_rot, position, buffer){
         
    var trunk = new gameobject();
    var branch = new gameobject();

    root.add_child(trunk);
    trunk.add_child(branch);

    root.transform.position = position;
    root.transform.rotation = new quaternion(0, y_rot, 0, 1 );
    root.transform.scale = new THREE.Vector3(5,5,5);
    
    var root_decomposer = {
        ssIndex : [ MapToSS(0, 0),],
        animationFrames : new THREE.Vector2(1, 1),
        colors : [ new THREE.Color(0x78664c) ],
        centre_offset : new THREE.Vector3(0, 0, 0),
        matrix : root.transform.get_transformation().toMatrix4(),
        type : 1,
    };

    PopulateBuffer(
        root.transform.get_transformed_position(), 
        root.transform.get_transformed_rotation(), 
        new THREE.Vector3(5, 5, 5), 
        buffer, 
        root_decomposer);
    
        trunk.transform.position = new THREE.Vector3(0, pixel*3, 0);

    var trunk_decomposer = {
        ssIndex : [ MapToSS(1, 0),],
        animationFrames : new THREE.Vector2(1, 2),
        colors : [ new THREE.Color(0x78664c) ],
        centre_offset : new THREE.Vector3(0, 0, 0),
        type : 1,
        matrix : trunk.transform.get_transformation().toMatrix4(),
    };

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

    var branch_decomposer = {
        ssIndex : [ MapToSS(2, 0),],
        animationFrames : new THREE.Vector2(1, 3),
        colors : [ new THREE.Color(0x78664c) ],
        centre_offset : new THREE.Vector3(0, 0, 0),
        type : 1,
        matrix : branch.transform.get_transformation().toMatrix4(),
    };

    PopulateBuffer(
        branch.transform.get_transformed_position(),
        branch.transform.get_transformed_rotation(),  
        new THREE.Vector3(5, 5, 5),
        buffer, 
        branch_decomposer);
}

function game_update(delta){
    game_time += delta * game_speed;

    for(var i = 0; i < Scene.length; i++){
        Scene[i].update();
    }
    shader_update();
    update(delta);
}

function update(delta){
    newobject1.transform.rotation.y += .5;
    cube1.matrix = newobject1.transform.get_transformation().toMatrix4();
    cube2.matrix = newobject2.transform.get_transformation().toMatrix4();
}

function shader_update(){
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


