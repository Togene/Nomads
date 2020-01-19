//TODO: Add diffrent region switches
function create_region (){
    
    //var new_region = lush;
    //new_region.isGassy = false;

    return lush;
}

function region(ColorPallette, Data, atmoSize, atmoThickness, 
                            hasLiquad, name, isGassy, customUrl)
{
    this.pallete = ColorPallette;
    this.data = Data;
    this.atmoSize = atmoSize;
    this.atmoThickness = atmoThickness;
    this.has_liquad = hasLiquad;
    this.name = name;
    this.is_gassy = isGassy;
    this.custom_url = customUrl;
}

//Customs Boimes
var cloud = new region (
    color_pallettes[0],
[
    new TerrainType("water deep", 0),
    new TerrainType("water shallow", 0.5)
], 0, 0, true, "cloud", 0, '');


var lush = new region(
    color_pallettes[1],
[
 new TerrainType("water deep", 0.0),
 new TerrainType("water Medium", 0.04),
 new TerrainType("water shallow", 0.21),
 new TerrainType("sand", .24),
 new TerrainType("grass", .32),
 new TerrainType("grass2", .59),
 new TerrainType("rocky", .7),
 new TerrainType("rocky2", .75),
 new TerrainType("rocky2", .82),
 new TerrainType("snowy", .88),
], 0, 0, true, "lush", 0, '');

var rock = new region(
    color_pallettes[4],
[
 new TerrainType("water deep", 0),
 new TerrainType("water deep", 0.1),
 new TerrainType("water deep", 0.2),
 new TerrainType("water shallow", 0.3),
 new TerrainType("sand", .56),
 new TerrainType("grass", .6),
 new TerrainType("rocky", .75),
 new TerrainType("snowy", .83)
], 0, 0, true, "rock", 0, '');

var primordial = new region(
    color_pallettes[6],
[
 new TerrainType("sand deep", 0),
 new TerrainType("water shallow", 0.35),
 new TerrainType("sand", .45),
 new TerrainType("grass", .48),
 new TerrainType("rocky", .52),
 new TerrainType("sand", .56),
 new TerrainType("grass", .6),
 new TerrainType("rocky", .75),
 new TerrainType("snowy", .83),
], 0, 0, true,"primordial", 0, '');

var frozen = new region(
    color_pallettes[7],
[
 new TerrainType("water deep", 0),
 new TerrainType("water shallow", .12),
 new TerrainType("sand", .23),
 new TerrainType("grass", .34),
 new TerrainType("rocky", .56),
 new TerrainType("water deep", .64),
 new TerrainType("water shallow", .75),
 new TerrainType("sand", .9),
], 0, 0, true,"frozen", 3, '');

var deadrock =  new region(
    color_pallettes[18],
[
 new TerrainType("water deep", 0),
 new TerrainType("water shallow", 0.1),
 new TerrainType("sand", .53),
 new TerrainType("water shallow"),
 new TerrainType("rocky", .75),
 new TerrainType("grass", .77),
 new TerrainType("rocky", .9),
], 0, 0, true,"deadrock", 0, '');

var peepee =  new region(
    color_pallettes[color_pallettes.length - 30],
[
 new TerrainType("water deep", 0),
 new TerrainType("water shallow", 0.1),
 new TerrainType("sand", .53),
 new TerrainType("water shallow", 0.6),
 new TerrainType("rocky", 0.7),
], 0, 0, true,"deadrock", 0,  'img/Maps/poonus_map.png');
