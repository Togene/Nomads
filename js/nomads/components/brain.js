function brain(){
    
    this.parent = null;
}

brain.prototype.update = function(delta){

}

aabb.prototype.set_parent = function(p){
    this.parent = p;
};

brain.prototype.name = "brain";