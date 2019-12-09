
var player;
var player_box;

function player_init(){
    player = new gameobject("player");
    //player.position = camera.position.clone();
    player_box = new aabb(player.transform, 0.5, 1, 0.5, true, 0xFF0000, true);

    player.add_component(player_box);
    player.add_component(new rigidbody(80, false));
    
    //player.transform.position = controls.getObject().position;
}

function player_update(delta){
    if(player != undefined) {
        var collider = player.get_component("aabb");
        if(collider.colliding){
            //console.log("Colliding");
        }
    }
}
