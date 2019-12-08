var controls;
var moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
var shift = false;
var canJump = false;
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var bounce_distance = 8;

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
                if ( canJump === true ) player.get_component("rigidbody").velocity.y += 350;
                canJump = false;
                break;
            case 16: // SHIFT
                shift = true;
                break;
        }
    };
    var onKeyUp = function ( event ) {
        switch ( event.keyCode ) {
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

function movement(delta){
          
    delta /= 2;
    if(player != null){
        var player_body = player.get_component("rigidbody");
    }

    if(controls !== undefined){
        if ( controls.isLocked === true ) {

            direction.z = Number( moveForward ) - Number( moveBackward );
            direction.x = Number( moveRight ) - Number( moveLeft );
            direction.normalize(); 
        
            var speed = 5;

            if(shift) { speed = speed * 3;} else { speed = speed;}

            if ((moveForward || moveBackward)){
                player_body.velocity.z -= direction.z * speed ;
            } 
        
            if ((moveLeft || moveRight)){
                player_body.velocity.x -= direction.x * speed ;
            }



            player.transform.rotation.qset(controls.getObject().quaternion.clone());

            controls.getObject().position.y += ( player_body.velocity.y * delta ); // new behavior
            controls.getObject().position.x = player.transform.position.x;
            controls.getObject().position.z = player.transform.position.z;

            if ( controls.getObject().position.y <= 0.0 ) {
                player_body.velocity.y = 0;
                controls.getObject().position.y = 0;
                canJump = true;
            }

    
        }
    }
    
}