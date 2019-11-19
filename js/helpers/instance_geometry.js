function create_buffer(){
    return {
        offsets: [],
        orientations: [],
        vector: new THREE.Vector4(),
        scales: [],
        colors: [],
        uvoffsets: [],
        animationFrame: [],
        type: [],
        normals: []
    };
}

function PopulateBuffer(position, orient, scale, buffer, renderer){

    buffer.scales.push(scale.x, scale.y, scale.z);

    buffer.vector.set(position.x, position.y, position.z, 0).normalize();

    buffer.offsets.push(
        position.x + buffer.vector.x + renderer.centre_offset.x, 
        position.y + buffer.vector.y + renderer.centre_offset.y, 
        position.z + buffer.vector.z + renderer.centre_offset.z);

    buffer.vector.set(position.x, position.y, position.z).normalize();

    buffer.orientations.push(orient.x, orient.y, orient.z, orient.w);

    var col = renderer.colors[randomRangeRound(0, renderer.colors.length - 1)];
    buffer.colors.push(col.r, col.g, col.b);

    var uvs = renderer.ssIndex[randomRangeRound(0, renderer.ssIndex.length - 1)];

    buffer.uvoffsets.push(uvs.x, uvs.y);

    buffer.animationFrame.push(renderer.animationFrames.x, renderer.animationFrames.y);

    buffer.type.push(renderer.type);

    buffer.normals.push(0.0, 1.0, 0.0);
}

function CreateInstance(id, world, buffer, spritesheetsize, shader, urlindex, animate, is3D = false) {
    var bufferGeometry = new THREE.PlaneBufferGeometry(1, 1, 1); 
    bufferGeometry.castShadow = true;

    var geometry = new THREE.InstancedBufferGeometry();
    geometry.index = bufferGeometry.index;
    geometry.attributes.position = bufferGeometry.attributes.position;
    geometry.attributes.uv = bufferGeometry.attributes.uv;

    offsetAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.offsets), 3);
    orientationAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.orientations), 4);
    colorAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.colors), 3);
    uvOffsetAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.uvoffsets), 2);
    scaleAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.scales), 3);
    animationFrameAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.animationFrame), 2);
    typeAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.type), 1);
    normalsAttribute = new THREE.InstancedBufferAttribute(new Float32Array(buffer.normals), 3);
   
    geometry.setAttribute('offset', offsetAttribute);
    geometry.setAttribute('orientation', orientationAttribute);
    geometry.setAttribute('col', colorAttribute);
    geometry.setAttribute('uvoffset', uvOffsetAttribute);
    geometry.setAttribute('scaleInstance', scaleAttribute);
    geometry.setAttribute('animationFrame', animationFrameAttribute);
    geometry.setAttribute('type', typeAttribute);
    geometry.setAttribute('normal', normalsAttribute);

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
        spriteSheetX: { type: "f", value: spritesheetsize.x },
        spriteSheetY: { type: "f", value: spritesheetsize.y },
        animationSwitch: { type: "f", value: animationSwitch },
        is3D: { type: "f", value: is3DSwitch },
        time: { type: "f", value: 1.0 },
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
    material.uniforms.spriteSheetX.value = spritesheetsize.x;
    material.uniforms.spriteSheetY.value = spritesheetsize.y;

    material.side = THREE.DoubleSide;
    mesh.frustumCulled = false;
    mesh.castShadow = true;

    world.add(mesh);
}