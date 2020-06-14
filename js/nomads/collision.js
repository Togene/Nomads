var collision_tree;
var nearest = [];
var nearest_debug = [];
var mag_mult = 2.2;
var rangecheck;

function collision_init(){
    collision_tree = new quad_tree(new rectangle(0, 0, 10000, 10000), 10);
    rangecheck = new rectangle(0, 0, 5, 5);
}   

function broad_quad_tree_insert(o){
    collision_tree.insert(o);
}

function collision_update(delta){
    world_collision(delta);
}

function world_collision(delta){
    if(collision_tree != undefined && player != undefined) {
            collision_tree.forEach(function(e){

            if(WORLD_COLLISION_ARRAY != null || WORLD_COLLISION_ARRAY.length != 0){
                var raycaster = new THREE.Raycaster(new THREE.Vector3(
                    e.transform.position.x,
                    0,
                    e.transform.position.z), 
                    new THREE.Vector3(0, 1, 0), 0, 5);
            
                var intersections = raycaster.intersectObjects(WORLD_COLLISION_ARRAY);
            
                //var onObject = intersections.length > 0;
                
                var lb = e.get_component("rigidbody");

                if(intersections[0] !== undefined){
                    if( lb != undefined){
                        if(e.name == "player"){
                            lb.ground(intersections[0].point.y, true);
                        } else {
                            lb.ground(intersections[0].point.y, false);
                        }
                    }
                }
            }
        });
    }
}

