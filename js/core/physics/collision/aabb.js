//credit : https://github.com/noona <--- give this person some love
//suace : https://github.com/noonat/intersect/blob/master/src/intersect.ts


function aabb(transform, w, h, d, debug = false, hex = 0x00FF00, fill = false, name = "nuzzing"){
    
    //this.debug_points = [];
    ////6 faces
    //for(var i = 0; i < 64; i++){
    //    //------------------------ CONTACT POINTS DEBUG ----------------//
    //    var geometry = new THREE.BoxGeometry( .05, .05, .05 );
    //    var material = new THREE.MeshBasicMaterial( {color: 0x00FF00} );
    //    var cp_0 = new THREE.Mesh( geometry, material );
    //    scene.add(cp_0);
    //    this.debug_points.push(cp_0);
    //    //------------------------ CONTACT POINTS DEBUG ----------------//
    //}

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

    this.decube = new decube();
    this.decube.update(this.get_verts());
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

aabb.prototype.set_decube_active = function(b){
    this.decube.set_active(b);
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
            this.decube.update(this.get_verts());
        }
    }

   // this.decube.set_active(true);

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

//grabs the aabb's transformed verts
aabb.prototype.get_verts = function(offset){

    var h = this.h;
    var w = this.w;
    var d = this.d;

    if(this.parent == null){
        return [
            new THREE.Vector3(),
            new THREE.Vector3(),
            new THREE.Vector3(),
            new THREE.Vector3(),
            new THREE.Vector3(),
            new THREE.Vector3(),
            new THREE.Vector3(),
            new THREE.Vector3(),
        ]
    }

    var transform_clone = this.parent.transform.clone();

    var diffrence =  h - transform_clone.scale.y/2;
    transform_clone.position.y += diffrence;
    
    if(offset != null){

        transform_clone.position.add(offset);
    }
    
    transform_clone.scale = new THREE.Vector3(1,1,1);
    //transform_clone.rotation = transform_clone.rotation.conjugate();

    //y_s/2 + h = 0

    var m = transform_clone.get_transformation().toMatrix4();



    var vert_0 = new THREE.Vector3(-w, -h, -d);
    vert_0.applyMatrix4(m);
    
    var vert_1 = new THREE.Vector3(w, -h, -d);
    vert_1.applyMatrix4(m);

    var vert_2 = new THREE.Vector3(w, -h, d);
    vert_2.applyMatrix4(m);

    var vert_3 = new THREE.Vector3(-w, -h, d);
    vert_3.applyMatrix4(m);

    var vert_4 = new THREE.Vector3(-w, h, -d);
    vert_4.applyMatrix4(m);
    
    var vert_5 = new THREE.Vector3(w, h, -d);
    vert_5.applyMatrix4(m);

    var vert_6 = new THREE.Vector3(w, h, d);
    vert_6.applyMatrix4(m);

    var vert_7 = new THREE.Vector3(-w, h, d);
    vert_7.applyMatrix4(m);

    //at this point the velocity should already be added
    //so we need to substract and

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
        vert_0,
        vert_1,
        vert_2,
        vert_3,
        vert_4,
        vert_5,
        vert_6,
        vert_7,

    ];
}

aabb.prototype.face_helper = function(f){
    for(var i = 0; i < f.length; i++){
        var n = f[i].n;
        if(Math.abs(n.y) < 0.0001){n.y = 0;}
        if(Math.abs(n.z) < 0.0001){n.z = 0;}
        if(Math.abs(n.x) < 0.0001){n.x = 0;}
    }

    return f;
}

aabb.prototype.get_edge = function(e, n, p){
    for(var i = 0; i < e.length; i++){
        if(e[i].get_normal(p).equals(n)){return e[i]}
    }

    return null;
}

