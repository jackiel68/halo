class StartupsController < ApplicationController
  def create
    if !current_user
      return render :json => { :success => false, :errors => "You are not authorized for this update" }
    end

    begin
      startup = Startup.new
      startup.startup_name = params[:startup_name]
      startup.url = params[:url] if params[:url]
      startup.start_year = params[:start_year] if params[:start_year]
      startup.end_year = params[:end_year] if params[:end_year]
      startup.user_id = current_user.id
      startup.save!
    rescue => e
      Rollbar.log('critical', e)
      return render :json => { :success => false, :errors => "Failed to create startup" }
    end

    render :json => { :success => true, :user => current_user.for_show }
  end

  def update
    startup = Startup.find(params[:id])

    if !current_user || current_user.id.to_i != startup.user_id.to_i
      return render :json => { :success => false, :errors => "You are not authorized for this update" }
    end

    begin
      Startup.transaction do
        startup.startup_name = params[:startup_name] if params[:startup_name]
        startup.url = params[:url] if params[:url]
        startup.start_year = params[:start_year] if params[:start_year]
        startup.end_year = params[:end_year] if params[:end_year]
        startup.save!
      end
    rescue => e
      Rollbar.log('critical', e)
      return render :json => { :success => false, :errors => "Failed to update startup" }
    end

    render :json => { :success => true, :user => current_user.for_show }
  end

  def destroy
    startup = Startup.find(params[:id])

    if !current_user || current_user.id.to_i != startup.user_id.to_i
      return render :json => { :success => false, :errors => "You are not authorized for this update" }
    end

    startup.destroy

    render :json => { :success => true }
  end
end
