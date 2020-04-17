function decube(verts){

    this.active = false;

    this.line_mat = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    this.line_mat2 = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    var v = new THREE.Vector3();
    
    this.line01 = new THREE.Line(this.create_line(v, v), this.line_mat);
    this.line12 = new THREE.Line(this.create_line(v, v), this.line_mat);
    this.line23 = new THREE.Line(this.create_line(v, v), this.line_mat);
    this.line30 = new THREE.Line(this.create_line(v, v), this.line_mat);
    this.line74 = new THREE.Line(this.create_line(v, v), this.line_mat);
    this.line45 = new THREE.Line(this.create_line(v, v), this.line_mat);
    this.line56 = new THREE.Line(this.create_line(v, v), this.line_mat);
    this.line67 = new THREE.Line(this.create_line(v, v), this.line_mat);
    this.line04 = new THREE.Line(this.create_line(v, v), this.line_mat);
    this.line15 = new THREE.Line(this.create_line(v, v), this.line_mat);
    this.line26 = new THREE.Line(this.create_line(v, v), this.line_mat);
    this.line37 = new THREE.Line(this.create_line(v, v), this.line_mat);

    this.update_points(verts);

    scene.add(this.line01);
    scene.add(this.line12);
    scene.add(this.line23);
    scene.add(this.line30);
    scene.add(this.line74);
    scene.add(this.line45);
    scene.add(this.line56);
    scene.add(this.line67);
    scene.add(this.line04);
    scene.add(this.line15);
    scene.add(this.line26);
    scene.add(this.line37);

    
}

decube.prototype.set_parent = function(p){
    this.parent = p;
};


decube.prototype.set_active = function(b){
    this.active = b;
};


decube.prototype.create_line = function (s, f){
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3().copy(s));
    geometry.vertices.push(new THREE.Vector3().copy(f));
    return geometry;
}

decube.prototype.update_line = function(l, s, f){
    l.geometry.vertices[0] = (s.clone());
    l.geometry.vertices[1] = (f.clone());
    
    l.geometry.computeBoundingSphere();
    l.geometry.frustumCulled = false;
    l.geometry.__dirtyVertices  = true;
    l.geometry.verticesNeedUpdate = true;
    l.geometry.normalsNeedUpdate = true;
}

decube.prototype.update = function(verts){
    this.update_points(verts)
}

decube.prototype.set_color = function(hex){
    this.line_mat.color = new THREE.Color(hex);
}

decube.prototype.update_points = function(v){
    
    this.line_mat.visible = this.active;

    if(v == null){return;}

    if(this.active){
            this.update_line(this.line01, v[0], v[1]);
            this.update_line(this.line12, v[1], v[2]);
            this.update_line(this.line23, v[2], v[3]);
            this.update_line(this.line30, v[3], v[0]);
            this.update_line(this.line74, v[7], v[4]);
            this.update_line(this.line45, v[4], v[5]);
            this.update_line(this.line56, v[5], v[6]);
            this.update_line(this.line67, v[6], v[7]);
            
            this.update_line(this.line04, v[0], v[4]);
            this.update_line(this.line15, v[1], v[5]);
            this.update_line(this.line26, v[2], v[6]);
            this.update_line(this.line37, v[3], v[7]);
    }
}