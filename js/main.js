var scene, renderer, camera, map_camera, clock, stats;

var composer;

var sun;

var show_mini = false;
var depthMaterial, depthRenderTarget;

function create_mini_map(){
    if(show_mini) {
          // orthographic cameras
        map_camera = new THREE.OrthographicCamera(
            window.innerWidth / -2,		// Left
            window.innerWidth / 2,		// Right
            window.innerHeight / 2,		// Top
            window.innerHeight / -2,	// Bottom
            -5000,            			// Near 
            1000 );           			// Far 
            map_camera.up = new THREE.Vector3(0,0,-1);
            map_camera.lookAt( new THREE.Vector3(0,-1,0) 
        );
        scene.add(map_camera);
    }
}

function init(){
    scene = new THREE.Scene();
    clock = new THREE.Clock();
  
    renderer = new THREE.WebGLRenderer();
    
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x379FE8, 1 );
    renderer.autoClear = false;

    document.body.appendChild( renderer.domElement );
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000000);
    camera.position.z = 5;
    scene.add(camera);

    var renderScene = new THREE.RenderPass( scene, camera );
   
    composer = new THREE.EffectComposer(renderer);
    composer.setSize( window.innerWidth,window.innerHeight);
    composer.addPass(renderScene)
    
    var bloomPass = new THREE.BloomPass(0.6, 25, 12, 16);
    
    composer.addPass(bloomPass);

    var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    composer.addPass(effectCopy);
    effectCopy.renderToScreen = true;

    

    create_mini_map()

    window.addEventListener('resize', onWindowResize, false );    

    sun = new THREE.DirectionalLight( 0xffffff, 1 );
    scene.add(sun);

    scene.fog = new THREE.Fog(new THREE.Color(0xffffff), 0.0025, 1000);

    stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );
}

function animate(){
    
    setTimeout( function() {
        stats.begin();
            requestAnimationFrame(animate);
            game_update(clock.getDelta());
        stats.end();
    }, 1000 / 60)

    //renderer.render( scene, camera);
    composer.render();

    //render();
}

function render() {
    var w = window.innerWidth, h = window.innerHeight;
	// setViewport parameters:
	//  lower_left_x, lower_left_y, viewport_width, viewport_height
	//renderer.setViewport( 0, 0, w, h);
	//renderer.clear();
	
	// full display
    // renderer.setViewport( 0, 0, SCREEN_WIDTH - 2, 0.5 * SCREEN_HEIGHT - 2 );
    //renderer.render(scene, camera);
    //composer.render();
   
	
	// minimap (overhead orthogonal camera)
    // lower_left_x, lower_left_y, viewport_width, viewport_height
    if (show_mini) {
        var width = (map_camera.left)/4;
    
        renderer.setViewport(w/2 + width, h/2 + width, w, h);
        renderer.render(scene, map_camera);
    }
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






