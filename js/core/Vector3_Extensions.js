THREE.Vector3.prototype.perp = function(){
    var x = this.x;
    this.x = this.z;
    this.z = -x;
    return this;
}


THREE.Vector3.prototype.rotate = function(rot){
    var conj = rot.conjugate(); //

    var w = rot.v_mul(this).q_mul(conj);
    return new THREE.Vector3(w.x, w.y, w.z);
}