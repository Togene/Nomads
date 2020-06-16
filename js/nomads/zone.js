function zone(){
    this.static_buffer = [];
    this.dynamic_buffer = [];
    this.land = null;
}

zone.prototype.get_static = function(){
    return this.static_buffer;
}

zone.prototype.get_dynamic = function(){
    return this.dynamic_buffer;
}

zone.prototype.bake_zone = function(){
    
    //generate map

    //create instances
}