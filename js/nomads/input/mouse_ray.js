var mouse = {x: 0, y: 0};
var mouse_ray;

function mouse_ray_init(){
    mouse_ray = new THREE.Raycaster();
    renderer.domElement.addEventListener('click', mouse_raycast, false);
}

function mouse_raycast(e){
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;

    mouse_ray.setFromCamera(mouse, camera);

    var intersects = mouse_ray.intersectObjects(WORLD_COLLISION_ARRAY);
    console.log("eh?");
    
    for(var i = 0; i < intersects[i]; i++){
        console.log(intersects[i]);
    }
   
}