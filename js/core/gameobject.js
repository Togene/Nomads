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

gameobject.prototype.update = function(delta){

    if(this.components != null){
        for(var i = 0; i < this.components.length; i++){
            this.components[i].update(delta);
        }
    }
    
    if(this.children != null){
        for(var i = 0; i < this.children.length; i++){
            this.children[i].update(delta);
        }
    }

    this.transform.update();
}

gameobject.prototype.add_component = function(c){
    this.components.push(c);
    c.set_parent(this);
}

gameobject.prototype.information = function(){
    console.log("Object:", this);
    console.log("Transform: ", this.transform);
}

gameobject.prototype.get_component = function(n){

    if(typeof n !== "string"){
        console.error("Must Be of Type String.");
        return null;
    }

    for(var i = 0; i < this.components.length; i++){
        if(this.components[i].name == n){
            return this.components[i];
        }
    }

    return null;
}

gameobject.prototype.has_component = function(n){
    
    if(typeof n !== "string"){
        console.error("Must Be of Type String.");
        return false;
    }

    for(var i = 0; i < this.components.length; i++){
        if(this.components[i].name == n){
            return true
        }
    }

    return false;
}

gameobject.prototype.name = "gameobject";