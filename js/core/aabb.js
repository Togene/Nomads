//credit : https://github.com/noona <--- give this person some love
//suace : https://github.com/noonat/intersect/blob/master/src/intersect.ts


function aabb(transform, w, h, d, debug = false, hex = 0x00FF00, fill = false){
    
    var transform_clone = transform.clone();
    transform_clone.scale = new THREE.Vector3(1,1,1);

    this.centre = transform.get_transformed_position().clone();
    this.transformed_dimensions = new THREE.Vector3(w, h, d);
    this.transformed_dimensions.applyMatrix4(transform_clone.get_transformation().toMatrix4());

    this.w = w;
    this.h = h;
    this.d = d;
    
    //used for ray intersection, and probs should be used in general with things
    this.min = new THREE.Vector3(
        -this.w,
        -this.h,
        -this.d
    );

    this.max = new THREE.Vector3(
        this.w,
        this.h,
        this.d
    );

    this.max.applyMatrix4(transform_clone.get_transformation().toMatrix4());
    this.min.applyMatrix4(transform_clone.get_transformation().toMatrix4());

    this.parent = null;
    this.colliding = false;

    this.non_active_color = hex;
    this.active_color = 0x0000FF;

    this.decube = new decube(this.centre, this.min, this.max, this.w, this.d, this.h);
    this.decube.update(this.min, this.max, transform, 1);
};

aabb.prototype.min_max_set = function(){
    this.min = new THREE.Vector3(
        -this.w,
        -this.h,
        -this.d
    );
    
    this.max = new THREE.Vector3(
        this.w,
        this.h,
        this.d
    );

    if(this.parent != null){
        
        var transform_clone = this.parent.transform.clone();
        
        transform_clone.scale = new THREE.Vector3(1,1,1);
        
        this.max.applyMatrix4(transform_clone.get_transformation().toMatrix4());
        this.min.applyMatrix4(transform_clone.get_transformation().toMatrix4());
    }
}


aabb.prototype.set_parent = function(p){
    this.parent = p;
};

aabb.prototype.set_visule_color = function(hex){
    //this.visule.material.color = new THREE.Color(hex);
    this.decube.set_color(hex);
}

aabb.prototype.update = function(delta){
    if(!(this.centre.equals(this.parent.transform.get_transformed_position()))){
     
        this.centre.copy(this.parent.transform.get_transformed_position());

        var transform_clone = this.parent.transform.clone();
        transform_clone.scale = new THREE.Vector3(1,1,1);
    
        this.min_max_set();
        this.transformed_dimensions.applyMatrix4(transform_clone.get_transformation().toMatrix4());

    }
        
    if(this.decube != null){
        if( this.parent != null){
            this.decube.update(this.min, this.max, this.parent.transform, delta);
        }
    }

    if(this.colliding && this.decube != null){
        this.decube.set_active(true);
        this.set_visule_color(this.active_color);
    }
    
    if(!this.colliding && this.decube != null){
        this.decube.set_active(false);
        this.set_visule_color(this.non_active_color);
    }
}

aabb.prototype.direct_position_set = function(p){

    if(p === undefined){
        console.error("No Paramatre Given");
    } else {
        this.centre = p.clone();
    }
}

aabb.prototype.direct_position_add = function(p){
    if(p === undefined){
        console.error("No Paramatre Given");
    } else {
        this.centre.add(p); 
    }
}

aabb.prototype.set_colliding = function(bool){
    this.colliding = bool;
}

