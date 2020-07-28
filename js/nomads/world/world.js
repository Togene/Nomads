function world_init() {
    world_generate()
}

function world_update(delta){
}

function world_generate() {
    var crab_isle_data = get_data("crab_isle");;

    var crab_isle = tile_create(
        {
            height: crab_isle_data.height, 
            color: crab_isle_data.color, 
            detail: crab_isle_data.detail, 
        }
    )
}

// height, color, detial_map, detial_test
function tile_create(maps) {

    var land_uniform =
    {
        indexMatrix16x16: { type: "fv1", value: DitherPattern4x4 },
        palette: { type: "v3v", value: GrayScalePallete },
        paletteSize: { type: "i", value: 8 },
        texture: { type: "t", value: maps.color },
        extra: { type: "t", value: null },
        time: { type: "f", value: 1.0 },
        lightpos: { type: 'v3', value: new THREE.Vector3(0, 30, 20) },
        noTexture: { type: "i", value: 0 },
        customColorSwitch: { type: "i", value: 1 },
        customColor: { type: "i", value: new THREE.Vector4(.48, .89, .90, 1) }
    };

    var shader = get_data("land_shader")
 
    var land_material = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'],
            THREE.UniformsLib['fog'],
            land_uniform]),
        vertexShader: shader.vert,
        fragmentShader: shader.frag,
        lights: true,
        wireframe: shader.extra.wf,
        transparent: shader.extra.trans,
        fog: true
    });

    var tile_geo = generete_tile(maps.height, maps.detail, 256);
    //tile_geo.computeBoundingSphere();
    

    land_material.side = THREE.DoubleSide;
    land_material.uniforms.texture.value = maps.color

    var tile = new THREE.Mesh( tile_geo, land_material );
    
    WORLD_COLLISION_ARRAY.push(tile);
    var helper = new THREE.VertexNormalsHelper( tile, 2, 0x00ff00, 1 )
    scene.add( tile );
    scene.add( helper );
}



function world_occlusion(){
}