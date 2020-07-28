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
    collision_tree.insert(
        new qt_point(
        o.transform.get_transformed_position(),
        o.id
    ));
}

function collision_update(delta){
    world_collision(delta);
}


function world_collision(delta){
    if(collision_tree != undefined && player != undefined) {
            collision_tree.forEach(function(e){

                var raycaster = new THREE.Raycaster(new THREE.Vector3(
                    Scene[e.id].transform.position.x,
                    0,
                    Scene[e.id].transform.position.z), 
                    new THREE.Vector3(0, 1, 0), 0, 5);
                    
                //console.log(ZONE_MAP)
                var intersections = raycaster.intersectObjects(WORLD_COLLISION_ARRAY);
                //var onObject = intersections.length > 0;
                ////e
                var lb = Scene[e.id].get_component("rigidbody");

                if(intersections[0] !== undefined){
                    console.log("something?")
                    if(lb != undefined){
                        if(Scene[e.id].name == "player"){
                            lb.ground(intersections[0].point.y, true);
                        } else {
                            lb.ground(intersections[0].point.y, false);
                        }
                    }
                }
        });
    }
}

