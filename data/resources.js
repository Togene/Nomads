
const MapFileurl =[
    'img/sprite_sheets/critters.png',
    'img/sprite_sheets/trees.png',
    'img/sprite_sheets/sky.png',
];

function raw_resource(n, t, d){
  this.name = n;
  this.type = t;
  this.data = d;  
};

function shader_resource(v, f, e){
    this.vert = v;
    this.frag = f;
    this.extra = e;
};

const raw_resources = [
    new raw_resource(
        "instance_shader", 
        "s", 
    new shader_resource(
        'js/shaders/instance/instance.vs.glsl',
        'js/shaders/instance/instance.fs.glsl',
        {wf:false, trans:false, anim:false} 
    )),
];