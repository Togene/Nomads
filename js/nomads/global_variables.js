const SOLID = 1;
const SPRITE = 0;
const PARTICLE = 3;

const SPRITE_SHEET_SIZE = new THREE.Vector2(8, 8);

// --------------- TIME ---------------- //
var ingame_time = 0;
// --------------- TIME --------------- //

const pixel = 0.03125;
const sprite_size = pixel * 32; // would be just 1 :| 

var WORLD_COLLISION_ARRAY = new Array();
var WORLD_OCCLUSION_ARRAY = new Array();
var WORLD_ANIM_OBJECTS = new Array();

var ZONE_MAP;

var WORLD_OBJECT = new THREE.Object3D();

var SEED = 123;
const W_TILE_SCALE = pixel * 2;