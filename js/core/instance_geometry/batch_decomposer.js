function batch_decomposer(...decomposers){
    this.decomposers = [];
    this.head = false;
    if(decomposers != undefined){
        this.decomposers = decomposers;
    } 
}

batch_decomposer.prototype.set_head = function(b){
    this.head = b;
}

batch_decomposer.prototype.get = function(i){
    return this.decomposers[i]
}

batch_decomposer.prototype.push = function(d){
    this.decomposers.push(d);
}

batch_decomposer.prototype.update = function(){
}

batch_decomposer.prototype.render = function(d){
    // TODO : fixed undefined issue :|
    if(d != undefined) {
        if(d < 100 ) {
            this.render_all(d)
        } else {
            if (this.head) {
                this.decomposers[0].render(d)
            } else {
                this.render_all(d);
            }
        }
    }
}

batch_decomposer.prototype.render_all = function(d){
    for(var i = 0; i < this.decomposers.length; i++){
        if(this.decomposers[i].name == "decomposer"){
            this.decomposers[i].render(0)
        } else {
            this.decomposers[i].render(d)
        }
    }
}

batch_decomposer.prototype.derender = function(){
    for(var i = 0; i < this.decomposers.length; i++){
        this.decomposers[i].derender()
    }
}

batch_decomposer.prototype.set_parent = function(p){
    this.parent = p;

    TestQuadTree.insert(new qt_point(
        this.parent.transform.get_transformed_position(), 
        this.parent.id
    ))
}

batch_decomposer.prototype.name = "batch_decomposer"