//credit : https://github.com/noona <--- give this person some love
//suace : https://github.com/noonat/intersect/blob/master/src/intersect.ts
function aabb(transform, w, h, d, debug = false, hex = 0x00FF00, fill = false){
    var transform_clone = transform;
    transform_clone.scale = new THREE.Vector3(1,1,1);

    this.centre = new THREE.Vector3().copy(transform_clone.get_transformed_position());

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

    this.decube = new decube();
    this.decube.update(this.get_verts());
};


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

    if(this.parent != null){
        if(!(this.centre.equals(this.parent.transform.get_transformed_position()))){
        
            this.centre = new THREE.Vector3().copy(this.parent.transform.get_transformed_position());
            
            var transform_clone = this.parent.transform.clone();
            transform_clone.scale = new THREE.Vector3(1,1,1);
            
            this.min_max_set(transform_clone);
            this.transformed_dimensions.applyMatrix4(transform_clone.get_transformation().toMatrix4());

        }
            
        if(this.decube != null){
            this.decube.update(this.get_verts());
        }
    }
}

aabb.prototype.set_colliding = function(bool){
    this.colliding = bool;
}


//grabs the aabb's transformed verts
aabb.prototype.get_verts = function(offset){
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

    var diffrence =  this.h - transform_clone.scale.y/2;
    transform_clone.position.y += diffrence;
    
    if(offset != null){ transform_clone.position.add(offset);}
    
    transform_clone.scale = new THREE.Vector3(1,1,1);
    transform_clone.rotation = transform_clone.rotation.conjugate();

    var m = transform_clone.get_transformation().toMatrix4();

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
        new THREE.Vector3(-this.w, -this.h, -this.d).applyMatrix4(m),
        new THREE.Vector3(+this.w, -this.h, -this.d).applyMatrix4(m),
        new THREE.Vector3(+this.w, -this.h, +this.d).applyMatrix4(m),
        new THREE.Vector3(-this.w, -this.h, +this.d).applyMatrix4(m),
        new THREE.Vector3(-this.w, +this.h, -this.d).applyMatrix4(m),
        new THREE.Vector3(+this.w, +this.h, -this.d).applyMatrix4(m),
        new THREE.Vector3(+this.w, +this.h, +this.d).applyMatrix4(m),
        new THREE.Vector3(-this.w, +this.h, +this.d).applyMatrix4(m),

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

aabb.prototype.toBox3D = function(){
    return new THREE.Box3(this.min, this.max);
}

aabb.prototype.toJSON = function(){
    return{
        name: this.name
    }
}

aabb.prototype.name = "aabb";
