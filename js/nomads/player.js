var player;
var player_box;
var player_face_ray;
var player_down_ray;

function player_init(){
    player = new gameobject("player");

    player.transform.position = new THREE.Vector3(0, 1.35, 0);
    player.transform.scale = new THREE.Vector3(1, 1, 1);
    player.transform.rotation = new quaternion(0, 0, 0, 1);

    player_box = new aabb(player.transform, 0.5, 1, 0.5, true, 0xFF0000, true);

    player.add_component(player_box);
    player.add_component(new rigidbody(180, false));

    //player_face_ray = new ray(player.transform.position, new THREE.Vector3(0, 0, 1));
    //player.add_component(player_face_ray);
    
    player_down_ray = new ray(player.transform.position, new THREE.Vector3(0, -1, 0));
    player.add_component(player_down_ray);
}

function get_player_direction(){
    var direction = new THREE.Vector3( 0, 0, - 1 );

    return direction.applyQuaternion( camera.quaternion );
}

function player_update(delta){
    
    if(player != undefined) {
        var collider = player.get_component("aabb");

        if(collider.colliding){
           
        }
    }
}
