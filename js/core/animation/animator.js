function animator(animations, decomposer){
    this.animations = animations;
    this.decomposer = decomposer;

    this.parent = null;
    this.current_animation = animations[0];
}

animator.prototype.get_current_animation = function(name){
    for(var i = 0; i < this.animations.length; i++){
        if(this.animations[i].name == name){
            this.current_animation = this.animations[i];
            break;
        }
    }
    console.error("no animation of that name exists");
}

animator.prototype.set_animation = function(num){
    if(num > this.animations.length) {
        console.error("exceeded animations length, max is: ", this.animations.length); 
        return; 
    } else {
        this.current_animation = this.animations[num];
        this.decomposer.set_animation(this.animations[num].start, this.animations[num].end); //
    }
 
}

animator.prototype.update = function(delta){
    this.current_animation.update(delta);
}

animator.prototype.set_parent = function(p){
    this.parent = p;
};

animator.prototype.name = "animator";
