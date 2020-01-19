var cycle_length = 24;
var current_time = 0;
var time = 0;
var sky_index = 0;
var sky_lerp_index = 0;
var sky = new gameobject("sky");

var sky_colors = [
    new THREE.Color( 0xEDA479), //Prime Morning
    new THREE.Color( 0x749AC5), //Prime Day
    new THREE.Color( 0xAC98D3) // Prime Night
];

function sky_init(){

    var shader = get_data("instance_shader");
    var buffer = create_buffer();
    var attributes = [];

    prime_star_init(buffer, attributes);
    sun_init(buffer, attributes);
    moon_init(buffer, attributes);

    CreateInstance(
        "stars", 
        animated_sprites, 
        buffer, 
        attributes,
        sprite_sheet_size , 
        shader, 
        2, 
        true, 
        false
        );
}

function update_sky(delta){
    time += delta; 
    current_time = (time % cycle_length);

    ////get current sky color
    var raw_sky_index = normalize(0, cycle_length, current_time) * sky_colors.length;

    sky_index = Math.floor(raw_sky_index);

    //need to figure out length to next color and lerp to it
    //current to next, length
    sky_lerp_index = raw_sky_index - sky_index;

    var current_color = new THREE.Color(sky_colors[sky_index].getHex()).lerp(
        sky_colors[(sky_index + 1) % sky_colors.length],
        sky_lerp_index);
    renderer.setClearColor(current_color.getHex(), 1 );

    sky.transform.rotation.x += cycle_length/360;
}

//TODO: Create Star Map :|
function prime_star_init(buffer, attributes){
    var min_distance = 300;
    var max_distance = 500;

    var stars = new gameobject("stars");

    sky.add_child(stars);

    for(var i = 0; i < 5; i++){
        var star = new gameobject("star");

        stars.add_child(star);

        var direction = new THREE.Vector3(
            random_range(-1, 1), 
            random_range(-1, 1), 
            random_range(-1, 1)
        );
        
        direction.normalize();

        var star_decomposer = new decomposer(
            [ MapToSS(0, 0),],
            new THREE.Vector2(2,1),
            [ 
              new THREE.Color(0xFFD27D),
              new THREE.Color(0xFFA371),
              new THREE.Color(0xA6A8FF),
              new THREE.Color(0xFFFA86),
              new THREE.Color(0xA87BFF),
            ],
            new THREE.Vector3(0, 0, 0),
            star.transform,
            0,
            attributes,
            buffer.index,
        );
        
        star.add_component(star_decomposer);

        PopulateBuffer(
            new THREE.Vector3(
            direction.x * random_range(min_distance, max_distance), 
            direction.y * random_range(min_distance, max_distance), 
            direction.z * random_range(min_distance, max_distance)
            ), //dont need this anymore
            new THREE.Vector3(0, 0, 0), //dont need this anymore
            new THREE.Vector3(15, 15, 15), //dont need this anymore
            buffer, 
            star_decomposer
            );
    }
}

function sun_init(buffer, attributes){

    var sun = new gameobject("sun");
    sky.add_child(sun);
    //sun.transform.position = new THREE.Vector3(0, 0, 0);

    var sun_decomposer = new decomposer(
        [ MapToSS(0, 1),],
        new THREE.Vector2(1,1),
        [ 
          new THREE.Color(0xFFD27D),
          new THREE.Color(0xFFA371),
          new THREE.Color(0xA6A8FF),
          new THREE.Color(0xFFFA86),
          new THREE.Color(0xA87BFF),
        ],
        new THREE.Vector3(0, 0, 0),
        sun.transform,
        0,
        attributes,
        buffer.index,
    );
    
    sun.add_component(sun_decomposer);

    PopulateBuffer(
        new THREE.Vector3(0, 1000, 0), //dont need this anymore
        new THREE.Vector3(0, 0, 0), //dont need this anymore
        new THREE.Vector3(100, 100, 100), //dont need this anymore
        buffer, 
        sun_decomposer);

}

function moon_init(buffer, attributes){

    var moon = new gameobject("moon");
    sky.add_child(moon);

    var moon_decomposer = new decomposer (
        [ MapToSS(0, 2),],
        new THREE.Vector2(1,1),
        [ 
          new THREE.Color(0xFFD27D),
        ],
        new THREE.Vector3(0, 0, 0),
        moon.transform,
        0,
        attributes,
        buffer.index,
    );
    
    moon.add_component(moon_decomposer);

    PopulateBuffer(
        new THREE.Vector3(0, -1000, 0), //dont need this anymore
        new THREE.Vector3(0, 0, 0), //dont need this anymore
        new THREE.Vector3(100, 100, 100), //dont need this anymore
        buffer, 
        moon_decomposer);

}
