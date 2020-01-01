//Get the Init from workers
var Physical = [];

this.addEventListener("message", function(evt) {
    //check which function to call from data[0]
    var token = evt.data[0];
    
    if(token == "init"){
        console.log("%cMap Generation Initialized", 'color: #FFC9DE');
        setTimeout(map_update, 0); // <-- start the physics update
    }
});

//for water and other enviromental effects
function map_update(){
    //    console.log("physics frame");
     //   setTimeout(physics_update, 1000);
};