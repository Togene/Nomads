function circle_create(p, q) {
    CIRCLE_RENDERER = new instance_renderer(
        6,
        SOLID_SPRITES,
        false,
        false
    )

    var circle = new gameobject("circle", 
    new THREE.Vector3 (p.x, p.y + 1, p.z), 
    new THREE.Vector3(2,2,2), q);
    
    circle.add_component(new decomposer(
        get_meta().circle,
        SOLID,
        CIRCLE_RENDERER,
    ));

    CIRCLE_RENDERER.bake_buffer();
    return circle;
}