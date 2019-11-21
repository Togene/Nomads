var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var clock;

clock = new THREE.Clock();

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

var controls = new THREE.PointerLockControls(camera);

var blocker = document.getElementById('blocker');
var instructions = document.getElementById('instructions');

instructions.addEventListener('click', function () {

    controls.lock();

}, false);

controls.addEventListener('lock', function () {

    instructions.style.display = 'none';
    blocker.style.display = 'none';

});

controls.addEventListener('unlock', function () {

    blocker.style.display = 'block';
    instructions.style.display = '';

});

var animate = function(){
    requestAnimationFrame(animate);

    game_update(clock.getDelta());

    renderer.render(scene, camera);
};

input_init();
animate();

function input_init() {

    var onKeyDown = function (event) {

        switch (event.keyCode) {
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
                break;
            case 13:
                enter = true;
                break;
            case 191:
                break;
        }

    };

    var onKeyUp = function (event) {

        switch (event.keyCode) {

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
            case 13:
                enter = false;
                break;
            case 39: // right
            case 68: // ds
                moveRight = false;
                break;
        }

    };

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

}


