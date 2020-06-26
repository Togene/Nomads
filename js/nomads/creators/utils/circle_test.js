function circle_create(p, q) {
    CIRCLE_RENDERER = new instance_renderer(
        6,
        SOLID_SPRITES,
        true,
        true
    )

    var circle = new gameobject("circle", 
    new THREE.Vector3 (p.x, p.y + 1, p.z), 
    new THREE.Vector3(2,2,2), q);
    
    circle.add_component(new decomposer(
        get_meta().circle,
        PARTICLE,
        CIRCLE_RENDERER,
    ));

    circle.add_component(new animator([
        new animation_sequence("walk", [new animation("walk", 0, 3)], 2, true), 
    ]));


    CIRCLE_RENDERER.bake_buffer();
    return circle;
}