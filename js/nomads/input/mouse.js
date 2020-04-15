var mouse = {x: 0, y: 0};
var mouse_ray;
var right_mouse_button = false;
var selected = null;

function mouse_init(){
    mouse_ray = new ray();
    
    //renderer.domElement.addEventListener('click', mouse_raycast, false);

    //remove defualt rightlick menu popup (save image one)
    //renderer.domElement.addEventListener('contextmenu', event => event.preventDefault());
    
    renderer.domElement.addEventListener('contextmenu', event => event.preventDefault());
    document.addEventListener( 'mousedown', mouse_down, false );
    document.addEventListener( 'mouseup', mouse_up, false );

}

function mouse_up(e){

    if( e.which == 2) {e.preventDefault(); }

    e.preventDefault();

    if(e.which == 3){
        if(!paused && edit){
            document.exitPointerLock();
            override = true;
            right_mouse_button = false;
        }
    }

    //console.log(e);
}

function mouse_down(e){

    if(e.which == 2) {e.preventDefault();}

    e.preventDefault();

    if(e.which == 3){
        if(!paused && edit){
            controls.domElement.requestPointerLock();
            override = false;
            right_mouse_button = true;
        }
    } 

    if(edit){
        if(e.which == 1){
            mouse_raycast(e);
       }
    }
 
}

function mouse_update(delta){
    if(selected != null && edit){
        console.log("selected?");
        if(moveForward){
            selected.transform.position.z += 1 * delta;
        } else if(moveLeft){
            selected.transform.position.x += 1* delta;
        } else if(moveRight){
            selected.transform.position.x -= 1* delta;
        }else if(moveBackward){
            selected.transform.position.z -= 1* delta;
        }
    }
    
    //! fix this dont wana keep assigning
    if(!edit && selected != null){selected = null;}
}

function mouse_raycast(e){
    //console.log(e);
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;

    mouse_ray.set_from_camera(mouse, camera);

    for(var i = 0; i < physics_objects.length; i++){
        var aabb = physics_objects[i].get_component("aabb");
        
        if(aabb != undefined){
            if(aabb.parent.name == "player"){continue;}

            if(aabb.ray_intersect(mouse_ray).val){
                console.log(aabb.parent.name);
                selected = aabb.parent;
                console.log(selected);
                return;
            }
        }
    }
    
    selected = null;
    //var intersects = mouse_ray.intersectObjects(WORLD_COLLISION_ARRAY);
//
    //if(intersects.length != 0){
    //    console.log(intersects[0]);
    //}
}