aabb.prototype.intersect_segement = function(position, delta, pad_x, pad_z, pad_y){
    const scale_x = 1.0 / delta.x;
    const scale_z = 1.0 / delta.z;

    //y-component add
    const scale_y = 1.0 / delta.y;

    const sign_x = Math.sign(scale_x);
    const sign_z = Math.sign(scale_z);
    
    //y-component add
    const sign_y = Math.sign(scale_y);

    const near_time_x = (this.centre.x - sign_x * (this.w + pad_x) - position.x) * scale_x;
    const near_time_z = (this.centre.z - sign_z * (this.d + pad_z) - position.z) * scale_z;

    //y-component add
    const near_time_y = (this.centre.y - sign_y * (this.h + pad_y) - position.y) * scale_y;

    const far_time_x = (this.centre.x + sign_x * (this.w + pad_x) - position.x) * scale_x;
    const far_time_z = (this.centre.z + sign_z * (this.d + pad_z) - position.z) * scale_z;

    //y-component add
    const far_time_y = (this.centre.y + sign_y * (this.h + pad_y) - position.y) * scale_y;

    if(
    near_time_x > far_time_z || 
    near_time_x > far_time_y || 
    near_time_z > far_time_x ||
    near_time_z > far_time_y ||
    near_time_y > far_time_x ||
    near_time_y > far_time_z){
        return null;}
    
    //|| near_time_y > far_time_y

    var near_time_zx = near_time_x > near_time_z ? near_time_x : near_time_z;
    const near_time = near_time_zx > near_time_y ? near_time_zx : near_time_y;

    var far_time_zx = far_time_x < far_time_z ? far_time_x : far_time_z;
    const far_time = far_time_zx < far_time_y ? far_time_zx : far_time_y

    if(near_time >= 1 || far_time <= 0){return null;}

    const h = new hit(this);
    h.time = clamp(near_time, 0, 1);

    if(near_time_x > near_time_z){
        h.normal.x = -sign_x;
        h.normal.z = 0;
    } else {
        h.normal.x = 0;
        h.normal.z = -sign_z;
    }

    h.delta.x = (1.0 - h.time) * -delta.x;
    h.delta.z = (1.0 - h.time) * -delta.z;

    h.position.x = position.x + delta.x * h.time;
    h.position.z = position.z + delta.z * h.time;

    return h;
}

aabb.prototype.intersect_aabb = function(right){
    const dx = right.centre.x - this.centre.x;
    //half is just c + w
    const px = right.w + this.w - Math.abs(dx);

    if(px <= 0){return null;}

    const dz = right.centre.z - this.centre.z;
    const pz = right.d + this.d - Math.abs(dz);

    if(pz <= 0){return null;}

    const h = new hit(this);

    if(px < pz){
        const sx = Math.sign(dx);
        h.delta.x = px * sx;
        h.normal.x = sx;
        h.position.x = this.centre.x + this.w * sx;
        h.position.z = right.centre.z;
    } else {
        const sz = Math.sign(dz);
        h.delta.z = pz * sz;
        h.normal.z = sz;
        h.position.x = right.centre.x;
        h.position.z = this.centre.z + this.d * sz;
    }

    return h;
}

aabb.prototype.intersect_sweep_aabb = function(right, delta){
    const sw = new sweep();

    if(delta.x === 0 && delta.z === 0){
        sw.position.x = right.centre.x;
        sw.position.z = right.centre.z;
        sw.hit = this.intersect_aabb(right);
        sw.time = sw.hit != null ? (sw.hit.time = 0) : 1;
        return sw;
    }

    sw.hit = this.intersect_segement(right.centre, delta, right.w, right.d, right.h);
    
    if(sw.hit != null){
        sw.time = clamp(sw.hit.time - EPSILON, 0, 1);
        sw.position.x = right.centre.x + delta.x * sw.time;
        sw.position.z = right.centre.z + delta.z * sw.time;

        const direction = delta.clone();
        direction.normalize();

        sw.hit.position.x = clamp(
            sw.hit.position.x + direction.x * right.w,
            this.centre.x - this.w,
            this.centre.x + this.w 
        );

        sw.hit.position.z = clamp(
            sw.hit.position.z + direction.z * right.d,
            this.centre.z - this.d ,
            this.centre.z + this.d 
        );
    } else {
        sw.position.x = right.centre.x + delta.x;
        sw.position.z = right.centre.z + delta.z;
        sw.time = 1;
    }

    return sw;
}

