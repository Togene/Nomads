
//axis = of least penetration, provided by SAT collision
//A - vertices's of A's face
//B - vertices of face
function handle_face(axis, A, B){

    //edges from this //.clone().negate()
    var A_edge = get_edge(axis, A);
    var B_edge = get_edge(axis, B);
    
    var A_points = sutherland_hodgman(A_edge, B_edge, axis);
    var B_points = sutherland_hodgman(B_edge, A_edge, axis);

    points = B_points.concat(A_points);

    return points;
}

//axis = of least penetration, provided by SAT collision
//A - vertices's of A's face
//B - vertices of face
function handle_edge(axis, A, B){

}

function sutherland_hodgman(e0, e1, n){
    var ref, inc;
    var flip = false;

    if(Math.abs(e0.dot(n)) <= Math.abs(e1.dot(n))){
        ref = e0.clone();
        inc = e1.clone();
    } else {
        ref = e1.clone();
        inc = e0.clone();

        flip = true;
    }

    //the edge vector
    var refv = ref.get_vector().clone().normalize();
    
    var o1 = refv.dot(ref.v0);

    var cp = clip(inc.v0, inc.v1, refv, o1);

    //if we dont have 2 points, return
    if(cp.length < 2) return;

    //clip whats left of the incident edge by
    //the second vertex of the refrence edge
    //but we need to clip the oppsite direction
    //so we flip the direction and offset
    var o2 = refv.dot(ref.v1);

    var cp2 = clip(cp[0], cp[1], refv.clone().negate(), -o2);
    //if we dont have 2 points left then fail
    if(cp2.length < 2) return;
    
    // get the reference edge normal
    //! might be a problem
    var ref_norm = ref.get_edge_normal(); //
    //if we had a flip the incident and refrences edges
    //then we need to flip the refrence edge normal to
    //clip properly

    if(flip) ref_norm.negate();

    //get the largest depth
    var max = ref_norm.dot(ref.max);
    //make sure the final points are not past the maximum
    
    if(ref_norm.dot(cp2[0]) - max < 0.0){
        cp2[0] = null;
    } 

    if((ref_norm.dot(cp2[1]) - max < 0.0)){
        cp2[1] = null; 
    }

    return cp2;
}

//clips the line sergment points v1, v2
//if they are past o along n
function clip (v0, v1, n, o){
    var cp = [];
  
    var d1 = n.dot(v0) - o;
    var d2 = n.dot(v1) - o;

    //if either point is past o along n
    //then we can keep the point
    if(d1 >= 0.0) cp.push(v0);
    if(d2 >= 0.0) cp.push(v1);

    //finally we need to check if they
    //are on opposing sides so that we can
    //compute the correct point

    if(d1 * d2 < 0.0){
        //if they are on diffrent sides of the
        //offset, d1 and d2 will be a (+) * (-)
        //and will yield a (-) and there be less then zero
        //get the vector for the edge we are clipping

        var e = v1.clone().sub(v0);
        //compute the location along e
        var u = d1 / (d1 - d2);

        e.multiplyScalar(u);

        e.add(v0);

        //add the point
        cp.push(e);
    }

    return cp;
}


function get_edge(n, vertices){
    //step 1 find farthest vertex
    //within the polygon along seperation normal;
    var max = -Infinity;
    var index = null;

    for(var i = 0; i < vertices.length; i++){
        var projection = n.dot(vertices[i]);
        
        if(projection > max){
            max = projection;
            index = i;
        }
    }
  
    //step 2
    // new we need to use the edge that 
    // is most perp either
    // right or the left
    var v = vertices[index];
    var v1 = vertices[(index + 1) % vertices.length];
    var v0 = vertices[(index - 1 < 0) ? vertices.length-1 : index-1];
    //v1 to v
    var l = v.clone().sub(v1).normalize();
    //v0 to v
    var r = v.clone().sub(v0).normalize();

    //the edge that is most perp
    // to n will have a dot product closer to zero
    if(r.dot(n) <= l.dot(n)){
        return new edge(v, v0, v);
    } else {
        return new edge(v, v, v1);
    }
}