aabb.prototype.get_face = function(f, n){
    for(var i = 0; i < f.length; i++){
        if(f[i].n.equals(n)){return f[i];}
    }

    return null;
}
//used to create construnct and return the faces
aabb.prototype.get_faces = function(v){
        

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

    return this.face_helper([
        //-y +y faces
        {v : [v[0], v[1], v[2], v[3]], n : v[3].clone().sub(v[1]).normalize().cross(v[0].clone().sub(v[1]).normalize()).normalize()
        , c: v[0].clone().add(v[2]).multiplyScalar(0.5)},
        {v : [v[4], v[5], v[6], v[7]], n : v[6].clone().sub(v[4]).normalize().cross(v[5].clone().sub(v[4]).normalize()).normalize()
        , c: v[4].clone().add(v[6]).multiplyScalar(0.5)},

        //-x +x faces
        {v : [v[1], v[2], v[6], v[5]], n : v[6].clone().sub(v[1]).normalize().cross(v[2].clone().sub(v[1]).normalize()).normalize()
        , c: v[1].clone().add(v[6]).multiplyScalar(0.5)},
        {v : [v[0], v[4], v[7], v[3]], n : v[4].clone().sub(v[3]).normalize().cross(v[0].clone().sub(v[3]).normalize()).normalize()
        , c: v[0].clone().add(v[7]).multiplyScalar(0.5)},

         //-z +z faces
        {v : [v[1], v[0], v[4], v[5]], n : v[5].clone().sub(v[0]).normalize().cross(v[1].clone().sub(v[0]).normalize()).normalize()
        , c: v[0].clone().add(v[5]).multiplyScalar(0.5)},
        {v : [v[3], v[2], v[6], v[7]], n : v[2].clone().sub(v[3]).normalize().cross(v[6].clone().sub(v[3]).normalize()).normalize()
        , c: v[3].clone().add(v[6]).multiplyScalar(0.5)},
    ])
}
//gets the edges of the aabb
aabb.prototype.edges = function(v, c){
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
        new edge(v[0], v[0], v[1], new THREE.Vector3()), //0, 1
        //new edge(v[1], v[1], v[2], new THREE.Vector3()), //2, 3
        //new edge(v[2], v[2], v[3], new THREE.Vector3()), //4, 5
        //new edge(v[3], v[3], v[0], new THREE.Vector3()), //6, 7
        //new edge(v[4], v[4], v[5], new THREE.Vector3()), //8, 9
        //new edge(v[5], v[5], v[6], new THREE.Vector3()), //10, 11
        //new edge(v[6], v[6], v[7], new THREE.Vector3()), //12, 13
        //new edge(v[7], v[7], v[4], new THREE.Vector3()), //14, 15
        //new edge(v[3], v[3], v[7], new THREE.Vector3()), //16, 17
        //new edge(v[2], v[2], v[6], new THREE.Vector3()), //18, 19
        //new edge(v[1], v[1], v[5], new THREE.Vector3()), //20, 21
        new edge(v[0], v[0], v[4], new THREE.Vector3()), //22, 23
        new edge(v[0], v[0], v[3], new THREE.Vector3()), //22, 23
    ]
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

    var axes = [3];

    //x axis
    axes[0] = v[1].clone().sub(v[0]).perp().normalize();

    //y axis
    axes[1] = v[4].clone().sub(v[0]).perp().normalize();

    //z axis
    axes[2] = v[3].clone().sub(v[0]).perp().normalize();

    return axes;
}

aabb.prototype.get_edge_axes = function(e0, e1) {

    var edge_axes = [];

    for(var i = 0; i < e0.length; i++){
        for(var j = 0; j < e1.length; j++){
            var edge_0 = e0[i].get_vector();
            var edge_1 = e1[j].get_vector();

            var axis = new THREE.Vector3().crossVectors(edge_0, edge_1).normalize();
            //console.log(axis);
           if(axis.length() != 0){
                edge_axes.push(
                    {
                        n: axis,
                        this: e0[i],
                        right: e1[j],
                    }
                );
           }
        }
    }

    return edge_axes;
}

aabb.prototype.project = function(n, v, sphere = false){

    var min = Infinity;
    var max = Infinity;

    if(!sphere){

        min = n.dot(v[0]);
        max = min;

        for(var i = 1; i < v.length; i++){

            var p = n.dot(v[i]);
            if(p < min){
                min = p;
            } else if(p > max){
                max = p;
            }
        }
    } else {
        var p = v.c.dot(n);
        min = p - v.r;
        max = p + v.r;
    }


    return new projection(min, max);
}

aabb.prototype.get_closest_vert = function(v, p){

    var min = Infinity;
    var vert = null;

    for(var i = 0; i < v.length; i++){
        var distance = p.distanceToSquared(v[i]);

        if(distance < min){
            min = distance;
            vert = v[i]
        }
    }

    return vert;
}

aabb.prototype.get_face_centre = function(v){
    return v[0].clone().sub(v[2]).multiplyScalar(0.5);
}
//credit to Randy Gaul manifold generation :
//https://www.randygaul.net/2013/03/28/custom-physics-engine-part-2-manifold-generation/

