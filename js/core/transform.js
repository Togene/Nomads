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

transform.prototype.get_transformation = function(){
    var t = new matrix().init_translation(this.position.x, this.position.y, this.position.z);
    
    var euler = this.rotation.conjugate().to_euler();

    var r = new matrix().init_rotation((rad_to_dag(euler.x)), (rad_to_dag(euler.y)), (rad_to_dag(euler.z)));
    var s = new matrix().init_scale(this.scale.x, this.scale.y, this.scale.z);
    var p = this.get_parent_matrix();

    return p.mul(t.mul(r.mul(s)));
}

transform.prototype.get_inverse_transformation = function(){
    
    var t = new matrix().init_translation(-this.position.x, -this.position.y, -this.position.z);
    
    var r = new matrix().init_rotation(this.rotation.x, this.rotation.y, this.rotation.z);
    r = r.transpose();

    var s = new matrix().init_scale(-this.scale.x, -this.scale.y, -this.scale.z);
    var p = this.get_parent_inverse_matrix();
   
    return s.mul(r.mul(t.mul(p)));
}

//TODO hasChanged fix, bugged atm ---> && this.parent.hasChanged()
transform.prototype.get_parent_matrix = function(){
    if(this.parent != null){
        this.parent_matrix = (this.parent.get_transformation());
    } else {
        this.parent_matrix =  new matrix().init_identity();
    }
    return this.parent_matrix;
}

transform.prototype.get_parent_inverse_matrix = function(){
    if(this.parent != null && this.parent.hasChanged()){
        this.parent_matrix = (this.parent.get_inverse_transformation());
    } else {
        this.parent_matrix =  new matrix().init_identity();
    }
    return this.parent_matrix;
}

transform.prototype.update = function(delta){
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

transform.prototype.get_look_direction = function(p, up, debug = false){

    var dir = p.clone().sub(this.position).normalize();

    var m = new matrix().init_rotation_fu(dir, up);
    
    return new quaternion(0, 0, 0, 1, null, null, m, debug);
}

transform.prototype.look_at = function(p, up){
    this.rotation = this.get_look_direction(p, up);
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
        this.parent_matrix = t.get_transformation();
        this.update()
    } else {
        console.error("Not Transform!");
    }
}

transform.prototype.set_position = function(p){
    this.position = p;
}

transform.prototype.clone = function() {
    var new_transform = new transform(
        this.position.clone(),
        this.scale.clone(),
        this.rotation.clone(),
    );
    
    if(this.parent != null) new_transform.set_parent(this.parent);

    return new_transform;
}

transform.prototype.has_rotated = function(){
    return this.rotation.x != 0 || this.rotation.y != 0 || this.rotation.z != 0;
}



transform.prototype.name = "transform";