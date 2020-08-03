var cycle_length = 24 * 3;
var current_time = 0;
var time = 0;
var sky_index = 0;
var sky_lerp_index = 0;
var sky;

var step = 0;

var min_distance = 300;
var max_distance = 500;

var moon;

var stars_array = []

var sky_colors = [
    new THREE.Color( 0xEDA479), //Prime Morning
    new THREE.Color( 0x749AC5), //Prime Day
    new THREE.Color( 0x749AC5), //Prime Day
    new THREE.Color( 0x749AC5), //Prime Day
    new THREE.Color( 0x749AC5), //Prime Day
    new THREE.Color( 0xEDA479), //Prime Morning
    new THREE.Color( 0xEDA479), //Prime Morning
    new THREE.Color( 0xAC98D3), //TRANS Night
    new THREE.Color( 0x292965), //Prime Night
    new THREE.Color( 0x170C2E), //Night Tip
    new THREE.Color( 0x170C2E), //Prime Night
    new THREE.Color( 0xAC98D3), //TRANS Night
];

function sky_init(){
   sky = new gameobject("sky");
   sky.transform.scale = new THREE.Vector3(1, 1, 1)

   var sun = new gameobject("sun", new THREE.Vector3 (0,0, 1000), 
   new THREE.Vector3(500,500,500), new quaternion(0,0,0,1));

   moon = new gameobject("moon", new THREE.Vector3 (0, 0, -1000), 
   new THREE.Vector3(200,200,200), new quaternion(0,0,0,1));

   sky.add_child(sun);
   sky.add_child(moon);

   sun.add_component(new particle(
       get_meta().sun,
   ));

   moon.add_component(new particle(
       get_meta().moon,
   ));

   moon.get_component("decomposer").set_alpha(0.5);

   var stars = new gameobject("stars", new THREE.Vector3(0,0,0), new THREE.Vector3(1, 1, 1), new quaternion(0,0,0,1));
   genenerate_stars(stars)
   sky.add_child(stars);
}

// temporary adding and testiing solid stars
function genenerate_stars(holder){
    for(var i = 0; i < 200; i++){
        var size = random_range(5, 25);

        var star =  new gameobject(
            "star", 
            new THREE.Vector3(0, 0, 0), 
            new THREE.Vector3(size,size,size), 
            new quaternion(0,0,0,1)
        );

        star.add_component(new particle(
            get_meta().star,
        ));
     
        var direction = new THREE.Vector3(
            random_range(-1, 1), 
            random_range(-1, 1), 
            random_range(-1, 1)
        );
        
        direction.normalize();

        star.transform.position = new THREE.Vector3(
            direction.x * random_range(min_distance, max_distance), 
            direction.y * random_range(min_distance, max_distance), 
            direction.z * random_range(min_distance, max_distance)
            );

        holder.add_child(star);
        stars_array.push(star)
    }
}

function update_sky(delta){
    time += delta; 
    current_time = (time % cycle_length);
    
    ingame_time = (current_time/cycle_length) * 24;
    //console.log(game_time);

    var raw_sky_index = normalize(0, cycle_length, current_time) * sky_colors.length;

    sky_index = Math.floor(raw_sky_index);

    //need to figure out length to next color and lerp to it
    //current to next, length
    sky_lerp_index = raw_sky_index - sky_index;

    var current_color = new THREE.Color(sky_colors[sky_index].getHex()).lerp(
        sky_colors[(sky_index + 1) % sky_colors.length], sky_lerp_index);
    
    renderer.setClearColor(current_color.getHex(), 1 );
    scene.fog.color = current_color;
        
    step = (Math.PI*2) * (raw_sky_index/sky_colors.length)
   
    if(sky != undefined) {
        sky.transform.rotation = new quaternion(null,null,null,null, 
        new THREE.Vector3(1, 0, 0), (step));
    }

    // TODO: find a better formula for this later on :|
    var index_normal = ((raw_sky_index/sky_colors.length) + 0.25) % 1;
    
    if(index_normal > 0.5){
        index_normal = Math.cos(index_normal + 0.5);
    }

    sun.intensity = clamp(EasingFunctions.easeInOutCubic(index_normal) * 4.75, 0.05, 1);

    // 0 = sun.intensity - (sun.intensity/1.0)
    // 1 = sun.intensity - (sun.intensity/1.0)
    // TODO: Fix formula for better star alpha lerping :c
    for(var i = 0; i < stars_array.length; i++){
        stars_array[i].get_component("decomposer").set_alpha(Math.cos(((sun.intensity/-1.0) - 0.5)));
    }
   
}

