function instance_renderer(map_index, mesh, animate, is3D = false, shader) {
    this.buffer = new instance_buffer(true);
    this.attributes = new instance_attributes();
    this.mesh = mesh;
    this.map_index = map_index;
    
    this.shader = null;

    if(shader == undefined){
        //console.warn("shader not found, using defualt!")
        this.shader = get_data("instance_shader");
    } else {
        this.shader = shader;
    }

    
    this.animate = animate;
    this.is3D = is3D
}

instance_renderer.prototype.get_buffer = function(){
    return this.buffer;
}

instance_renderer.prototype.get_attributes = function(){
    return this.attributes;
}

instance_renderer.prototype.buffer_append = function(o){
    if(o != undefined){
        if(o.get_component("decomposer") != null){
            this.buffer.append(o.get_component("decomposer"))
        }
    }
}

instance_renderer.prototype.name = "instance_renderer";

function instance_buffer(prefill = false){
    this.translation = [];
    this.orientations = [];
    this.vector =  new THREE.Vector4();
    this.scales = [];
    this.colors = [];
    this.uvoffsets = [];
    this.tile_size = [];
    this.animation_start = [];
    this.animation_end = [];
    this.animation_time = [];
    this.type = [];
    this.fog = [];
    this.m0 = [];
    this.m1 = [];
    this.m2 = [];
    this.m3 = [];
    this.index = 0;
    this.size = 2000;

    if(prefill){
        this.prefill()
    }
}

instance_buffer.prototype.prefill = function(){
    for(var i = 0; i < this.size; i++){
        this.translation.push(0,0,0);
        this.orientations.push(0,0,0,1);
        this.vector =  new THREE.Vector4();
        this.scales.push(0,0,0);
        this.colors.push(0,0,0,1);
        this.uvoffsets.push(0,0);
        this.tile_size.push(0,0);
        this.animation_start.push(0);
        this.animation_end.push(0);
        this.animation_time.push(0);
        this.type.push(0);
        this.fog.push(0);
        this.m0.push(0,0,0,1);
        this.m1.push(0,0,0,1);
        this.m2.push(0,0,0,1);
        this.m3.push(0,0,0,1);
        this.index ++;
    }
}

instance_buffer.prototype.get_index = function(){
    return this.index;
}

instance_buffer.prototype.set_animation = function(index, animation){
    this.animation_start[index] = animation.start;
    this.animation_end[index] = animation.length;
    this.animation_time[index] = random_range(0, 3);
}

instance_buffer.prototype.set = function(decomposer, animation){
    this.tile_size[this.index] = decomposer.tile_size.x; 
    this.tile_size[this.index + 1] = decomposer.tile_size.y;

    this.scales[this.index] = decomposer.scale.x;
    this.scales[this.index + 1] = decomposer.scale.y;
    this.scales[this.index + 2] = decomposer.scale.z;

    // ¯\_(ツ)_/¯
    this.vector.set(
        decomposer.position.x, 
        decomposer.position.y, 
        decomposer.position.z, 0).normalize();

    this.translation[this.index] = decomposer.position.x + this.vector.x;
    this.translation[this.index + 1] = decomposer.position.y + this.vector.y;
    this.translation[this.index + 2] = decomposer.position.z + this.vector.z;

    //  ¯\_(ツ)_/¯
    this.vector.set(
        decomposer.position.x, 
        decomposer.position.y,
        decomposer.position.z
    ).normalize();

    this.orientations[this.index] = decomposer.orient.x;
    this.orientations[this.index + 1] = decomposer.orient.y;
    this.orientations[this.index + 2] = decomposer.orient.z;
    this.orientations[this.index + 3] = decomposer.orient.w;

    var col = decomposer.colors[randomRangeRound(0, decomposer.colors.length - 1)];
    this.colors[this.index] = col.r;
    this.colors[this.index + 1] = col.g;
    this.colors[this.index + 2] = col.b;
    this.colors[this.index + 3] = col.a;
 
    var uvs = decomposer.ssIndex[randomRangeRound(0, decomposer.ssIndex.length - 1)];
    this.uvoffsets[this.index] = uvs.x;
    this.uvoffsets[this.index + 1] = uvs.x;

    if(animation != null){
        this.animation_start[this.index] = animation.start;
        this.animation_end[this.index] = animation.length;
        this.animation_time[this.index] = random_range(0, 3);
    } else {
        this.animation_start[this.index] = 0;
        this.animation_end[this.index] = 0;
        this.animation_time[this.index] = 0;
    }

    this.type[this.index] = decomposer.type;
    this.fog[this.index] = decomposer.fog;

    //Most Transform information now within the matrix 
    this.m0[this.index + 0] = decomposer.matrix.elements[0];
    this.m0[this.index + 1] = decomposer.matrix.elements[1];
    this.m0[this.index + 2] = decomposer.matrix.elements[2];
    this.m0[this.index + 3] = decomposer.matrix.elements[3];

    this.m1[this.index + 0] = decomposer.matrix.elements[4];
    this.m1[this.index + 1] = decomposer.matrix.elements[5];
    this.m1[this.index + 2] = decomposer.matrix.elements[6];
    this.m1[this.index + 3] = decomposer.matrix.elements[7];

    this.m2[this.index + 0] = decomposer.matrix.elements[8];
    this.m2[this.index + 1] = decomposer.matrix.elements[9];
    this.m2[this.index + 2] = decomposer.matrix.elements[10];
    this.m2[this.index + 3] = decomposer.matrix.elements[11];

    this.m3[this.index + 0] = decomposer.matrix.elements[12];
    this.m3[this.index + 1] = decomposer.matrix.elements[13];
    this.m3[this.index + 2] = decomposer.matrix.elements[14];
    this.m3[this.index + 3] = decomposer.matrix.elements[15];

    this.index ++;
}

