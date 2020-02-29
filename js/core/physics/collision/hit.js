function hit(col){
    this.collider = col;
    this.position = new THREE.Vector3();
    this.delta = new THREE.Vector3();
    this.normal = new THREE.Vector3();
    this.time = 0;
}