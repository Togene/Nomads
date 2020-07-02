function default_create(p, q) {
    var def = new gameobject("defualt", 
    new THREE.Vector3 (p.x, p.y, p.z), 
    new THREE.Vector3(1,1,1), q);
    
    def.add_component(new particle());

    def.add_component(new animator([
        new animation_sequence("walk", [new animation("walk", 0, 3)], 2, true), 
    ]));

    return def;
}