instance_buffer.prototype.append = function(decomposer, animation){
    this.tile_size.push(
        decomposer.tile_size.x, 
        decomposer.tile_size.y,
    );

    this.scales.push(
        decomposer.scale.x, 
        decomposer.scale.y, 
        decomposer.scale.z
    );

    this.vector.set(
        decomposer.position.x, 
        decomposer.position.y, 
        decomposer.position.z, 0).normalize();

    this.translation.push(
        decomposer.position.x + this.vector.x, 
        decomposer.position.y + this.vector.y, 
        decomposer.position.z + this.vector.z
    );

    this.vector.set(
        decomposer.position.x, 
        decomposer.position.y,
        decomposer.position.z
    ).normalize();

    this.orientations.push(
        decomposer.orient.x, 
        decomposer.orient.y, 
        decomposer.orient.z, 
        decomposer.orient.w);

    var col = decomposer.colors[randomRangeRound(0, decomposer.colors.length - 1)];
    this.colors.push(col.r, col.g, col.b, col.a);
  
    var uvs = decomposer.ssIndex[randomRangeRound(0, decomposer.ssIndex.length - 1)];

    this.uvoffsets.push(uvs.x, uvs.y);

    if(animation != null){
        this.animation_start.push(animation.start);
        this.animation_end.push(animation.length);
        this.animation_time.push(random_range(0, 3));
    } else {
        this.animation_start.push(0);
        this.animation_end.push(0);
        this.animation_time.push(0);
    }

    this.type.push(decomposer.type);

    this.fog.push(decomposer.fog);

    //Most Transform information now within the matrix 
    this.m0.push(
        decomposer.matrix.elements[0],  decomposer.matrix.elements[1],  decomposer.matrix.elements[2],  decomposer.matrix.elements[3],
    );

    this.m1.push(
        decomposer.matrix.elements[4],  decomposer.matrix.elements[5],  decomposer.matrix.elements[6],  decomposer.matrix.elements[7],
    );

    this.m2.push(
        decomposer.matrix.elements[8],  decomposer.matrix.elements[9],  decomposer.matrix.elements[10], decomposer.matrix.elements[11],
    );

    this.m3.push(
        decomposer.matrix.elements[12], decomposer.matrix.elements[13], decomposer.matrix.elements[14], decomposer.matrix.elements[15],
    );

    this.index ++;
}

instance_buffer.prototype.name = "instance_buffer";

/**
 * 
 * @param {*} container 
 * @param {*} this 
 * @param {*} attributes 
 * @param {*} spritesheetsize 
 * @param {*} shader 
 * @param {*} urlindex 
 * @param {*} animate 
 * @param {*} is3D 
 */
