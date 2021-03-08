class EmailResponseTemplatesController < ApplicationController
  def index
    # If the user_id is NULL, it is a default template
    @email_response_templates = EmailResponseTemplate.where("user_id = ? OR user_id IS NULL", params[:user_id])
    render :json => { :email_response_templates => @email_response_templates }
  end

  def create
    if !current_user
      return render :json => { :success => false, :errors => "You are not authorized for this update" }
    end

    begin
      email_response_template = EmailResponseTemplate.new
      email_response_template.user = current_user
      email_response_template.content = params[:content]
      email_response_template.title = params[:title]
      email_response_template.save!
    rescue => e
      Rollbar.log('critical', e)
      return render :json => { :success => false, :errors => "Failed to create email response template" }
    end

    render :json => { :success => true }
  end
end
