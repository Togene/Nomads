function quaternion(x, y, z, w, axis = null, angle = null, rot = null, debug = false){
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;

    if(axis != null && angle != null){
        if(debug) console.log("reached here?");
        var sinHalfAngle = Math.sin(angle/2);
        var cosHalfAngle = Math.cos(angle/2);

        this.x = axis.x * sinHalfAngle;
        this.y = axis.y * sinHalfAngle;
        this.z = axis.z * sinHalfAngle;
        this.w = cosHalfAngle;

    } else if (rot != null){
        if(debug) console.log("reached matrix?", this.x);
        this.constructor_matrix(rot);
    }
}

quaternion.prototype.constructor_matrix = function(rot){
            
            var trace = rot.get(0, 0) + rot.get(1, 1) + rot.get(2, 2);

            if(trace > 0){
               
               var s = 0.5 / Math.sqrt(trace + 1.0);
               this.w = 0.25 / s;
               this.x = (rot.get(1, 2) - rot.get(2, 1)) * s;
               this.y = (rot.get(2, 0) - rot.get(0, 2)) * s;
               this.z = (rot.get(0, 1) - rot.get(1, 0)) * s;
    
            } else {

                if(rot.get(0,0) > rot.get(1, 1) && rot.get(0, 0) > rot.get(2, 2)){
    
                    var s = 2.0 * Math.sqrt(1.0 + rot.get(0, 0) - rot.get(1, 1) - rot.get(2, 2));
    
                    this.w = (rot.get(1, 2) - rot.get(2, 1)) / s;
                    this.x = 0.25 * s;
                    this.y = (rot.get(1, 0) + rot.get(0, 1)) / s;
                    this.z = (rot.get(2, 0) + rot.get(0, 2)) / s;
    
                } else if(rot.get(1, 1) > rot.get(2, 2)){
                    
                    var s = 2.0 * Math.sqrt(1.0 + rot.get(1, 1) - rot.get(0, 0) - rot.get(2,2));
    
                    this.w = (rot.get(2, 0) - rot.get(0, 2)) / s;
                    this.x = (rot.get(1, 0) + rot.get(0, 1)) / s;
                    this.y = 0.25 * s;
                    this.z = (rot.get(2, 1) + rot.get(1, 2)) / s;
                } else {
                    
                    var s = 2.0 * Math.sqrt(1.0 + rot.get(2, 2) - rot.get(0, 0) - rot.get(1, 1));
    
                    this.w = (rot.get(0, 1) - rot.get(1, 0)) / s;
                    this.x = (rot.get(2, 0) + rot.get(0, 2)) / s;
                    this.y = (rot.get(1, 2) + rot.get(2, 1)) / s;
                    this.z = 0.25 * s;
                }
            }
    
            var length = Math.sqrt(
                this.x * this.x + 
                this.y * this.y + 
                this.z * this.z + 
                this.w * this.w);
    
             this.x /= length;
             this.y /= length;
             this.z /= length;
             this.w /= length;
}

quaternion.prototype.length = function(){
    return Math.sqrt(
        this.x * this.x + 
        this.y * this.y + 
        this.z * this.z + 
        this.w * this.w);
}

quaternion.prototype.normalized = function() {
    var length = this.length();

    return new quaternion(this.x/length, this.y/length, this.z/length, this.w/length);
}

quaternion.prototype.conjugate = function(){
    return new quaternion(-this.x, -this.y, -this.z, this.w);
}

quaternion.prototype.s_mul = function(r){
    return new quaternion(this.x * r, this.y * r, this.z * r, this.w * r);
}

quaternion.prototype.q_mul = function(r){

    if(r instanceof quaternion){
            
        var _w = (this.w * r.w) - (this.x * r.x) - (this.y * r.y) - (this.z * r.z);
        var _x = (this.x * r.w) + (this.w * r.x) + (this.y * r.z) - (this.z * r.y);
        var _y = (this.y * r.w) + (this.w * r.y) + (this.z * r.x) - (this.x * r.z);
        var _z = (this.z * r.w) + (this.w * r.z) + (this.x * r.y) - (this.y * r.x);

        return new quaternion(_x, _y, _z, _w);
    } else {
        console.error("needs to be quaternion");
        return new quaternion(-1, -1, -1, -1);
    }

}

quaternion.prototype.v_mul = function(r){

    if(r instanceof THREE.Vector3){
        var _w = (-this.x * r.x) - (this.y * r.y) - (this.z * r.z);
        var _x = ( this.w * r.x) + (this.y * r.z) - (this.z * r.y);
        var _y = ( this.w * r.y) + (this.z * r.x) - (this.x * r.z);
        var _z = ( this.w * r.z) + (this.x * r.y) - (this.y * r.x);

        return new quaternion(_x, _y, _z, _w);
    }

    return -1;
}

quaternion.prototype.sub = function(r){
    return new quaternion(this.x - r.x, this.y - r.y, this.z - r.z, this.w - r.w);
}

