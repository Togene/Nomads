
function pass_transforms(
    p = new THREE.Vector3(), 
    o = new THREE.Vector4(), 
    s = new THREE.Vector3(1, 1, 1))
    {
        this.position = p;
        this.orient = o;
        this.scale = s;
}

function sprite(meta, pass_transform){
    return new decomposer(meta, SPRITE, pass_transform)
}

function solid(meta, renderer, pass_transform){
    return new decomposer(meta, SOLID, pass_transform)
}

function particle(meta, renderer, pass_transform){
    return new decomposer(meta, PARTICLE, pass_transform)
}

function decomposer(meta, type, pass_transform){
    if(meta == undefined){ 
        throw new Error("Meta Data is required for decomposer!");
    }
    if(meta.map_key == undefined){ 
        throw new Error("Map Key not defined!");
    }
    if(renderers.get(meta.map_key) == undefined){ 
        throw new Error("Renderer is required for decomposer!");
    }

    this.tile_size = new THREE.Vector3(1,1);

    if(meta.tile_size != null){
        this.tile_size = new THREE.Vector2(meta.tile_size.x, meta.tile_size.y);
    }

    var renderer = renderers.get(meta.map_key);

    this.ssIndex = array_map_to_ss(meta.mapping);
    this.animationFrames = meta.frames;
    this.colors = array_hex_to_three_color(meta.colors);
    this.type = type || 0;
    this.attributes_refrence = renderer.attributes;

    this.position;
    this.scale;
    this.orient;

    if(pass_transform == null){
        this.position = new THREE.Vector3(
            meta.transform.position.x, meta.transform.position.y, meta.transform.position.z);
        this.scale = new THREE.Vector3(
            meta.transform.scale.x, meta.transform.scale.y, meta.transform.scale.z);
        this.orient = new THREE.Vector4(
            meta.transform.orient.x, meta.transform.orient.y, 
            meta.transform.orient.z, meta.transform.orient.w);
    } else {
        this.position = pass_transform.position.clone();
        this.scale = pass_transform.scale.clone();
        this.orient = pass_transform.orient.clone();
    }
    
    this.parent = null; //for gameobject

    this.buffer_idx = renderer.buffer.index;
    this.buffer = renderer.buffer;
    this.animate = renderer.animate;
}

decomposer.prototype.update = function(){
    if(this.animate){
        if(this.transform != null && this.transform.hasChanged()){  
           //this.attribute_debug();
           this.matrix = this.transform.get_transformation().toMatrix4();
           //have to tell the buffer/instance_geometry to update aswell
           this.update_attributes();
           this.set_orientation(this.parent.transform.rotation);
        }
    }
}    

decomposer.prototype.update_buffer_animation = function(animation){
    this.buffer.append_animation(this.buffer_idx, animation);
}

decomposer.prototype.set_animation = function(s, e, t){
    if(this.attributes_refrence != null && this.attributes_refrence.length != 0){
        var start_attribute = this.attributes_refrence[7];
        var end_attribute = this.attributes_refrence[8];
        var time_attribute = this.attributes_refrence[9];
  
        start_attribute.setX  (this.buffer_idx, s);
        start_attribute.needsUpdate = true;

        end_attribute.setX  (this.buffer_idx, e);
        end_attribute.needsUpdate = true;

        time_attribute.setX  (this.buffer_idx, t);
        time_attribute.needsUpdate = true;
    } else {
        console.error("no attributes found!");
    }
}

decomposer.prototype.attribute_debug = function(){
    if(this.attributes_refrence != null && this.attributes_refrence.length != 0){
        var color_attribute = this.attributes_refrence[4];
        color_attribute.setXYZ(this.buffer_idx, 0,random_range(0, 1),0);
        color_attribute.needsUpdate = true;
    } else {
        console.error("no attributes found!");
    }
}

decomposer.prototype.set_color = function(hex){
    if(this.attributes_refrence != null && this.attributes_refrence.length != 0){
        var color_attribute = this.attributes_refrence[4];
        var col = new THREE.Color(hex);
        var col_vector = new THREE.Vector3(col.r, col.g, col.b);

        color_attribute.setXYZ(this.buffer_idx, col_vector.x, col_vector.y, col_vector.z);
        color_attribute.needsUpdate = true;
    } else {
        console.error("no attributes found!");
    }
}

decomposer.prototype.set_orientation = function(o){
    if(this.attributes_refrence != null && this.attributes_refrence.length != 0){
        var orientation_attribute = this.attributes_refrence[6];
        orientation_attribute.setXYZW(this.buffer_idx, o.x, o.y, o.z, o.w);
        
        orientation_attribute.needsUpdate = true;
    } else {
        console.error("no attributes found!");
    }
}

decomposer.prototype.update_attributes = function(){
    if(this.attributes_refrence != null && this.attributes_refrence.length != 0){
        var m0_attribute = this.attributes_refrence[0];
        var m1_attribute = this.attributes_refrence[1];
        var m2_attribute = this.attributes_refrence[2];
        var m3_attribute = this.attributes_refrence[3];
    
        //buffer is a temp data pass
        //data is stored in attributes that the GPU uses
        //here we access the attributes array's stored in "attributes"
        //and update the matrix elements in the arrays to let the GPU know 
        //something has changed 
        m0_attribute.setXYZW(
            this.buffer_idx,  
            this.matrix.elements[0],
            this.matrix.elements[1],
            this.matrix.elements[2],
            this.matrix.elements[3]
        );
        
        m1_attribute.setXYZW(
            this.buffer_idx,  
            this.matrix.elements[4],
            this.matrix.elements[5],
            this.matrix.elements[6],
            this.matrix.elements[7]
        );
    
        m2_attribute.setXYZW(
            this.buffer_idx,  
            this.matrix.elements[8],
            this.matrix.elements[9],
            this.matrix.elements[10],
            this.matrix.elements[11]
        );
        
        m3_attribute.setXYZW(
            this.buffer_idx,  
            this.matrix.elements[12],
            this.matrix.elements[13],
            this.matrix.elements[14],
            this.matrix.elements[15]
        );
        
        m0_attribute.needsUpdate = true;
        m1_attribute.needsUpdate = true;
        m2_attribute.needsUpdate = true;
        m3_attribute.needsUpdate = true;
    } else {
        console.error("no attributes found!");
    }
}

decomposer.prototype.set_parent = function(p){
    this.parent = p;
}

decomposer.prototype.set_transform = function(t){
    this.transform = t;
    this.matrix = t.get_transformation().toMatrix4();

    //append to the buffer after all fields are set
    this.buffer.append(this);
}

decomposer.prototype.set_usefog = function(b){
    this.usefog = b;
}

decomposer.prototype.toJSON = function(){
    return {
        name: this.name,
        ssIndex : this.ssIndex,
        animationFrames : this.animationFrames,
        colors : this.colors,
        centre_offset: this.centre_offset,
        
        //this.transform = trans;
        
        //this.matrix = this.transform.get_transformation().toMatrix4();
        type: this.type,
        fog: this.fog,
        buffer_idx: this.buffer_idx,

        //this.attributes_refrence = attributes;
        //this.parent = null; //for gameobject
    }
}

decomposer.prototype.name = "decomposer";
decomposer.prototype.requires = ["transform"];