// Sharing

function windowPopup(url, width, height) {
  var left = (screen.width/2) - (width/2),
      top = (screen.height/2) - (height/2);

  return window.open(url, name, "menubar=no,toolbar=no,status=no,width="+width+",height="+height+",toolbar=no,left="+left+",top="+top);
}

$(document).ready(function() {
  // Copy to Clipboard
  var clipboardButton = $('.btn-clipboard');
  if (clipboardButton.length) {
    var clipboard = new Clipboard('.btn-clipboard');
    clipboardButton.tooltip({ title: 'Copied!', trigger: 'manual', position: 'bottom' });
    clipboardButton.on('click', function(e){
      e.preventDefault();
    });
    clipboard.on('success', function(e){
      e.clearSelection();
      $(e.trigger).tooltip('show');
      setTimeout(function(){
        $(e.trigger).tooltip('hide');
      }, 1500);
    });
  };

  // Social Share
  $(".js-social-share").on("click", function(e) {
    e.preventDefault();

    windowPopup($(this).attr("href"), 500, 300);
  });
});
