function animator(animations, decomposer){
   
    this.animations_sequences = animations;
    this.decomposer = decomposer;

    this.parent = null;
    this.current_animation = this.animations_sequences[0].current_animation;

    console.log(this.current_animation);
}

animator.prototype.get_current_animation = function(name){
    for(var i = 0; i < this.animations_sequences.length; i++){
        if(this.animations_sequences[i].name == name){
            this.current_animation = this.animations_sequences[i];
            break;
        }
    }
    console.error("no animation of that name exists");
}

animator.prototype.set_animation_sequence = function(num){
    if(num > this.animations_sequences.length) {
        console.error("exceeded animations length, max is: ", this.animations_sequences.length); 
        return; 
    } else {
        this.current_animation = this.animations_sequences[num].current_animation;
        
        console.log(this.current_animation);

        this.decomposer.set_animation(this.current_animation.start, this.current_animation.length);
    }
}

animator.prototype.update = function(delta){
    this.current_animation.update(delta);
}

animator.prototype.set_parent = function(p){
    this.parent = p;
};

animator.prototype.name = "animator";