//credit : http://www.dyn4j.org/2010/01/sat/
//helping with SAT collision detection

//for SAT intersecting 
//!
aabb.prototype.intersect_sat_aabb = function(right, dir, init, offset, overlaps){
    
    if(init) {
      
        var overlap = Infinity;
        var axis = new THREE.Vector3();

        var v = this.get_verts(offset); // grab vertices
        var a = this.get_axes(v); // normal axes (faces)
        var e = this.edges(v); // get edges
        //var f = this.get_faces(v);

        var rv = right.get_verts(); // right verts
        var ra = right.get_axes(rv); // right normal axes (faces)
        var re = right.edges(rv);
        //var rf = right.get_faces(rv);

        var edge_axes = this.get_edge_axes(e, re);

        var p0 = this.parent.transform.position.clone();
        var p1 = right.parent.transform.position.clone();
        
        var direction = p0.clone().sub(p1).normalize();

        var me = false;

        for(var o = 0; o < re.length; o++){
        //  e[o].debug_normal(p1);
        }

        for(var i = 0; i < a.length; i++){
            var proj_1 = this.project(a[i], v);
            var proj_2 = right.project(a[i], rv);

            if(!proj_1.overlap(proj_2)) {
                return {result: false, axis: new THREE.Vector3(0,0,0), gap: 0};
            } else {

                var o = proj_1.get_overlap(proj_2);
                
                if(overlaps != null) overlaps.push({axis:a[i], o:o});

                if(o < overlap){
                    //set to axis
                    overlap = o;
                    axis = a[i];
                    me = true;
                }
            }
        }

        for(var i = 0; i < ra.length; i++){
            var proj_1 = this.project(ra[i], v);
            var proj_2 = right.project(ra[i], rv);

            if(!proj_1.overlap(proj_2)) {
                return {result: false, axis: new THREE.Vector3(0,0,0), gap: 0};
            } else {

                var o = proj_1.get_overlap(proj_2);

                if(overlaps != null) overlaps.push({axis:ra[i], o:o});

                if(o < overlap){
                    //set to axis
                    overlap = o;
                    axis = ra[i];
                    me = false;
                }
            }
        }

        for(var i = 0; i < edge_axes.length; i++){
            var proj_1 = this.project(edge_axes[i].n, v);
            var proj_2 = right.project(edge_axes[i].n, rv);

            if(!proj_1.overlap(proj_2)) {
                return {result: false, axis: new THREE.Vector3(0,0,0), gap: 0};
            } else {

                var o = proj_1.get_overlap(proj_2);
                
                if(overlaps != null) overlaps.push({axis:edge_axes[i].n, o:o});

                if(o < overlap){
                    //set to axis
                    overlap = o;
                    axis = edge_axes[i].n;
                    isEdge = true;
                    me = true;
                }
            }
        }

        if(axis.dot(direction) < 0.0){
            axis.negate();
        }

        return {result: true, axis: axis, gap: overlap};
    } else {
   
        var best_axis = null;
        var best_overlap = 0;
        var best_dot = Infinity;
        console.log("doing impact check!");
        var final = [];

        for(var i = 0; i < overlaps.length; i++){
            var dot = overlaps[i].axis.dot(dir);
            
            final.push({a:overlaps[i].axis, o:overlaps[i].o, d:dot});

            if(dot < best_dot){
                best_dot = dot;
                best_axis = overlaps[i].axis;
                best_overlap = overlaps[i].o;
            }
        }


        final.sort(function(a, b){return a.d-b.d});
        //console.log(final);

        return {result: true, axis: best_axis, gap: best_overlap, list:final};
    }
}

aabb.prototype.intersect_sat_aabb_sphere = function(right){
    
        var overlap = Infinity;
        var axis = new THREE.Vector3();

        var v = this.get_verts(); // grab vertices
        var a = this.get_axes(v); // normal axes (faces)
        var e = this.edges(v); // get edges

        var p0 = this.parent.transform.position.clone();
        var p1 = right.parent.transform.position.clone();
        
        var direction = p0.clone().sub(p1).normalize();

        var nearest = this.get_closest_vert(v, p1);
        
        var d = nearest.clone().sub(p1).normalize();

        a.push(d)
        
        for(var i = 0; i < a.length; i++){
            var proj_1 = this.project(a[i], v);
            var proj_2 = this.project(a[i], {c: p1, r: right.radius}, true);

            if(!proj_1.overlap(proj_2)) {
                return {result: false, axis: new THREE.Vector3(0,0,0), gap: 0};
            } else {

                var o = proj_1.get_overlap(proj_2);
                
                if(o < overlap){
                    //set to axis
                    overlap = o;
                    axis = a[i];
                    me = true;
                }
            }
        }

        if(axis.dot(direction) < 0.0){
            axis.negate();
        }

        return {result: true, axis: axis, gap: overlap};
}

