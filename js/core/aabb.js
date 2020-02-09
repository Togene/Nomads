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

    //how far the aabb will be projected into the future
    this.projection = new THREE.Vector3(1,1,1);

    this.max.applyMatrix4(transform_clone.get_transformation().toMatrix4());
    this.min.applyMatrix4(transform_clone.get_transformation().toMatrix4());

    this.parent = null;
    this.colliding = false;

    this.non_active_color = hex;
    this.active_color = 0x0000FF;

    this.decube = new decube(this.centre, this.min, this.max, this.w, this.d, this.h);
    this.decube.update(this.min, this.max, transform, 1);
};

aabb.prototype.set_projection = function(v){
    this.projection.copy(v);
}

aabb.prototype.min_max_set = function(t){
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
        this.max.applyMatrix4(t.get_transformation().toMatrix4());
        this.min.applyMatrix4(t.get_transformation().toMatrix4());
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
        
        transform_clone.position = 
            new THREE.Vector3(
                transform_clone.position.x * this.projection.x,
                transform_clone.position.y * this.projection.y,
                transform_clone.position.z * this.projection.z
            );

        this.min_max_set(transform_clone);
        this.transformed_dimensions.applyMatrix4(transform_clone.get_transformation().toMatrix4());

    }
        
    if(this.decube != null){
        if( this.parent != null){
            this.decube.update(this.min, this.max, this.parent.transform, this.projection, delta);
        }
    }

    this.decube.set_active(true);

    //if(this.colliding && this.decube != null){
    //    this.decube.set_active(true);
    //    this.set_visule_color(this.active_color);
    //}
    //
    //if(!this.colliding && this.decube != null){
    //    this.decube.set_active(false);
    //    this.set_visule_color(this.non_active_color);
    //}
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
aabb.prototype.get_verts = function(l_start, l_step){
    var vertices = [];
    
    var transform_clone = this.parent.transform.clone();
    //transform_clone.position;
    transform_clone.scale = new THREE.Vector3(1,1,1);
    
    var m = transform_clone.get_transformation().toMatrix4();
 
    var vert_0 = new THREE.Vector3(-this.w, -this.h, -this.d);
    vert_0.applyMatrix4(m);
    
    var vert_1 = new THREE.Vector3(this.w, -this.h, -this.d);
    vert_1.applyMatrix4(m);

    var vert_2 = new THREE.Vector3(this.w, -this.h, this.d);
    vert_2.applyMatrix4(m);

    var vert_3 = new THREE.Vector3(-this.w, -this.h, this.d);
    vert_3.applyMatrix4(m);

    var vert_4 = new THREE.Vector3(-this.w, this.h, -this.d);
    vert_4.applyMatrix4(m);
    
    var vert_5 = new THREE.Vector3(this.w, this.h, -this.d);
    vert_5.applyMatrix4(m);

    var vert_6 = new THREE.Vector3(this.w, this.h, this.d);
    vert_6.applyMatrix4(m);

    var vert_7 = new THREE.Vector3(-this.w, this.h, this.d);
    vert_7.applyMatrix4(m);
    

      /*
        v7 ------ v6
        |          |
        |          |
        |          |
        v4 ------ v5


        v3 ------ v2
        |          |
        |          |
        |          |
        v0 ------ v1
    */

    //at this point the velocity should already be added
    //so we need to substract and
    vertices.push(vert_0);
    vertices.push(vert_1);
    vertices.push(vert_2);
    vertices.push(vert_3);
    vertices.push(vert_7);
    vertices.push(vert_6);
    vertices.push(vert_5);
    vertices.push(vert_4);

    return vertices;
}

aabb.prototype.get_edges = function(v){
    /*
        v7 ------ v6
        |          |
        |          |
        |          |
        v4 ------ v5


        v3 ------ v2
        |          |
        |          |
        |          |
        v0 ------ v1
    */

    return [
        v[0], v[4],
        v[4], v[0]
    ];
}

//grab the face from MTV information

