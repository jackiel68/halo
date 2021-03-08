module SocialHelper
  def share_urls_for(campaign, options = {})
    raw = options[:raw] || false
    message = options[:message] || campaign_message(campaign)
    methods = %w(facebook twitter mail)
    url = campaign_share_url(campaign, options)

    # For debugging to ensure that the right link to the campaign was being sent - it was.
    # share_url('facebook', url.html_safe, nil).html_safe

    if raw
      urls = { 'campaign_url' => url }
      methods.each do |method|
        urls["campaign_#{ method }_url"] = share_url(method, url, message)
      end
      urls
    else
      html = ''
      methods.each do |method|
        html << share_link(method, url, message)
      end
      html << copy_link(url)

      html.html_safe
    end
  end

  def share_icon(method)
    content_tag(:span, class: "icon icon-#{ method }"){}
  end

  def share_button(button_text, campaign, method)
    message = campaign_message(campaign)
    url = campaign_share_url(campaign)

    content_tag(:div, class: "btn btn-lg btn-#{method}-share") do
      link_to(share_url(method, url, message), target: :blank, class: 'social-share js-social-share') do
        concat content_tag(:span, '', class: "#{ method }-logo")
        concat content_tag(:span, button_text)
      end
    end
  end

  private

  def campaign_message(campaign)
    campaign.social_message || "Donate to #{ campaign.disease.name } research."
  end

  def campaign_share_url(campaign, options = {})
    url_options = { host: ENV['HOST'], subdomain: 'www' }
    url_options['referrer'] = current_user.try(:referrer_token) unless options[:disable_referrer]
    campaign_url(campaign, url_options)
  end

  def copy_link(url)
    link_to(url, class: 'social-share btn-clipboard', data: { 'clipboard-text': url }) do
      share_icon('link')
    end
  end

  def share_link(method, url, message)
    link_to(share_url(method, url, message), target: :blank, class: 'social-share js-social-share') do
      share_icon(method)
    end
  end

  def share_url(method, url, message)
    case method
    when 'facebook'
      "https://www.facebook.com/sharer/sharer.php?u=#{ url }"
    when 'twitter'
      "https://twitter.com/intent/tweet/?text=#{ URI.encode(message) }&url=#{ url }"
    when 'mail'
      subject = URI.encode('Together we can make the difference')
      body = URI.encode("#{ message }\n#{ url }")
      "mailto:?subject=#{ subject }&body=#{ body }"
    end
  end
end
