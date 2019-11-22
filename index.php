<html>
	<head>
	<title>NOMADS</title>
	<link type="text/css" rel="stylesheet" href="main.css">
		<style>
			#blocker {
				position: absolute;
				width: 100%;
				height: 100%;
				background-color: rgba(0,0,0,0.5);
			}
			#instructions {
				width: 100%;
				height: 100%;
				display: -webkit-box;
				display: -moz-box;
				display: box;
				-webkit-box-orient: horizontal;
				-moz-box-orient: horizontal;
				box-orient: horizontal;
				-webkit-box-pack: center;
				-moz-box-pack: center;
				box-pack: center;
				-webkit-box-align: center;
				-moz-box-align: center;
				box-align: center;
				color: #ffffff;
				text-align: center;
				font-family: Arial;
				font-size: 14px;
				line-height: 24px;
				cursor: pointer;
			}
		</style>
	</head>
		<body>
			<!-- JQuery <.< -->
			<script type="text/javascript" src="js/libs/JQ.js"></script>

			<script src = "js/libs/three.min.js"></script>
			<script src = "js/libs/PointerLockControls.js"></script>
			<script src = "data/resources.js"></script>
			<script src = "js/helpers/instance_geometry.js"></script>
			<script src = "js/helpers/antlion.js"></script>
			<script src = "js/helpers/utilities.js"></script>
			<script src = "js/helpers/matrix.js"></script>
			<script src = "js/helpers/quaternion.js"></script>
			<script src = "js/helpers/transform.js"></script>
			<script src = "js/helpers/gameobject.js"></script>
			<script src = "js/nomads/nomads.js"></script>

		<div id="blocker">

			<div id="instructions">
				<span style="font-size:36px">Click to play</span>
				<br /><br />
				Move: WASD<br/>
				Jump: SPACE<br/>
				Look: MOUSE
			</div>

		</div>
			<script src = "js/main.js"></script>

		</body>
</html>