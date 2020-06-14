var pause_screen;
var blocker;
var override = false;

function pause_init(){
    pause_screen = document.getElementById( 'pause_screen' );
    blocker = document.getElementById( 'blocker' );

    pause_screen.addEventListener( 'click', function (e) {
        controls.lock();
    }, false );

    controls.addEventListener( 'lock', function () {
            if(!override) pause_hide();
     } );

    controls.addEventListener( 'unlock', function () {
            if(!override) pause_show();
     } );
    
}

function pause_show(){
   blocker.style.display = 'block';
   pause_screen.style.display = '';
}

function pause_hide(){
    pause_screen.style.display = 'none';
    blocker.style.display = 'none';
}