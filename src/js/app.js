
$( document ).ready( function () {
    $( "#js-nav-toggle" ).on( "click", function () {
        if ( $( "#js-nav-toggle-target" ).hasClass( "mobile-nav-open" ) ) {
            $( "#js-nav-toggle-target" ).removeClass( "mobile-nav-open" );
        } else {
            $( "#js-nav-toggle-target" ).addClass( "mobile-nav-open" );
        }
    } );


    $( window ).scroll( function () {
        headerScrolled();
    } );

    headerScrolled();
} );

function headerScrolled () {
    if ( $( this ).scrollTop() >= 60 ) {
        $( "#js-header" ).addClass( "header-scrolled" );
    } else {
        $( "#js-header" ).removeClass( "header-scrolled" );
    }
}

// Hero image parallax effect

$( document ).ready( function () {
    var heroPanel = document.getElementById( "js-hero-panel" );
    console.log( heroPanel );
    if ( heroPanel ) {
        window.addEventListener( "scroll", heroParallax );
        window.addEventListener( "mousemove", heroParallax );
        console.log( "heroPanel exists" );
    } else {
        console.log( "heroPanel does not exist" );
    }
} );

var mouseX = 0;
var mouseY = 0;

function heroParallax ( e ) {
    var heroPanel = document.getElementById( "js-hero-panel" );
    var heroPanelRect = heroPanel.getBoundingClientRect();

    // Check the hero panel is in view
    if ( heroPanelRect.bottom > 0 ) {
        if ( e.clientX ) { mouseX = e.clientX; }
        if ( e.clientY ) { mouseY = e.clientY; }

        var xDistance = mouseX - ( heroPanelRect.left + ( heroPanel.offsetWidth / 2 ) );
        var yDistance = mouseY - ( heroPanelRect.top + ( heroPanel.offsetHeight / 2 ) );

        heroPanel.style.setProperty( "--xDistance", xDistance + "px" );
        heroPanel.style.setProperty( "--yDistance", yDistance + "px" );
    }

}