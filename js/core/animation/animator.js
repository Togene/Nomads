function animator(animations){
    this.animations_sequences = animations;

    this.parent = null;
    
    this.current_sequence = this.animations_sequences[0];
    this.current_animation = this.animations_sequences[0].current_animation;
    this.curent_index = 0;
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

animator.prototype.get_current_index = function(){
    return this.curent_index;
}

animator.prototype.set_animation_sequence = function(num){
    if(num > this.animations_sequences.length) {
        console.error("exceeded animations length, max is: ", this.animations_sequences.length); 
        return; 
    } else {
        if(this.animations_sequences[num].name == this.current_sequence.name){
            console.error("already set to animation: ", this.current_sequence.name); 
            return;
        }
        this.curent_index = num;
        this.current_sequence = this.animations_sequences[num];
        this.current_sequence.time_stamp(game_time);
    }
}

animator.prototype.update = function(delta){
    this.current_sequence.update(delta);
    this.current_animation = this.current_sequence.current_animation;
    this.decomposer.set_animation(this.current_animation.start, this.current_animation.length, this.current_sequence.current_frame);
}

animator.prototype.set_parent = function(p){
    this.parent = p;
};

animator.prototype.set_requirements = function(d){
    if(d.name == "decomposer"){
        this.decomposer = d;
        this.decomposer.update_buffer_animation(this);
    }
}

animator.prototype.name = "animator";
animator.prototype.requires = ["decomposer"];