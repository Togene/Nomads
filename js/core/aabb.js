function aabb(transform, w, h, d, debug = false, hex = 0x00FF00, fill = false){
    var p = transform.position;

    this.position = p.clone();

    this.w = w;
    this.h = h;
    this.d = d;
    
    this.parent = null;
    this.colliding = false;

    this.non_active_color = hex;
    this.active_color = 0x0000FF;

    this.visule = this.visule(hex, fill);
    this.visule.visible = debug;
};

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
    if(this.visule != null){
        this.visule.position.set(this.position.x, this.position.y, this.position.z);

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
        this.position = p.clone();
    }

}

aabb.prototype.direct_position_add = function(p){
    if(p === undefined){
        console.error("No Paramatre Given");
    } else {
        this.position.add(p); 
    }
}

aabb.prototype.set_colliding = function(bool){
    this.colliding = bool;
}

aabb.prototype.intersect = function(right){
    return !(
        right.position.x - right.w > this.position.x + this.w ||
        right.position.x + right.w < this.position.x - this.w ||
        right.position.y - right.h > this.position.y + this.h ||
        right.position.y + right.h < this.position.y - this.h ||
        right.position.z - right.d > this.position.z + this.d ||
        right.position.z + right.d < this.position.z - this.d);
}

aabb.prototype.name = "aabb";
