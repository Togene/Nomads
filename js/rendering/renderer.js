
var pool_data;

function shader_init(){
        
    console.log("%cLoading Pool", 'color: #DAA45C');
    
    //pool = new rendering_pool(5);
    
    //save(pool.buffer, 'pool_data', 'json');

    console.log("%cPool Done", 'color: #DAA45C');
}

function shader_update(delta){
    if (ANIMATED_SPRITES.children.length != 0) {
        for (var i = 0; i < ANIMATED_SPRITES.children.length; i++) {
            if (ANIMATED_SPRITES.children[i] != undefined) {

                if(ANIMATED_SPRITES.children[i].material != undefined){
                    ANIMATED_SPRITES.children[i].material.uniforms.time.value = game_time;
                }

                if(ANIMATED_SPRITES.children[i].children != undefined){
                    for (var j = 0; j < ANIMATED_SPRITES.children[i].children.length; j++) {
                        
                        if(ANIMATED_SPRITES.children[i].children[j].material != undefined){
                            ANIMATED_SPRITES.children[i].children[j].material.uniforms.time.value = game_time;
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
