// Donation Form

$(document).ready(function() {
  // Toggle loved one name field
  $('#has-loved-one').on('click', function() {
    $('#loved-one-name').toggleClass('hidden');
  });

  // Popovers
  $('[data-toggle="popover"]').popover();
  $('[data-toggle="popover"]').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
  });
});
