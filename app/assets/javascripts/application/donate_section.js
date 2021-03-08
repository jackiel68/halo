$(".campaigns.campaigns-show").ready(function() {
  var isDesktop = window.matchMedia("(min-width: 1024px)").matches;
  var circleProgressConfig = {
    reverse: false,
    emptyFill: '#e5e5e5',
    fill: '#3bbded',
    animation: false
  };

  initiateProgressCircles(circleProgressConfig);

  // event listener for hover state change
  $('.donate-section__timeline .circle-progress').hover(handleHover, handleOffHover);

  // handle circle progress bar animation
  const handleCircleAnimation = function() {
    var $mainProgressEl = $('.donate-section__main.active .circle-progress');

    if($mainProgressEl.length > 0 && isScrolledIntoView($mainProgressEl[1])) {
      // handles in timeout to eliminate page render glitching
      setTimeout(function() {
        animateMainProgress($mainProgressEl);
        clearTimeout(animateMainProgress);
      }, 0);
    }
  };

  $(window).scroll(handleCircleAnimation);

  handleCircleAnimation();

  // init Carousel
  handleCarousel();

  $('.donate-section__main-wrapper').on('beforeChange', handleCarouselArrows);

  $(window).on('resize orientationchange', handleCarousel);

  // helpers

  function handleCarousel() {
    // screen size based on $screen-xs
    if(window.innerWidth > 480){
      $('.donate-section__main-wrapper.slick-initialized').slick('unslick');
    } else {
      $('.donate-section__main-wrapper').not('.slick-initialized').slick({
        arrows: true,
        nextArrow: '<i class="icon-arrow-right"></i>',
        prevArrow: '<i class="icon-arrow-left" ></i>',
        centerPadding: '70px',
        infinite: false,
        adaptiveHeight: true,
        initialSlide: 1,
        centerMode: true,
        mobileFirst: true,
        focusOnSelect: true
      });
    }
  }

  function handleCarouselArrows(e, carousel, currentSlide, nextSlide) {
    var $prevArrow = carousel.$prevArrow;
    var $nextArrow = carousel.$nextArrow;

    if(nextSlide === 2) {
      $nextArrow.addClass('hidden');
    } else {
      $nextArrow.removeClass('hidden');
    }

    if(nextSlide === 0) {
      $prevArrow.addClass('hidden');
    } else {
      $prevArrow.removeClass('hidden');
    }
  }

  function handleHover() {
    if($(this).hasClass('active')) return;

    var $mainProgressEl = $(".donate-section__main[data-position='" + this.dataset.position + "']");

    activateTimelineEl($(this));
    activateMainEl($mainProgressEl);
  }

  function handleOffHover() {
    if($(this).hasClass('inprogress')) return;

    if(isDesktop){
      resetActiveTimelineEl($(this));
      resetMainEl();
    }
  }

  function initiateProgressCircles(config) {
    // timeline circles
    $('.donate-section__timeline .circle-progress').circleProgress($.extend({}, config, {
      size: 30,
      startAngle: (-Math.PI / 180) * 196
    }));

    var updatedConfig = $.extend({}, config, {
      size: (isDesktop ? 160 : 200),
      thickness: (isDesktop ? 17 : 19)
    });
    var activeCirleSelector = '.donate-section__main.active .circle-progress';

    // inactive main circles
    var $inactiveMainCircles = $('.donate-section__main .circle-progress').not(activeCirleSelector);
    $inactiveMainCircles.circleProgress(updatedConfig);

    // active main circles
    $(activeCirleSelector).circleProgress($.extend({}, updatedConfig, {
      fill: config.emptyFill
    }));
  }

  function animateMainProgress($el) {
    $el.circleProgress($.extend({}, circleProgressConfig, {
      animation: {
        duration: 2200,
        easing: "circleProgressEasing"
      }
    }));

    $(window).off('scroll', handleCircleAnimation);
  }

  function isScrolledIntoView(el) {
    if(!el) return false;

    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var elTop = $(el).offset().top;
    var elBottom = elTop + $(el).height();

    return ((elBottom <= docViewBottom) && (elTop >= docViewTop));
  }

  var $origActiveMainEl, $newActiveMainEl, $origActiveTimelineEl;

  function activateTimelineEl($timelineEl) {
    $origActiveTimelineEl = $('.circle-progress.active');

    $origActiveTimelineEl.removeClass('active');
    $timelineEl.addClass('active');
  }

  function resetActiveTimelineEl($timelineEl) {
    $timelineEl.removeClass('active');
    $origActiveTimelineEl.addClass('active');
  }

  function activateMainEl($mainEl) {
    $origActiveMainEl = $('.donate-section__main.active');
    $newActiveMainEl = $mainEl;

    $origActiveMainEl.removeClass('active');
    $newActiveMainEl.addClass('active');
  }

  function resetMainEl() {
    $origActiveMainEl.addClass('active');
    $newActiveMainEl.removeClass('active');
  }
});
