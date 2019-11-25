
function decomposer(ss, frames, colors, offset, trans, type, attributes, index){
    this.ssIndex = ss;
    this.animationFrames = frames;
    this.colors = colors;
    this.centre_offset = offset;
    
    this.transform = trans;
    
    this.matrix = this.transform.get_transformation().toMatrix4();
    this.type = type;

    if(index == undefined){console.error("Missing Index.");}

    this.buffer_idx = index;
    this.attributes_refrence = attributes;

    this.parent = null; //for gameobject
}

decomposer.prototype.update = function(){
    if(this.transform.hasChanged()){
       //this.attribute_debug();
       this.matrix = this.transform.get_transformation().toMatrix4();
       //have to tell the buffer/instance_geometry to update aswell
       this.update_attributes();
    }
}    

decomposer.prototype.attribute_debug = function(){
    var color_attribute = this.attributes_refrence[4];

    color_attribute.setXYZ(this.buffer_idx, 0,randomRange(0, 1),0);
    color_attribute.needsUpdate = true;
}

decomposer.prototype.update_attributes = function(){
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
}

decomposer.prototype.set_parent = function(p){
    this.parent = p;
}