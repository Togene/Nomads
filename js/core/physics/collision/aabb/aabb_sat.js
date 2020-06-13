//for SAT intersecting 
//!
aabb.prototype.intersect_sat_aabb = function(right, offset){

    var overlap = Infinity;
    var axis = new THREE.Vector3();

    var v = this.get_verts(offset); // grab vertices
    var a = this.get_axes(v); // normal axes (faces)
    var e = this.edges(v); // get edges

    var rv = right.get_verts(); // right verts
    var ra = right.get_axes(rv); // right normal axes (faces)
    var re = right.edges(rv);

    var edge_axes = this.get_edge_axes(e, re);

    var p0 = this.parent.transform.get_transformed_position().clone();
    var p1 = right.parent.transform.get_transformed_position().clone();
    
    var direction = p0.clone().sub(p1).normalize();

    for(var i = 0; i < a.length; i++){
        var proj_1 = this.project(a[i], v);
        var proj_2 = right.project(a[i], rv);

        if(!proj_1.overlap(proj_2)) {
            return {result: false, axis: new THREE.Vector3(0,0,0), gap: 0};
        } else {

            var o = proj_1.get_overlap(proj_2);
            
            if(o < overlap){
                //set to axis
                overlap = o;
                axis = a[i];
            }
        }
    }

    for(var i = 0; i < ra.length; i++){
        var proj_1 = this.project(ra[i], v);
        var proj_2 = right.project(ra[i], rv);

        if(!proj_1.overlap(proj_2)) {
            return {result: false, axis: new THREE.Vector3(0,0,0), gap: 0};
        } else {

            var o = proj_1.get_overlap(proj_2);

            if(o < overlap){
                //set to axis
                overlap = o;
                axis = ra[i];
            }
        }
    }

    for(var i = 0; i < edge_axes.length; i++){
        var proj_1 = this.project(edge_axes[i].n, v);
        var proj_2 = right.project(edge_axes[i].n, rv);

        if(!proj_1.overlap(proj_2)) {
            return {result: false, axis: new THREE.Vector3(0,0,0), gap: 0};
        } else {

            var o = proj_1.get_overlap(proj_2);
            
            if(o < overlap){
                //set to axis
                overlap = o;
                axis = edge_axes[i].n;
                isEdge = true;
            }
        }
    }

    if(axis.dot(direction) < 0.0){
        axis.negate();
    }

    return {result: true, axis: axis, gap: overlap};
}

aabb.prototype.intersect_sat_aabb_sphere = function(right){

    var overlap = Infinity;
    var axis = new THREE.Vector3();

    var v = this.get_verts(); // grab vertices
    var a = this.get_axes(v); // normal axes (faces)
    var e = this.edges(v); // get edges

    var p0 = this.parent.transform.position.clone();
    var p1 = right.parent.transform.position.clone();
    
    var direction = p0.clone().sub(p1).normalize();

    var nearest = this.get_closest_vert(v, p1);
    
    var d = nearest.clone().sub(p1).normalize();

    a.push(d)
    
    for(var i = 0; i < a.length; i++){
        var proj_1 = this.project(a[i], v);
        var proj_2 = this.project(a[i], {c: p1, r: right.radius}, true);

        if(!proj_1.overlap(proj_2)) {
            return {result: false, axis: new THREE.Vector3(0,0,0), gap: 0};
        } else {

            var o = proj_1.get_overlap(proj_2);
            
            if(o < overlap){
                //set to axis
                overlap = o;
                axis = a[i];
                me = true;
            }
        }
    }

    if(axis.dot(direction) < 0.0){
        axis.negate();
    }

    return {result: true, axis: axis, gap: overlap};
}