instance_renderer.prototype.bake_buffer = function() {
    if (this.buffer == undefined || this.buffer.length == 0) {
        console.error("buffer error.")
    }

    if(this.buffer.index <= 0){
        console.log("buffer is empty!")
        return
    }

    var bufferGeometry = new THREE.PlaneBufferGeometry(1, 1, 1); 
    bufferGeometry.castShadow = true;

    var geometry = new THREE.InstancedBufferGeometry();
    geometry.index = bufferGeometry.index;
    geometry.attributes.position = bufferGeometry.attributes.position;
    geometry.attributes.uv = bufferGeometry.attributes.uv;
  
    //var translationAttribute = new THREE.InstancedBufferAttribute(new Float32Array(this.buffer.translation), 3);
    var orientationAttribute = new THREE.InstancedBufferAttribute(new Float32Array(this.buffer.orientations), 4);
    var colorAttribute = new THREE.InstancedBufferAttribute(new Float32Array(this.buffer.colors), 4);
    var uvOffsetAttribute = new THREE.InstancedBufferAttribute(new Float32Array(this.buffer.uvoffsets), 2);
    var tileSizeAttribute = new THREE.InstancedBufferAttribute(new Float32Array(this.buffer.tile_size), 2);
    var scaleAttribute = new THREE.InstancedBufferAttribute(new Float32Array(this.buffer.scales), 3);
    var animation_startAttribute = new THREE.InstancedBufferAttribute(new Float32Array(this.buffer.animation_start), 1);
    var animation_endAttribute = new THREE.InstancedBufferAttribute(new Float32Array(this.buffer.animation_end), 1);
    var animation_timeAttribute = new THREE.InstancedBufferAttribute(new Float32Array(this.buffer.animation_time), 1);
    var typeAttribute = new THREE.InstancedBufferAttribute(new Float32Array(this.buffer.type), 1);
    var fogAttribute = new THREE.InstancedBufferAttribute(new Float32Array(this.buffer.fog), 1);
    var m0Attribute = new THREE.InstancedBufferAttribute(new Float32Array(this.buffer.m0), 4);
    var m1Attribute = new THREE.InstancedBufferAttribute(new Float32Array(this.buffer.m1), 4);
    var m2Attribute = new THREE.InstancedBufferAttribute(new Float32Array(this.buffer.m2), 4);
    var m3Attribute = new THREE.InstancedBufferAttribute(new Float32Array(this.buffer.m3), 4);

    //geometry.setAttribute('translation', translationAttribute);
    geometry.setAttribute('orientation', orientationAttribute);
    geometry.setAttribute('col', colorAttribute);
    geometry.setAttribute('uvoffset', uvOffsetAttribute);
    geometry.setAttribute('tile_size', tileSizeAttribute);
    geometry.setAttribute('scale', scaleAttribute);
    geometry.setAttribute('animation_start', animation_startAttribute);
    geometry.setAttribute('animation_end', animation_endAttribute);
    geometry.setAttribute('animation_time', animation_timeAttribute);
    geometry.setAttribute('type', typeAttribute);
    geometry.setAttribute('fog', fogAttribute);
    geometry.setAttribute('m0', m0Attribute);
    geometry.setAttribute('m1', m1Attribute);
    geometry.setAttribute('m2', m2Attribute);
    geometry.setAttribute('m3', m3Attribute);
    
    this.attributes.populate(
        [
            //translationAttribute,
            orientationAttribute,
            colorAttribute,
            uvOffsetAttribute,
            tileSizeAttribute,
            scaleAttribute,
            animation_startAttribute,
            animation_endAttribute,
            animation_timeAttribute,
            typeAttribute,
            fogAttribute,
            m0Attribute,
            m1Attribute,
            m2Attribute,
            m3Attribute,
        ], this.buffer.index
    );

    var texture = new THREE.TextureLoader().load(renderer_text_info[this.map_index].map);

    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    var animationSwitch = 0;
    var is3DSwitch = 0;

    if (this.animate)
        animationSwitch = 1.0;

    if(this.is3D)
        is3DSwitch = 1.0;

    var instanceUniforms = {
        map: { value: texture },
        spriteSheetX: { type: "f", value: SPRITE_SHEET_SIZE.x },
        spriteSheetY: { type: "f", value: SPRITE_SHEET_SIZE.y },
        animationSwitch: { type: "f", value: animationSwitch },
        is3D: { type: "f", value: is3DSwitch },
        time: { type: "f", value: 1.0 },
    }

    if(this.shader == undefined){
        console.error("shader wasnt found, using defualt.");
        this.shader = get_data("instance_shader");
    }

    var material = new THREE.RawShaderMaterial({
        uniforms:
            THREE.UniformsUtils.merge([
                THREE.UniformsLib['lights'],
                THREE.UniformsLib['fog'],
                instanceUniforms
            ]),

        vertexShader: this.shader.vert,
        fragmentShader:  this.shader.frag,
        wireframe:  this.shader.extra.wf,
        transparent:  this.shader.extra.trans,
        fog: true,
        lights: true,
    });

    mesh = new THREE.Mesh(geometry, material);
    material.uniforms.map.value = texture;
    material.uniforms.spriteSheetX.value = SPRITE_SHEET_SIZE.x;
    material.uniforms.spriteSheetY.value = SPRITE_SHEET_SIZE.y;

    material.side = THREE.DoubleSide;
    mesh.frustumCulled = false;
    mesh.castShadow = true;
    //console.log("objects baked: ", this.buffer.index)

    this.mesh.add(mesh);
}