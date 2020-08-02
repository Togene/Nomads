
var pool_data;

function shader_init(){
        
    //console.log("%cLoading Pool", 'color: #DAA45C');
    
    //pool = new rendering_pool(5);
    
    //save(pool.buffer, 'pool_data', 'json');

    //console.log("%cPool Done", 'color: #DAA45C');
}

function shader_update(delta){
    for(var i = 0; i < renderers.length; i++){
        // object_shader_update(renderers[i].mesh)
    }

    //object_shader_update(ANIMATED_SPRITES);
    object_shader_update(WORLD_ANIM_OBJECTS);
}

function object_shader_update(o){
    if (o != null) {
        o.forEach(function(element){
            element.material.uniforms.time.value = game_time;
        });
    }
}

function object_child_update(o){
    for (var i = 0; i < o.children.length; i++) {
        if (o.children[i] != undefined) {

            if(o.children[i].material != undefined){
                o.children[i].material.uniforms.time.value = game_time;
            }

            if(o.children[i].children != undefined){
                for (var j = 0; j < o.children[i].children.length; j++) {
                    
                    if(o.children[i].children[j].material != undefined){
                        o.children[i].children[j].material.uniforms.time.value = game_time;
                    }
                }
            }
        }
    }
}
