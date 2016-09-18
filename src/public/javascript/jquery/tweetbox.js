// Initially disable the button
$('button').prop("disabled", true);

// When the value of the text area changes...
$('textarea').on('input', function() {
    // If there's at least one character...
    if ($(this).val().length > 0) {
        // Enable the button.
        $('button').prop('disabled', false);
    } else {
        // Else, disable the button.
        $('button').prop('disabled', true);
    }
});
