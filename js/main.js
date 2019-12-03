var scene, renderer, camera, clock;

function init(){
    scene = new THREE.Scene();
    clock = new THREE.Clock();
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x379FE8, 1 );
    document.body.appendChild( renderer.domElement );
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1500);
    camera.position.z = 5;

    window.addEventListener( 'resize', onWindowResize, false );    
    
    //Grid helper
    var size = 100;
    var divisions = 10;
    var grid_helper = new THREE.GridHelper(size, divisions);
    grid_helper.position.set(0, 0, 0);
    scene.add(grid_helper);
}

function animate(){
    requestAnimationFrame(animate);

    game_update(clock.getDelta());

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

init();
//launch async then bootstrap game when its done
antlion_init(); //antlion init -> data waterfall -> antlion done -> game bootstrap
animate();






