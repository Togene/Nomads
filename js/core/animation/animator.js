function animator(animations, url){
    this.animations = animations;
    
    //might need to be the texture sheet instead?
    this.url = url;

    this.parent = null;
    this.current_animation = animations[0];
}

animator.prototype.set_current_animation = function(name){
    for(var i = 0; i < this.animations.length; i++){
        if(this.animations[i].name == name){
            this.current_animation = this.animations[i];
            break;
        }
    }

    console.error("no animation of that name exists");
}

animator.prototype.update = function(delta){
    this.current_animation.update(delta);
}

animator.prototype.set_parent = function(p){
    this.parent = p;
};

animator.prototype.name = "animator";
