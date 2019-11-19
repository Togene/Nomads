
Scene = [];

//------------- Sprite THREE holders ---------
var animated_sprites = new THREE.Object3D();
var solid_sprites = new THREE.Object3D();
//--------------------------------------------

//------------- MOVEMENT ----------------
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
//------------- MOVEMENT ----------------

var newobject1 = new gameobject("poop");
var newobject2 = new gameobject();

var geometry = new THREE.BoxGeometry(1,1,1);
var material1 = new THREE.MeshBasicMaterial({color:0x00ff00});
var material2 = new THREE.MeshBasicMaterial({color:0xff0000});

var cube1 = new THREE.Mesh(geometry, material1);
var cube2 = new THREE.Mesh(geometry, material2);
const SpriteSheetSize = new THREE.Vector2(8, 8);

var game_resources;
var game_time = 0;
var game_speed = 2;

//launch async then bootstrap init
antlion_init();

//setting up keybutton events
input_init();

function game_bootstrap(data){
    game_resources = data;
    
    scene.add(controls.getObject());

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

    TestCreatures();
}



function TestCreatures(){
    var crab_shader = get_data("instance_shader");
    var buffer = create_buffer();
    
        var decomposer = {
        ssIndex : [ MapToSS(0, 0),],
        animationFrames : new THREE.Vector2(3, 1),
        colors : [ new THREE.Color(0xff5a5b) ],
        centre_offset :   new THREE.Vector3(0, 0, 0),
        type :    1,
        };

    for(var i = 0; i < 1000; i++){
        PopulateBuffer(new THREE.Vector3(randomRange(-100, 100),-15,randomRange(-100, 100)), new quaternion(0,0,0,1), new THREE.Vector3(5,5,5), buffer, decomposer)
    }

    CreateInstance("Test", animated_sprites, buffer, SpriteSheetSize, crab_shader, 0, true, false)

    scene.add(animated_sprites);
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

    movement(delta);
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

function movement(delta){
    
    velocity.x -= velocity.x * 2.0 * delta; // drag
    velocity.z -= velocity.z * 2.0 * delta; // drag

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveLeft) - Number(moveRight);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward  || moveBackward ) velocity.z -= direction.z * 1200.0 * delta;
    if (moveLeft  || moveRight ) velocity.x -= direction.x * 1200.0 * delta;

    controls.getObject().translateX(velocity.x * delta);
    controls.getObject().translateY(velocity.y * delta);
    controls.getObject().translateZ(velocity.z * delta);

}

function input_init() {

    var onKeyDown = function (event) {

        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true;
                break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;
            case 32: // space
                break;
            case 13:
                enter = true;
                break;
            case 191:
                Console_Open = !Console_Open;
                break;
        }

    };

    var onKeyUp = function (event) {

        switch (event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                break;
            case 13:
                enter = false;
                break;
            case 39: // right
            case 68: // d
                moveRight = false;
                break;
        }

    };

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

}