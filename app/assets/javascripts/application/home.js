$(".pages-home").ready(function() {

  $('.carousel').toggleClass('visible');

  ['scientists', 'partners'].forEach(function (className) {
    var arrowColor = className === 'partners' ? 'green' : 'blue';
    var isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    $($('.' + className + ' .carousel')[0]).slick({
      arrows: true,
      nextArrow: '<i class="icon-pointer-right-' + arrowColor + ' slick-next"></i>',
      prevArrow: '<i class="icon-pointer-left-' + arrowColor + ' slick-prev" ></i>',
      adaptiveHeight: true,
      dots: true,
      infinite: true,
      swipe: isDesktop ? false : true,
      centerMode: true,
      appendDots: $("#" + className + "-carousel-dots")
    });
  });
});
