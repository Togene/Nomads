var cycle_length = 3;
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

    star_init(buffer, attributes);
    sun_init(buffer, attributes);
    moon_init(buffer, attributes);

    CreateInstance(
        "stars", 
        animated_sprites, 
        buffer, 
        attributes,
        SpriteSheetSize, 
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
    var raw_sky_index = Normalize(0, cycle_length, current_time) * sky_colors.length;

    sky_index = Math.floor(raw_sky_index);

    //need to figure out length to next color and lerp to it
    //current to next, length
    sky_lerp_index = raw_sky_index - sky_index;

    var current_color = new THREE.Color(sky_colors[sky_index].getHex()).lerp(
        sky_colors[(sky_index + 1) % sky_colors.length],
        sky_lerp_index);
    renderer.setClearColor(current_color.getHex(), 1 );

    sky.transform.rotation.y += 1;
}

//TODO: Create Star Map :|
function star_init(buffer, attributes){

    var stars = new gameobject("stars");
    sky.add_child(stars);
    var min_distance = 300;
    var max_distance = 500;

    for(var i = 0; i < 1000; i++){
        var star = new gameobject("star");
        stars.add_child(star);

        var direction = new THREE.Vector3(
            randomRange(-1, 1), 
            randomRange(-1, 1), 
            randomRange(-1, 1)
        );
        
        direction.normalize();

        stars.transform.position = new THREE.Vector3(
            direction.x * randomRange(min_distance, max_distance), 
            direction.y * randomRange(min_distance, max_distance), 
            direction.z * randomRange(min_distance, max_distance)
        );

        stars.transform.scale = new THREE.Vector3(
            25,
            25,
            25,
        );


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

        PopulateBuffer(
            star.transform.get_transformed_position(), //dont need this anymore
            star.transform.get_transformed_rotation(), //dont need this anymore
            new THREE.Vector3(15, 15, 15), //dont need this anymore
            buffer, 
            star_decomposer
            );
    }
}

function sun_init(buffer, attributes){

    var sun = new gameobject("sun");
    sky.add_child(sun);
    sun.transform.position = new THREE.Vector3(0, 1000, 0);

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

    PopulateBuffer(
        sun.transform.get_transformed_position(), //dont need this anymore
        sun.transform.get_transformed_rotation(), //dont need this anymore
        new THREE.Vector3(100, 100, 100), //dont need this anymore
        buffer, 
        sun_decomposer);

    console.log(buffer.index);
}

function moon_init(buffer, attributes){

    var moon = new gameobject("moon");
    sky.add_child(moon);
    moon.transform.position = new THREE.Vector3(0, -1000, 0);

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

    PopulateBuffer(
        moon.transform.get_transformed_position(), //dont need this anymore
        moon.transform.get_transformed_rotation(), //dont need this anymore
        new THREE.Vector3(100, 100, 100), //dont need this anymore
        buffer, 
        moon_decomposer);

    console.log(buffer.index);
}
