aabb.prototype.intersect_segement = function(position, delta, pad_x, pad_z, pad_y){
    const scale_x = 1.0 / delta.x;
    const scale_z = 1.0 / delta.z;

    //y-component add
    const scale_y = 1.0 / delta.y;

    const sign_x = Math.sign(scale_x);
    const sign_z = Math.sign(scale_z);
    
    //y-component add
    const sign_y = Math.sign(scale_y);

    const near_time_x = (this.centre.x - sign_x * (this.w + pad_x) - position.x) * scale_x;
    const near_time_z = (this.centre.z - sign_z * (this.d + pad_z) - position.z) * scale_z;

    //y-component add
    const near_time_y = (this.centre.y - sign_y * (this.h + pad_y) - position.y) * scale_y;

    const far_time_x = (this.centre.x + sign_x * (this.w + pad_x) - position.x) * scale_x;
    const far_time_z = (this.centre.z + sign_z * (this.d + pad_z) - position.z) * scale_z;

    //y-component add
    const far_time_y = (this.centre.y + sign_y * (this.h + pad_y) - position.y) * scale_y;

    if(
    near_time_x > far_time_z || 
    near_time_x > far_time_y || 
    near_time_z > far_time_x ||
    near_time_z > far_time_y ||
    near_time_y > far_time_x ||
    near_time_y > far_time_z){
        return null;}
    
    //|| near_time_y > far_time_y

    var near_time_zx = near_time_x > near_time_z ? near_time_x : near_time_z;
    const near_time = near_time_zx > near_time_y ? near_time_zx : near_time_y;

    var far_time_zx = far_time_x < far_time_z ? far_time_x : far_time_z;
    const far_time = far_time_zx < far_time_y ? far_time_zx : far_time_y

    if(near_time >= 1 || far_time <= 0){return null;}

    const h = new hit(this);
    h.time = clamp(near_time, 0, 1);

    if(near_time_x > near_time_z){
        h.normal.x = -sign_x;
        h.normal.z = 0;
    } else {
        h.normal.x = 0;
        h.normal.z = -sign_z;
    }

    h.delta.x = (1.0 - h.time) * -delta.x;
    h.delta.z = (1.0 - h.time) * -delta.z;

    h.position.x = position.x + delta.x * h.time;
    h.position.z = position.z + delta.z * h.time;

    return h;
}

aabb.prototype.intersect_aabb = function(right){
    const dx = right.centre.x - this.centre.x;
    //half is just c + w
    const px = right.w + this.w - Math.abs(dx);

    if(px <= 0){return null;}

    const dz = right.centre.z - this.centre.z;
    const pz = right.d + this.d - Math.abs(dz);

    if(pz <= 0){return null;}

    const h = new hit(this);

    if(px < pz){
        const sx = Math.sign(dx);
        h.delta.x = px * sx;
        h.normal.x = sx;
        h.position.x = this.centre.x + this.w * sx;
        h.position.z = right.centre.z;
    } else {
        const sz = Math.sign(dz);
        h.delta.z = pz * sz;
        h.normal.z = sz;
        h.position.x = right.centre.x;
        h.position.z = this.centre.z + this.d * sz;
    }

    return h;
}

aabb.prototype.intersect_sweep_aabb = function(right, delta){
    const sw = new sweep();

    if(delta.x === 0 && delta.z === 0){
        sw.position.x = right.centre.x;
        sw.position.z = right.centre.z;
        sw.hit = this.intersect_aabb(right);
        sw.time = sw.hit != null ? (sw.hit.time = 0) : 1;
        return sw;
    }

    sw.hit = this.intersect_segement(right.centre, delta, right.w, right.d, right.h);
    
    if(sw.hit != null){
        sw.time = clamp(sw.hit.time - EPSILON, 0, 1);
        sw.position.x = right.centre.x + delta.x * sw.time;
        sw.position.z = right.centre.z + delta.z * sw.time;

        const direction = delta.clone();
        direction.normalize();

        sw.hit.position.x = clamp(
            sw.hit.position.x + direction.x * right.w,
            this.centre.x - this.w,
            this.centre.x + this.w 
        );

        sw.hit.position.z = clamp(
            sw.hit.position.z + direction.z * right.d,
            this.centre.z - this.d ,
            this.centre.z + this.d 
        );
    } else {
        sw.position.x = right.centre.x + delta.x;
        sw.position.z = right.centre.z + delta.z;
        sw.time = 1;
    }

    return sw;
}