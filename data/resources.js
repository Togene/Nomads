var landUniform =
{
    indexMatrix16x16: { type: "fv1", value: DitherPattern4x4 },
    palette: { type: "v3v", value: GrayScalePallete },
    paletteSize: { type: "i", value: 8 },
    texture: { type: "t", value: null },
    extra: { type: "t", value: null },
    time: { type: "f", value: 1.0 },
    lightpos: { type: 'v3', value: new THREE.Vector3(0, 30, 20) },
    noTexture: { type: "i", value: 0 },
    customColorSwitch: { type: "i", value: 1 },
    customColor: { type: "i", value: new THREE.Vector4(.48, .89, .90, 1) }
};

const MapFileurl =[
    'img/sprite_sheets/critters.png',
    'img/sprite_sheets/trees.png',
    'img/sprite_sheets/sky.png',
    'img/sprite_sheets/structures.png',
    'img/sprite_sheets/lithies.png',
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

// { name:"Water_Tile",type: 'island_textures', color_file: 'img/World/water_tile.png', height_file: 'img/World/water_level_color.png', detail_file: 'img/World/Crab_Island_detail.png'},

//{ name:"Cloud_Shader",type: 'shader', vert: 'js/Shaders/Cloud/Cloud.vs.glsl', frag: 'js/Shaders/Cloud/Cloud.fs.glsl', extra: {wf:false, trans:true, anim:false} },
//{ name:"Sky_Shader",type: 'shader', vert: 'js/Shaders/Sky/Sky.vs.glsl', frag: 'js/Shaders/Sky/Sky.fs.glsl', extra: {wf:false, trans:false, anim:false} },
//{ name:"Land_Shader",type: 'shader', vert: 'js/Shaders/Land/Land.vs.glsl', frag: 'js/Shaders/Land/Land.fs.glsl', extra: {wf:false, trans:true, anim:false}  },
//{ name:"Water_Shader",type: 'shader', vert: 'js/Shaders/Water/Water.vs.glsl', frag: 'js/Shaders/Water/Water.fs.glsl', extra:  {wf:false, trans:true, anim:true}  },

const raw_resources = [
    new raw_resource(
        "instance_shader", 
        "s", 
        new shader_resource(
            'js/shaders/instance/instance.vs.glsl',
            'js/shaders/instance/instance.fs.glsl',
            {wf:false, trans:false, anim:false} 
        )
    ),
    new raw_resource(
        "Crab_Isle",
        't', 
        new tile_resource(
            'img/tile/Crab_Island_color.png', 
            'img/tile/Crab_Island.png', 
            'img/tile/Crab_Island_detail.png',
        )),
];