function world_init() {
    world_generate()
}

function world_update(delta){
}

function world_generate() {
    var crab_isle = new zone("crab_isle", get_data("land_shader"), 0, true)
    var water_isle = new zone("water_tile", get_data("water_Shader"), 6, false)
}

// height, color, detial_map, detial_test
function tile_create(maps) {
}


function world_occlusion(){
}