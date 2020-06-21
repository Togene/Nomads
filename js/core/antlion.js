//data after being processed
var compiled_data = [];

//ensure nothing else interfaces as resources are loading
var DONE = false;

var async_time = 0;
var elapsed_time = 0;
var map_index = 0;
var pool;
var meta_data = null;
var manifest = [];

/*used to grab all outside resources for the game since all resources
are async and require some to be compiled*/

function antlion_init(){
    load('saved/pool_data', 'json', antlion_pool_load);
    load('saved/object_manifest', 'json', antlion_manifest_load);
    load('meta_data', 'json', meta_data_load);

    async_time = Date.now();
    antlion_fall(raw_resources.length - 1, []);
}

function antlion_fall(i, data){
    //catch data dropping in from prevois call, except the first init
    if(data.length != 0){ compiled_data.push(data);}
    
    //onload function will pass on to done
    if(i == 0){
        if(raw_resources[i].type == "s"){
            shader_loader(
                raw_resources[i].name, 
                raw_resources[i].data.vert, 
                raw_resources[i].data.frag, 
                antlion_done, 
                raw_resources[i].data.extra, 
                i - 1);
        } else if(raw_resources[i].type == "t"){
            texture_loader(
                raw_resources[i].name, 
                raw_resources[i].data.color, 
                raw_resources[i].data.height, 
                raw_resources[i].data.detail,
                antlion_fall, 
                i - 1);
        } else if(raw_resources[i].type == "m"){
            map_texture_loader(
                raw_resources[i].name, 
                map_index++, 
                raw_resources[i].data.url, 
                antlion_fall, 
                i - 1);
        }
        return;
    }

    //Keep falling baby
    if(raw_resources[i].type == "s"){
        shader_loader(
            raw_resources[i].name, 
            raw_resources[i].data.vert, 
            raw_resources[i].data.frag, 
            antlion_fall, 
            raw_resources[i].data.extra, 
            i - 1);
    } else if(raw_resources[i].type == "t"){
        texture_loader(
            raw_resources[i].name, 
            raw_resources[i].data.color, 
            raw_resources[i].data.height, 
            raw_resources[i].data.detail,
            antlion_fall, 
            i - 1);
    } else if(raw_resources[i].type == "m"){
        map_texture_loader(
            raw_resources[i].name, 
            map_index++,
            raw_resources[i].data.url, 
            antlion_fall, 
            i - 1);
    }

    console.log("%cFALLING: " + i, 'color: #FF0000');
}

//push the last data, and flag for done;
function antlion_done(i, data){
    compiled_data.push(data);
    elapsed_time = Date.now() - async_time;
    //start up init after data loaded
    game_bootstrap(compiled_data);
}

function antlion_pool_load(data){
    pool = JSON.parse(data);
}

function meta_data_load(data){
    meta_data = JSON.parse(data);
    console.log("%cmeta data loaded successful", 'color: #FF0000');
}

function antlion_manifest_load(data){
   // manifest = JSON.parse(data);
   // console.log("loading successful.", manifest);
   // 
   // if(manifest.length != 0){
   //     for(var i = 0; i < manifest.length; i++){
   //         box_create(manifest[i].position, null, false);
   //     }
   // }
}

function antlion_reset_manifest(){
    manifest = [];
    console.log("manifest reset.", JSON.stringify(manifest));
    remove('object_manifest', 'json');
}

function antlion_add_to_manifest(data){
    console.log(manifest);

    manifest.push(data);
    save(manifest, 'object_manifest', 'json');
}

function antlion_get_manifest(){
    return manifest;
}

function get_meta(){
    return meta_data;
}

// Credit to THeK3nger - https://gist.github.com/THeK3nger/300b6a62b923c913223fbd29c8b5ac73
//Sorry to any soul that bare's witness to this Abomination....May the gods have mercy on me
function shader_loader(name, vertex_url, fragment_url, onLoad, custom, i, onProgress, onError) {
    var vertex_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
    vertex_loader.setResponseType('text');
    vertex_loader.load(vertex_url, function (vertex_text) {
        var fragment_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
        fragment_loader.setResponseType('text');
        fragment_loader.load(fragment_url, function (fragment_text) {
            var shadow_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
            shadow_loader.setResponseType('text');
            shadow_loader.load("js/shaders/shadow.glsl", function (shadow_text) {
                var dither_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
                dither_loader.setResponseType('text');
                dither_loader.load("js/shaders/dither.glsl", function (dither_text) {
                    //this needs an i
                    onLoad(i, {name: name, extra: custom, vert: text_parse(vertex_text, shadow_text, dither_text), frag: text_parse(fragment_text, shadow_text, dither_text) });
                }

                )
            });
        })
    }, onProgress, onError);
}

function texture_loader(name, urlc, urlh, urld, onLoad, i, onProgress, onError){
    texture_c = new THREE.TextureLoader().load(urlc, function (event) {
        texture_h = new THREE.TextureLoader().load(urlh, function (event) {
            texture_d = new THREE.TextureLoader().load(urld, function (event) {

        imagedata = get_image_data(texture_h.image);    
        detial_data = get_image_data(texture_d.image); 

        texture_c.magFilter = THREE.NearestFilter;
        texture_c.minFilter = THREE.NearestFilter;

        texture_h.magFilter = THREE.NearestFilter;
        texture_h.minFilter = THREE.NearestFilter;
        
        detial_data.magFilter = THREE.NearestFilter;
        detial_data.minFilter = THREE.NearestFilter;

        texture_d.magFilter = THREE.NearestFilter;
        texture_d.minFilter = THREE.NearestFilter;
        
       
        onLoad(i, {name:name, color: texture_c, height:imagedata, detail: detial_data, detail_test: texture_d}, onProgress, onError)

            })
        })
    });
}

function map_texture_loader(name, index, url, onLoad, i, onProgress, onError){
    
    texture = new THREE.TextureLoader().load(url, function () {

        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;

       
        onLoad(i, {name:name, index:index, map: texture}, onProgress, onError)
    });
}

//Yummy Yum Yum
function text_parse(glsl, shadow_text, dither_text) {
    var text = glsl.replace("AddShadow", shadow_text);
    text = text.replace("AddDither", dither_text);

    return text;
}

function get_data(key){

    if(typeof key === 'string'){
        //console.log(key);

        for(var i = 0; i < compiled_data.length; i++){
            if(compiled_data[i].name == key){return compiled_data[i];}
        }

    } else if(typeof key === 'number'){
       // console.log(key);

        for(var i = 0; i < compiled_data.length; i++){

            if(compiled_data[i].index != null){
                    if(compiled_data[i].index == key){return compiled_data[i];}
            }
        }
    }
}