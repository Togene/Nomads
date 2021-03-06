
function pass_transforms(o = new THREE.Vector4()){
    this.orient = o;
}

//cyclinder sprite
function sprite(meta, pass_transform){
    return new decomposer(meta, SPRITE, pass_transform)
}

function solid(meta, pass_transform){
    return new decomposer(meta, SOLID, pass_transform)
}

//full sprite
function particle(meta, pass_transform){
    return new decomposer(meta, PARTICLE, pass_transform)
}

function decomposer(meta, type, pass_transform){
    if(meta == undefined){ 
        meta = get_meta().default
    }
    if(meta.map_key == undefined){ 
        throw new Error("Map Key not defined!");
    }
    if(renderers.get(meta.map_key) == undefined){ 
        throw new Error("Renderer is required for decomposer!");
    }

    this.skip_occlusion = false;

    if(meta.skip_occlusion != null){ 
        this.skip_occlusion = meta.skip_occlusion;
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

    this.orient;
    this.scale = new THREE.Vector3(1,1,1);
    
    if(pass_transform == null){
        this.orient = new THREE.Vector4(
            meta.transform.orient.x, meta.transform.orient.y, 
            meta.transform.orient.z, meta.transform.orient.w);
    } else {
        this.orient = pass_transform.orient.clone();
    }
    
    this.parent = null; //for gameobject

    this.buffer_idx = renderer.buffer.index;
    this.buffer = renderer.buffer;
    this.animate = renderer.animate;

    this.rendering = false;
}

decomposer.prototype.update = function(){
    //if(this.animate)
        //this.attribute_debug();
        if(this.transform != null && this.transform.hasChanged()){  
            
           this.matrix = this.transform.get_transformation().toMatrix4();
           //have to tell the buffer/instance_geometry to update aswell
           this.attributes_refrence.set_transform(this.buffer_idx, this.matrix)
           this.attributes_refrence.set_orientation(this.buffer_idx, new quaternion(0,0,0,1).to_three_q());
        }
    //}
}    

decomposer.prototype.update_buffer_animation = function(animation){
    //this.buffer.set_animation(this.buffer_idx, animation);
}

decomposer.prototype.set_animation = function(s, e, t){
    if(this.attributes_refrence != null){
        this.attributes_refrence.set_animation(this.buffer_idx, s, e, t);
    }
}

decomposer.prototype.attribute_debug = function(){
    if(this.attributes_refrence != null && this.attributes_refrence.length != 0){
        var color_attribute = this.attributes_refrence.col;
        color_attribute.setXYZ(this.buffer_idx, 0,random_range(0, 1),0);
        color_attribute.needsUpdate = true;
    } else {
        console.error("no attributes found!");
    }
}

decomposer.prototype.set_color = function(hex){
    if(this.attributes_refrence != null){
        this.attributes_refrence.set_color(this.buffer_idx, hex)
    }
}

decomposer.prototype.set_alpha = function(alpha){
    if(this.attributes_refrence != null){
        this.attributes_refrence.set_alpha(this.buffer_idx, alpha)
    }
}

decomposer.prototype.set_type = function(type){
    if(type < 0 || type > 3){
        console.error("type must be in range 0 - 3");
        return
    }
    if(this.attributes_refrence != null){
        this.attributes_refrence.set_type(this.buffer_idx, type)
    }
}

decomposer.prototype.set_parent = function(p){
    this.parent = p;
}

decomposer.prototype.set_transform = function(t){
    this.transform = t;

    // this is why we need to split up the instance shader :|
    this.scale = this.transform.scale;
    this.matrix = t.get_transformation().toMatrix4();

    // append to the buffer after all fields are set
    if(!this.skip_occlusion) {
        TestQuadTree.insert(new qt_point(
            this.parent.transform.get_transformed_position(), 
            this.parent.id
            ))
    } else {
        //this.attributes_refrence.set(this);
    }
}

decomposer.prototype.render = function(type){
    if(!this.rendering){
        if(type != undefined){
            this.set_type(type);
        }
        
        this.attributes_refrence.set(this)
        this.rendering = true;
    }
}

decomposer.prototype.derender = function(){
    if(this.rendering){
        this.attributes_refrence.unset(this.buffer_idx)
        this.rendering = false;
    }
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