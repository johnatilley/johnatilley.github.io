
$( document ).ready( function () {
    // Mobile Nav
    $( "#js-nav-toggle" ).on( "click", function () {
        if ( $( "#js-nav-toggle-target" ).hasClass( "mobile-nav-open" ) ) {
            $( "#js-nav-toggle-target" ).removeClass( "mobile-nav-open" );
        } else {
            $( "#js-nav-toggle-target" ).addClass( "mobile-nav-open" );
        }
    } );

    // Page Scrolling
    $( window ).scroll( function () {
        headerScrolled();
    } );

    headerScrolled();

    // Hero image parallax effect
    var heroPanel = document.getElementById( "js-hero-panel" );
    if ( heroPanel ) {
        window.addEventListener( "scroll", heroParallax );
        window.addEventListener( "mousemove", heroParallax );
    }
} );

// Page Scrolling
function headerScrolled () {
    if ( $( this ).scrollTop() >= 60 ) {
        $( "#js-header" ).addClass( "header-scrolled" );
    } else {
        $( "#js-header" ).removeClass( "header-scrolled" );
    }
}

// Hero image parallax effect
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

