
Scene = [];

var newobject1 = new gameobject("poop");
var newobject2 = new gameobject();
var newobject3 = new gameobject();

var geometry = new THREE.BoxGeometry(1,1,1);
var material1 = new THREE.MeshBasicMaterial({color:0x00ff00});
var material2 = new THREE.MeshBasicMaterial({color:0xff0000});
var material3 = new THREE.MeshBasicMaterial({color:0x0000ff});

var cube1 = new THREE.Mesh(geometry, material1);
var cube2 = new THREE.Mesh(geometry, material2);
var cube3 = new THREE.Mesh(geometry, material3);

function game_initialize(){
    scene.add(cube1);
    scene.add(cube2);
    //scene.add(cube3);

    console.log("Game Initialized");

    newobject1.add_child(newobject1);
    newobject1.transform.position = new THREE.Vector3(0,1,0);
    newobject1.transform.scale = new THREE.Vector3(1,1,1);
    
    newobject2.transform.position = new THREE.Vector3(0,0,0);
    newobject1.add_child(newobject2);
   

    newobject2.add_child(newobject3);
    newobject3.transform.position = new THREE.Vector3(0,0,0);

    for(var i = 0; i < Scene.length; i++){
        Scene[i].information();
    }
}

function update(){
    //newobject1.transform.position.x += .01;
    newobject1.transform.rotation.y += .05;

    cube1.position.set(
        newobject1.transform.position.x,
        newobject1.transform.position.y,
        newobject1.transform.position.z
    );

    cube1.rotation.set(
        newobject1.transform.rotation.x,
        newobject1.transform.rotation.y,
        newobject1.transform.rotation.z
    );

    cube1.scale.set(
        newobject1.transform.scale.x,
        newobject1.transform.scale.y,
        newobject1.transform.scale.z
    );

    cube2.position.set(
        newobject2.transform.get_transformed_position().x,
        newobject2.transform.get_transformed_position().y,
        newobject2.transform.get_transformed_position().z
    );


    //cube2.matrix.setPosition(newobject2.transform.get_transformed_position());
    //cube2.matrixAutoUpdate = false;
    //cube3.matrix.setPosition(newobject3.transform.get_transformed_position());
    //cube3.matrixAutoUpdate = false;
}//

function game_update(){

    for(var i = 0; i < Scene.length; i++){
        Scene[i].update();
    }
    update();
}