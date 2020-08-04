function map_rgba(index, map_data) {
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

function generete_tile(height_map, detial_map, lod) {
    if (lod > 6 || lod < 0) {
        console.error("LOD must be between 0 - 6");
        lod = 1;
    }

    var top_left_x = (height_map.width - 1) / -2;
    var top_left_z = (height_map.width - 1) / +2;

    var increment = (lod == 0) ? 1 : lod * 2
    var vertices_per_line = Math.floor(((height_map.width - 1) / increment) + 1)
    
    var map_size = vertices_per_line * vertices_per_line

    var vertices = [(map_size) * 3]
    var indices = [(vertices_per_line - 1) * (vertices_per_line - 1) * 6]
    var normals = [map_size * 3]
    var uvs = [map_size * 2]

    vertex_index = 0;
    triangle_index = 0;
    normals_index = 0;
    uv_index = 0;

    var max_height = -Infinity;

    for(var y = 0; y < height_map.height; y+= increment)
        for(var x = 0; x < height_map.width; x+= increment){
        
        var index = (x + (height_map.width) * y);
        var map_data = map_rgba(index, height_map.data);

        var height = 0;
    
        if(map_data.r != undefined){
            height = EasingFunctions.easeInOutQuad(normalize(0, 255, map_data.r/255) * 1250) * -1;

            if (height > max_height){
                max_height = height
            }

            if (height == 0){
                height = -25;
            }
        } else {
            height = 10000
        }
        
        if(detial_map != undefined){
            var detials = map_rgba(index, detial_map.data);

            if(detials.g > 100){
                tree_01_create(new THREE.Vector3((top_left_x + x), height, (top_left_z - y)), new quaternion())
            } else {
               
            }
        }

        vertices[(vertex_index * 3) + 0] = (top_left_x + x);
        vertices[(vertex_index * 3) + 1] = height;
        vertices[(vertex_index * 3) + 2] = (top_left_z - y);
        
        // ¯\_(ツ)_/¯
       // normals.push(0, 1, 0);
        normals[(normals_index * 3) + 0] = 0.0;
        normals[(normals_index * 3) + 1] = 1.0;
        normals[(normals_index * 3) + 2] = 0.0;
        normals_index++;

        uvs[(uv_index * 2) + 0] = (x/height_map.width)
        uvs[(uv_index * 2) + 1] = 1 - (y/height_map.height)
        uv_index++;

        if(x < height_map.width - increment && y < height_map.height - increment){
            //console.log(vertex_index)
            indices[(triangle_index * 6) + 0] = vertex_index;
            indices[(triangle_index * 6) + 1] = vertex_index + vertices_per_line + 1;
            indices[(triangle_index * 6) + 2] = vertex_index + vertices_per_line;

            indices[(triangle_index * 6) + 3] = vertex_index + vertices_per_line + 1;
            indices[(triangle_index * 6) + 4] = vertex_index;
            indices[(triangle_index * 6) + 5] = vertex_index + 1;

            triangle_index ++;
        }
        
        vertex_index ++;
    }
    //console.log(vertices.length)
    player.transform.position.y = max_height
    player.get_component("rigidbody").reset_height = max_height + player.transform.scale.y*2.5;

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
 