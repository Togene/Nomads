const pixel = 0.03125;
const sprite_size = pixel * 32; // would be just 1 :| 
const EPSILON = 1e-8;

function dag_to_rad(d){return d * (Math.PI/180);}


//adds small margin to floating point numbers to account for floating point errors
function bais_greater_than(a, b){
    const k_bias_relative = 0.95;
    const k_bais_absolute = 0.91;

    // >= instad of > for NAN comparison safty
    return a >= b * k_bias_relative + a * k_bais_absolute;
}

//map to Sprite Shader
function MapToSS(x, y) {
    return new THREE.Vector2((1 / 8) * x, (1 / 8) * y);
}

function distanceXY(x0, y0, x1, y1) {
    this.dx = x1 - x0;
    this.dy = y1 - y0;

    return Math.sqrt(dx * dx + dy * dy);
}

function Clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
};


function circlePointCollision(x, y, vec, rad) {
    return distanceXY(x, y, vec.x, vec.y) < rad;
}

function swap(l, r){
    var tmp = l;
    l = r;
    r = tmp;
}
//prng
//credit : https://gist.github.com/blixt/f17b47c62508be59987b

function p_random(seed){
    this._seed = seed % 2147483647;
    if (this._seed <= 0) this._seed += 2147483646;
};

//returns prng between 1 and 2^32 - 2
p_random.prototype.next = function(){
    return this._seed = (this._seed * 16807 % 2147483647);
};

p_random.prototype.next_range = function(min, max){
    return this._seed = (this._seed * 16807 % 2147483647) * (max - min) + min;
};


p_random.prototype.nextFloat = function(){
    return (this.next() - 1) / 2147483646;
};

function random_range(min, max) {
    return min + Math.random() * (max - min);
};

function randomRangeRound(min, max) {
    return Math.round(random_range(min, max));
};

function frac(f) {
    return f % 1;
};

function normalize(min, max, value) {
    return (value - min) / (max - min);
};

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
};

function pointInRect(x, y, p1, p2) {
    //x range check
    //y range check
    //if both are true the point is inside the range

    return inRange(x, p1.x, p2.x) &&
        inRange(y, p1.y, p2.y);
};

function inRange(value, min, max) {
    //checks the ranges from x1 to x2 , returning true if the point is within range
    //Mathf.min and mathf.Max are used in the case of negetive values

    //Mathf.min is used when value is smallest value
    //instead of just checking value with min
    //and vice versa
    //if max is negetive it will be the smallest value istead
    return value >= Math.min(min, max) && value <= Math.max(min, max);
};

function GetMagnitude(vector) {
    return Math.sqrt((vector.x * vector.x) +
        (vector.y * vector.y) +
        (vector.z * vector.z));
}

function GetVectorNormalize(vector) {
    var mag = GetMagnitude(vector);

    return new THREE.Vector3(vector.x / mag, vector.y / mag, vector.z / mag);
}

function traverse_list(l){
    if(l.length > 0){
        for(var i = 0; i < l.length; i++){console.log(l[i].name);}
    } else {
        console.log("");
    }
}

/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 * source : https://gist.github.com/gre/1650294
 */
EasingFunctions = {
    // no easing, no acceleration
    linear: function (t) { return t },
    // accelerating from zero velocity
    easeInQuad: function (t) { return t * t },
    // decelerating to zero velocity
    easeOutQuad: function (t) { return t * (2 - t) },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
    // accelerating from zero velocity 
    easeInCubic: function (t) { return t * t * t },
    // decelerating to zero velocity 
    easeOutCubic: function (t) { return (--t) * t * t + 1 },
    // acceleration until halfway, then deceleration 
    easeInOutCubic: function (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 },
    // accelerating from zero velocity 
    easeInQuart: function (t) { return t * t * t * t },
    // decelerating to zero velocity 
    easeOutQuart: function (t) { return 1 - (--t) * t * t * t },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t },
    // accelerating from zero velocity
    easeInQuint: function (t) { return t * t * t * t * t },
    // decelerating to zero velocity
    easeOutQuint: function (t) { return 1 + (--t) * t * t * t * t },
    // acceleration until halfway, then deceleration 
    easeInOutQuint: function (t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t }
}


//Javascript related utils
