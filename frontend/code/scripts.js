$(document).ready(function(){
    // Attach a submit handler to the forms
    $( "form" ).submit(function( event ) {
        // Stop forms from submitting normally
        event.preventDefault();

        // Get some values from elements on the form:
        var $form = $( this ),
            url = $form.attr( "action" );

        // Send the data using post
        var posting = $.post( url );

        // Put the results in a div
        posting.done(function( data ) {
            var content = $( data ).find( "#content" );
            $( "#result" ).empty().append( content );
        });
    });
});