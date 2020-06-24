function gameobject(
    n = "default", 
    p = new THREE.Vector3(0,0,0), 
    s = new THREE.Vector3(1,1,1), 
    r = new quaternion(0,0,0,1)
){
    this.name = n;
    this.children = [];
    this.components = [];

    //TODO fix y position based on scale
    p.y -= s.y/2;
    this.transform = new transform (p, s, r);
    
    Scene.push(this);
};

gameobject.prototype.add_child = function(o){
    if(o !== this){
        this.children.push(o);
        o.set_parent(this);
        o.transform.set_parent(this.transform);
        o.update();
    } else {
        console.error("%c Cant Add Self!", 'background: #333; color: #bada55');
    }
}

gameobject.prototype.set_parent = function(p){
    this.parent = p;
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
    if(c == null){console.error(this.name + ": no component was given!"); return;}
    this.components.push(c);
    c.set_parent(this);
    this.add_requirements(c);
}

gameobject.prototype.add_requirements = function(c){

    if(c.requires == null){
        return;
    }

    for(var i = 0; i < c.requires.length; i++) {
        
        if(c.requires == "transform"){
            c.set_transform(this.transform);
            continue;
        }

        var component = this.get_component(c.requires[i]);
        if(component == null){
            console.error("component: " + "\"" + c.requires[i] + "\"" + " is missing")
        } else {
            c.set_requirements(component)
        }
    }
}

gameobject.prototype.information = function(){
    console.log("Object:", this);
    console.log("Transform: ", this.transform);
}

gameobject.prototype.get_component = function(n){
    var components = [];

    if(typeof n !== "string"){
        console.error("Must Be of Type String.");
        return null;
    }

    for(var i = 0; i < this.components.length; i++){
        if(this.components[i].name == n){
            components.push(this.components[i]);
        }
    }

    if(components.length == 0){
        return null;
    } else if (components.length == 1){
        return components[0];
    } else {
        return components;
    }
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

gameobject.prototype.components_toJSON = function(){
    var l = [];

    for(var i = 0; i < this.components.length; i++){
        l.push(this.components[i].toJSON());
    }

    return l;
}

gameobject.prototype.children_toJSON = function(){
    var l = [];

    for(var i = 0; i < this.children.length; i++){
        l.push(this.children[i].toJSON());
    }

    return l;
}

gameobject.prototype.toJSON = function(parent = false){

    if(parent){
        return{
            name: this.name,
        };
    } else {
        return{
            name: this.name,
            id: this.transform.position.x.toString() + this.transform.position.y.toString() + this.transform.position.z.toString(),
            position: this.transform.position,
            rotation: this.transform.rotation,
            scale: this.transform.scale,
            parent: (this.parent == null) ?  null : this.parent.toJSON(true),
            components: this.components_toJSON(),
            children: this.children_toJSON()
        };
    }

}

gameobject.prototype.name = "gameobject";