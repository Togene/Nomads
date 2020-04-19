var mouse = {x: 0, y: 0};
var mouse_three = {x: 0, y: 0};

var mouse_ray;
var mouse_hit = {x:0, y:0, z:0};
var right_mouse_button = false;
var selected = null, hovered = null;
var mouse_first_b = false;

function mouse_init(){
    mouse_ray = new ray();
    
    //renderer.domElement.addEventListener('click', mouse_raycast, false);

    //remove defualt rightlick menu popup (save image one)
    //renderer.domElement.addEventListener('contextmenu', event => event.preventDefault());
    
    renderer.domElement.addEventListener('contextmenu', event => event.preventDefault());
    document.addEventListener('mousedown', mouse_down, false );
    document.addEventListener('mouseup', mouse_up, false );
    document.addEventListener('mousemove', mouse_move, false)
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

        if(e.which == 1){
            if(edit){
                mouse_first_b = true;
                
                if(hovered != null){
                    if(selected != null && selected != hovered){
                        selected.get_component("aabb").set_visule_color(0xffffff);
                        selected.get_component("aabb").set_decube_active(false);
                    }
                    selected = hovered;
                    selected.get_component("aabb").set_visule_color(0xff0000);
                    mouse_hit.x =  selected.transform.position.x;
                    mouse_hit.y =  selected.transform.position.y;
                    mouse_hit.z =  selected.transform.position.z;

                } else {
                    if(selected != null){
                        selected.get_component("aabb").set_visule_color(0xffffff);
                        selected.get_component("aabb").set_decube_active(false);
                    }

                    selected = null;
                }
                
            } else if(pause){
                paused = false;
                controls.lock();
            }
        }
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

    if(edit){
        if(e.which == 1){
            mouse_first_b = false;
       }
    }
}

function mouse_move(e){
    if(edit){

        mouse_hover_raycast(e);

        mouse_three_raycast(e);
    }
}

var grid_size = (pixel * 2) * 16;

function mouse_update(delta){
    if(selected != null && edit){
        if(mouse_first_b){
            selected.transform.position.x = grid_size * Math.ceil((mouse_hit.x-0.5)/grid_size);
            selected.transform.position.z = grid_size * Math.ceil((mouse_hit.z-0.5)/grid_size);

            var ray = new THREE.Raycaster(selected.transform.position, new THREE.Vector3(0, -1, 0), 0 , 5);
            var intersects = ray.intersectObjects(WORLD_COLLISION_ARRAY);

            var y = 0;

            if(intersects[0] != undefined){
                y = intersects[0].point.y ;
            } else {
                y = selected.transform.position.y
            }

            selected.transform.position.y = y + selected.transform.scale.y/2 || mouse_hit.y + selected.transform.scale.y/2;
        }
    } else if(selected != null & paused || selected != null & !edit){
        selected.get_component("aabb").set_visule_color(0xffffff);
        selected.get_component("aabb").set_decube_active(false);
    }
    
    //! fix this dont wana keep assigning
    if(!edit && selected != null){selected = null;}
}

function mouse_three_raycast(e){   
    mouse_three.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse_three.y = ((e.clientY / window.innerHeight) * 2 - 1) * -1;

    var mouse_three_ray = new THREE.Raycaster();

    mouse_three_ray.setFromCamera(mouse_three, camera);

    var intersects = mouse_three_ray.intersectObjects(WORLD_COLLISION_ARRAY);

    if(intersects.length != 0){
        mouse_hit.x = intersects[0].point.x;
        mouse_hit.y = intersects[0].point.y;
        mouse_hit.z = intersects[0].point.z;
    }
}

function mouse_hover_raycast(e){

    if(hovered != null && hovered != selected){
        var aabb = hovered.get_component("aabb");
        aabb.set_decube_active(false);
        hovered = null;
    }

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = ((e.clientY / window.innerHeight) * 2 - 1) * -1;
    
    mouse_ray.set_from_camera(mouse, camera);

    for(var i = 0; i < physics_objects.length; i++){

        var aabb = physics_objects[i].get_component("aabb");

        if(aabb != undefined){
            if(aabb.parent.name == "player"){continue;}

            var intersect = aabb.ray_intersect(mouse_ray);
            if(intersect.val){
                console.log(aabb.parent.name);
                hovered = aabb.parent;
                aabb.set_decube_active(true);

                return;
            }
        }
    }
    
    hovered = null;
}