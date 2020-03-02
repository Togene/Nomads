		precision highp float;
		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		//vertex position
		attribute vec3 position;

		attribute vec3 translation;
		attribute vec4 orientation;
		attribute vec3 scale;
		attribute vec3 col;
		attribute vec2 uv;
		attribute vec2 uvoffset;
	
		attribute float type;
		attribute float fog;
		varying float fog_pass;

		varying vec2 vUv;
		uniform float spriteSheetX;
		uniform float spriteSheetY;
		
		attribute vec2 animationFrame;
		uniform float time;
		uniform float animationSwitch;
	

		varying vec2 framePass;
		varying vec3 colorPass;
		varying vec2 uvoffsetPass;
		varying vec2 spritesheetsizePass;

		uniform mat4 viewMatrix;
		uniform mat4 modelMatrix;
		uniform vec3 cameraPosition;
		varying vec2 viewDirection;
		varying vec4 posWorld;
		varying vec4 rotation;

		attribute vec4 m0;
		attribute vec4 m1;
		attribute vec4 m2;
		attribute vec4 m3;

		varying vec3 forward;

		vec4 q_mul(vec4 ql, vec4 qr){
			float _w = (ql.w * qr.w) - (ql.x * qr.x) - (ql.y * qr.y) - (ql.z * qr.z);
       		float _x = (ql.x * qr.w) + (ql.w * qr.x) + (ql.y * qr.z) - (ql.z * qr.y);
       		float _y = (ql.y * qr.w) + (ql.w * qr.y) + (ql.z * qr.x) - (ql.x * qr.z);
        	float _z = (ql.z * qr.w) + (ql.w * qr.z) + (ql.x * qr.y) - (ql.y * qr.x);
			return vec4(_x, _y, _z, _w);
		}

		vec4 v_mul(vec4 ql, vec3 v){
			float _w = (-ql.x * v.x) - (ql.y * v.y) - (ql.z * v.z);
			float _x = ( ql.w * v.x) + (ql.y * v.z) - (ql.z * v.y);
			float _y = ( ql.w * v.y) + (ql.z * v.x) - (ql.x * v.z);
			float _z = ( ql.w * v.z) + (ql.x * v.y) - (ql.y * v.x);
			return vec4(_x, _y, _z, _w);
		}

		vec4 conjugate(vec4 q){
			return vec4(-q.x, -q.y, -q.z, q.w);
		}

		vec3 rotate(vec3 v, vec4 q){
			vec4 conj = conjugate(q);
			
			vec4 w = q_mul(v_mul(q, v), conj);

			return vec3(w.x, w.y, w.z);
		}

		// http://www.geeks3d.com/20141201/how-to-rotate-a-vertex-by-a-quaternion-in-glsl/
		vec3 applyQuaternionToVector( vec4 q, vec3 v ){
			return v + 2.0 * cross( q.xyz, cross( q.xyz, v ) + q.w * v );
		}

		vec3 transform(inout vec3 position, vec3 T, vec4 R, vec3 S){
			//applies the scale
			position *= S;
			
			//compute rotaiton where R is a quaternion
			position += 2.0 * cross(R.xyz, cross(R.xyz, position) + R.w * position);

			//translate that bitch
			position += T;
			
			return position;
		}

		void main() {
			
			rotation = orientation;
			forward = normalize(rotate(vec3(0, 0, 1), rotation));

			vec4 finalPosition = vec4(0);
			mat4 transform_matrix = mat4(m0, m1, m2, m3);

			if(type == 0.0){
				//---------------------------------------------------Normal Sprite ---------------------------------------------------
				/* Sprites Face The Camera*/
				vec4 mvPosition = viewMatrix * transform_matrix * vec4( translation * 1.0, 1.0 );
				mvPosition.xyz += (position * scale);
				finalPosition = projectionMatrix * mvPosition;
				//---------------------------------------------------Normal Sprite ---------------------------------------------------
			} else if (type == 1.0){
				//---------------------------------------------------Solid Sprite ---------------------------------------------------
				/* Sprites Dont Face The Camera*/
				vec3 pos = position;
				mat4 MVP =  projectionMatrix * viewMatrix * transform_matrix;
				finalPosition = MVP * vec4(position, 1.0 ) ; 
				//---------------------------------------------------Solid Sprite ---------------------------------------------------
			}

			vUv = vec2((uv.x/spriteSheetX) + (uvoffset.x), (uv.y/spriteSheetY) + (uvoffset.y));
			
			//viewdirection
			posWorld = transform_matrix * vec4((translation),1.0);
			viewDirection = normalize((posWorld.xz - cameraPosition.xz));	
			//---------------------------------------------------------

			colorPass = col.rgb;
			framePass = animationFrame;
			uvoffsetPass = uvoffset;
			spritesheetsizePass = vec2(spriteSheetX, spriteSheetY);	
		
			fog_pass = fog;
			gl_Position = finalPosition;
		}