// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain




//Quad Tree Responsible for Checking for nearby objects
function rectangle(x, y, w, h){
    this.x = x; // CENTER X
    this.y = y; // CENTER Y
    this.w = w;
    this.h = h;
}

rectangle.prototype.left = function(){
    return this.x - this.w / 2;
}

rectangle.prototype.right = function(){
    return this.x + this.w / 2;
}

rectangle.prototype.top = function(){
    return this.y - this.h / 2;
}

rectangle.prototype.bottom = function(){
    return this.y + this.h / 2;
}

rectangle.prototype.contains = function(o){

    if(o == undefined) {return false}
    return (
        o.pos.x >= this.x - this.w &&
        o.pos.x <= this.x + this.w &&
        o.pos.z >= this.y - this.h &&
        o.pos.z <= this.y + this.h);
}

rectangle.prototype.intersects = function(range){
    return !(
        range.x - range.w > this.x + this.w ||
        range.x + range.w < this.x - this.w ||
        range.y - range.h > this.y + this.h ||
        range.y + range.h < this.y - this.h);
}

rectangle.prototype.name = "rectangle";

function circle(x, y, r){
    this.x = x;
    this.y = y;
    this.r = r;
    this.rsqrd = this.r * this.r;
}

circle.prototype.contains = function(o){
    if(o == undefined) {return false}
    var d = Math.pow((o.pos.x - this.x), 2) + Math.pow((o.pos.z - this.y), 2);
    return d <= this.rsqrd;
}

circle.prototype.intersects = function(range){

    var xDist = Math.abs(range.x - this.x);
    var yDist = Math.abs(range.y - this.y);

    //rad of the circle
    var r = this.r;

    var w = range.w;
    var h = range.h;

    var edges = Math.pow((xDist - w), 2) + Math.pow((yDist - h), 2);

    // no intersect
    if(xDist > (r + w) || yDist > (r + h)){
        return false;
    }

    //intersects within the circle
    if(xDist <= w || yDist <= h){
        return true;
    }

    return edges <= this.rsqrd;
}

circle.prototype.name = "circle";

function quad_tree(boundary, capacity){
    
    //TODO : parametre checks
    if(capacity < 1){
        console.error("capacity must be greater then 0");
        return undefined;
    }

    this.boundary = boundary;
    this.capacity = capacity;
    this.objects = [];
    this.divided = false;

    this.visule = this.visulize();

    this.box_bound = new THREE.Box3(
        new THREE.Vector3(this.boundary.x - this.boundary.w, 0.1, this.boundary.y - this.boundary.h),
        new THREE.Vector3(this.boundary.x + this.boundary.w, 0.1, this.boundary.y + this.boundary.h))

}

quad_tree.prototype.visulize = function(){

}

quad_tree.prototype.subdivide = function(){
    var x = this.boundary.x;
    var y = this.boundary.y;
    var w = this.boundary.w / 2;
    var h = this.boundary.h / 2;

    var ne = new rectangle(x + w, y - h, w, h);
    this.northeast = new quad_tree(ne, this.capacity);

    var nw = new rectangle(x - w, y - h, w, h);
    this.northwest = new quad_tree(nw, this.capacity);

    var se = new rectangle(x + w, y + h, w, h);
    this.southeast = new quad_tree(se, this.capacity);

    var sw = new rectangle(x - w, y + h, w, h);
    this.southwest = new quad_tree(sw, this.capacity);
    
    this.divided = true;
}

function qt_point(pos, i, obj = null){
    this.id = i;
    this.pos = pos;
    this.object = obj;
}

quad_tree.prototype.insert = function(o){
    if(!this.boundary.contains(o)){
        return false;
    }

    if(this.objects.length < this.capacity){
        this.objects.push(o);
        return true;
    }

    if(!this.divided){
        this.subdivide();
    }

    return (
        this.northeast.insert(o) || 
        this.northwest.insert(o) || 
        this.southeast.insert(o) ||
        this.southwest.insert(o));
}

