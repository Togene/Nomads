

function map_colors(index, map_data) {
    var red = map_data[(index * 4) + 0];
    var green = map_data[(index * 4) + 1];
    var blue = map_data[(index * 4) + 2];
    var alpha = map_data[(index* 4) + 3];

    return {r:red, g:green,b:blue,a:alpha}
}

/**
 * generates map data to mesh data
 * texture data [r,g,b,a]
 * @param {*} height_map 
 * @param {*} detial_map 
 * @param {*} size 
 */

function generete_tile(height_map, detial_map, size) {
    map_max =  height_map.width * height_map.height

    // power diffrence between mesh and texture
    power_diffrence = (Math.log2(map_max) - Math.log2(size * size));

    step_diffrence = 1;

    if(power_diffrence > 1) {
        step_diffrence = Math.pow(2, (Math.log2(map_max) - Math.log2(size * size)));
    }

    // mesh variables
    var vertices = []
    var indices = []
    var normals = []
    var uvs = []

    for(var x = 0; x <= size; x++)
        for(var y = 0; y <= size; y++){
            
            var index = (x + (size) * y);
            var map_step = index * step_diffrence;

     
            var height_colors = map_colors(map_step, height_map.data);
            
           //var vertex = new THREE.Vector3(x, height_colors.r, y);
           var height = height_colors.r/255;
           
           if(map_step >= map_max){
                height = 1000000;
            }
            

            vertices.push(x - (size/2), height * 5, y - (size/2));
            // ¯\_(ツ)_/¯
            normals.push(0, -1, 0);
            uvs.push((x/size), 1 -  (y/size));
    }

    for(var x = 0; x < size; x++){
        for(var y = 0; y < size; y++){

            var a = x + (size + 1) * y;
            var b = x + (size + 1) * (y + 1);
            var c = (x + 1) + (size + 1) * (y + 1);
            var d = (x + 1) + (size + 1) * y;

            indices.push(a, b, d);
            indices.push(b, c, d);
        }
    }

    var bufferGeometry = new THREE.BufferGeometry();

 
    bufferGeometry.setIndex(indices);
    bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    bufferGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    bufferGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

    var geo = new THREE.Geometry().fromBufferGeometry(bufferGeometry);
    geo.mergeVertices();
    geo.computeFaceNormals();
    geo.computeVertexNormals();
    geo.computeBoundingSphere();

    return geo;
}


 