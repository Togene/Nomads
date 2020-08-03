const renderer_text_info = [
    {
        name: "critters", 
        map:'img/sprite_sheets/critters.png', 
        animate:true, 
        is3D:false, 
        container: new THREE.Object3D()
    },
    {
        name: "trees", 
        map:'img/sprite_sheets/trees.png', 
        animate:false, 
        is3D:false, 
        container: new THREE.Object3D()},
    {
        name: "sky", 
        map:'img/sprite_sheets/sky.png', 
        animate:false, 
        is3D:false, 
        container: new THREE.Object3D()
    },
    {
        name: "structures", 
        map:'img/sprite_sheets/structures.png', 
        animate:false, 
        is3D:false,
        container: new THREE.Object3D()},
    {
        name: "lithies", 
        map:'img/sprite_sheets/lithies.png', 
        animate:true, 
        is3D:true, 
        container: new THREE.Object3D()},
    {
        name: "debug", 
        map:'img/sprite_sheets/debug.png', 
        animate:false, 
        is3D:false, 
        container: new THREE.Object3D()},
    {
        name: "multi_test", 
        map:'img/sprite_sheets/multi_test.png', 
        animate:true, 
        is3D:true, 
        container: new THREE.Object3D()
    },
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

function tile_resource(c, h, d){
    this.color = c;
    this.height = h;
    this.detail = d;
};

function map_resource(url){
    this.url = url;
};

const raw_resources = [
    new raw_resource(
        "instance_shader", 
        "s", 
        new shader_resource(
            'js/shaders/instance/instance.vs.glsl',
            'js/shaders/instance/instance.fs.glsl',
            {wf:false, trans:true, anim:false} 
        )),
    new raw_resource(
        "land_shader", 
        "s", 
        new shader_resource(
            'js/Shaders/land/land.vs.glsl',
            'js/Shaders/land/land.fs.glsl',
            {wf:false, trans:true, anim:false}  
        )),
    new raw_resource(
        "water_Shader", 
        "s", 
        new shader_resource(
            'js/Shaders/water/water.vs.glsl',
            'js/Shaders/water/water.fs.glsl',
            {wf:false, trans:true, anim:true}  
        )),
    new raw_resource(
        "crab_isle",
        't', 
        new tile_resource(
            'img/tile/Crab_Island/Crab_Island_color.png', 
            'img/tile/Crab_Island/Crab_Island_height.png', 
            'img/tile/Crab_Island/Crab_Island_detail.png',
        )),
    new raw_resource(
        "water_tile",
        't', 
        new tile_resource(
            'img/tile/water_tile.png', 
            'img/tile/water_level_color.png', 
            'img/tile/water_level_color.png',
        )),
    new raw_resource(
        "sea_floor",
        't', 
        new tile_resource(
            'img/tile/sea_floor_color.png', 
            'img/tile/sea_floor.png', 
            'img/tile/sea_floor_detail.png',
        )),
    new raw_resource(
        "critters", 'm', new map_resource('img/tile/sea_floor_color.png')),
    new raw_resource(
        "trees", 'm', new map_resource('img/sprite_sheets/trees.png')),
    new raw_resource(
        "sky", 'm', new map_resource('img/sprite_sheets/sky.png')),
    new raw_resource(
        "structures", 'm', new map_resource('img/sprite_sheets/structures.png')),
    new raw_resource(
        "lithies", 'm', new map_resource('img/sprite_sheets/lithies.png')),
    new raw_resource(
        "debug", 'm', new map_resource('img/sprite_sheets/debug.png')),
];