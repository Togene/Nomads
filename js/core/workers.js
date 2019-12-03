var map_gen_worker;

if (window.Worker) {
    console.log("Worker Created.");
    map_gen_worker = new Worker('js/nomads/map_generator.js');

    //physics update?
    map_gen_worker.postMessage(["init"]);
}
