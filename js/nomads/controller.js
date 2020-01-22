var controls;
var moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
var shift = false;
var space = false;
var canJump = false;
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var bounce_distance = 8;

var step = 4;
var speed_mult = 6;

function controller_init(){
    controls = new THREE.PointerLockControls( camera, document.body );
    scene.add( controls.getObject() );

    controller_gui_init();
    controller_key_init();
}

function controller_gui_init(){

    var blocker = document.getElementById( 'blocker' );
    var instructions = document.getElementById( 'instructions' );
    instructions.addEventListener( 'click', function () {
        controls.lock();
    }, false );
    controls.addEventListener( 'lock', function () {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    } );
    controls.addEventListener( 'unlock', function () {
        blocker.style.display = 'block';
        instructions.style.display = '';
    } );
}

function controller_key_init(){
    
    var onKeyDown = function ( event ) {
        switch ( event.keyCode ) {
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
                space = true;
                canJump = false;
                break;
            case 16: // SHIFT
                shift = true;
                break;
        }
    };
    var onKeyUp = function ( event ) {
        switch ( event.keyCode ) {
            case 32: //space
                space = false;
                break;
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
            case 39: // right
            case 68: // d
                moveRight = false;
                break;
            case 16: // SHIFT
                shift = false;
                break;
        }
    };
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );
}

function get_step_x(){
    return direction.x * step * speed_mult;
}

function get_step_z(){
    return direction.z * step * speed_mult;
}

function movement(delta){
    //var step = step_size;

    delta /= 2;

    if(controls !== undefined && player != null){
        if ( controls.isLocked === true ) {
            var player_body = player.get_component("rigidbody");
            var col = player.get_component("aabb");

            direction.z = Number( moveForward ) - Number( moveBackward );
            direction.x = Number( moveRight ) - Number( moveLeft );
            direction.normalize(); 
            

            if(shift) { speed_mult = 2.1;} else { speed_mult = 1;}

            if ((moveForward || moveBackward)){
               player_body.velocity.z -= direction.z * step * speed_mult;
            } 
        
            if ((moveLeft || moveRight)){
               player_body.velocity.x -= direction.x * step * speed_mult;
            }

            if(space){
                if (canJump === true ){
                        player.get_component("rigidbody").add_force(
                            70, new THREE.Vector3(0, 1, 0));
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