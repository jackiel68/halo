class SessionsController < Devise::SessionsController
  # def create_via_email
  #   session_params = params[:session]
  #   user = User.find_by(email: session_params[:email])

  #   if user
  #     if user.has_password?
  #       if user.authenticate(session_params[:password])
  #         # All good!
  #         session[:user_id] = user.id
  #         track_sign_in
  #         render json: { user_id: user.id }, status: :created
  #       else
  #         invalid_sign_in_attempt('Incorrect password')
  #       end
  #     else
  #       invalid_sign_in_attempt("It seems there's no password associated to your account. Try logging in via facebook instead.")
  #     end
  #   else
  #     invalid_sign_in_attempt('Invalid email')
  #   end
  # end

  layout "clean", :only => [:new, :login, :company_signup, :company_login, :university_signup, :university_login]

  def login
    if current_user
      flash[:notice] = "You are already signed in"
      redirect_to root_url
    end

    @title = "Register"
  end

  def new
    super

    if current_user
      flash[:notice] = "You are already signed in"
      redirect_to root_url
    end

    @title = "Login"
  end

  def company_login
    if current_user
      flash[:notice] = "You are already signed in. Log out first in order to create a new company account"
      redirect_to root_url
    end
    @title = "Company Login"
  end

  def company_signup
    if current_user
      flash[:notice] = "You are already signed in. Log out first in order to create a new company account"
      redirect_to root_url
    end

    gon.companies = Company.all.sort_by { |c| c.company_name }.map do |company|
      {
        key: company.id,
        text: company.company_name,
        value: company.company_name,
      }
    end
    @title = "Company Signup"
  end

  def university_login
    if current_user
      flash[:notice] = "You are already signed in. Log out first in order to create a new university account"
      redirect_to root_url
    end

    @title = "University Login"
  end

  def university_signup
    if current_user
      flash[:notice] = "You are already signed in. Log out first in order to create a new university account"
      redirect_to root_url
    end

    @title = "University Signup"
  end

  def redirect_login
    unless current_user
      return redirect_to "/"
    end
    if current_user.requires_onboarding?
      redirect_to :controller => "onboardings", :action => "index"
    elsif current_user.requires_university_onboarding?
      redirect_to :controller => "onboardings", :action => "university"
    elsif current_user.role == User::ROLES[:company] && CompaniesRelation.where(:user_id => current_user.id).exists?
      redirect_to '/reviewer_dashboard'
    elsif current_user.role == User::ROLES[:university]
      redirect_to '/research/water'
    else
      redirect_to '/research/water'
    end
  end

  def create_via_provider
    User.transaction do
      auth = request.env['omniauth.auth']

      # Find an identity, or create a new one
      @identity = Identity.from_omniauth(auth)

      if current_user
        # Try to link an identity with the current user
        if @identity.user == current_user
          redirect_to root_url, notice: 'Already linked that account!'
        else
          current_user.identities << @identity
          redirect_to root_url, notice: 'Successfully linked that account!'
        end
      else
        if @identity.user
          # Sign in
          sign_in(:user, @identity.user)
        else
          # Sign up
          user = User.create_with_omniauth(auth)
          user.identities << @identity
          sign_up_and_set_interests(user)
        end
        track_sign_in
        redirect_to_previous_url
      end
    end
  end

  def destroy
    reset_session
    redirect_to root_url
  end

  private

  def invalid_sign_in_attempt(message)
    render json: message, status: :unprocessable_entity
  end
end
