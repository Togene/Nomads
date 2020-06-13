aabb.prototype.ray_intersect = function(r){
    if(!(r instanceof ray)){return false;}

    //---------------------- X ---------------------------------
    var txmin = (this.min.x - r.origin.x) / r.direction.x;
    var txmax = (this.max.x - r.origin.x) / r.direction.x;

    if(txmin > txmax) {
        //* ------------ SWAP -----------
        //console.log("min x", txmin, "max x", txmax);
        var tmp = txmin;
        txmin = txmax;
        txmax = tmp;
        //console.log("min x", txmin, "max x", txmax);
        //* ------------ SWAP -----------
    }
    //---------------------- X ---------------------------------

    //---------------------- Y ---------------------------------
    var tymin = (this.min.y - r.origin.y) / r.direction.y;
    var tymax = (this.max.y - r.origin.y) / r.direction.y;

    if(tymin > tymax) {
        //* ------------ SWAP -----------
        //console.log("min y", tymin, "max y", tymax);
        var tmp = tymin;
        tymin = tymax;
        tymax = tmp;
        //console.log("min y", tymin, "max y", tymax);
        //* ------------ SWAP -----------
    }

    if((txmin > tymax) || (tymin > txmax)){return false;}
    if(tymin > txmin){txmin = tymin;}
    if(tymax < txmax){txmax = tymax;}
    //---------------------- Y ---------------------------------

    //---------------------- Z ---------------------------------
    var tzmin = (this.min.z - r.origin.z) / r.direction.z;
    var tzmax = (this.max.z - r.origin.z) / r.direction.z;

    if(tzmin > tzmax) {
        //* ------------ SWAP -----------
        //console.log("min z", tzmin, "max z", tzmax);
        var tmp = tzmin;
        tzmin = tzmax;
        tzmax = tmp;
        //console.log("min z", tzmin, "max z", tzmax);
        //* ------------ SWAP -----------
    }

    if((txmin > tzmax) || (tzmin > txmax)){return false;}
    if(tzmin > txmin){txmin = tzmin;}
    if(tzmax < txmax){txmax = tzmax;}
    //---------------------- Z ---------------------------------
    
    return {val : true, x: txmin, y: this.max.y, z: tzmin};
}