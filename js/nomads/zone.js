function zone(empty = true){
    if(!empty)this.tile = this.genere_tile();
    this.instances = []
}

zone.prototype.generate_tile(){
    
}

zone.prototype.bake_zone = function(){
    //generate map

    //create instances
}

zone.prototype.name = "zone";