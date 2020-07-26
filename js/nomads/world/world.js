function world_init() {
    World_Generate();
}

function world_update(delta){
    world_occlusion();
    world_index();
}

function World_Generate() {
    var sea_floor_data = get_data("sea_floor");
    var crab_isle_data = get_data("crab_isle");
    var water_tile_data = get_data("water_tile");

    var landShader = get_data("Land_Shader");
    var waterShader = get_data("Water_Shader");

    var crab_isle = CreateTile(landShader, crab_isle_data.height, 
        crab_isle_data.color, crab_isle_data.detail, crab_isle_data.detail_test,
         TILE_GRID_SIZE, W_TILE_SCALE, true);

    var sea_floor = CreateTile(landShader, sea_floor_data.height, 
        sea_floor_data.color, sea_floor_data.detail, sea_floor_data.detail_test,
        TILE_GRID_SIZE, W_TILE_SCALE, true);

    var water_tile = CreateTile(waterShader, water_tile_data.height, 
        water_tile_data.color, crab_isle_data.detail, crab_isle_data.detail_test,  
        1, TILE_GRID_SIZE * W_TILE_SCALE, false);
    
    var chunkSize = (W_TILE_SIZE * W_TILE_SCALE);
    var full_size = (chunkSize) * TILE_GRID_SIZE;
    var full_world_size = ((chunkSize) * TILE_GRID_SIZE * W_NUM_TILES);


    for (var y = 0; y < W_NUM_TILES; y++) 
        for (var x = 0; x < W_NUM_TILES; x++){
            var world_pos_x = (x * full_size) + full_size / 2 - full_world_size / 2;
            var world_pos_y = (y * full_size) + full_size / 2 - full_world_size / 2;

            var index = mapindex[y * W_NUM_TILES + x];

            if (index == 0) {
                var newisle = sea_floor.clone();
              
                newisle.position.set(world_pos_x, 0, world_pos_y);
                WORLD_OBJECT.add(newisle);
            } else if ( index  == 1){
                var newisle = crab_isle.clone();
              
                newisle.position.set(world_pos_x, 0, world_pos_y);
                WORLD_OBJECT.add(newisle);
            }

            var water = water_tile.clone();
            water.position.set(world_pos_x, 0, world_pos_y );
            ANIM_WORLD_OBJECTS.add(water);
        }

    scene.add(ANIM_WORLD_OBJECTS);
    scene.add(WORLD_OBJECT);
}

function CreateTile(shader, height, color, detial_map, detial_test, 
    gridSize, scale, physical) {

    var landMassChunk = new THREE.Object3D();
    
    var material = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'],
            THREE.UniformsLib['fog'],
            landUniform]),
        vertexShader: shader.vert,
        fragmentShader: shader.frag,
        lights: true,
        wireframe: shader.extra.wf,
        transparent: shader.extra.trans,
       // polygonOffset: true,
        //polygonOffsetFactor: 1, // positive value pushes polygon further away
        //polygonOffsetUnits: 1,
        fog: true
    });

    material.side = THREE.DoubleSide;
    var chunkSize = (W_TILE_SIZE * scale);
    var detial = ((chunkSize / gridSize) / scale) * 4;

    var half_chunk = (chunkSize) / 2;
    var full_size = (chunkSize) * gridSize;
    var world_mapping = half_chunk - (full_size - 1) / 2;

    detial_test.repeat.x = -1;
    detial_test.repeat.y = -1;

    detial_test.wrapS = THREE.RepeatWrapping;
    detial_test.wrapT = THREE.RepeatWrapping;

    color.wrapS = THREE.RepeatWrapping;
    color.wrapT = THREE.RepeatWrapping;

    material.uniforms.texture.value = color;
    material.uniforms.extra.value = detial_test;

    for (var y = 0; y < gridSize; y++)
        for (var x = 0; x < gridSize; x++) {

            var x_loc = ((x) * chunkSize) + world_mapping;
            var y_loc = ((y) * chunkSize) + world_mapping;

            var chunkgeo = GenerateTileMesh(
                height, detial_map, 150, 12.0, detial,
                x_loc,
                y_loc,
                chunkSize, gridSize, scale, x, y);
            
            chunkgeo.computeBoundingSphere();

            var chunk = new THREE.Mesh(chunkgeo, material);

            // wireframe
            if(wire_framing){
                var geo = new THREE.EdgesGeometry( chunk.geometry ); // or WireframeGeometry
                var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
                var wireframe = new THREE.LineSegments( geo, mat );
                chunk.add( wireframe );
            }
            
            if(physical) { WORLD_COLLISION_ARRAY.push(chunk) };

            chunk.castShadow = true; //default is false
            chunk.receiveShadow = true; //default
            chunk.scale.set(1, 1, 1);
            landMassChunk.add(chunk);
        }     

    return landMassChunk;
}

function world_index(){
    if(player != undefined){
        var x = player.transform.position.x || 0;
        var z = player.transform.position.z || 0;
    }
}

function world_occlusion(){


    if(ANIM_WORLD_OBJECTS != null){
        if(ANIM_WORLD_OBJECTS.children != null || ANIM_WORLD_OBJECTS.children.length != 0){
            for(var i = 0; i < ANIM_WORLD_OBJECTS.children.length; i++){
                if(ANIM_WORLD_OBJECTS.children[i].children != null || 
                    ANIM_WORLD_OBJECTS.children[i].children.length != 0){

                    for(var j = 0; j < ANIM_WORLD_OBJECTS.children[i].children.length; j++){
                                        
                        ANIM_WORLD_OBJECTS.children[i].children[j].geometry.computeBoundingSphere();

                        if(CAMERA_FRUSTUM.intersectsObject( ANIM_WORLD_OBJECTS.children[i].children[j] )){
                            ANIM_WORLD_OBJECTS.children[i].children[j].visible = true;
                        } else {
                            ANIM_WORLD_OBJECTS.children[i].children[j].visible = false;
                        }

                    }
                }
            }
        }
    }

    visible_chunks = [];

    if(WORLD_OBJECT != null){
        if(WORLD_OBJECT.children != null || WORLD_OBJECT.children.length != 0){
            for(var i = 0; i < WORLD_OBJECT.children.length; i++){

                if(WORLD_OBJECT.children[i].children != null || 
                    WORLD_OBJECT.children[i].children.length != 0){

                    for(var j = 0; j < WORLD_OBJECT.children[i].children.length; j++){
                                        
                        WORLD_OBJECT.children[i].children[j].geometry.computeBoundingSphere();

                        if(CAMERA_FRUSTUM.intersectsObject( WORLD_OBJECT.children[i].children[j] )){
                            visible_chunks.push(WORLD_OBJECT.children[i].children[j])
                            WORLD_OBJECT.children[i].children[j].visible = true;
                        } else {
                            WORLD_OBJECT.children[i].children[j].visible = false;
                        }

                    }
                }
            }
        }
    }

    console.log(visible_chunks.length)
}