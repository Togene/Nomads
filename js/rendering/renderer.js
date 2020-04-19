
var pool_data;

function shader_init(){
        
    console.log("%cLoading Pool", 'color: #DAA45C');
    
        pool = new rendering_pool(5);
    
        save(pool.buffer, 'pool_data', 'json');
        while(load('pool_data', 'json', load_callback) != undefined);
        console.log(pool_data);

    console.log("%cPool Done", 'color: #DAA45C');
}

function load_callback(data){
    pool_data = data;
    console.log(JSON.parse(data).translation);
    return false;
}

function shader_update(delta){
    if (animated_sprites.children.length != 0) {
        for (var i = 0; i < animated_sprites.children.length; i++) {
            if (animated_sprites.children[i] != undefined) {

                if(animated_sprites.children[i].material != undefined){
                    animated_sprites.children[i].material.uniforms.time.value = game_time;
                }

                if(animated_sprites.children[i].children != undefined){
                    for (var j = 0; j < animated_sprites.children[i].children.length; j++) {
                        
                        if(animated_sprites.children[i].children[j].material != undefined){
                            animated_sprites.children[i].children[j].material.uniforms.time.value = game_time;
                        }
                    }
                }
            }
        }
    }

    if (ANIM_WORLD_OBJECTS != null) {
        for (var i = 0; i < ANIM_WORLD_OBJECTS.children.length; i++) {
            if (ANIM_WORLD_OBJECTS.children[i] != undefined) {

                if(ANIM_WORLD_OBJECTS.children[i].material != undefined){
                    ANIM_WORLD_OBJECTS.children[i].material.uniforms.time.value = game_time;
                }

                if(ANIM_WORLD_OBJECTS.children[i].children != undefined){
                    for (var j = 0; j < ANIM_WORLD_OBJECTS.children[i].children.length; j++) {
                        
                        if(ANIM_WORLD_OBJECTS.children[i].children[j].material != undefined){
                            ANIM_WORLD_OBJECTS.children[i].children[j].material.uniforms.time.value = game_time;
                        }
                    }
                }
            }
        }
    }
}
