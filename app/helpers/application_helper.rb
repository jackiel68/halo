module ApplicationHelper
  # devise helpers
  def resource_name
    :user
  end
 
  def resource
    @resource ||= User.new
  end
 
  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end
  
  def title(text, additional_css_classes = nil)
    content_for(:title, strip_tags(text))
    content_tag(:h2, class: "primary-heading #{ additional_css_classes }") { text.html_safe }
  end

  def meta_tag(tag, text)
    content_for :"meta_#{tag}", text
  end

  def yield_meta_tag(tag, default_text='')
    content_for?(:"meta_#{tag}") ? content_for(:"meta_#{tag}") : default_text
  end

  def subheading(text, additional_css_classes = nil)
    content_for(:title, strip_tags(text))
    content_tag(:h3, class: "sub-heading #{ additional_css_classes }") { text.html_safe }
  end

  def menu_item_for(text = '', path = nil, options = {})
    content_tag(:li, class: "#{ (path && current_page?(path) ? 'active' : nil) }") do
      link_to(text, path, options)
    end
  end

  def flash_messages(opts = {})
    flash.each do |msg_type, message|
      concat(content_tag(:div, class: "text-center alert #{bootstrap_class_for(msg_type)}") do
        concat(content_tag(:button, class: 'close', aria: {label: "close"}, data: {dismiss: 'alert'}) do
          concat content_tag(:span, "&times;".html_safe, aria: {hidden: true})
        end)
        concat(message)
      end)
      flash.clear
    end
    nil
  end

  def avatar_for(user)
    return if Rails.env.test?
    gravatar_id = Digest::MD5::hexdigest(user.email.downcase)
    gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}?d=404"
    open(gravatar_url).read
    image_tag(gravatar_url, alt: user.name, class: 'avatar')
  rescue
    content_tag(:span, user.name.first, class: 'avatar')
  end

  def error_messages_for(object)
    render(partial: 'application/error_messages', locals: { object: object })
  end

  def pretty_date(date)
    return unless date.present?
    date.strftime("%B #{date.day.ordinalize}")
  end

  def markdown(text)
    return '' unless text.present?
    content_tag(:div, class: 'markdown') do
      Redcarpet::Markdown.new(
        Redcarpet::Render::HTML,
        autolink: true,
        no_intra_emphasis: true,
        hard_wrap: true
      ).render(text).html_safe
    end
  end

  def clearfix(i = nil)
    '<div class="clearfix"></div>'.html_safe if !i || i.even?
  end

  def conditional_main_class
    'container' unless action_name == 'home' || action_name == 'coming_soon'
  end

  def coming_soon_active
    if action_name == 'coming_soon'
      return true
    else
      return false
    end
  end

  def simple_modal(locals = {}, &block)
    render layout: 'application/simple_modal', locals: locals, &block
  end

  private

  def bootstrap_class_for(flash_type)
    {
      alert: 'alert-info',
      notice: 'alert-info',
      info: 'alert-info',
      success: 'alert-success',
      error: 'alert-danger',
      warning: 'alert-warning'
    }[flash_type.to_sym]
  end
end
