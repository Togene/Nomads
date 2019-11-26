function transform(p, s, r){
    this.position = p;
    this.scale = s;
    this.rotation = r;

    this.old_position = new THREE.Vector3(0,0,0);
    this.old_scale = new THREE.Vector3(1,1,1);
    this.old_rotation = new quaternion(r.x,r.y,r.z,r.w);

    this.parent = null;

    this.parent_matrix = new matrix();
    this.parent_matrix.init_identity();
}

transform.prototype.hasChanged = function(){
    if(this.parent != null && this.parent.hasChanged()){return true;}
    if(!this.position.equals(this.old_position)){ return true;}
    if(!this.rotation.equals(this.old_rotation)){return true;}
    if(!this.scale.equals(this.old_scale)){return true;}

    return false;
}

transform.prototype.get_transformation = function(no_rot){
    var t = new matrix();
    t.init_translation(this.position.x, this.position.y, this.position.z);
    var r = new matrix();
    
    if(!no_rot){
        r.init_rotation(this.rotation.x, this.rotation.y, this.rotation.z);
    } else {
        r.init_identity();
    }
    
    var s = new matrix();
    s.init_scale(this.scale.x, this.scale.y, this.scale.z);

    var p = this.get_parent_matrix(no_rot);

    return p.mul(t.mul(r.mul(s)));
}

transform.prototype.get_parent_matrix = function(no_rot){
    if(this.parent != null && this.parent.hasChanged()){
        this.parent_matrix = (this.parent.get_transformation(no_rot));
    }
    return this.parent_matrix;
}

transform.prototype.update = function(){
        if(this.old_position != null) {
            this.old_position.set(this.position.x, this.position.y, this.position.z);
            this.old_scale.set(this.scale.x, this.scale.y, this.scale.z);
            this.old_rotation.set(this.rotation.x, this.rotation.y, this.rotation.z, this.rotation.w);
        } else {
            this.old_position = new THREE.Vector3(this.position.x + 1, this.position.y + 1, this.position.z + 1);
            this.old_scale = new THREE.Vector3(this.scale.x * 0.5, this.scale.y * 0.5, this.scale.z * 0.5);
            this.old_rotation = new quaternion(this.rotation.x + 1, this.rotation.y + 1, this.rotation.z + 1,  this.rotation.w + 1);
        }
}

transform.prototype.rotate = function(ax, an){
    var q = new quaternion({axis : ax, angle : an});
    q.q_mul(this.rotation);
    q.normalized();

    this.rotation = q;
}

transform.prototype.look_at = function(p, up){
    this.rot = this.get_look_direction(p, up);
}

transform.prototype.get_look_direction = function(p, up){
    var m = new matrix();
    m.init_rotation(p.sub(this.position).normalized, up);

    var q = new quaternion({rot:m});
}

transform.prototype.get_transformed_position = function(){
    return this.get_parent_matrix().transform(this.position);
}

transform.prototype.get_transformed_scale = function(){
    return this.get_parent_matrix().transform(this.scale);
}

transform.prototype.get_transformed_rotation = function(){
    var parentRotation = new quaternion(0,0,0,1);

    if(this.parent != null){
        parentRotation = this.parent.get_transformed_rotation();
    }
    return parentRotation.q_mul(this.rotation);
}

transform.prototype.set_parent = function(t){
    if(t instanceof transform){
        this.parent = t;
    } else {
        console.error("Not Transform!");
    }
}

transform.prototype.set_position = function(p){
    this.position = p;
}