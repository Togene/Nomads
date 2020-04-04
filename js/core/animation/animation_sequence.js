//used to create animation sequeunces
//example : death animation + dead_still
//good for non looping animations with an end
function animation_sequence(name, animations, loop = true){
    this.name = name;
    this.animations = animations;
    this.current_animation = animations[0];
    this.current_frame = 0;

    this.end = false;
    this.animation_length = 0;
    this.loop = loop;

    for(var i = 0; i < animations.length; i++){
        this.animation_length += animations[i].length;
    }
}

animation_sequence.prototype.update = function(delta){
    this.current_animation = this.animations[0];

    if(this.current_frame >= animation_length){
        if(!this.loop){
            this.end = true;
        } else {
            this.reset_sequence();
        }

    }
}

animation_sequence.prototype.reset_sequence = function(){
    this.current_frame = 0;
}

