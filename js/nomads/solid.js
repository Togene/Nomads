function solid(){
    this.decomposer = new decomposer(
        [ MapToSS(0, 1),],
        new THREE.Vector2(1, 1),
        [ new THREE.Color(0x78664c) ],
        new THREE.Vector3(0, 0, 0),
        face.transform,
        SOLID,
        attributes,
        buffer.index,
        0,
    );
}

solid.prototype.name = "solid"