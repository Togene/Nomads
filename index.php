<html>
	<head>
	<title>NOMADS</title>
	<link type="text/css" rel="stylesheet" href="css/ui.css">

	</head>
		<body>
			<!-- JQuery <.< -->
				<script type="text/javascript" src="js/libs/JQ.js"></script>
			<!-- THREE libs -->
				<script src = "js/libs/three.min.js"></script>
				<script src = "js/libs/PointerLockControls.js"></script>
			<!-- THREE libs -->
			
			<script src = "data/dither.js"></script>
			<script src = "data/resources.js"></script>	
			<script src = "js/core/file/file_helpers.js"></script>
			
			<script src = "js/core/utilities.js"></script>
			<script src = "js/core/antlion.js"></script>
			<script src = "js/core/workers.js"></script>
			<script src = "js/core/color_utilities.js"></script>
			<script src = "js/core/instance_geometry.js"></script>
			
			<script src = "js/core/animation/animation.js"></script>
			<script src = "js/core/animation/animator.js"></script>
			<script src = "js/core/animation/animation_sequence.js"></script>

			<script src = "js/core/vector3_extensions.js"></script>
			<script src = "js/core/matrix.js"></script>
			<script src = "js/core/quaternion.js"></script>
			<script src = "js/core/transform.js"></script>

			<script src = "js/core/GUI/text.js"></script>

			<script src = "js/core/physics/rigidbody.js"></script>
			<script src = "js/core/physics/collision/edge.js"></script>
			<script src = "js/core/physics/collision/sphere.js"></script>
			<script src = "js/core/physics/collision/sutherland_hodgman.js"></script>
			<script src = "js/core/physics/collision/projection.js"></script>
			<script src = "js/core/physics/collision/ray.js"></script>
			<script src = "js/core/physics/collision/sweep.js"></script>
			<script src = "js/core/physics/collision/hit.js"></script>
			<script src = "js/core/physics/collision/aabb.js"></script>

			<script src = "js/core/decomposer.js"></script>
			<script src = "js/core/decube.js"></script>
			<script src = "js/core/gameobject.js"></script>
			<script src = "js/core/quadtree.js"></script>
	
			<script src = "js/nomads/world/tile_generator.js"></script>
			<script src = "js/nomads/world/world.js"></script>

			<script src = "js/nomads/world/generator_utilities/1D_noise.js"></script>
			<script src = "js/nomads/world/generator_utilities/2D_noise.js"></script>
			<script src = "js/nomads/world/generator_utilities/falloff.js"></script>
			<script src = "js/nomads/world/generator_utilities/map_generator.js"></script>
			<script src = "js/nomads/world/generator_utilities/noise_from_texture.js"></script>
			<script src = "js/nomads/world/generator_utilities/regions.js"></script>
						
			<script src = "js/nomads/components/brain.js"></script>
			<script src = "js/nomads/components/interaction.js"></script>

			<script src = "js/nomads/yard_stick.js"></script>
			<script src = "js/nomads/box.js"></script>
			<script src = "js/nomads/fauna.js"></script>
			<script src = "js/nomads/flora.js"></script>
			<script src = "js/nomads/humanoids.js"></script>
			<script src = "js/nomads/structures.js"></script>

			<script src = "js/nomads/player.js"></script>
			<script src = "js/nomads/collision.js"></script>
			<script src = "js/nomads/physics.js"></script>
			<script src = "js/nomads/controller.js"></script>


			<script src = "js/nomads/nomads.js"></script>
			<script src = "js/rendering/renderer.js"></script>
			<script src = "js/rendering/rendering_pool.js"></script>
			<script src = "js/nomads/sky.js"></script>

			<script src = "js/nomads/gui/pause.js"></script>

			<script src = "js/nomads/input/mouse.js"></script>
			<script src = "js/nomads/input/keyboard.js"></script>

			
		
		<div id="blocker">
			<div id="pause_screen">
				<span style="font-size:36px">PAUSED</span>
				<br /><br />
			</div>
		</div>
			<script src = "js/main.js"></script>

		</body>
</html>