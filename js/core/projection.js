function projection(min, max){
    this.min = min;
    this.max = max;
}

projection.prototype.overlap = function(o){
   	return !(this.min > o.max || o.min > this.max);
}

projection.prototype.create_line = function (s, f, hex){
    
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3().copy(s));
    geometry.vertices.push(new THREE.Vector3().copy(f));

    return new THREE.Line(geometry, new THREE.MeshBasicMaterial({color: hex} ));
}