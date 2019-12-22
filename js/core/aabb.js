function aabb(transform, w, h, d, debug = false, hex = 0x00FF00, fill = false){
    
    this.centre = transform.position.clone();
    
    this.w = w;
    this.h = h;
    this.d = d;
    
    //used for ray intersection, and probs should be used in general with things
    this.min = new THREE.Vector3(
        this.centre.x - this.w,
        this.centre.y - this.h,
        this.centre.z - this.d
    );

    this.max = new THREE.Vector3(
        this.centre.x + this.w,
        this.centre.y + this.h,
        this.centre.z + this.d
    );

    this.parent = null;
    this.colliding = false;

    this.non_active_color = hex;
    this.active_color = 0x0000FF;

    this.visule = this.visule(hex, fill);
    this.visule.visible = debug;
};

aabb.prototype.min_set = function(){
    this.min = new THREE.Vector3(
        this.centre.x - this.w,
        this.centre.y - this.h,
        this.centre.z - this.d
    );
}

aabb.prototype.max_set = function(){
    this.max = new THREE.Vector3(
        this.centre.x + this.w,
        this.centre.y + this.h,
        this.centre.z + this.d
    );
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
    this.visule.material.color = new THREE.Color(hex);
}

aabb.prototype.update = function(delta){
    
    if(!this.parent.transform.position.equals(this.centre)){
        this.centre.copy(this.parent.transform.position);
        this.min_set();
        this.max_set();
    }

    if(this.visule != null){
        this.visule.position.copy(this.centre);

        if(this.colliding){
            this.set_visule_color(this.active_color);
        }
        
        if(!this.colliding){
            this.set_visule_color(this.non_active_color);
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

//credit : https://www.gamedev.net/articles/programming/general-and-gameplay-programming/swept-aabb-collision-detection-and-response-r3084/
aabb.prototype.swept_intersect = function(left_body, right){
    
    var normalx = 0.0;
    var normaly = 0.0;
    var normalz = 0.0;

    var xInvEntry, yInvEntry, zInvEntry;
    var xInvExit, yInvExit, zInvExit;

    //b1 = left
    //b2 = right

    // find the distance between the objects on the near and far sides for both x and y
    if(left_body.velocity.x > 0.0){
        xInvEntry = right.centre.x - (this.centre.x + this.w);
        xInvExit = (right.centre.x + right.w) - this.centre.x;
    } else {
        xInvEntry = (right.centre.x + right.w) - this.centre.x;
        xInvExit = right.centre.x - (this.centre.x + this.w);
    }

    //if(left_body.velocity.y > 0.0){
    //    yInvEntry = right.centre.y - (this.centre.y + this.h);
    //    yInvExit = (right.centre.y + right.h) - this.centre.y;
    //} else {
    //    yInvEntry = (right.centre.y + right.h) - this.centre.y;
    //    yInvExit = right.centre.y - (this.centre.y + this.h);
    //}

    if(left_body.velocity.z > 0.0){
        zInvEntry = right.centre.z - (this.centre.z + this.d);
        zInvExit = (right.centre.z + right.d) - this.centre.z;
    } else {
        zInvEntry = (right.centre.z + right.d) - this.centre.z;
        zInvExit = right.centre.z - (this.centre.z + this.d);
    }

    //find the time of collision and time of leaving for each axis (if statement is to repvent devide my zero)
    var xEntry, yEntry, zEntry;
    var xExit, yExit, zExit;

    if(left_body.velocity.x == 0){
        xEntry = -Infinity;
        xExit = Infinity;
    } else {
        xEntry = xInvEntry / left_body.velocity.x;
        xExit = xInvExit / left_body.velocity.x;
    }

    //if(left_body.velocity.y == 0){
    //    yEntry = -Infinity;
    //    yExit = Infinity;
    //} else {
    //    yEntry = yInvEntry / left_body.velocity.y;
    //    yExit = yInvExit / left_body.velocity.y;
    //}

    if(left_body.velocity.z == 0){
        zEntry = -Infinity;
        zExit = Infinity;
    } else {
        zEntry = zInvEntry / left_body.velocity.z;
        zExit = zInvExit / left_body.velocity.z;
    }

    //find the earliest/latest times of collisionfloat
    var entryTime = Math.max(xEntry, zEntry);
    //entryTime = Math.max(entryTime, zEntry);

    var exitTime = Math.min(xExit, zExit);
    //exitTime = Math.min(exitTime, zExit);

    //if there was no collision
    if(entryTime > exitTime || xEntry < 0.0  && zEntry < 0.0 || xEntry > 1.0 || zEntry > 1.0){
        return {val: 1.0, nx: 0, ny:0, nz:0};
    } else { //! totes colliding!
        if(xEntry > zEntry){
            if(xInvEntry < 0.0){
                normalx = +1.0;
                normaly = +0.0;
                normalz = 0.0;
            } else {
                normalx = -1.0;
                normaly = +0.0;
                normalz = 0.0;
            }
        } else {
            if(zInvEntry < 0.0){
                normalx = +0.0;
                normaly = +1.0;
                normalz = 0.0;
            } else {
                normalx = +0.0;
                normaly = -1.0;
                normalz = 0.0;
            }
        }
        
        // return the time of collsion

        return {val: entryTime, nx: normalx, ny: normaly, nz: normalz};
    }
}

aabb.prototype.intersect = function(right){
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
