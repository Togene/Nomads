		varying vec2 vUv;

 		//uniform vec3 lightpos;
		
		varying vec3 vecNormal;

		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHTS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];
		varying vec4 worldPosition;
		varying vec3 viewDirection;
		uniform vec3 SunLightPosition;
		
		void main() 
		{	
			vUv = uv;
			
			vec3 transformed = vec3( position );

			worldPosition =  modelMatrix * vec4(position, 1.0);

			vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);


			vecNormal = (normalMatrix  * vec3(normal)).xyz;

			vec4 eyepos = modelViewMatrix * vec4 (position, 1.0);
			//vec4 lighteye = viewMatrix * vec4 (lightpos, 1.0);
			
			//vec4 tmp = modelViewMatrix * vec4 (lightpos, 1.0);

			

			viewDirection = normalize((worldPosition.xyz - cameraPosition.xyz));

			 // store the world position as varying for lighting
			
			gl_Position = projectionMatrix * mvPosition;

			for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

				vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * worldPosition;
			}
		}