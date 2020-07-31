var cycle_length = 24;
var current_time = 0;
var time = 0;
var sky_index = 0;
var sky_lerp_index = 0;
var sky;

var step = 0;

var sky_colors = [
    new THREE.Color( 0xEDA479), //Prime Morning
    new THREE.Color( 0x749AC5), //Prime Day
    new THREE.Color( 0xAC98D3) // Prime Night
];

function sky_init(){
   sky = new gameobject("sky");
   sky.transform.scale = new THREE.Vector3(1, 1, 1)

   var sun = new gameobject("sun", new THREE.Vector3 (0, 1000, 0), 
   new THREE.Vector3(500,500,500), new quaternion(0,0,0,1));

   var moon = new gameobject("moon", new THREE.Vector3 (0, -1000, 0), 
   new THREE.Vector3(200,200,200), new quaternion(0,0,0,1));

   sky.add_child(sun);
   sky.add_child(moon);

   sun.add_component(new particle(
       get_meta().sun,
   ));

   moon.add_component(new particle(
       get_meta().moon,
   ));
}

function update_sky(delta){
    time += delta; 
    current_time = (time % cycle_length);

    var raw_sky_index = normalize(0, cycle_length, current_time) * sky_colors.length;

    sky_index = Math.floor(raw_sky_index);
    //need to figure out length to next color and lerp to it
    //current to next, length
    sky_lerp_index = raw_sky_index - sky_index;

    var current_color = new THREE.Color(sky_colors[sky_index].getHex()).lerp(
        sky_colors[(sky_index + 1) % sky_colors.length], sky_lerp_index);
    
        renderer.setClearColor(current_color.getHex(), 1 );

    scene.fog.color = current_color;
   
    step += ((Math.PI*2) / (cycle_length*360));
    console.log(cycle_length)
    //if(step > 100) { step = 0;}

    sky.transform.rotation = new quaternion(null,null,null,null, 
        new THREE.Vector3(1, 0, 0), (step));
}

