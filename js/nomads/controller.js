var controls;
var moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
var shift = false;
var space = false;
var canJump = false;
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var bounce_distance = 8;


var speed = 2;
var speed_mult = 1;


var lock = false;

function controller_init(){
    controls = new THREE.PointerLockControls( camera, document.body );
    scene.add( controls.getObject() );
}

function get_step_x(){
    var step = speed;

    return direction.x * step * speed_mult;
}

function get_step_z(){
    var step = speed;

    return direction.z * step * speed_mult;
}

function movement(delta){
    //var step = step_size;
    var step = speed;

    if(controls !== undefined && player != null){
        if ( controls.isLocked === true ) {
            var player_body = player.get_component("rigidbody");
            var player_col = player.get_component("aabb");

            direction.z = Number( moveForward ) - Number( moveBackward );
            direction.x = Number( moveRight ) - Number( moveLeft );
            direction.normalize(); 
  
            if(shift) { speed_mult = 2.1;} else { speed_mult = 1;}

            if ((moveForward || moveBackward)){
               player_body.velocity.z -= direction.z * (step * speed_mult);
            } 
        
            if ((moveLeft || moveRight)){
                player_body.velocity.x -= direction.x * (step * speed_mult);
            }

            if(space){
                if (canJump === true ){
                        player.get_component("rigidbody").add_force(
                            20, new THREE.Vector3(0, 1, 0));
                            canJump = false;
                    }
            }
            //camera rotation to player rotation
            //player.transform.rotation.qset(controls.getObject().quaternion.clone());

            //camera pos = player pos
            controls.getObject().position.copy(player.transform.position);

            if ( controls.getObject().position.y == 0.0 ) {
                canJump = true;
            }

            
        }
    }
    
}