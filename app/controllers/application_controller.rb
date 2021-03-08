class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  #http_basic_authenticate_with name: 'halo', password: 'makethedifference', if: :need_authentication?
  protect_from_forgery with: :exception
  helper_method :current_campaign
  add_flash_types :error, :warning
  before_action :initialize_user
  # before_action :http_basic_authenticate

  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :store_user_diseases, if: :user_signed_in?

  # Used for mailers
  def default_url_options
    { host: request.host_with_port }
  end

  def current_campaign
    @current_campaign ||= Campaign.open.current
  end

  def http_basic_authenticate
    authenticate_or_request_with_http_basic do |name, password|
      session[:auth] = (name == 'halo' && password == 'makethedifference')
    end
  end

  def initialize_user
    @new_user = User.new unless current_user
  end

  def require_sign_in
    unless user_signed_in?
      session[:previous_url] = request.fullpath
      @require_sign_in = true
    end
  end

  def require_user!
    respond_to do |format|
      format.html {
        redirect_to_previous_url(message = 'Please log in') unless user_signed_in?
      }
      format.json {
        render json: {
          error: 'Please log in',
        } unless user_signed_in?
      }
    end
  end

  def redirect_to_onboarding
    if current_user && current_user.requires_onboarding?
      redirect_to "/onboarding"
    elsif current_user && current_user.requires_university_onboarding?
      redirect_to "/onboarding/university"
    end
  end

  def redirect_to_previous_url(message = nil)
    url = session[:previous_url] || root_path
    session[:previous_url] = nil
    message ? redirect_to(url, notice: message) : redirect_to(url)
  end

  rescue_from CanCan::AccessDenied do |exception|
    redirect_to main_app.root_path, alert: exception.message
  end

  private

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name])
  end

  def need_authentication?
    logger.debug "CURRENT USER AGENT = #{request.user_agent}"
    if request.user_agent == "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)" || request.user_agent == "facebookexternalhit/1.1" || request.user_agent == "Facebot"
      false
    else
      true
    end
  end

  def pretty_json_errors(record)
    record.errors.full_messages.to_sentence.humanize
  end

  def sign_up_and_set_interests(user)
    # session[:user_id] = user.id
    # sign_in(:user, user)
    # user.diseases << Disease.where(id: session[:disease_ids])
    # session[:disease_ids] = nil

    sign_in(:user, user)
    store_user_diseases
  end

  def store_user_diseases
    disease_ids = session[:disease_ids]
    if disease_ids.present? && user_signed_in?
      current_user.diseases << Disease.where(id: session[:disease_ids])
      session[:disease_ids] = nil
    end
  end

  def track_sign_in
    current_user.identify_user
  end
end
