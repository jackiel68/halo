class UsersController < ApplicationController
  skip_before_action :http_basic_authenticate, only: [:subscribe]
  def set_interests
    session[:disease_ids] = params[:user][:disease_ids].reject(&:empty?)

    if params[:via_facebook]
      redirect_to('/auth/facebook')
    else
      redirect_to(sign_up_via_email_path)
    end
  end

  # def create_via_email
  #   @user = User.new(user_params)

  #   if @user.save
  #     sign_up_and_set_interests(@user)
  #     track_sign_in
  #     render json: { user_id: @user.id }, status: :created
  #   else
  #     render json: pretty_json_errors(@user), status: :unprocessable_entity
  #   end
  # end

  def update_password(email)
    user = User.find_by_email(email)
    user.password = "pugsley"
    user.password_confirmation = "pugsley"
    user.save
  end

  def redirect_to_profile
    if user_signed_in?
      redirect_to "/profile/#{current_user.profile_id}"
    else
      redirect_to "/"
    end
  end

  def show
    @user = User.find_by_id(params[:id])
    render :json => { :user => @user.for_show }
  end

  def update
    if params[:id].to_i != current_user.id
      return render :json => { :success => false, :errors => "You are not authorized for this update" }
    end
    success = false

    begin
      User.transaction do
        current_user.first_name = params[:first_name]
        current_user.last_name = params[:last_name]
        current_user.email = params[:email]
        current_user.phone = params[:phone]
        success = current_user.save

        if !success
          render :json => { :success => false, :errors => current_user.errors.full_messages.to_sentence }
        end

        if params[:old_password] && params[:password]
          if !current_user.valid_password?(params[:old_password])
            return render :json => { :success => false, :errors => "Password not valid. Please try again." }
          end

          if !current_user.update_with_password({ :current_password => params[:old_password], :password => params[:password], :password_confirmation => params[:password_confirmation] })

            return render :json => { :success => false, :errors => "Password update failed. Please try again" }
          else
            bypass_sign_in current_user
          end
        end
      end
    rescue => e
      Rollbar.log('critical', e)
      return render :json => { :success => false, :errors => "Failed to update user" }
    end

    if success
      render :json => { :success => true, :user => current_user.for_show }
    end
  end

  def subscribe
    redirect_to(sign_up_thank_you_path)
  end

  def image_upload
    file = params[:file]
    current_user.image = file
    current_user.save!

    render :json => { :image => current_user.image }
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email, :password)
  end
end
