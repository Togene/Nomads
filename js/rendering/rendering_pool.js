function rendering_pool(pool_size){
    this.pool_size = pool_size;
    this.pool = [];
    this.index = 0;
    this.buffer = create_buffer();
    this.init();
}

rendering_pool.prototype.push = function(){

    this.index++;
}

rendering_pool.prototype.remove = function(){

    this.index--;
}

rendering_pool.prototype.iterate_over = function(){

}

rendering_pool.prototype.init = function(){

    var shader = get_data("instance_shader");
    var attributes = [];

    for(var i = 0; i < this.pool_size; i++){
        
        //var generic = new gameobject("generic");

        //generic.set
        //this.pool.push(generic)
        var generic_transform = new transform( 
            new THREE.Vector3(0,0,0),
            new THREE.Vector3(1,1,1),
            new quaternion(0,0,0,1),
        );

        var generic_decomposer = new decomposer(
            [ MapToSS(0, 0),],
            new THREE.Vector2(1, 1),
            [ new THREE.Color(0xffffff) ],
            new THREE.Vector3(0, 0, 0),
            generic_transform,
            0,
            attributes,
            this.buffer.index,
        );

        PopulateBuffer(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 0), 
            generic_transform.scale,
            this.buffer, 
            generic_decomposer
        );
    }

    CreateInstance(
        "Generic", 
        animated_sprites, 
        this.buffer, 
        attributes, 
        sprite_sheet_size, 
        shader, 
        4, 
        true, 
        true,
    );
}



