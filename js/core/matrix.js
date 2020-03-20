function matrix(){
    this.m = [4];

    for(var i = 0; i < 4; ++i){
        var col = [];
        for(var j = 0; j < 4; ++j){
            col[j] = 0;
        }

        this.m[i] = col;
    }

    this.init_identity()
};

matrix.prototype.init_identity = function(){
    this.m[0][0] = 1; this.m[0][1] = 0; this.m[0][2] = 0; this.m[0][3] = 0;
    this.m[1][0] = 0; this.m[1][1] = 1; this.m[1][2] = 0; this.m[1][3] = 0;
    this.m[2][0] = 0; this.m[2][1] = 0; this.m[2][2] = 1; this.m[2][3] = 0;
    this.m[3][0] = 0; this.m[3][1] = 0; this.m[3][2] = 0; this.m[3][3] = 1;

    return this;
};

matrix.prototype.init_translation = function(x, y, z){
    this.m[0][0] = 1; this.m[0][1] = 0; this.m[0][2] = 0; this.m[0][3] = x;
    this.m[1][0] = 0; this.m[1][1] = 1; this.m[1][2] = 0; this.m[1][3] = y;
    this.m[2][0] = 0; this.m[2][1] = 0; this.m[2][2] = 1; this.m[2][3] = z;
    this.m[3][0] = 0; this.m[3][1] = 0; this.m[3][2] = 0; this.m[3][3] = 1;

    return this;
};

matrix.prototype.init_scale = function(x, y, z){
    this.m[0][0] = x; this.m[0][1] = 0; this.m[0][2] = 0; this.m[0][3] = 0;
    this.m[1][0] = 0; this.m[1][1] = y; this.m[1][2] = 0; this.m[1][3] = 0;
    this.m[2][0] = 0; this.m[2][1] = 0; this.m[2][2] = z; this.m[2][3] = 0;
    this.m[3][0] = 0; this.m[3][1] = 0; this.m[3][2] = 0; this.m[3][3] = 1;

    return this;
};

matrix.prototype.init_rotation = function(x, y, z){
    var rx = new matrix();
    var ry = new matrix();
    var rz = new matrix();

    x = dag_to_rad(x);
    y = dag_to_rad(y);
    z = dag_to_rad(z);

    rz.m[0][0] = +Math.cos(z); rz.m[0][1] = -Math.sin(z); rz.m[0][2] = 0; rz.m[0][3] = 0;
    rz.m[1][0] = +Math.sin(z); rz.m[1][1] = +Math.cos(z); rz.m[1][2] = 0; rz.m[1][3] = 0;
    rz.m[2][0] = 0;            rz.m[2][1] = 0;            rz.m[2][2] = 1; rz.m[2][3] = 0;
    rz.m[3][0] = 0;            rz.m[3][1] = 0;            rz.m[3][2] = 0; rz.m[3][3] = 1;
    
    rx.m[0][0] = 1; rx.m[0][1] = 0;            rx.m[0][2] = 0;            rx.m[0][3] = 0;
    rx.m[1][0] = 0; rx.m[1][1] = +Math.cos(x); rx.m[1][2] = -Math.sin(x); rx.m[1][3] = 0;
    rx.m[2][0] = 0; rx.m[2][1] = +Math.sin(x); rx.m[2][2] = +Math.cos(x); rx.m[2][3] = 0;
    rx.m[3][0] = 0; rx.m[3][1] = 0;            rx.m[3][2] = 0;            rx.m[3][3] = 1;

    ry.m[0][0] = +Math.cos(y); ry.m[0][1] = 0; ry.m[0][2] = -Math.sin(y); ry.m[0][3] = 0;
    ry.m[1][0] = 0;            ry.m[1][1] = 1; ry.m[1][2] = 0;            ry.m[1][3] = 0;
    ry.m[2][0] = +Math.sin(y); ry.m[2][1] = 0; ry.m[2][2] = +Math.cos(y); ry.m[2][3] = 0;
    ry.m[3][0] = 0;            ry.m[3][1] = 0; ry.m[3][2] = 0;            ry.m[3][3] = 1;

    this.m = (rz.mul(ry.mul(rx))).m;

    return this;
}

matrix.prototype.init_rotation_fur = function(forward, up, right){
    
    var f = forward.clone();
    var r = right.clone();
    var u = up.clone();

    this.m[0][0] = r.x; this.m[0][1] = r.y; this.m[0][2] = r.z; this.m[0][3] = 0;
    this.m[1][0] = u.x; this.m[1][1] = u.y; this.m[1][2] = u.z; this.m[1][3] = 0;
    this.m[2][0] = f.x; this.m[2][1] = f.y; this.m[2][2] = f.z; this.m[2][3] = 0;
    this.m[3][0] = 0;   this.m[3][1] = 0;   this.m[3][2] = 0;   this.m[3][3] = 1;

    return this;
}

matrix.prototype.init_rotation_fu = function(forward, up){
    
    var f = forward.normalize();
    var r = up.normalize();
    r = r.clone().cross(f);
    
    var u = f.clone().cross(r);

    return this.init_rotation_fur(f, u, r);
}

matrix.prototype.transform = function(r){
    return new THREE.Vector3(
        this.m[0][0] * r.x + this.m[0][1] * r.y + this.m[0][2] * r.z + this.m[0][3],
        this.m[1][0] * r.x + this.m[1][1] * r.y + this.m[1][2] * r.z + this.m[1][3],
        this.m[2][0] * r.x + this.m[2][1] * r.y + this.m[2][2] * r.z + this.m[2][3],
    );
}



matrix.prototype.get = function(x, y){return this.m[x][y];};
matrix.prototype.set = function(x, y, v){this.m[x][y] = v;};
matrix.prototype.set_matrix = function(m){this.m = m;};

matrix.prototype.mul = function(r){
    var result = new matrix();

    for(var i = 0; i < 4; i++){
        for(var j = 0; j < 4; j++){
            result.set(i, j, this.m[i][0] * r.get(0, j) + 
                             this.m[i][1] * r.get(1, j) +
                             this.m[i][2] * r.get(2, j) +
                             this.m[i][3] * r.get(3, j));
        }
    }

    return result;
}

matrix.prototype.invert = function(r){
    return new THREE.Vector3(
        this.m[0][0] * r.x + this.m[0][1] * r.y + this.m[0][2] * r.z + this.m[0][3],
        this.m[1][0] * r.x + this.m[1][1] * r.y + this.m[1][2] * r.z + this.m[1][3],
        this.m[2][0] * r.x + this.m[2][1] * r.y + this.m[2][2] * r.z + this.m[2][3],
    );
}

matrix.prototype.transpose = function(){

    var result = new matrix();

    for(var i = 0; i < 4; i++){
        for(var j = 0; j < 4; j++){
            result.m[i][j] = this.m[j][i]
        }
    }

    return result;
}

matrix.prototype.toMatrix4 = function(){

    var m = new THREE.Matrix4().set(
        this.m[0][0], this.m[0][1], this.m[0][2], this.m[0][3],
        this.m[1][0], this.m[1][1], this.m[1][2], this.m[1][3],
        this.m[2][0], this.m[2][1], this.m[2][2], this.m[2][3],
        this.m[3][0], this.m[3][1], this.m[3][2], this.m[3][3],
    );

    return m; 
}


matrix.prototype.name = "matrix";