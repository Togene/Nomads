
function shader_init(){
    
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
}