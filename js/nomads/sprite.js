function sprite(metadata){
    this.decomposer = new decomposer(
        [ MapToSS(0, 0),],
        new THREE.Vector2(3, 1),
        [ new THREE.Color(0xff5a5b) ],
        new THREE.Vector3(0, 0, 0),
        crab.transform,
        SPRITE,
        attributes,
        buffer.index,
        0
    );
}

sprite.prototype.name = "sprite"