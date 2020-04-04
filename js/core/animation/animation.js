
//start is where the animation starts on the x
//end is basically the length/size of the animation
function animation(name, start, length){
    this.name = name;
    this.start = start; //x index start
    this.length = length; //length of the animation

    this.current_frame = start;
}

animation.prototype.update = function(delta){
    this.current_frame++;
}
