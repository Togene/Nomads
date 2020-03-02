function decube(c, min, max, w, d, h){

    this.min = min;
    this.max = max;
    
    this.active = false;

    this.dimensions = new THREE.Vector3(w, h, d);

    this.t = new transform(
        new THREE.Vector3().copy(c),
        new THREE.Vector3(1,1,1),
        new quaternion(0,0,0,1),
    );

    this.line_mat = new THREE.MeshBasicMaterial( {color: 0xffffff} );

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

    this.update_points();


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

decube.prototype.update = function(min, max, t, p, delta){
    this.t = t.clone();
    
    this.t.position = new THREE.Vector3(
        this.t.position.x * p.x,
        this.t.position.y * p.y,
        this.t.position.z * p.z
    );

    this.update_points(min, max, p);
}

decube.prototype.set_color = function(hex){
    //this.material.color = new THREE.Color(hex);
    this.line_mat.color = new THREE.Color(hex);
}

decube.prototype.update_points = function(min, max, projection){
    
    this.line_mat.visible = this.active;

    if(this.active){
        if(this.t != undefined){
            this.t.scale = new THREE.Vector3(1,1,1);

            //max and min from aabb, transformed already
            if(min != undefined && max != undefined){
                var p0 = (new THREE.Vector3(
                    -this.dimensions.x,
                    -this.dimensions.y,
                    -this.dimensions.z
                ));
                p0.applyMatrix4 (this.t.get_transformation().toMatrix4());

                var p7 = (new THREE.Vector3(
                    this.dimensions.x,
                    this.dimensions.y,
                    this.dimensions.z
                ));
                    
                p7.applyMatrix4 (this.t.get_transformation().toMatrix4());
    
                var p1 = new THREE.Vector3(
                    this.dimensions.x,
                    -this.dimensions.y,
                    -this.dimensions.z
                );
        
                p1.applyMatrix4 (this.t.get_transformation().toMatrix4());
                //this.p1.position.copy(p1);
        
                this.update_line(this.line01, p0, p1);
                
                var p2 = new THREE.Vector3(
                    this.dimensions.x,
                    -this.dimensions.y,
                    this.dimensions.z
                );
                p2.applyMatrix4 (this.t.get_transformation().toMatrix4());
                //this.p2.position.copy(p2);
        
                this.update_line(this.line12, p1, p2);
        
                var p3 = new THREE.Vector3(
                    -this.dimensions.x,
                    -this.dimensions.y,
                    this.dimensions.z
                );
                p3.applyMatrix4 (this.t.get_transformation().toMatrix4());
                //this.p3.position.copy(p3);
        
                this.update_line(this.line23, p2, p3);
                this.update_line(this.line30, p3, p0);
                
                var p4 = new THREE.Vector3(
                    this.dimensions.x,
                    this.dimensions.y,
                    -this.dimensions.z
                );
        
                p4.applyMatrix4 (this.t.get_transformation().toMatrix4());
                //this.p4.position.copy(p4);
        
                this.update_line(this.line74, p7, p4);
        
                var p5 = new THREE.Vector3(
                    -this.dimensions.x,
                    this.dimensions.y,
                    -this.dimensions.z
                );
        
                p5.applyMatrix4 (this.t.get_transformation().toMatrix4());
        
                this.update_line(this.line45, p4, p5);
        
                var p6 = new THREE.Vector3(
                    -this.dimensions.x,
                    this.dimensions.y,
                    this.dimensions.z
                );
        
                p6.applyMatrix4 (this.t.get_transformation().toMatrix4());
        
                this.update_line(this.line56, p5, p6);
                this.update_line(this.line67, p6, p7);
        
                this.update_line(this.line04, p0, p5);
                this.update_line(this.line15, p1, p4);
                this.update_line(this.line26, p2, p7);
                this.update_line(this.line37, p3, p6);
            }
        }
    }
}