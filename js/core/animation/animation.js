function animation(name, start, end){
    this.name = name;
    this.start = start;
    this.end = end;

    this.current_frame = start;
}

animation.prototype.update = function(delta){
    this.current_frame++;
}
