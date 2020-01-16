//data after being processed
var compiled_data = [];

//ensure nothing else interfaces as resources are loading
var DONE = false;

var async_time = 0;
var elapsed_time = 0;

/*used to grab all outside resources for the game since all resources
are async and require some to be compiled*/

function antlion_init(){
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
            raw_resources[i].extra, 
            i - 1);
    }

    console.log("FALLING!", i);
}

//push the last data, and flag for done;
function antlion_done(i, data){
    compiled_data.push(data);

    elapsed_time = Date.now() - async_time;

    //start up init after data loaded
    game_bootstrap(compiled_data);
  
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

//Yummy Yum Yum
function text_parse(glsl, shadow_text, dither_text) {
    var text = glsl.replace("AddShadow", shadow_text);
    text = text.replace("AddDither", dither_text);

    return text;
}

function get_data(name){
    for(var i = 0; i < compiled_data.length; i++){
        if(compiled_data[i].name == name){return compiled_data[i];}
    }
}