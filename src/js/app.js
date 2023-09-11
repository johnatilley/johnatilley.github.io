
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