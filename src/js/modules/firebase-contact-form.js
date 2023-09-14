// // Initialize Firebase
// var config = {
//     apiKey: "AIzaSyD5bCyvYm5adElW2tllyfYH-CXnyQdUxVY",
//     authDomain: "contactform-2086d.firebaseapp.com",
//     databaseURL: "https://contactform-2086d.firebaseio.com",
//     projectId: "contactform-2086d",
//     storageBucket: "contactform-2086d.appspot.com",
//     messagingSenderId: "35839015044"
// };
// firebase.initializeApp( config );

// // Reference messages collection
// var messagesRef = firebase.database().ref( 'messages' );

// // Listen for form submit
document.getElementById( 'contactForm' ).addEventListener( 'submit', submitForm );

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
            $( '.jt-form__submit' ).removeClass( 'loading' );
            $( '.jt-form__success-message' ).fadeIn();
        } )

    // Clear form
    document.getElementById( 'contactForm' ).reset();
}

// // Function to get form value
function getInputVal ( id ) {
    return document.getElementById( id ).value;
}
