aabb.prototype.intersect_legacy = function(right){
    var lx = false;
    var rx = false;
    var ty = false;
    var by = false;
    var bz = false;
    var fz = false;

    var n = new THREE.Vector3();

    if(right.centre.x - right.w > this.centre.x + this.w){
        lx = true;
        n = new THREE.Vector3(1, 0, 0);
    }

    if(right.centre.x + right.w < this.centre.x - this.w){
        rx = true;
        n.add(new THREE.Vector3(-1, 0, 0));
    }

    if(right.centre.y - right.h > this.centre.y + this.h){
        by = true;
        n.add(new THREE.Vector3(0, -1, 0));
    }

    if(right.centre.y + right.h < this.centre.y - this.h){
        ty = true;
        n.add(new THREE.Vector3(0, 1, 0));
    }

    if(right.centre.z - right.d > this.centre.z + this.d){
        bz = true;
        n.add(new THREE.Vector3(0, 0, -1));
    }

    if(right.centre.z + right.d < this.centre.z - this.d){
        fz = true;
        n.add(new THREE.Vector3(0, 0, 1));
    }

    n.normalize();

    //console.log(
    //    "\n", "lx", lx, "rx", rx,"\n",
    //    "by", by, "ty", ty,"\n",
    //    "fz", fz, "bz", bz,"\n")
/*
          6----7
         /|   /|
        2----3 |
        | |  | |
        | 4--|-5
        |/   |/
        0----1
*/
    return {result: !(lx || rx || by || ty || fz || bz), normal: n};
}