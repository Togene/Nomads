var player;
var player_box;
var player_face_ray;
var player_down_ray;

function player_init(){
    player = new gameobject("player");

    player.transform.position = new THREE.Vector3(0, 10, 0);
    player.transform.scale = new THREE.Vector3(1, 2, 1);
    player.transform.rotation = new quaternion(0, 0, 0, 1);

    player_box = new aabb(player.transform, 0.5, 1, 0.5, true, 0xFF0000, true);

    player.add_component(player_box);
    player.add_component(new rigidbody(180, false));

    //player_face_ray = new ray(player.transform.position, new THREE.Vector3(0.5, -1, 0));
    //player.add_component(player_face_ray);


    var pos = player.transform.position.clone();

    player_down_ray_0 = new ray(new THREE.Vector3(pos.x - 0.5, pos.y, pos.z + 0.5), new THREE.Vector3(0, -1, 0));
    player.add_component(player_down_ray_0);

    player_down_ray_1 = new ray(new THREE.Vector3(pos.x + 0.5, pos.y, pos.z + 0.5), new THREE.Vector3(0, -1, 0));
    player.add_component(player_down_ray_1);

    player_down_ray_2 = new ray(new THREE.Vector3(pos.x - 0.5, pos.y, pos.z - 0.5), new THREE.Vector3(0, -1, 0));
    player.add_component(player_down_ray_2);

    player_down_ray_3 = new ray(new THREE.Vector3(pos.x - 0.5, pos.y, pos.z + 0.5), new THREE.Vector3(0, -1, 0));
    player.add_component(player_down_ray_3);
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
        //console.log(player.transform.position);
    }

   
}
