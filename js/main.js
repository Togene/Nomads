var scene, renderer, camera, map_camera, clock;

function init(){
    scene = new THREE.Scene();
    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x379FE8, 1 );
    renderer.autoClear = false;

    document.body.appendChild( renderer.domElement );
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    scene.add(camera);
    // orthographic cameras
	map_camera = new THREE.OrthographicCamera(
        window.innerWidth / -2,		// Left
        window.innerWidth / 2,		// Right
        window.innerHeight / 2,		// Top
        window.innerHeight / -2,	// Bottom
        -5000,            			// Near 
        10000 );           			// Far 
        map_camera.up = new THREE.Vector3(0,0,-1);
        map_camera.lookAt( new THREE.Vector3(0,-1,0) );
    scene.add(map_camera);

    window.addEventListener('resize', onWindowResize, false );    
    
    //Grid helper
    var size = 100;
    var divisions = 10;
    var grid_helper = new THREE.GridHelper(size, divisions);
    grid_helper.position.set(0, 0, 0);

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    scene.add(directionalLight);
    scene.add(grid_helper);
    scene.fog = new THREE.Fog(new THREE.Color(0xffffff), 0.0025, 1000);
}

function animate(){
    requestAnimationFrame(animate);
    render();
    game_update(clock.getDelta());
  
}

function render() {
    var w = window.innerWidth, h = window.innerHeight;
	// setViewport parameters:
	//  lower_left_x, lower_left_y, viewport_width, viewport_height
	renderer.setViewport( 0, 0, w, h);
	renderer.clear();
	
	// full display
	// renderer.setViewport( 0, 0, SCREEN_WIDTH - 2, 0.5 * SCREEN_HEIGHT - 2 );
    renderer.render(scene, camera);
	
	// minimap (overhead orthogonal camera)
    //  lower_left_x, lower_left_y, viewport_width, viewport_height
    var width = (map_camera.left)/4;
    
	renderer.setViewport(w/2 + width, h/2 + width, w, h);
	renderer.render(scene, map_camera);
}
   
function onWindowResize() {
    //camera.aspect = window.innerWidth / window.innerHeight;
    //camera.updateProjectionMatrix();
    //renderer.setSize( window.innerWidth, window.innerHeight );
}

init();
//launch async then bootstrap game when its done
antlion_init(); //antlion init -> data waterfall -> antlion done -> game bootstrap
animate();






