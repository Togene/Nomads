var paused = true;
var edit = false;

function keyboard_init(){
    
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );
}

function onKeyDown( e ) {
    switch ( e.keyCode ) {
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
        case 80: // P
            p = true;
            pause();
            break;
        case 27: // ESC
            console.log("checking esc");
            break;
        case 69: // E
            edit_mode();
            break;
    }
};

function onKeyUp( e ) {
    switch ( e.keyCode ) {
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
        case 80:
            p = false;
            break;
        case 27:
            console.log("checking esc");
            break;
    }
};

function edit_mode(){
    if(!paused){
        
        if(controls.isLocked){
            edit = true;
            override = true;
            document.exitPointerLock();
        } else {
            edit = false;
            override = false;
            controls.domElement.requestPointerLock();
        }
    }
}


function pause(){
    pointer_lock_control();
}

function pointer_lock_control(){

    if(edit){
        edit = false;
        override = false;
        paused = true;
        
        pause_show();
        controls.unlock();
    } else {
        if(controls.isLocked){
            paused = true;
            controls.unlock();
        } else {
            paused = false;
            controls.lock();
        }
    }
}