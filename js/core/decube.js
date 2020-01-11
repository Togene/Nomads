function decube(c, min, max, w, d, h){

    this.min = min;
    this.max = max;

    this.dimensions = new THREE.Vector3(w, h, d);

    this.t = new transform(
        new THREE.Vector3().copy(c),
        new THREE.Vector3(1,1,1),
        new quaternion(0,0,0,1),
    );

    var geometry = new THREE.BoxGeometry( .05, .05, .05 );
    this.material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    
    this.line_mat = new THREE.MeshBasicMaterial( {color: 0xffffff} );

    //-------------------- Bottom Face ---------------------
    this.p0 = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {color: 0x00ff00} ) );
    this.p1 = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {color: 0x0000ff} ) );
    this.p2 = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {color: 0xff00ff} )  );
    this.p3 = new THREE.Mesh( geometry, this.material );
    //-------------------- Bottom Face ---------------------

    //-------------------- Top Face ---------------------
    this.p4 = new THREE.Mesh( geometry, this.material );
    this.p5 = new THREE.Mesh( geometry, this.material );
    this.p6 = new THREE.Mesh( geometry, this.material );
    this.p7 = new THREE.Mesh( geometry, this.material );

    this.line01 = new THREE.Line(this.create_line(this.p0, this.p1), this.line_mat);
    this.line12 = new THREE.Line(this.create_line(this.p1, this.p2), this.line_mat);
    this.line23 = new THREE.Line(this.create_line(this.p2, this.p3), this.line_mat);
    this.line30 = new THREE.Line(this.create_line(this.p3, this.p0), this.line_mat);
    //-------------------- Top Face ---------------------

    this.update_points();

    scene.add(this.p0);
    scene.add(this.line01);
    scene.add(this.p1);
    scene.add(this.line12);
    scene.add(this.p2);
    scene.add(this.line23);
    scene.add(this.p3);
    scene.add(this.line30);

    scene.add(this.p4);
    scene.add(this.p5);
    scene.add(this.p6);
    scene.add(this.p7);
}

decube.prototype.set_parent = function(p){
    this.parent = p;
};

decube.prototype.create_line = function (s, f){
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3().copy(s.position));
    geometry.vertices.push(new THREE.Vector3().copy(f.position));
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

decube.prototype.update = function(min, max, t, delta){
    this.t = t.clone();
    this.update_points(min, max);
}

decube.prototype.set_color = function(hex){
    this.material.color = new THREE.Color(hex);
    this.line_mat.color = new THREE.Color(hex);
}

decube.prototype.update_points = function(min, max){
    
    //max and min from aabb, transformed already
    if(min != undefined && max != undefined){
        this.p0.position.copy(new THREE.Vector3(
            min.x,
            min.y,
            min.z
        ));

        this.p7.position.copy(new THREE.Vector3(
            max.x,
            max.y,
            max.z
        ));
    }

    if(this.t != undefined){

        this.t.scale = new THREE.Vector3(1,1,1);

        var p1 = new THREE.Vector3(
            this.dimensions.x,
            -this.dimensions.y,
            -this.dimensions.z
        );

        p1.applyMatrix4 (this.t.get_transformation().toMatrix4());
        this.p1.position.copy(p1);

        this.update_line(this.line01, this.p0.position, p1);
        
        var p2 = new THREE.Vector3(
            this.dimensions.x,
            -this.dimensions.y,
            this.dimensions.z
        );
        p2.applyMatrix4 (this.t.get_transformation().toMatrix4());
        this.p2.position.copy(p2);

        this.update_line(this.line12, p1, p2);

        var p3 = new THREE.Vector3(
            -this.dimensions.x,
            -this.dimensions.y,
            this.dimensions.z
        );
        p3.applyMatrix4 (this.t.get_transformation().toMatrix4());
        this.p3.position.copy(p3);

        this.update_line(this.line23, p2, p3);
        this.update_line(this.line30, p3, this.p0.position);

       // var p4 = new THREE.Vector3(
       //     -this.dimensions.x,
       //     this.dimensions.y,
       //     -this.dimensions.z
       // );
//
       // p4.applyMatrix4 (this.t.get_transformation().toMatrix4());
//
       // var p5 = new THREE.Vector3(
       //     -this.dimensions.x,
       //     this.dimensions.y,
       //     this.dimensions.z
       // );
//
       // p5.applyMatrix4 (this.t.get_transformation().toMatrix4());
//
       // var p6 = new THREE.Vector3(
       //     this.dimensions.x,
       //     this.dimensions.y,
       //     -this.dimensions.z
       // );
       // p6.applyMatrix4 (this.t.get_transformation().toMatrix4());
       // 
       // var p7 = new THREE.Vector3(
       //     this.dimensions.x,
       //     this.dimensions.y,
       //     this.dimensions.z
       // );
       // p7.applyMatrix4 (this.t.get_transformation().toMatrix4());
        
        //this.p4.position.copy(p4);
        //this.p5.position.copy(p5);
        //this.p6.position.copy(p6);
        //this.p7.position.copy(p7);
        
       //if(this.line04 != undefined){
       //    //update line from 0 - 1;
       //    this.update_line(this.line01, p0, p1);
       //    this.update_line(this.line23, p2, p3);
       //    this.update_line(this.line13, p1, p3);
       //    this.update_line(this.line02, p0, p2);
       //    this.update_line(this.line45, p4, p5);
       //    this.update_line(this.line67, p6, p7);
       //    this.update_line(this.line57, p5, p7);
       //    this.update_line(this.line46, p4, p6);
       //    this.update_line(this.line04, p0, p4);
       //}

       //if(this.line15 != undefined){
       //    this.update_line(this.line15, p1, p5);
       //}

       //if(this.line37 != undefined){
       //    this.update_line(this.line37, p3, p7);
       //}

       //if(this.line26 != undefined){
       //    this.update_line(this.line26, p2, p6);
       //}
    }
    
}