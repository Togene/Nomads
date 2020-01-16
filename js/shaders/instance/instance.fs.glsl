		precision highp float;
		uniform sampler2D map;
		varying vec2 vUv;
		varying vec3 colorPass;

		uniform vec3 fogColor;
		uniform float fogNear;
		uniform float fogFar;

		uniform float time;
		uniform float animationSwitch;
		uniform float is3D;

		varying vec2 framePass;
		varying vec2 uvoffsetPass;
		varying vec2 spritesheetsizePass;

		uniform vec3 cameraPosition;
		varying vec2 viewDirection;
		varying vec4 posWorld;

		varying vec4 rotation;
		
		const float PI = 3.1415926535897932384626433832795;

		float AbsoluteAngle(float angle) {
    		return (mod(angle, 360.0)) >= 0.0 ? angle : (angle + 360.0);
		}
		
		// Author @patriciogv - 2015
		// http://patriciogonzalezvivo.com
		float random (vec2 st) {
				return fract(sin(dot(st.xy,
									vec2(12.9898,78.233)))*
					43758.5453123);
		}

		void main() {
			float uvTime = 1.0;
			vec2 uvIndex = vec2(1.0);

			if(animationSwitch == 1.0){
			
				float angle = (atan(viewDirection.y, viewDirection.x)) * (180.0 / PI)  - rotation.y;
				float offset = (PI / 4.0) * (180.0 / PI);

				float dagrees = AbsoluteAngle(angle + offset);

				//normaledAngle = (normaledAngle * 2) - 1;
				float normalizedAngle = dagrees / 360.0;

				float index = ceil(mod(normalizedAngle * 4.0, 4.0) - 1.0);

				uvTime = time;
				float randx = clamp(random(framePass), 0.0, framePass.x);
				float timeOffsetX = ceil(mod(time*2.0, (framePass.x))-1.0)/spritesheetsizePass.x;
				
				float yUvOffset = vUv.y;

				if(is3D == 1.0){
					yUvOffset += (index - uvoffsetPass.y)/spritesheetsizePass.y;
				}

				uvIndex = vec2(vUv.x + (timeOffsetX - uvoffsetPass.x), yUvOffset);
				
			} else {
				uvIndex = vec2(vUv.x, vUv.y);
			}

			vec4 tex = texture2D( map, uvIndex);

			if (tex.a != 1.0) 
			discard;

			gl_FragColor = (tex * vec4(colorPass, 1.0) * vec4(fogColor,1.0));

			float depth = (gl_FragCoord.z / gl_FragCoord.w);

          	float fogFactor = smoothstep( fogNear, fogFar, depth * 3.0);
          	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor);

		}
