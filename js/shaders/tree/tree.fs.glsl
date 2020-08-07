		precision highp float;
		uniform sampler2D map;
		varying vec2 vUv;
		varying vec4 colorPass;

		uniform vec3 fogColor;
		uniform float fogNear;
		uniform float fogFar;

		uniform float time;
		varying float animation_time_pass;
		uniform float animationSwitch;
		varying float fog_pass;

		uniform float is3D;

		varying vec2 animationframePass;
		varying vec2 uvoffsetPass;
		varying vec2 spritesheetsizePass;

		uniform vec3 cameraPosition;
		varying vec2 viewDirection;
		varying vec4 posWorld;

		varying vec3 forward;

		varying float animation_start_pass;
		varying float animation_end_pass;
		
		varying vec2 tile_size_pass;

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
		
		//uv - animationframePass;

		void main() {
			float uvTime = 1.0;
			vec2 uvIndex = vec2(1.0);

			vec4 tex = texture2D(map, vec2(vUv.x, vUv.y));
			vec4 tex2 = texture2D(map, vec2(vUv.x + 1.0/8.0, vUv.y));
			vec4 tex3 = texture2D(map, vec2(vUv.x + 2.0/8.0, vUv.y));

			if (tex.a < 1.0 && tex2.a < 1.0 && tex3.a < 1.0) 
			discard;
			
			gl_FragColor = (vec4(colorPass));

			if(fog_pass == 1.0)
			{
				float depth = (gl_FragCoord.z / gl_FragCoord.w);

				float fogFactor = smoothstep( fogNear, fogFar, depth * 3.0);
				gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor);
			}

		}
