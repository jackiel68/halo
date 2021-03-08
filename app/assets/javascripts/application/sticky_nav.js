$('.campaigns.campaigns-show').ready(function() {
  var isPhone = window.matchMedia("(max-width: 480px)").matches;
  if(isPhone){
    handleStickyMobileNav();
  } else {
    handleStickyDesktopNav();
  }
});

var origNavOffset;
var handleStickyDesktopNav = function() {
  $(window).on('load resize orientationchange', function() {
    initiateStickyNav();
  });

  handleButtonScroll();
};

var handleButtonScroll = function() {
  // move buttons upwards as user scrolls downwards
  $(window).on('scroll load', function() {
    var $buttons = $('#campaign-nav-tabs .navbar-right');
    var windowOffsetTop = origNavOffset - $(window).scrollTop() + 180;

    $buttons.css('top', windowOffsetTop < 0 ? 0 : windowOffsetTop / 3);
  });
};

var initiateStickyNav = function() {
  var $navTabs = $('#campaign-nav-tabs');
  origNavOffset = $navTabs.offset().top;
  $navTabs.affix({
    offset: {
      top: $navTabs.offset().top
    }
  });
};

var handleStickyMobileNav = function() {
  $(window).on('scroll load', function() {
    var $triggerEl = $('.donate-section .donate-auth-link').filter(function() {
      // TODO fix bug that causes two of every element to show up in DOM
      // One of the elements has negative height, making this func necessary
      return $(this).height() > 0;
    });
    var docViewTop = $(window).scrollTop();
    var triggerElBottom = $triggerEl.offset().top; + $triggerEl.height();
    var $stickyHeader = $('#campaign-sticky-header');

    if(docViewTop > (triggerElBottom + 10)){
      $stickyHeader.addClass('active');
    } else {
      $stickyHeader.removeClass('active');
    }
  });
};
