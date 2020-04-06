//used to create animation sequeunces
//example : death animation + dead_still
//good for non looping animations with an end
function animation_sequence(name, animations, speed = 1, loop = true){
    this.name = name;
    this.animations = animations;
    this.current_animation = animations[0];

    this.end = false;
    this.animation_length = 0;
    this.loop = loop;

    for(var i = 0; i < animations.length; i++){
        this.animation_length += animations[i].length;
    }

    this.current_index = 0;
    this.game_time_stamp = game_time;
    this.current_frame = 0;
    this.frame_offset = randomRangeRound(0, this.current_animation.length);
    this.animation_speed = speed;
    //this.current_animation.current_frame = ;
}

animation_sequence.prototype.time_stamp = function(time){
    this.game_time_stamp = time;
    this.current_index = 0;
    this.current_frame = 0;
}

animation_sequence.prototype.update = function(delta){
  
    this.current_frame += (delta + (this.frame_offset * delta)) * this.animation_speed;//(game_time - this.game_time_stamp);
    //console.log(this.current_frame);
    //console.log(this.current_frame);

    if(!this.end){
        if(this.current_index == this.animations.length-1){
            if(this.current_frame >= this.animations[this.current_index].length){
                if(!this.loop){
                    this.end = true;
                    this.current_frame = 0;
                } else {
                    this.reset_time();
                }
            }
        } else {
            if(this.current_frame >= this.animations[this.current_index].length){
                this.current_index ++;
                this.reset_time();
            } 
        }
    }

    this.current_animation = this.animations[this.current_index];
}

animation_sequence.prototype.reset_time = function(){
    this.game_time_stamp = game_time;
    this.current_frame = 0;
}

animation_sequence.prototype.reset_sequence = function(){
    this.current_frame = game_time;
    this.current_index = 0;
}

