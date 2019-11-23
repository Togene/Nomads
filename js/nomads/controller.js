var controls;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();

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
                if ( canJump === true ) velocity.y += 350;
                canJump = false;
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
        }
    };
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );
}

function movement(delta){
    
    if(controls !== undefined){
        if ( controls.isLocked === true ) {
            //raycaster.ray.origin.copy( controls.getObject().position );
           // raycaster.ray.origin.y -= 10;
            //var intersections = raycaster.intersectObjects( objects );
            var onObject = true;//intersections.length > 0;
            var time = performance.now();
           // var delta = delta; //( time - prevTime ) / 1000;
            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
            velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
            direction.z = Number( moveForward ) - Number( moveBackward );
            direction.x = Number( moveRight ) - Number( moveLeft );
            direction.normalize(); // this ensures consistent movements in all directions
            if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
            if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;
            if ( onObject === true ) {
                velocity.y = Math.max( 0, velocity.y );
                canJump = true;
            }
            controls.moveRight( - velocity.x * delta );
            controls.moveForward( - velocity.z * delta );
            controls.getObject().position.y += ( velocity.y * delta ); // new behavior
            if ( controls.getObject().position.y < 0 ) {
                velocity.y = 0;
                controls.getObject().position.y = 0;
                canJump = true;
            }
            prevTime = time;
        }
    }
    
}