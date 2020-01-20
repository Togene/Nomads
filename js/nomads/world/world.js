const W_NUM_TILES = 5;
const W_TILE_SIZE = 255;
const TEXTURE_RESOLUTION = 256;
const TILE_GRID_SIZE = 16; //how many times is the tile chopped up into smaller bits
const WORLD_PHYSICAL = [];
var WORLD_OBJECT = new THREE.Object3D();
var SEED = 123;
const W_TILE_SCALE = 1.0;
var ANIM_WORLD_OBJECTS = new THREE.Object3D();
const WORLD_TILE_SCALE = 1.0;

var volmetric_cube;

const mapindex =
        [2, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0];

function world_init() {

    World_Generate();

    scene.add(ANIM_WORLD_OBJECTS);
    scene.add(WORLD_OBJECT);
}

function World_Generate() {
    var TreeBuffer = create_buffer();
    var EnviBuffer = create_buffer();
    var StructBuffer = create_buffer();
    var CreatureBuffer = create_buffer();
    //var grid_total_size = W_NUM_TILES * W_NUM_TILES;

    /*
    persistance = 2.9;//randomRange(0.65, 0.85);
    lacunarity = 0.21;//randomRange(1.9, 2.2);
    octaves = 5;//Math.round(randomRange(4, 6));
    noiseScale = 3;//randomRange(10, 200);
    */

    //var maps = MapGenerator(5, 1.9, 0.21, SEED, 1, new THREE.Vector2(0, 0), TEXTURE_RESOLUTION);
    
    var crab_isle_data = get_data("Crab_Isle");
    var water_tile_data = get_data("Water_Tile");

    var landShader = get_data("Land_Shader");
    var waterShader = get_data("Water_Shader");

    //var crab_isle = CreateTile(landShader, crab_isle_data.height, 
    //    crab_isle_data.color, crab_isle_data.detail, crab_isle_data.detail_test, TILE_GRID_SIZE, W_TILE_SCALE, {tree: TreeBuffer, envi: EnviBuffer, strct: StructBuffer, crt: CreatureBuffer}, true, 0.0);

    var water_tile = CreateTile(waterShader, water_tile_data.height, 
        water_tile_data.color, crab_isle_data.detail, crab_isle_data.detail_test,  1, TILE_GRID_SIZE * W_TILE_SCALE, {}, false, 15.0);
    
    var chunkSize = (W_TILE_SIZE * W_TILE_SCALE);
    var full_size = (chunkSize) * TILE_GRID_SIZE;
    var full_world_size = ((chunkSize) * TILE_GRID_SIZE * W_NUM_TILES);

    //console.log(water_tile);

    //WORLD_OBJECT.add(water_tile);

    for (var y = 0; y < W_NUM_TILES; y++) 
        for (var x = 0; x < W_NUM_TILES; x++){

            var world_pos_x = (x * full_size) + full_size / 2 - full_world_size / 2;
            var world_pos_y = (y * full_size) + full_size / 2 - full_world_size / 2;

            var index = mapindex[y * W_NUM_TILES + x];

            if (index == 1) {
               // var newisle = crab_isle.clone();

              //  newisle.position.set(world_pos_x, 0, world_pos_y);
              //  WORLD_OBJECT.add(newisle);

             //   var water = water_tile.clone();
             //   water.position.set(world_pos_x, 0, world_pos_y );
             //   WORLD_OBJECT.add(water);
                
            } else if (index == 0) {
                //var water = water_tile.clone();
               
              //  WORLD_OBJECT.add(water);
              //  ANIM_WORLD_OBJECTS.add(water);
            //    water.position.set(world_pos_x, 0, world_pos_y );
            }
        }
    
    //console.log(ANIM_WORLD_OBJECTS);



    //CreateCreatures("", "", "");
    //var crab_shader = get_data("Instance_Shader");
    //CreateInstance("Trees", WORLD_OBJECT, TreeBuffer, sprite_sheet_size, crab_shader, 0, false, true);
    //CreateInstance("Structures", WORLD_OBJECT, StructBuffer, sprite_sheet_size, crab_shader, 1, false, true);
    //CreateInstance("Creatures", WORLD_OBJECT, CreatureBuffer, sprite_sheet_size, crab_shader, 2, true, false);
}

function CreateTile(shader, height, color, detial_map, detial_test, gridSize, scale, buffers, physical, yoffset) {

    landMassChunk = new THREE.Object3D();
    
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
                height, detial_map, 1500, 1.0, detial, chunkSize / gridSize,
                x_loc,
                y_loc,
                chunkSize, gridSize, scale, x, y, buffers, yoffset);
            
            //console.log(chunkgeo);

            var chunk = new THREE.Mesh(chunkgeo, material);

            chunk.castShadow = true; //default is false
            chunk.receiveShadow = true; //default
            chunk.scale.set(1, 1, 1);
            scene.add(chunk);
            helper = new THREE.FaceNormalsHelper( chunk, 2, 0x00ff00, 12 );
            //WORLD_OBJECT.add(helper);    
                
            if(physical) {WORLD_PHYSICAL.push(chunk);}
        }     

    return landMassChunk;
}






