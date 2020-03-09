function hodgman_sutherland(e1, e2, n, flip){
    if(Math.abs(e1.dot(n)) <= Math.abs(e2.dot(n))){
        ref = e1;
        inc = e2;
        //flip = true;
    } else {
        ref = e2;
        inc = e1;
    
        flip = true;
    }

    var refv = ref.get_vector();
    var o1 = refv.dot(ref.v0);

    var cp = clip(inc.v0, inc.v1, refv, o1);
    if(cp.length < 2) return;

    var o2 = refv.dot(ref.v1);
    var cp = clip(cp[0], cp[1], refv.clone().negate(), -o2);
    if(cp.length < 2) return;

    var ref_norm = ref.get_centre().clone().sub(ref.face_normal()).normalize();

    if(flip) ref_norm.negate();

    var max = ref_norm.dot(ref.max);

    if(ref_norm.dot(cp[0]) - max < 0.0){
        cp[0] = null;
    }

    if(ref_norm.dot(cp[1] - max < 0.0)){
        cp[1] = null;
    }

    return cp;
}

function clip(v1, v2, n, o){
    var cp = [];

    var d1 = n.dot(v1) - o;
    var d2 = n.dot(v2) - o;

    if(d1 >= 0.0) cp.push(v1);
    if(d2 >= 0.0) cp.push(v2);

    if(d1 * d2 < 0.0){
        var e = v2.clone().sub(v1);
        var u = d1 / (d1 - d2);
        e.multiplyScalar(u);
        e.add(v1);

        cp.push(e);
    }

    return cp;
}