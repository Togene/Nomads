function instance_buffer(){
    this.translation = [];
    this.orientations = [];
    this.vector =  new THREE.Vector4();
    this.scales = [];
    this.colors = [];
    this.uvoffsets = [];
    this.animation_start = [];
    this.animation_end = [];
    this.animation_time = [];
    this.type = [];
    this.fog = [];
    this.normals = [];
    this.m0 = [];
    this.m1 = [];
    this.m2 = [];
    this.m3 = [];
    this.index = 0;
}

instance_buffer.prototype.get_index = function(){
    return this.index;
}

instance_buffer.prototype.append = function(position, orient, scale, decomposer, animation){
    this.scales.push(scale.x, scale.y, scale.z);

    this.vector.set(position.x, position.y, position.z, 0).normalize();

    this.translation.push(
        position.x + this.vector.x + decomposer.centre_offset.x, 
        position.y + this.vector.y + decomposer.centre_offset.y, 
        position.z + this.vector.z + decomposer.centre_offset.z);

    this.vector.set(position.x, position.y, position.z).normalize();

    this.orientations.push(orient.x, orient.y, orient.z, orient.w);

    var col = decomposer.colors[randomRangeRound(0, decomposer.colors.length - 1)];
    this.colors.push(col.r, col.g, col.b);

    var uvs = decomposer.ssIndex[randomRangeRound(0, decomposer.ssIndex.length - 1)];

    this.uvoffsets.push(uvs.x, uvs.y);

    //this.animationFrame.push(decomposer.animationFrames.x, decomposer.animationFrames.y);

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

    this.normals.push(0.0, 1.0, 0.0);

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
function create_instance(container, buffer, attributes, shader, urlindex, animate, is3D = false) {
    var bufferGeometry = new THREE.PlaneBufferGeometry(1, 1, 1); 
    bufferGeometry.castShadow = true;

    var geometry = new THREE.InstancedBufferGeometry();
    geometry.index = bufferGeometry.index;
    geometry.attributes.position = bufferGeometry.attributes.position;
    geometry.attributes.uv = bufferGeometry.attributes.uv;
  
    var translationAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.translation), 3);
    var orientationAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.orientations), 4);
    var colorAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.colors), 3);
    var uvOffsetAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.uvoffsets), 2);
    var scaleAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.scales), 3);
    var animation_startAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.animation_start), 1);
    var animation_endAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.animation_end), 1);
    var animation_timeAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.animation_time), 1);


    var typeAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.type), 1);
    var fogAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.fog), 1);
    var normalsAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.normals), 3);
    var m0Attribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.m0), 4);
    var m1Attribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.m1), 4);
    var m2Attribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.m2), 4);
    var m3Attribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.m3), 4);

    geometry.setAttribute('translation', translationAttribute);
    geometry.setAttribute('orientation', orientationAttribute);
    geometry.setAttribute('col', colorAttribute);
    geometry.setAttribute('uvoffset', uvOffsetAttribute);
    geometry.setAttribute('scale', scaleAttribute);
    geometry.setAttribute('animation_start', animation_startAttribute);
    geometry.setAttribute('animation_end', animation_endAttribute);
    geometry.setAttribute('animation_time', animation_timeAttribute);
    geometry.setAttribute('type', typeAttribute);
    geometry.setAttribute('fog', fogAttribute);
    geometry.setAttribute('normal', normalsAttribute);
    geometry.setAttribute('m0', m0Attribute);
    geometry.setAttribute('m1', m1Attribute);
    geometry.setAttribute('m2', m2Attribute);
    geometry.setAttribute('m3', m3Attribute);

    attributes.push(
        m0Attribute,                    //0
        m1Attribute,                    //1
        m2Attribute,                    //2
        m3Attribute,                    //3
        colorAttribute,                 //4
        typeAttribute,                  //5
        orientationAttribute,           //6
        animation_startAttribute,       //7
        animation_endAttribute,         //8
        animation_timeAttribute         //9
    );

    var texture = new THREE.TextureLoader().load(MapFileurl[urlindex]);

    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    var animationSwitch = 0;
    var is3DSwitch = 0;

    if (animate)
        animationSwitch = 1.0;

    if(is3D)
        is3DSwitch = 1.0;

    var instanceUniforms = {
        map: { value: texture },
        spriteSheetX: { type: "f", value: SPRITE_SHEET_SIZE.x },
        spriteSheetY: { type: "f", value: SPRITE_SHEET_SIZE.y },
        animationSwitch: { type: "f", value: animationSwitch },
        is3D: { type: "f", value: is3DSwitch },
        time: { type: "f", value: 1.0 },
    }

    if(shader == undefined){
        console.error("shader wasnt found, using defualt.");
        shader = get_data("instance_shader");
    }

    var material = new THREE.RawShaderMaterial({
        uniforms:
            THREE.UniformsUtils.merge([
                THREE.UniformsLib['lights'],
                THREE.UniformsLib['fog'],
                instanceUniforms
            ]),

        vertexShader: shader.vert,
        fragmentShader: shader.frag,
        wireframe: shader.extra.wf,
        transparent: shader.extra.trans,
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

    container.add(mesh);
}