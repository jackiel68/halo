// Ajax Forms
$(document).ajaxStart(function () {
  $('body').css({ 'cursor': 'wait' });
  docCookies.setItem('afterSignInUrl', window.location.href);
});
$(document).ajaxComplete(function( event, xhr, settings ) {
  // Set cursor back to normal
  $('body').css({ 'cursor': 'default' });

  if (xhr.status == 201) {
    // Redirect
    location.assign(docCookies.getItem('afterSignInUrl'));
  } else {
    // Display error messages
    var message = xhr.responseText;
    var json = xhr.responseJSON;
    if (json) {
      if (json.error) {
        message = json.error;

      } else if (json.errors) {
        var errors = [];
        for (var field in json.errors) {
          field_msgs = json.errors[field];
          for (var i=0; i<field_msgs.length; i++) {
            errors.push(field + ' ' + field_msgs[i]);
          }
        }
        message = errors.join(', ');
      }
    }

    $('.modal.fade.in #alert').text(message).addClass('alert alert-danger in');
  }
});

$(document).ready(function() {
  // enable navigation to specific tabs using url hash
  var url = document.location.toString();
  if (url.match('#')) {
    $('.nav-tabs a[href="#' + url.split('#')[1] + '"]').tab('show');
  }

  if ($('body').data('sign-in-required')) {
    $('#sign-up').modal('show');

    // hide the close button
    $('.close-auth-modal').hide();

    // don't allow the modal to hide
    $('#sign-up').on('hide.bs.modal', function(e) {
      return false;
    });
  }

  $(".alert" ).fadeOut(3000);

  // Modal Clicking (had to add after alignment stuff)
  $(".modal").click(function(ev){
    if(ev.target != this) return;
    $('.modal').modal('hide');
  });
});
