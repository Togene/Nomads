function gameobject(n = "default", child = [], comp = []){
    this.name = n;
    this.children = child;
    this.components = comp;
    this.transform = new transform (
        new THREE.Vector3(0,0,0),
        new THREE.Vector3(1,1,1),
        new quaternion(0,0,0,1),
    );
    Scene.push(this);
};

gameobject.prototype.add_child = function(o){
    if(o !== this){
        this.children.push(o);
        o.transform.set_parent(this.transform);
    } else {
        console.error("%c Cant Add Self!", 'background: #333; color: #bada55');
    }
}

gameobject.prototype.update = function(){

    this.transform.update();

    if(this.components != null){
        for(var i = 0; i < this.components.length; i++){
            this.components[i].update();
        }
    }
    
    if(this.children != null){
        for(var i = 0; i < this.children.length; i++){
            this.children[i].update();
        }
    }
}

gameobject.prototype.add_componenent = function(c){
    this.components.push(c);
    c.set_parent(this);
}

gameobject.prototype.information = function(){
    console.log("Object:", this);
    console.log("Transform: ", this.transform);
}
