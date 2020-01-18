var world_gen_worker;

function get_to_work(m){
    if (window.Worker) {
        console.log("World Worker Created.");
        world_worker = new Worker('js/nomads/world/world.js');
    
        world_worker.postMessage(["init"]);
    }
}