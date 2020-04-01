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
	
		varying vec2 animationframePass;

		attribute float animation_start;
		attribute float animation_end;

		varying float animation_start_pass;
		varying float animation_end_pass;

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

		mat4 transpose(mat4 mat){
			vec4 i0 = mat[0];
			vec4 i1 = mat[1];
			vec4 i2 = mat[2];
			vec4 i3 = mat[3];

			return mat4(
				vec4(i0.x, i1.x, i2.x, i3.x),
				vec4(i0.y, i1.y, i2.y, i3.y),
				vec4(i0.z, i1.z, i2.z, i3.z),
				vec4(i0.w, i1.w, i2.w, i3.w)
			);
		}

		//void get_rotation(mat4 mat, vec3 in yaw, vec3 in pitch, vec3 in roll){
		//	if(mat[0][0] == 1.0)
		//}

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

			mat4 view_matrix_transpose = transpose(viewMatrix);
			mat4 S2 = view_matrix_transpose * viewMatrix;	

			
			//viewdirection
			posWorld = transform_matrix * vec4((translation),1.0);
			viewDirection = normalize((posWorld.xz - cameraPosition.xz));	
		
			//---------------------------------------------------------

			if(type == 0.0){
				//---------------------------------------------------Normal/3D Sprite ---------------------------------------------------
				/* Sprites Face The Camera in Y Axis*/

				mat4 modelview = viewMatrix * transform_matrix;

				modelview[0][0] = 1.0;
				modelview[0][1] = 0.0;
				modelview[0][2] = 0.0;

				//modelview[1][0] = 0.0;
				//modelview[1][1] = 1.0;
				//modelview[1][2] = 0.0;

				modelview[2][0] = 0.0;
				modelview[2][1] = 0.0;
				modelview[2][2] = 1.0;

				vec4 mvPosition =  modelview * vec4(((position  * scale) + translation) ,  1.0 );
				
				finalPosition = projectionMatrix * mvPosition;

				//REMMMEBER THAT POSITION IS THE POSITION OF THE ENTIRE OBJECT!
				//ALL HUMNIONDS/TREES/CRABS ARE UNDER A SINGLE OBJECT SO U NEED POSITION + TRANSLATION

				//---------------------------------------------------Normal/3D Sprite ---------------------------------------------------
			} else if (type == 3.0){
			/* Sprites Face The Camera*/
				vec4 mvPosition =  viewMatrix * transform_matrix * vec4(translation ,  1.0 );
				mvPosition.xyz += (position  * scale);
				finalPosition = projectionMatrix * mvPosition;

			} else if (type == 1.0){
				//---------------------------------------------------Solid Sprite ---------------------------------------------------
				/* Sprites Dont Face The Camera*/
				vec3 pos = position;
				mat4 MVP =  projectionMatrix * viewMatrix * transform_matrix;
				finalPosition = MVP * vec4(position, 1.0 ) ; 
				//---------------------------------------------------Solid Sprite ---------------------------------------------------
			}

			vUv = vec2((uv.x/spriteSheetX) + (uvoffset.x), (uv.y/spriteSheetY) + (uvoffset.y));


			colorPass = col.rgb;

			animationframePass = animationFrame;
			uvoffsetPass = uvoffset;

			spritesheetsizePass = vec2(spriteSheetX, spriteSheetY);	


			animation_start_pass = animation_start;
			animation_end_pass = animation_end;

			fog_pass = fog;
			gl_Position = finalPosition;
		}