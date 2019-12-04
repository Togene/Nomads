
var player;
var player_box;

function player_init(){
    player = new gameobject("player");
    player_box = new aabb(player.transform, 0.5, 1, 0.5, true, 0xFF0000, true);

    player.add_component(player_box);
    player.add_component(new rigidbody(10, false));
    
    player.transform.position = controls.getObject().position;
}

function player_update(delta){
    if(player != undefined) {
        player.transform.position = new THREE.Vector3
        (
            controls.getObject().position.x,
            controls.getObject().position.y,
            controls.getObject().position.z
        );

        var collider = player.get_component("aabb");
        
        if(collider.colliding){
            console.log("Colliding");
        }
    }
}

function get_player_direction(){
    var direction = new THREE.Vector3( 0, 0, - 1 );
    var v = new THREE.Vector3();
    v.copy( direction ).applyQuaternion( camera.quaternion );
    v.y = 0;
    return v;
}