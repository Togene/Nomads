
function decomposer(ss, frames, colors, offset, type, buffer){
    this.ssIndex = ss;
    this.animationFrames = frames;
    this.colors = colors;
    this.centre_offset = offset;
    this.type = type;
    this.attributes_refrence = [];

    this.parent = null; //for gameobject

    if(buffer == undefined){console.error("Missing buffer.");}

    this.buffer_idx = buffer.index;
    this.buffer = buffer;
}

decomposer.prototype.update = function(){
    if(this.transform != null && this.transform.hasChanged()){
       //this.attribute_debug();
       this.matrix = this.transform.get_transformation().toMatrix4();
       //have to tell the buffer/instance_geometry to update aswell
       this.update_attributes();
       this.set_orientation(this.parent.transform.rotation);
    }
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
    this.buffer.append (
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0), 
        new THREE.Vector3(1, 1, 1),
        this
    );
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