aabb.prototype.generate_contact_points = function(v, rv, axis, direction, right){

    var f = this.get_faces(v);
    var rf = right.get_faces(rv);

    var thisEdge = false;
    var rightEdge = false;

    //get the 2 side planes
    var right_face = this.get_face(rf, axis);
    var this_face = this.get_face(f, axis.clone().negate());

    if(right_face == null){rightEdge = true;}
    if(this_face == null){thisEdge = true}
    var points = []

    for(var j = 0; j < this.debug_points.length; j++){
            this.debug_points[j].position.copy(new THREE.Vector3());
    } 

    if(!thisEdge && !rightEdge){
        points = [];

        var f = this.get_faces(v);
        var rf = right.get_faces(rv);

        for(var i = 0; i < this_face.v.length; i++){
            var this_v = this_face.v[i];
            var i_loop = (i + 1) % this_face.v.length;
            var e0 = new edge(this_v, this_v, this_face.v[i_loop], this_face);

            for(var j = 0; j < right_face.v.length; j++){

                var j_loop = (j + 1) % right_face.v.length;
                var right_v = right_face.v[j];
                var e1 = new edge(right_v, right_v, right_face.v[j_loop], right_face);

                points = points.concat(hodgman_sutherland(e0, e1, axis, false));
         
            }
        }
    }

    if(points != null){
        for(var j = 0; j < points.length; j++){
            if(points[j] != null){
                this.debug_points[j].position.copy(points[j]);
            } else {
                this.debug_points[j].position.copy(new THREE.Vector3());
            } 
        }
    }
}

aabb.prototype.best_face= function(o, n){

    var max = -Infinity;
    var face_index = null;

    //find best edge from faces and verts
    for(var j = 0; j < o.length; j++){
            var projection = n.dot(o[j].n);

            if(projection > max){
                max = projection;
                face_index = j;
            }
    }
    return o[face_index];
}

aabb.prototype.best_edge = function(o, n){

    var max = -Infinity;
    var vert_index = null;
    var face_index = null;

    //find best edge from faces and verts
    for(var j = 0; j < o.length; j++){
        for(var i = 0; i <  o[j].v.length; i++){
            var projection = n.dot(o[j].v[i]);

            if(projection > max){
                max = projection;
                vert_index = i;
                face_index = j;
            }
        }
    }

    var v_length = o[face_index].v.length;
    var v_i_next = (vert_index + 1) % v_length;
    var v_1_prev = (vert_index - 1 < 0) ? v_length - 1 : vert_index - 1;

    var v = o[face_index].v[vert_index];

    var v1 = o[face_index].v[v_i_next];
    var v0 = o[face_index].v[v_1_prev];

    var l = v.clone().sub(v1).normalize();
    var r = v.clone().sub(v0).normalize();

    if(r.dot(n) <= l.dot(n)){
        return new edge(v, v0, v, o[face_index]);
    } else {
        return new edge(v, v, v1, o[face_index]);
    }
}

aabb.prototype.best_edge_per_face = function(face, n){

    var max = -Infinity;
    var vert_index = null;

    //find best edge from faces and verts
    for(var i = 0; i < face.v.length; i++){
            var projection = n.dot(face.v[i]);

            if(projection > max){
                max = projection;
                vert_index = i;
            }
    }

    var v_length = face.v.length;
    var v_i_next = (vert_index + 1) % v_length;
    var v_1_prev = (vert_index - 1 < 0) ? v_length - 1 : vert_index - 1;

    var v = face.v[vert_index];

    var v1 = face.v[v_i_next];
    var v0 = face.v[v_1_prev];

    var l = v.clone().sub(v1).normalize();
    var r = v.clone().sub(v0).normalize();

    if(r.dot(n) <= l.dot(n)){
        return new edge(v, v0, v, face);
    } else {
        return new edge(v, v, v1, face);
    }
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

aabb.prototype.toJSON = function(){
    return{
        name: this.name
    }
}

aabb.prototype.name = "aabb";
