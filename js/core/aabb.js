//credit : https://github.com/noona <--- give this person some love
//suace : https://github.com/noonat/intersect/blob/master/src/intersect.ts

function aabb(transform, w, h, d, debug = false, hex = 0x00FF00, fill = false){
    
    this.centre = transform.get_transformed_position().clone();

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


    var transform_clone = transform.clone();
        
    transform_clone.scale = new THREE.Vector3(1,1,1);

    this.max.applyMatrix4(transform_clone.get_transformation().toMatrix4());
    this.min.applyMatrix4(transform_clone.get_transformation().toMatrix4());

    this.parent = null;
    this.colliding = false;

    this.non_active_color = hex;
    this.active_color = 0x0000FF;

    this.visule = this.visule(hex, fill);
    this.visule.visible = false;

    this.decube = new decube(this.centre, this.min, this.max, this.w, this.d, this.h);
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

aabb.prototype.visule = function(hex, fill){
    var geo = new THREE.Geometry();

/*
          6----7
         /|   /|
        2----3 |
        | |  | |
        | 4--|-5
        |/   |/
        0----1
*/
    var l_x = + this.w;
    var r_x = - this.w;
    var t_y = + this.h;
    var b_y = - this.h;
    var f_z = + this.d;
    var b_z = - this.d;

    geo.vertices.push(
        new THREE.Vector3(l_x, b_y, f_z), // 0 -- left
        new THREE.Vector3(r_x, b_y, f_z), // 1 -- right
        new THREE.Vector3(l_x, t_y, f_z), // 2 -- right
        new THREE.Vector3(r_x, t_y, f_z), // 3
        new THREE.Vector3(l_x, b_y, b_z), // 4
        new THREE.Vector3(r_x, b_y, b_z), // 5
        new THREE.Vector3(l_x, t_y, b_z), // 6
        new THREE.Vector3(r_x, t_y, b_z), // 7
    );

    geo.faces.push(
        //front
        new THREE.Face3(0, 3, 2),
        new THREE.Face3(0, 1, 3),
        //right
        new THREE.Face3(1, 7, 3),
        new THREE.Face3(1, 5, 7),
        //back
        new THREE.Face3(5, 6, 7),
        new THREE.Face3(5, 4, 6),
        //left
        new THREE.Face3(4, 2, 6),
        new THREE.Face3(4, 0, 2),
        //top
        new THREE.Face3(2, 7, 6),
        new THREE.Face3(2, 3, 7),
        //bottom
        new THREE.Face3(4, 1, 0),
        new THREE.Face3(4, 5, 1)
    );

    var mat = new THREE.MeshBasicMaterial({color:hex, wireframe:fill});

    var cube = new THREE.Mesh(geo, mat);
    cube.position.set(this.x, this.y, this.z);
    scene.add(cube);
    return cube;
}

aabb.prototype.set_visule_color = function(hex){
    //this.visule.material.color = new THREE.Color(hex);
    this.decube.set_color(hex);
}

aabb.prototype.update = function(delta){
    if(!(this.centre.equals(this.parent.transform.get_transformed_position()))){
        this.centre.copy(this.parent.transform.get_transformed_position());
        this.min_max_set();
    }

    if(this.visule != null){
        this.visule.position.copy(this.centre);

        this.visule.rotation.setFromRotationMatrix(
            this.parent.transform.get_transformation().toMatrix4()
        );
     
        if(this.colliding){
            this.set_visule_color(this.active_color);
        }
        
        if(!this.colliding){
            this.set_visule_color(this.non_active_color);
        }
    }

    if(this.decube != null){
        if( this.parent != null){
            this.decube.update(this.min, this.max, this.parent.transform, delta);
        }
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
            this.centre.x - this.w ,
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
