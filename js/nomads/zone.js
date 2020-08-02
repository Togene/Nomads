function zone(key, s, lod, physical){

    var map = get_data(key);

    this.shader = s;

    map.color.wrapS = THREE.RepeatWrapping;
    map.color.wrapT = THREE.RepeatWrapping;

    this.generate_tile(
        {
            height: map.height, 
            color: map.color, 
            detail: map.detail, 
        }, s, lod, physical
    )
    this.collider = null;
    this.land = null;
}

zone.prototype.generate_tile = function(maps, shader, lod, physical){
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

    land_material.side = THREE.DoubleSide;
    land_material.uniforms.texture.value = maps.color

    var tile_geo = generete_tile(maps.height, maps.detail, lod);
    var tile_geo_collider = generete_tile(maps.height, null, 5);

    tile_geo_collider.computeBoundingSphere();
    tile_geo.computeBoundingBox();

    var tile = new THREE.Mesh( tile_geo, land_material );
    //var tile_collider = new THREE.Mesh( tile_geo_collider, new THREE.MeshBasicMaterial({wireframe:true}) );
    WORLD_ANIM_OBJECTS.push(tile);
    if(physical) WORLD_COLLISION_ARRAY.push(tile);
    if(physical) WORLD_OCCLUSION_ARRAY.push(tile_geo_collider);
   
    //scene.add(tile_collider)
    //var helper = new THREE.VertexNormalsHelper( tile, 2, 0x00ff00, 1)
    //scene.add( helper );
    scene.add( tile );
  
}

zone.prototype.bake_zone = function(){
}

zone.prototype.name = "zone";