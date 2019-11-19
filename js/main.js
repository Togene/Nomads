var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var clock;

clock = new THREE.Clock();

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

var controls = new THREE.PointerLockControls(camera);

var animate = function(){
    requestAnimationFrame(animate);

    game_update(clock.getDelta());

    renderer.render(scene, camera);
};

animate();