quad_tree.prototype.query = function(range, found, raycaster){
    if(found == undefined){
        found = [];
    }

    if(range.name == "circle" || range.name == "rectangle"){
        if(!range.intersects(this.boundary)){
            return found;
        }

        for(var i = 0; i < this.objects.length; i++){
            if(range.contains(this.objects[i])){
                var range_vector = new THREE.Vector3(range.x, 0, range.y);
                var d = range_vector.distanceToSquared(this.objects[i].transform.position);
                found.push({o: this.objects[i], d: d});
            }
        }
    } else {
        // bounding "box" of the quad-tree section
       
        //this.objects.sort(function(a,b){
        //    var ad = camera.position.distanceToSquared(a.pos);
        //    var bd = camera.position.distanceToSquared(b.pos);
        //    return ad-bd
        //});

        // if quad section is within the frustrum, check the points inside
        if(range.intersectsBox(this.box_bound)){
            for(var i = 0; i < this.objects.length; i++){
                Scene[this.objects[i].id].get_component("decomposer").render();
                if(range.containsPoint(Scene[this.objects[i].id].transform.get_transformed_position())){
                    Scene[this.objects[i].id].get_component("decomposer").render();
                }
            }
        }
    }

    if(this.divided){
        this.northeast.query(range, found, raycaster);
        this.northwest.query(range, found, raycaster);
        this.southeast.query(range, found, raycaster);
        this.southwest.query(range, found, raycaster);
    }

    return found;
}

function object_exists(id, array) {
    return array.some(function(el) {
      return el.id === id;
    }); 
}

quad_tree.prototype.closest = function(o, count, maxDistance){

    //TODO : Add parametre Checks
    if(this.objects.length == 0){
        return [];
    }

    if(this.objects.length < count){
        return this.objects;
    }

    //Distance of query 
    if(typeof maxDistance === "undefined"){
        //a circle that contains the entire quadtree
        const outerreach = Math.sqrt(
            Math.pow(this.boundary.w, 2) + Math.pow(this.boundary.h, 2)
        );

        //distance of the query point from centre
        const pointdistance = Math.sqrt(
            Math.pow(o.transform.get_transformed_position().x, 2) + 
            Math.pow(o.transform.get_transformed_position().z, 2));

        //one quadtreee size away from the query point
        maxDistance = outerreach + pointdistance;
    }

    //Binary search with circle queries

    var inner = 0;
    var outer = maxDistance;
    var limit = 8; //limit to avoid infinite loops caused by ties
    var objects;

    while(limit > 0){
        const radius = (inner + outer) / 2;
        var p = object.transform.get_transformed_position();
        const range = new circle(p.x, p.z, radius);
        objects = this.query(range);

        if(objects.length === count){
            return objects;
        } else if (objects.length < count){
            inner = radius;
        } else {
            outer = radius;
            limit --;
        }
    }

    // Sort by sqred distance
    objects.sort(
        (a,b) => {
            var p = object.transform.get_transformed_position(); 
            const aDist = Math.pow(p.x - a.x, 2) + Math.pow(p.z - a.z, 2);
            const bDist = Math.pow(p.x - b.x, 2) + Math.pow(p.z - b.z, 2);
            return aDist - bDist;
        }
    );

    //slice to return correct count (breaks ties)
    return objects.slice(0, count);
}

quad_tree.prototype.forEach = function(fn){
    this.objects.forEach(fn);

    if(this.divided){
        this.northeast.forEach(fn);
        this.northwest.forEach(fn);
        this.southeast.forEach(fn);
        this.southwest.forEach(fn);
    }
}

quad_tree.prototype.merge = function(other, capacity){
    var left = Math.min(this.boundary.left, other.boundary.left);
    var right = math.max(this.boundary.right, other.boundary.right);
    var top = math.min(this.boundary.top, other.boundary.top);
    var bottom = math.max(this.boundary.bottom, other.boundary.bottom);
    var height = bottom - top;
    var width = right - left;
    var midx = left + width / 2;
    var midy = top + height / 2;
    var boundary = new rectangle(midx, midy, width, height);
    var result = new quad_tree(boundary, capacity);
    this.forEach(object => result.insert(object));
    other.forEach(object => result.insert(object));

    return result;
}

quad_tree.prototype.length = function(){
    var count = this.objects.length;

    if(this.divided){
        count += this.northwest.length;
        count += this.northeast.length;
        count += this.southwest.length;
        count += this.southeast.length;
    }

    return count;
}

quad_tree.prototype.name = "quad_tree";

