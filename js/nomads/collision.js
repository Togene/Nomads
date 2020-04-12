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
    broad_collision_check(delta);
    player_collision_check(delta);
    floor_collision_check(delta);

}

function floor_collision_check(delta){
    if(collision_tree != undefined && player != undefined) {
        collision_tree.forEach(function(e){
            //floor_narrow_check(e, delta);
            land_check(e, delta);
        });
    }
}

function land_check(e, delta){

    if(WORLD_COLLISION_ARRAY != null || WORLD_COLLISION_ARRAY.length != 0){
        var raycaster = new THREE.Raycaster(new THREE.Vector3(
            e.transform.position.x,
            0,
            e.transform.position.z), 
            new THREE.Vector3(0, 1, 0), 0, 5);
    
        var intersections = raycaster.intersectObjects(WORLD_COLLISION_ARRAY);
    
        var onObject = intersections.length > 0;
        
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
}

function floor_narrow_check(e, delta){
    
    if(e != undefined){
        var lb = e.get_component("rigidbody");
        var lr = e.get_component("ray");

        var r = floor.get_component("aabb");
        var intersection = r.ray_intersect(lr);

        if(intersection.val){
            lr.set_intersecting(true);

            if(e.name == "player"){
                lb.ground(intersection.y, true);
            } else {
                lb.ground(intersection.y, false);
            }
        } 
    }
}

function player_collision_check(delta){
    if(player != undefined){
        near = [];
        near_debug = [];

        rangecheck.x = player.transform.position.x;
        rangecheck.y = player.transform.position.z;
        
        collision_tree.query(rangecheck, near, near_debug);

        sphere_collision_check(near, player, delta);
    }
}

function broad_collision_check(delta){
    if(collision_tree != undefined && player != undefined) {
        collision_tree.forEach(function(e){
            if(e != undefined && e.get_component("rigidbody") != undefined){
                near = [];
                near_debug = [];
                var rangecheck = new rectangle(0, 0, 1, 1);

                rangecheck.x = e.transform.position.x
                rangecheck.y = e.transform.position.z;

                collision_tree.query(rangecheck, near, near_debug);
                
                near.sort(function(a, b){
                    return a.d - b.d;
                });

                //near.splice( near.indexOf(e), 1 );
                narrow_collision_check(near, e, delta);
            }
        });
    }
}

function sphere_collision_check(near, e, delta){
    var l = e.get_component("aabb");
    var lb = e.get_component("rigidbody");

    l.set_colliding(false);

    for(var j = 0; j < near.length; j++) {

        if (e == near[j].o){continue;}

        var rs = near[j].o.get_component("sphere");
            
        if(rs != null){
        rs.set_colliding(false); 

            if(sat_sphere_response(e, l, rs)){
                rs.set_colliding(true); 
                console.log("sphere colliding")
            }

        }
    }   
}

function narrow_collision_check(near, e, delta){

    var l = e.get_component("aabb");
    var lb = e.get_component("rigidbody");
    var lr = e.get_component("ray");

    l.set_colliding(false);
    
    if(lb != null) lb.set_grounded(false);
    for(var i = 0; i < near.length; i++) {
        
        if (near[i].o == e){continue;}

        var r = near[i].o.get_component("aabb");
        var rb = near[i].o.get_component("rigidbody");
        
        r.set_colliding(false);
        if(rb != null) rb.set_grounded(false);

        var delt = near[i].o.transform.position.clone().sub(e.transform.position);
        delt.y = 0;

                    
        if(lr.length != undefined){
            for(var j = 0; j < lr.length; j++){
                collision_ray_response(l, r, lr[j], lb, near[i].o);
            }
        } else { 
            collision_ray_response(l, r, lr, lb, near[i].o);
        }
        
        if(sat_response(e, l, r, lb, rb, near[i].o, delta)){
            l.set_colliding(true);
            r.set_colliding(true);
           break;
        };

        //TODO: check for 90/180/270 dagree's as not roated
        if(e.transform.has_rotated() || near[i].o.transform.has_rotated()){
        //stable_sat for OOB, 
            
        } else {
            //Swept for AABB
            //if(sweep_response(e, l, r, lb, rb, near[i].o, delt)){};
            //if(sweep_response(e, l, r, lb, rb, near[i].o, delt)){};
        } 
    
    }
}

function sat_sphere_response(e, l, r){
    
    var stable_sat_init = l.intersect_sat_aabb_sphere(r);

    if(stable_sat_init.result){return true;} 

    return false;
}

function sat_response(e, l, r, lb, rb, near, delta){

    var step = lb.get_step(new THREE.Vector3(), delta);
    var tiny_step = new THREE.Vector3(0.01, 0.01, 0.01).multiply(step.clone().normalize());
    var step_total = new THREE.Vector3();
    var k = 0;

    if(step.length() < 0.2){
        //console.log("%c no point doing discreate shit", 'color: #00ff00');
        var sat = l.intersect_sat_aabb(r, null, true, null, null);

        if(sat.result) {
            if(lb != undefined){lb.null_velocity(delta);}
            if(rb != undefined){rb.null_velocity(delta);}
            
            l.set_colliding(true);
            r.set_colliding(true);

            if(sat.axis.y >= 0.55 && e.name == "player"){
                if(lb != null) lb.set_grounded(true);
                if(rb != null) rb.set_grounded(true);
                canJump = true;
            }
    
            e.transform.position.x += sat.axis.x * sat.gap * 1;
            e.transform.position.z += sat.axis.z * sat.gap * 1;
            e.transform.position.y += sat.axis.y * sat.gap * 1;

            return true;
        }
        
    } else {
        while(k < 100){
            step_total.add(tiny_step);
    
            var sat = l.intersect_sat_aabb(r, null, true, step_total, null);
            if(sat.result){
  
                if(lb != undefined){lb.null_velocity(delta, false);}
                if(rb != undefined){rb.null_velocity(delta, false);}
                
                l.set_colliding(true);
                r.set_colliding(true);
     
                if(sat.axis.y >= 0.55 && e.name == "player"){
                    canJump = true;

                    if(lb != null) lb.set_grounded(true);
                    if(rb != null) rb.set_grounded(true);
                } 
                
                e.transform.position.add(step_total);

                e.transform.position.x += sat.axis.x * sat.gap * 1;
                e.transform.position.z += sat.axis.z * sat.gap * 1;
                e.transform.position.y += sat.axis.y * sat.gap * 1;
                
        
                //console.log("found collision at ", k);
                return true; 
            }

            if(step_total.length() >= step.length()){
                //console.log("%csteps ended at ", 'color: #bada55', k); 
                break;
            }
            k++;
        }
    }
    return false;
}

function general_sat(e, l, r, lb, rb, near, delta){
    var sat = l.intersect_sat_aabb(r, null, true, null, null);

    if(sat.result) {
        e.transform.position.x += sat.axis.x * sat.gap * 1;
        e.transform.position.z += sat.axis.z * sat.gap * 1;
        e.transform.position.y += sat.axis.y * sat.gap * 1;

        if(sat.axis.y >= 0.55 && e.name == "player"){
            if(lb != null) lb.set_grounded(true);
            if(rb != null) rb.set_grounded(true);
            canJump = true;
        }

        l.set_colliding(true);
        r.set_colliding(true);

        if(lb != undefined){lb.null_velocity(delta);}
        if(rb != undefined){rb.null_velocity(delta);}

        return true;
    }

    return false;
}

function debug_direction (f, t, cutoff){

    var d = f.clone().sub(t);
    var dir = t.clone().sub(f).normalize();

    if(d.length() > cutoff){
        var material = new THREE.LineBasicMaterial({
            color: 0x0000ff
        });
        
        var geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3().copy(f),
            new THREE.Vector3().copy(t),
        );
        
        var line = new THREE.Line( geometry, material );
        scene.add( line );

        var normal_arrow = new THREE.ArrowHelper( dir, f, .25, 0x00FF00 );
        scene.add( normal_arrow );
    }
}

