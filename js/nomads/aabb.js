function aabb(x){
    this.x = x;

    this.parent = null;
}

aabb.prototype.set_parent = function(p){
    this.parent = p;
}

aabb.prototype.update = function(delta){
}

aabb.prototype.name = "aabb";


//function AABB(x, y, z, w, h, d){
//    this.x = x;
//    this.y = y;
//    this.z = z;
//    this.w = w;
//    this.h = h;
//    this.d = d;
//}