quaternion.prototype.add = function(r){
    return new quaternion(this.x + r.x, this.y + r.y, this.z + r.z, this.w + r.w);
}

quaternion.prototype.toRotationMatrix = function(){
    var forward = new THREE.Vector3(
        2.0 * (this.x * this.z - this.w * this.y),
        2.0 * (this.y * this.z + this.w * this.x),
        1.0 - 2.0 * (this.x * this.x + this.y * this.y));

    var up = new THREE.Vector3(
        2.0 * (this.x * this.y + this.w * this.z),
        1.0 - 2.0 * (this.x * this.x + this.z * this.z),
        2.0 * (this.y * this.z - this.w * this.x));

    var right = new THREE.Vector3(
        1.0 - 2.0 * (this.y * this.y + this.z * this.z),
        2.0 * (this.x * this.y - this.w * this.z),
        2.0 * (this.x * this.z + this.w * this.y));

    var m = new matrix();
    m.init_rotation(forward, up, right);

    return m;
}

quaternion.prototype.dot = function(r){
    return this.x * r.x + this.y * r.y + this.z * r.z + this.w * this.w;
}

quaternion.prototype.nlerp = function(dest, lerp, shortest){

    var corrected_dest = dest.clone();

    if(shortest && this.dot(dest) < 0){
        corrected_dest = new quaternion(-dest.x, -dest.y, -dest.z, -dest.w);
    }

    return corrected_dest.sub(this).s_mul(lerp).add(this).normalized();
}

quaternion.prototype.slerp = function(dest, lerp, shortest){
    var EPSILON = 1e3;

    var cos = this.dot(dest);
    var corrected_dest = dest.clone();

    if(shortest && cos < 0){
        cos = -cos;
        corrected_dest = new quaternion(-dest.x, -dest.y, -dest.z, -dest.w);
    }

    if(Math.abs(cos) >= 1 - EPSILON){
        return this.nlerp(corrected_dest, lerp, false);
    }

    var sin = Math.sqrt(1.0 - cos * cos);
    var angle = Math.atan2(sin, cos);
    var inv_sin = 1.0/sin;

    var src_factor = Math.sin((1.0 - lerp) * angle) * inv_sin;
    var dest_factor = Math.sin((lerp) * angle) * inv_sin;

    var new_rot = this.clone();
    return new_rot.s_mul(src_factor).add(corrected_dest).s_mul(dest_factor);
}

quaternion.prototype.get_forward = function(){
    return new THREE.Vector3(0, 0, 1).rotate(this);
}

quaternion.prototype.get_back = function(){
    return new THREE.Vector3(0, 0, -1).rotate(this);
}

quaternion.prototype.get_up = function(){
    return new THREE.Vector3(0, 1, 0).rotate(this);
}

quaternion.prototype.get_down = function(){
    return new THREE.Vector3(0, -1, 0).rotate(this);
}

quaternion.prototype.get_right = function(){
    return new THREE.Vector3(1, 0, 0).rotate(this);
}

quaternion.prototype.get_left = function(){
    return new THREE.Vector3(-1, 0, 0).rotate(this);
}

quaternion.prototype.set = function(x, y, z, w){
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
}

quaternion.prototype.qset = function(q){
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
    this.w = q.w;
}

quaternion.prototype.equals = function(q){
    return this.x == q.x && this.y == q.y && this.z == q.z && this.w == q.w;
}

quaternion.prototype.to_three_q = function(){
    return new THREE.Quaternion(
        dag_to_rad(this.x), 
        dag_to_rad(this.y), 
        dag_to_rad(this.z), 
        dag_to_rad(this.w));
}

quaternion.prototype.to_three_q_rad = function(){
    return new THREE.Quaternion(
        (this.x), 
        (this.y), 
        (this.z), 
        (this.w));
}

//https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles
quaternion.prototype.to_euler = function(){
    
    //roll x axis rotation
    var sinr_cosp = 2 * (this.w * this.x + this.y * this.z);
    var cosr_cosp = 1 - 2 * (this.x * this.x + this.y * this.y);
    var roll = Math.atan2(sinr_cosp, cosr_cosp);

    //pitch y axis rotation
    var sin_p = 2 * (this.w * this.y - this.z * this.x);

    var pitch = 0.0;
    if(Math.abs(sin_p) >= 1){
        pitch = copy_sign(Math.PI / 2, sin_p); //use 90 degrees if out of range
    } else {
        pitch = Math.asin(sin_p);
    }

    //yaw z axis rotation
    var siny_cosp = 2 * (this.w * this.z + this.x * this.y);
    var cosy_cosp = 1 - 2 * (this.y * this.y + this.z * this.z);
    var yaw = Math.atan2(siny_cosp, cosy_cosp);

    return new THREE.Vector3(((roll)), ((pitch)), ((yaw)));
}

quaternion.prototype.clone = function(){
    return new quaternion(this.x, this.y, this.z, this.w);
}

quaternion.prototype.name = "quaternion";