//credit : http://www.dyn4j.org/2010/01/sat/
//helping with SAT collision detection
aabb.prototype.get_verts = function(){
    var vertices = [];
    
    var transform_clone = this.parent.transform.clone();
    transform_clone.scale = new THREE.Vector3(1,1,1);
    var m = transform_clone.get_transformation().toMatrix4();

    var vert_0 = new THREE.Vector3(-this.w, -this.h, -this.d);
    vert_0.applyMatrix4(m);
    vertices.push(vert_0);
     
    var vert_1 = new THREE.Vector3(this.w, -this.h, -this.d);
    vert_1.applyMatrix4(m);
    vertices.push(vert_1);
    
    var vert_3 = new THREE.Vector3(this.w, -this.h, this.d);
    vert_3.applyMatrix4(m);
    vertices.push(vert_3);

    var vert_2 = new THREE.Vector3(-this.w, -this.h, this.d);
    vert_2.applyMatrix4(m);
    vertices.push(vert_2);

    //console.log(vertices);
    return vertices;
}

aabb.prototype.refrence_transform = function(v, m){

    for(var i = 0; i < v.length; i ++){
        v[i].applyMatrix4(m);
    }

    return v;
}

aabb.prototype.get_norms = function(v){
    var n = v.length, crt, nxt, l, x1, z1;

    var normals = [];
    var mids = [];

    for(var i = 0; i < n; i++){
        crt = v[i];
        nxt = v[(i + 1) % v.length]; //this is a neat trick
        x1 = (nxt.z - crt.z);
        z1 = (nxt.x - crt.x);
        l = Math.sqrt(x1 * x1 + z1 * z1);

        mids[i] = new THREE.Vector3(
            (nxt.x + crt.x)/2, 
            0, 
            (nxt.z + crt.z)/2
        );

        normals[i] = new THREE.Vector3(x1/l, 0, z1/l);
        normals[i + 1] = new THREE.Vector3(-x1/l, 0, -z1/l);
    }
    return {n: normals, m: mids};
};

aabb.prototype.get_axes = function(v){
    axes = [v.length];

    for(var i = 0; i < v.length; i++){
        var p1 = v[i];
        var p2 = v[ i + 1 == v.length ? 0 : i + 1];
        var edge = p1.clone().sub(p2);
        var normal = edge.perp().normalize();

        if(normal.x == 0){normal.x = 0;}
        if(normal.z == 0){normal.z = 0;}
        if(normal.y == 0){normal.y = 0;}

        axes[i] = normal;
    }

    return axes;
}

aabb.prototype.project = function(n, v){

    var min = n.clone().dot(v[0]);
    var max = min;

    for(var i = 1; i < v.length; i++){

        var p = n.dot(v[i]);
        if(p < min){
            min = p;
        } else if(p > max){
            max = p;
        }
    }

    return new projection(min, max);
}

//credit to Randy Gaul manifold generation :
//https://www.randygaul.net/2013/03/28/custom-physics-engine-part-2-manifold-generation/

aabb.prototype.intersect_sat_aabb = function(right){

    var overlap = Infinity;
    var axis = null;

    var v = this.get_verts();
    var a  = this.get_axes(v);

    var rv =  right.get_verts();
    var ra  = right.get_axes(rv);

    for(var i = 0; i < a.length; i++){
        var proj_1 = this.project(a[i], v);
        var proj_2 = right.project(a[i], rv);

        if(!proj_1.overlap(proj_2)){
            return {result: false};
        } else {

            var o = proj_1.get_overlap(proj_2);

            if(o < overlap){
                //set to axis
                overlap = o;
                axis = a[i];
            }
        }
    }

    for(var i = 0; i < ra.length; i++){
        var proj_1 = this.project(ra[i], v);
        var proj_2 = right.project(ra[i], rv);

        if(!proj_1.overlap(proj_2)){
            return {result: false};
        } else {

            var o = proj_1.get_overlap(proj_2);

            if(o < overlap){
                //set to axis
                overlap = o;
                axis = ra[i];
            }
        }
    }
    var p0 = this.parent.transform.position.clone();
    var p1 = right.parent.transform.position.clone();

    var direction = p0.sub(p1);

    if(axis.dot(direction) < 0.0){
        axis.negate();
    }

    
    return {result: true, axis: axis, gap: overlap};
}


