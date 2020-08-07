function instance_attributes(array, index){
    if(array != undefined){
        this.populate(array, index)
    }
}

function state(){
    this.active = false
}

instance_attributes.prototype.populate = function(array, index){

    var states = []
    for(var i = 0; i < index; i++){
        states.push(false)
    }
    this.states =  new THREE.InstancedBufferAttribute(new Float32Array(states), 1);

    //this.translation = array[0]; // ✓
    this.orientation = array[0]; // ✓

    // color
    this.col = array[1]; // ✓

    this.uvoffset = array[2]; // ✓
    this.tile_size = array[3]; // ✓
    this.scale = array[4]; // ✓

    // animations
    this.animation_start = array[5]; // ✓
    this.animation_end = array[6];  // ✓
    this.animation_time = array[7]; // ✓
    
    this.type = array[8]; // ✓
    this.fog = array[9]; // ✓
    
    //transform
    this.m0 = array[10]; // ✓
    this.m1 = array[11]; // ✓
    this.m2 = array[12]; // ✓
    this.m3 = array[13]; // ✓

    this.index = 0;
    this.max = index;
}


instance_attributes.prototype.set = function(decomposer){
    var index = 0;
    
    // grab the first empty slot in the buffer
    while (this.states.getX(index) != 0 && index < this.max){ index++ }
    
    this.states.setX(index, true)

    var uvs = decomposer.ssIndex[randomRangeRound(0, decomposer.ssIndex.length - 1)];
    this.set_uvoffset(index, uvs);

    this.set_tile_size(index, decomposer.tile_size);

    //var vector = new THREE.Vector4(
    //    decomposer.position.x, 
    //    decomposer.position.y, 
    //    decomposer.position.z, 0).normalize();
    //
    //
    //var translation = new THREE.Vector3(
    //    decomposer.position.x + vector.x, 
    //    decomposer.position.y + vector.y, 
    //    decomposer.position.z + vector.z
    //);
    //
    //this.set_translation(index, translation);
    this.set_orientation(index, decomposer.orient);
    this.set_scale(index, decomposer.scale);
    this.set_type(index, decomposer.type);
    this.set_fog(index, decomposer.fog);

    var col = decomposer.colors[randomRangeRound(0, decomposer.colors.length - 1)];
    var col_vector = new THREE.Vector4(col.r, col.g, col.b, 1.0);

    this.set_color(index, col_vector)

    this.set_transform(index, decomposer.matrix)

    decomposer.buffer_idx = index;
}

instance_attributes.prototype.unset = function(index){
    //console.log("attributes being reset?", index)
    this.set_uvoffset(index, new THREE.Vector2(0,0));
    this.set_tile_size(index, new THREE.Vector2(0,0));

    this.set_orientation(index, new THREE.Vector4(0,0,0,0));
    this.set_scale(index, new THREE.Vector3(1,1,1));
    this.set_type(index, 0);
    this.set_fog(index, 0);
    var col_vector = new THREE.Vector3(0, 0, 0);
    this.set_color(index, col_vector)

    //this.set_animation(index, )
    this.set_transform(index, new THREE.Matrix4())
    this.states.setX(index, false)
}

instance_attributes.prototype.set_uvoffset = function(index, uv){
    this.uvoffset.setXY(index, uv.x, uv.y);
    this.uvoffset.needsUpdate = true;
}

instance_attributes.prototype.set_tile_size = function(index, ts){
    this.tile_size.setXY(index, ts.x, ts.y);
    this.tile_size.needsUpdate = true;
}

instance_attributes.prototype.set_translation = function(index, t){
    this.translation.setXYZ(index, t.x, t.y, t.z);
    this.translation.needsUpdate = true;
}

instance_attributes.prototype.set_orientation = function(index, o){
    this.orientation.setXYZW(index, o.x, o.y, o.z, o.w);
    this.orientation.needsUpdate = true;
}

instance_attributes.prototype.set_scale = function(index, s){
    this.scale.setXYZ(index, s.x, s.y, s.z);
    this.scale.needsUpdate = true;
}

instance_attributes.prototype.set_type = function(index, type){
    this.type.setX(index, type);
    this.type.needsUpdate = true;
}

instance_attributes.prototype.set_fog = function(index, fog){
    this.fog.setX(index, fog);
    this.fog.needsUpdate = true;
}

instance_attributes.prototype.set_color = function(index, col){
    this.col.setXYZW(index, col.x, col.y, col.z, col.w);
    this.col.needsUpdate = true;
}

instance_attributes.prototype.set_alpha = function(index, alpha){
    this.col.setW(index, alpha);
    this.col.needsUpdate = true;
}

instance_attributes.prototype.set_type = function(index, type){
    this.type.setX(index, type);
    this.type.needsUpdate = true;
}

instance_attributes.prototype.set_animation = function(index, s, e, t) {
    this.animation_start.setX  (index, s);
    this.animation_end.setX  (index, e);
    this.animation_time.setX  (index, t);

    this.animation_start.needsUpdate = true;
    this.animation_end.needsUpdate = true;
    this.animation_time.needsUpdate = true;
}

instance_attributes.prototype.set_transform = function(index, matrix){
    this.m0.setXYZW(
        index,  
        matrix.elements[0],
        matrix.elements[1],
        matrix.elements[2],
        matrix.elements[3]
    );
    
    this.m1.setXYZW(
        index,  
        matrix.elements[4],
        matrix.elements[5],
        matrix.elements[6],
        matrix.elements[7]
    );

    this.m2.setXYZW(
        index,  
        matrix.elements[8],
        matrix.elements[9],
        matrix.elements[10],
        matrix.elements[11]
    );
    
    this.m3.setXYZW(
        index,  
        matrix.elements[12],
        matrix.elements[13],
        matrix.elements[14],
        matrix.elements[15]
    );

    this.m0.needsUpdate = true;
    this.m1.needsUpdate = true;
    this.m2.needsUpdate = true;
    this.m3.needsUpdate = true;
}

instance_attributes.prototype.add = function(index){
}

instance_attributes.prototype.name = "instance_attributes"