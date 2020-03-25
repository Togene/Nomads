
//start is where the animation starts on the x
//end is basically the length/size of the animation
function animation(name, start, end){
    this.name = name;
    this.start = start; //x index start
    this.end = end; //x indesx end

    this.current_frame = start;
}

animation.prototype.update = function(delta){
    this.current_frame++;
}