function sweep_response(e, l, r, lb, rb, near, delt){

    var sweep = l.intersect_sweep_aabb(r, delt);
                    
    if(sweep.hit != null){ 
        l.set_colliding(true);
        r.set_colliding(true);
            //     
        if(lb != undefined) lb.null_velocity();
        if(rb != undefined) rb.null_velocity();
        collision_sweep_response(sweep, e, r);
        return true;  
    } 
    
    
    return false;               
}

function collision_ray_response(l, r, lr, lb, r_o){
    var intersection = r.ray_intersect(lr);

    if(intersection.val){
        lr.set_intersecting(true);

        if(r_o.name == "player"){
            lb.ground(intersection.y, true);
        } else {
            lb.ground(intersection.y, false);
        }
    } 
}

function collision_sweep_response(sweep, e, r){
    var nx = Math.abs(sweep.hit.normal.x);
    var sx = Math.sign(sweep.hit.normal.x);

    var nz = Math.abs(sweep.hit.normal.z);
    var sz = Math.sign(sweep.hit.normal.z);

    var face = 0;
    var hit_clone = sweep.hit.position.clone();

    if(nx > nz){
        if(sx > 0){
            face = r.max.x;
        } else {
            face = r.min.x;
        }
        hit_clone.x = face;
        e.transform.position.x = hit_clone.x - (.5 * (sx * -1));
    } else {
        if(sz > 0){
            face = r.max.z;
        } else {
            face = r.min.z;
        }
        hit_clone.z = face;
        e.transform.position.z = hit_clone.z - (.5 * (sz * -1));
    }
}

function collision_response(lb, rb, n, delta){

    //no rigidbodies, no collision
    if(lb == null && rb == null){return;}

    //Handle Nulls and Kenetics
    if(rb == null && lb != null){
        lb.flip_velocity(n, delta);
    }
    else if(lb == null && rb != null){
        rb.flip_velocity(n, delta);
    } else {
        var lb_dir = lb.get_direction();
        var rb_dir = rb.get_direction();

        rb.add_force(lb.get_magnitude()/rb.mass, lb_dir);
        lb.add_force(rb.get_magnitude()/lb.mass, n);
    }
}
