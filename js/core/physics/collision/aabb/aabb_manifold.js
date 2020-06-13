
aabb.prototype.generate_contact_points = function(v, rv, axis, direction, right){

    var f = this.get_faces(v);
    var rf = right.get_faces(rv);

    var thisEdge = false;
    var rightEdge = false;

    //get the 2 side planes
    var right_face = this.get_face(rf, axis);
    var this_face = this.get_face(f, axis.clone().negate());

    if(right_face == null){rightEdge = true;}
    if(this_face == null){thisEdge = true}
    var points = []

    for(var j = 0; j < this.debug_points.length; j++){
            this.debug_points[j].position.copy(new THREE.Vector3());
    } 

    if(!thisEdge && !rightEdge){
        points = [];

        var f = this.get_faces(v);
        var rf = right.get_faces(rv);

        for(var i = 0; i < this_face.v.length; i++){
            var this_v = this_face.v[i];
            var i_loop = (i + 1) % this_face.v.length;
            var e0 = new edge(this_v, this_v, this_face.v[i_loop], this_face);

            for(var j = 0; j < right_face.v.length; j++){

                var j_loop = (j + 1) % right_face.v.length;
                var right_v = right_face.v[j];
                var e1 = new edge(right_v, right_v, right_face.v[j_loop], right_face);

                points = points.concat(hodgman_sutherland(e0, e1, axis, false));
         
            }
        }
    }

    if(points != null){
        for(var j = 0; j < points.length; j++){
            if(points[j] != null){
                this.debug_points[j].position.copy(points[j]);
            } else {
                this.debug_points[j].position.copy(new THREE.Vector3());
            } 
        }
    }
}

aabb.prototype.best_face = function(o, n){

    var max = -Infinity;
    var face_index = null;

    //find best edge from faces and verts
    for(var j = 0; j < o.length; j++){
            var projection = n.dot(o[j].n);

            if(projection > max){
                max = projection;
                face_index = j;
            }
    }
    return o[face_index];
}

aabb.prototype.best_edge = function(o, n){

    var max = -Infinity;
    var vert_index = null;
    var face_index = null;

    //find best edge from faces and verts
    for(var j = 0; j < o.length; j++){
        for(var i = 0; i <  o[j].v.length; i++){
            var projection = n.dot(o[j].v[i]);

            if(projection > max){
                max = projection;
                vert_index = i;
                face_index = j;
            }
        }
    }

    var v_length = o[face_index].v.length;
    var v_i_next = (vert_index + 1) % v_length;
    var v_1_prev = (vert_index - 1 < 0) ? v_length - 1 : vert_index - 1;

    var v = o[face_index].v[vert_index];

    var v1 = o[face_index].v[v_i_next];
    var v0 = o[face_index].v[v_1_prev];

    var l = v.clone().sub(v1).normalize();
    var r = v.clone().sub(v0).normalize();

    if(r.dot(n) <= l.dot(n)){
        return new edge(v, v0, v, o[face_index]);
    } else {
        return new edge(v, v, v1, o[face_index]);
    }
}

aabb.prototype.best_edge_per_face = function(face, n){

    var max = -Infinity;
    var vert_index = null;

    //find best edge from faces and verts
    for(var i = 0; i < face.v.length; i++){
            var projection = n.dot(face.v[i]);

            if(projection > max){
                max = projection;
                vert_index = i;
            }
    }

    var v_length = face.v.length;
    var v_i_next = (vert_index + 1) % v_length;
    var v_1_prev = (vert_index - 1 < 0) ? v_length - 1 : vert_index - 1;

    var v = face.v[vert_index];

    var v1 = face.v[v_i_next];
    var v0 = face.v[v_1_prev];

    var l = v.clone().sub(v1).normalize();
    var r = v.clone().sub(v0).normalize();

    if(r.dot(n) <= l.dot(n)){
        return new edge(v, v0, v, face);
    } else {
        return new edge(v, v, v1, face);
    }
}