aabb.prototype.intersect_legacy = function(right){
    var lx = false;
    var rx = false;
    var ty = false;
    var by = false;
    var bz = false;
    var fz = false;

    var n = new THREE.Vector3();

    if(right.centre.x - right.w > this.centre.x + this.w){
        lx = true;
        n = new THREE.Vector3(1, 0, 0);
    }

    if(right.centre.x + right.w < this.centre.x - this.w){
        rx = true;
        n.add(new THREE.Vector3(-1, 0, 0));
    }

    if(right.centre.y - right.h > this.centre.y + this.h){
        by = true;
        n.add(new THREE.Vector3(0, -1, 0));
    }

    if(right.centre.y + right.h < this.centre.y - this.h){
        ty = true;
        n.add(new THREE.Vector3(0, 1, 0));
    }

    if(right.centre.z - right.d > this.centre.z + this.d){
        bz = true;
        n.add(new THREE.Vector3(0, 0, -1));
    }

    if(right.centre.z + right.d < this.centre.z - this.d){
        fz = true;
        n.add(new THREE.Vector3(0, 0, 1));
    }

    n.normalize();

    //console.log(
    //    "\n", "lx", lx, "rx", rx,"\n",
    //    "by", by, "ty", ty,"\n",
    //    "fz", fz, "bz", bz,"\n")
/*
          6----7
         /|   /|
        2----3 |
        | |  | |
        | 4--|-5
        |/   |/
        0----1
*/
    return {result: !(lx || rx || by || ty || fz || bz), normal: n};
}

aabb.prototype.ray_intersect = function(r){
    if(!(r instanceof ray)){return false;}

    //---------------------- X ---------------------------------
    var txmin = (this.min.x - r.origin.x) / r.direction.x;
    var txmax = (this.max.x - r.origin.x) / r.direction.x;

    if(txmin > txmax) {
        //* ------------ SWAP -----------
        //console.log("min x", txmin, "max x", txmax);
        var tmp = txmin;
        txmin = txmax;
        txmax = tmp;
        //console.log("min x", txmin, "max x", txmax);
        //* ------------ SWAP -----------
    }
    //---------------------- X ---------------------------------

    //---------------------- Y ---------------------------------
    var tymin = (this.min.y - r.origin.y) / r.direction.y;
    var tymax = (this.max.y - r.origin.y) / r.direction.y;

    if(tymin > tymax) {
        //* ------------ SWAP -----------
        //console.log("min y", tymin, "max y", tymax);
        var tmp = tymin;
        tymin = tymax;
        tymax = tmp;
        //console.log("min y", tymin, "max y", tymax);
        //* ------------ SWAP -----------
    }

    if((txmin > tymax) || (tymin > txmax)){return false;}
    if(tymin > txmin){txmin = tymin;}
    if(tymax < txmax){txmax = tymax;}
    //---------------------- Y ---------------------------------

    //---------------------- Z ---------------------------------
    var tzmin = (this.min.z - r.origin.z) / r.direction.z;
    var tzmax = (this.max.z - r.origin.z) / r.direction.z;

    if(tzmin > tzmax) {
        //* ------------ SWAP -----------
        //console.log("min z", tzmin, "max z", tzmax);
        var tmp = tzmin;
        tzmin = tzmax;
        tzmax = tmp;
        //console.log("min z", tzmin, "max z", tzmax);
        //* ------------ SWAP -----------
    }

    if((txmin > tzmax) || (tzmin > txmax)){return false;}
    if(tzmin > txmin){txmin = tzmin;}
    if(tzmax < txmax){txmax = tzmax;}
    //---------------------- Z ---------------------------------
    
    return {val : true, x: txmin, y: this.max.y, z: tzmin};
}

aabb.prototype.name = "aabb";
