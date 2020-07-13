function circle_create(p, q) {
    var circle = new gameobject("circle", 
    new THREE.Vector3 (p.x, p.y + 1, p.z), 
    new THREE.Vector3(2,2,2), q);
    
    circle.add_component(new sprite(
        get_meta().circle,
    ));

    circle.add_component(new animator([
        new animation_sequence("walk", [new animation("walk", 0, 3)], 2, true), 
    ]));

    return circle;
}