aabb.prototype.get_face = function(n, v){
     /*
        v7 ------ v6
        |          |
        |          |
        |          |
        v4 ------ v5


        v3 ------ v2
        |          |
        |          |
        |          |
        v0 ------ v1
    */

    

    if(n.x == 0 && n.y == 1 && n.z == 0){
        console.log("getting up?");
        return [v[0], v[1], v[2], v[3]];
    } else if(n.x == 0 && n.y == -1 && n.z == 0){
        console.log("getting down?");
        return [v[4], v[5], v[6], v[7]];
    } else if(n.x == 1 && n.y == 0 && n.z == 0){
        console.log("getting left?");
        return [v[0], v[4], v[7], v[3]];
    } else if(n.x == -1 && n.y == 0 && n.z == 0){
        console.log("getting right?");
        return [v[1], v[2], v[6], v[5]];
    } else if(n.x == 0 && n.y == 0 && n.z == 1){
        console.log("getting front?");
        return [v[0], v[1], v[5], v[4]];
    } else if(n.x == 0 && n.y == 0 && n.z == -1){
        console.log("getting back?");
        return [v[2], v[3], v[7], v[6]];
    }
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

        axes[i] = {n: normal, v0:p1.clone(), v1:p2.clone()};
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
    
    var body = this.parent.get_component("rigidbody");

    if(body != null){
        velocity_direction = body.get_direction().clone().normalize();
    }

    var overlap = Infinity;
    var axis = new THREE.Vector3(0,0,0);

    //need to get all 6 faces
    var v = this.get_verts();
    var a = this.get_axes(v);
    
    var rv =  right.get_verts();
    var ra = right.get_axes(rv);

    //TODO: grab cross axis's from both axis's
    for(var i = 0; i < a.length; i++){
        var proj_1 = this.project(a[i].n, v);
        var proj_2 = right.project(a[i].n, rv);

        if(!proj_1.overlap(proj_2)){
            return {result: false, axis: new THREE.Vector3(0,0,0), gap: 0};
        } else {

            var o = proj_1.get_overlap(proj_2);
   
            if(o < overlap){
                //set to axis
                overlap = o;
                axis = a[i].n;
            }
        }
    }

    for(var i = 0; i < ra.length; i++){
        var proj_1 = this.project(ra[i].n, v);
        var proj_2 = right.project(ra[i].n, rv);

        if(!proj_1.overlap(proj_2)) {
            return {result: false, axis: new THREE.Vector3(0,0,0), gap: 0};
        } else {

            var o = proj_1.get_overlap(proj_2);

            if(o < overlap){
                //set to axis
                overlap = o;
                axis = ra[i].n;
            }
        }
    }
    var p0 = this.parent.transform.position.clone();
    var p1 = right.parent.transform.position.clone();

    var direction = p0.sub(p1).normalize();

    if(axis.dot(direction) < 0.0){
        axis.negate();
    }

    //this best, edge
    //right best edge
    var edge0 = this.get_edge({result: true, axis: axis, gap: overlap}, v);
    var edge1 = right.get_edge({result: true, axis: axis.clone().negate(), gap: overlap}, rv);

    var points = this.sutherland_hodgman(edge0, edge1, axis);

    if(points != undefined){
        for(var i = 0; i < points.length; i++){
            var geometry = new THREE.BoxGeometry( .1, .1, .1 );
            var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
            var cube = new THREE.Mesh( geometry, material );
            cube.position.copy(points[i]);
            scene.add( cube );
        }
    }


    return {result: true, axis: axis, gap: overlap};
}

aabb.prototype.get_edge = function(r, vertices){
    
    //step 1 find farthest vertex
    //within the polygon along seperation normal;
    var c = vertices.length;
    var n = r.axis;
    var max = -Infinity;
    var index = 0;

    for(var i = 0; i < c; i++){
        var projection = n.dot(vertices[i]);
        
        if(projection > max){
            max = projection;
            index = i;
        }
    }
  
    //step 2
    // new we need to use the edge that 
    // is most perp either
    // right or the left
    //! might be a problem
    //! getting prevois or next vertex 
    var v = vertices[index];
    var v1 = vertices[(index + 1) % vertices.length];
    var v0 = vertices[(index - 1 <= 0) ? vertices.length-1 : index-1];
    //! might be a problem

    //v1 to v
    var l = v.clone().sub(v1);
    l.normalize();

    //v0 to v
    var r = v.clone().sub(v0);
    r.normalize();

    //the edge that is most perp
    // to n will have a dot product closer to zero

    if(r.dot(n) <= l.dot(n)){
        return new edge(v, v0, v);
    } else {
        return new edge(v, v, v1);
    }
}


aabb.prototype.sutherland_hodgman = function(e0, e1, n){
    var ref, inc;
    var flip = false;

    if(Math.abs(e0.dot(n)) <= Math.abs(e1.dot(n))){
        ref = e0.clone();
        inc = e1.clone();
    } else {
        ref = e1.clone();
        inc = e0.clone();

        flip = true;
    }

    //the edge vector
    var refv = ref.clone();
    //! might be a problem
    refv.normalize();

    var o1 = refv.dot(ref.v0);

    var cp = this.clip(inc.v0, inc.v1, refv, o1);

    //if we dont have 2 points, return
    if(cp.length < 2) return;

    //clip whats left of the incident edge by
    //the second vertex of the refrence edge
    //but we need to clip the oppsite direction
    //so we flip the direction and offset
    var o2 = refv.dot(ref.v1);

    var cp2 = this.clip(cp[0], cp[1], refv.negate(), -o2);
    //if we dont have 2 points left then fail
    if(cp2.length < 2) return;
    
    //get the frence edge normal
    //! might be a problem
    var ref_norm = ref.cross(-1.0);
    //if we had a flip the incident and refrences edges
    //then we need to flip the refrence edge normal to
    //clip properly

    if(flip) ref_norm.negate();

    //get the largest depth
    var max = ref_norm.dot(ref.max);
    //make sure the final points are not past the maximum

    if(ref_norm.dot(cp2[0]) - max < 0.0){
        cp2.splice( cp2.indexOf(cp2[0]), 0 );
    } 

    if(ref_norm.dot(cp2[1]) - max < 0.0){
        cp2.splice( cp2.indexOf(cp2[1]), 0 );
    }
    cp2.concat(cp);

    return cp2;
}

//clips the line sergment points v1, v2
//if they are past o along n
aabb.prototype.clip = function(v1, v2, n, o){
    var clipped_points = [];
  
    var d1 = n.dot(v1) - o;
    var d2 = n.dot(v2) - o;

    //if either point is past o along n
    //then we can keep the point
    if(d1 >= 0.0) clipped_points.push(v1);
    if(d2 >= 0.0) clipped_points.push(v2);

    //finally we need to check if they
    //are on opposing sides so that we can
    //compute the correct point

    if(d1 * d2 < 0.0){
        //if they are on diffrent sides of the
        //offset, d1 and d2 will be a (+) * (-)
        //and will yield a (-) and there be less then zero
        //get the vector for the edge we are clipping

        var e = v2.clone().sub(v1);
        //compute the location along e
        var u = d1 / (d1 - d2);
        e.multiplyScalar(u);
        e.add(v1);

        //add the point
     
        clipped_points.push(e);
    }

    return clipped_points;
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

aabb.prototype.toBox3D = function(){
    return new THREE.Box3(this.min, this.max);
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
