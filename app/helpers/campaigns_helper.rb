module CampaignsHelper
  def cover_for(campaign)
    "style=\"background-image: url(#{ campaign.cover_url(:cover) })\"".html_safe
  end

  def thank_you_message_for(donation)
    if donation.user.present?
      string = "#{donation.user.first_name}, thank you for your donation"
    else
      string = 'Thank you for your donation'
    end

    string += " in honor of #{ donation.loved_one_name }" if donation.loved_one_name.present?
    string
  end

  def funding_status_header_for(milestone)
    case milestone[:funding_status]
    when 'Not Started'
      'Not Yet Funding'
    when 'Success'
      'Complete'
    when 'In Progress'
      'Currently Funding'
    end
  end

  def timeline_connector_class_for(milestone)
    case milestone[:project_status]
    when 'Success'
      'complete'
    # when 'In Progress'
    #   'inprogress'
    end
  end
end
