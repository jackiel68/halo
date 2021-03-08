$(".campaigns.campaigns-show").ready(function() {
  var isDesktop = window.matchMedia("(min-width: 1024px)").matches;

  $('.milestones .circle-progress').circleProgress({
    reverse: false,
    emptyFill: '#e5e5e5',
    fill: '#3bbded',
    size: (isDesktop ? 30 : 35),
    startAngle: (-Math.PI / 180) * (isDesktop ? 105 : 102)
  });

  if(isDesktop){
    $('.milestones .circle-progress-timeline').hover(handleHover, handleOffHover);
  }

  function handleHover() {
    var $timelineSection = $(this).closest('.milestones__timeline-section');
    var $fundingData = $timelineSection.find('.milestones__funding-data');

    $fundingData.addClass('active');
    $(this).addClass('active');
  }

  function handleOffHover() {
    var $timelineSection = $(this).closest('.milestones__timeline-section');
    var $fundingData = $timelineSection.find('.milestones__funding-data');

    $fundingData.removeClass('active');
    $(this).removeClass('active');
  }
});
