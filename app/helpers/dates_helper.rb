module DatesHelper
  def countdown_to(deadline)
    t = deadline - Time.now
    mm, ss = t.divmod(60)
    hh, mm = mm.divmod(60)
    dd, hh = hh.divmod(24)
    "<div class=\"figure\"><p>%d</p><span class=\"unit\">days</span></div><div class=\"figure\"><p>%d</p><span class=\"unit\">hours</span></div><div class=\"figure\"><p>%d</p><span class=\"unit\">minutes</span></div>".html_safe % [dd, hh, mm]
  end

  def days_until(date)
    ((date.beginning_of_day - Date.today.beginning_of_day)/1.day).to_i
  end
end
