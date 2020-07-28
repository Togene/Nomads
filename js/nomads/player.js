var player;
var player_box;
var player_face_ray;
var player_down_ray;

function player_init(){
    player = new gameobject("player");

    player.transform.position = new THREE.Vector3(0, 10, 0);
    player.transform.scale = new THREE.Vector3(1, 1.45, 1);
    player.transform.rotation = new quaternion(0, 0, 0, 1);

    player.add_component(new rigidbody(180, true));
}

function get_player_direction(){
    var direction = new THREE.Vector3( 0, 0, - 1 );

    return direction.applyQuaternion( camera.quaternion );
}

function player_update(delta){
    
    if(player != undefined) {
    }

   
}
