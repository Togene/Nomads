﻿<html>
	<head>
	<title>NOMADS</title>
	<link type="text/css" rel="stylesheet" href="css/ui.css">

	</head>
		<body>
			<!-- JQuery <.< -->
			<script type="text/javascript" src="js/libs/JQ.js"></script>
			<!-- THREE libs -->
			<script src = "js/libs/stats.min.js"></script>
			<script src = "js/libs/three.min.js"></script>
			
			<script src = "js/libs/EffectComposer.js"></script>
			
			<script src = "js/libs/ConvolutionShader.js"></script>
			<script src = "js/libs/BloomPass.js"></script>
			<script src = "js/libs/RenderPass.js"></script>
		
			<script src = "js/libs/CopyShader.js"></script>
			<script src = "js/libs/ShaderPass.js"></script>
			
			<script src = "js/libs/PointerLockControls.js"></script>
			
			<script src = "js/nomads/global_variables.js"></script>
			<script src = "js/core/geometry/polygon2D.js"></script>

			<!--                 INSTANCE GEOMETRY                       -->
			<script src = "js/core/instance_geometry/instance_buffer.js"></script>
			<script src = "js/core/instance_geometry/instance_attributes.js"></script>
			<script src = "js/core/instance_geometry/decomposer.js"></script>
			<script src = "js/core/instance_geometry/batch_decomposer.js"></script>
			<!--                 INSTANCE GEOMETRY                       -->

			<script src = "data/dither.js"></script>
			<script src = "data/resources.js"></script>	
			<script src = "js/core/file/file_helpers.js"></script>

			<script src = "js/core/utilities.js"></script>
			<script src = "js/core/antlion.js"></script>
			<script src = "js/core/workers.js"></script>
			<script src = "js/core/color_utilities.js"></script>
			<script src = "js/core/animation/animation.js"></script>
			<script src = "js/core/animation/animator.js"></script>
			<script src = "js/core/animation/animation_sequence.js"></script>
			<script src = "js/core/vector3_extensions.js"></script>
			<script src = "js/core/matrix.js"></script>
			<script src = "js/core/quaternion.js"></script>
			<script src = "js/core/transform.js"></script>

			<script src = "js/core/GUI/text.js"></script>

			<script src = "js/core/physics/rigidbody.js"></script>

			<script src = "js/core/decube.js"></script>
			<script src = "js/core/gameobject.js"></script>
			<script src = "js/core/quadtree.js"></script>

			<script src = "js/nomads/world/generator_utilities/1D_noise.js"></script>
			<script src = "js/nomads/world/generator_utilities/2D_noise.js"></script>
			<script src = "js/nomads/world/generator_utilities/falloff.js"></script>
			<script src = "js/nomads/world/generator_utilities/map_generator.js"></script>
			<script src = "js/nomads/world/generator_utilities/noise_from_texture.js"></script>
			<script src = "js/nomads/world/generator_utilities/regions.js"></script>

			<script src = "js/nomads/creators/utils/yard_stick.js"></script>
			<script src = "js/nomads/creators/utils/circle_test.js"></script>
			<script src = "js/nomads/creators/utils/default.js"></script>
			<script src = "js/nomads/creators/structures/box.js"></script>
			<script src = "js/nomads/creators/structures/house.js"></script>
			<script src = "js/nomads/creators/creatures/crab.js"></script>
			<script src = "js/nomads/creators/enviroment/tree_01.js"></script>
			<script src = "js/nomads/creators/entities/lithy.js"></script>

			<script src = "js/nomads/zone.js"></script>
			<script src = "js/nomads/player.js"></script>
			<script src = "js/nomads/collision.js"></script>
			<script src = "js/nomads/physics.js"></script>
			<script src = "js/nomads/controller.js"></script>

			<script src = "js/nomads/nomads.js"></script>
			<script src = "js/rendering/renderer.js"></script>
			<script src = "js/rendering/rendering_pool.js"></script>

			<script src = "js/nomads/gui/pause.js"></script>

			<script src = "js/nomads/input/keyboard.js"></script>

			<!-- world -->
				<script src = "js/nomads/world/tile_generator.js"></script>
				<script src = "js/nomads/world/world.js"></script>
				<script src = "js/nomads/world/sky.js"></script>
			<!-- world -->
			
		
		<div id="blocker">
			<div id="pause_screen">
				<span style="font-size:36px">PAUSED</span>
				<br /><br />
			</div>
		</div>
			<script src = "js/main.js"></script>

		</body>
</html>