const SOLID = 1;
const SPRITE = 0;
const PARTICLE = 3;

const sprite_sheet_size = new THREE.Vector2(8, 8);
var STATIC_BUFFER;
var DYNAMIC_BUFFER;

//------------- Sprite THREE.Object3D holders ---------
var animated_sprites = new THREE.Object3D();
var solid_sprites = new THREE.Object3D();
//--------------------------------------------

const pixel = 0.03125;
const sprite_size = pixel * 32; // would be just 1 :| 

const W_NUM_TILES = 1; //width x height of map

const W_TILE_SIZE = 255;
const TEXTURE_RESOLUTION = 256;
const TILE_GRID_SIZE = 16; //how many times is the tile chopped up into smaller bits
const WORLD_PHYSICAL = [];
var WORLD_COLLISION_ARRAY = new Array();

var WORLD_OBJECT = new THREE.Object3D();
var ANIM_WORLD_OBJECTS = new THREE.Object3D();

var SEED = 123;
const W_TILE_SCALE = pixel * 2;
var wire_framing = false;

var mapindex = [
    1,
];