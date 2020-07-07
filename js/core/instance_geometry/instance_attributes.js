function instance_attributes(array, index){
    if(array != undefined){
        this.populate(array, index)
    }
}

instance_attributes.prototype.populate = function(array, index){
    this.translation = array[0];
    this.orientation = array[1];
    this.col = array[2];
    this.uvoffset = array[3];
    this.tile_size = array[4];
    this.scale = array[5];
    this.animation_start = array[6];
    this.animation_end = array[7];
    this.animation_time = array[8];
    this.type = array[9];
    this.fog = array[10];
    this.m0 = array[11];
    this.m1 = array[12];
    this.m2 = array[13];
    this.m3 = array[14];
    this.index = index;
    console.log(this.index)
}

instance_attributes.prototype.remove_at = function(index){
}

instance_attributes.prototype.add = function(index){
}

instance_attributes.prototype.name = "instance_attributes"