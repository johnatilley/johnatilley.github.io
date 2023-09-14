// Listen for form submit
var contactForm = document.getElementById( 'contactForm' )
if ( contactForm) {
    contactForm.addEventListener( 'submit', submitForm );
}

// Submit form
function submitForm ( e ) {
    e.preventDefault();

    //Get value
    var name = getInputVal( 'name' );
    var company = getInputVal( 'company' );
    var email = getInputVal( 'email' );
    var phone = getInputVal( 'phone' );
    var message = getInputVal( 'message' );

    $( '.jt-form__submit' ).addClass( 'loading' );
    $( '.jt-form__success-message' ).hide();

    $.ajax( "https://sendmessage-ye6o7rduqq-uc.a.run.app",
        {
            data: {
                name: name,
                company: company,
                email: email,
                phone: phone,
                message: message
            },
        } )
        .fail( function ( error ) {
            alert("Message failed to send");
            $( '.jt-form__submit' ).removeClass( 'loading' );
        } )
        .done( function ( result ) {
            if (result.status === "success") {
                $( '.jt-form__success-message' ).fadeIn();
            } else {
                alert("Message failed to send");
            }
            $( '.jt-form__submit' ).removeClass( 'loading' );
        } )

    // Clear form
    document.getElementById( 'contactForm' ).reset();
}

// // Function to get form value
function getInputVal ( id ) {
    return document.getElementById( id ).value;
}
