class EducationsController < ApplicationController
  def create
    if !current_user
      return render :json => { :success => false, :errors => "You are not authorized for this update" }
    end

    begin
      education = Education.new
      education.location = params[:location] if params[:location]
      education.degree = params[:degree] if params[:degree]
      education.start_year = params[:start_year] if params[:start_year]
      education.end_year = params[:end_year] if params[:end_year]
      education.field_of_study = params[:field_of_study] if params[:field_of_study]
      education.user_id = current_user.id
      education.save!
    rescue => e
      Rollbar.log('critical', e)
      return render :json => { :success => false, :errors => "Failed to create education history" }
    end

    render :json => { :success => true, :user => current_user.for_show }
  end

  def update
    education = Education.find(params[:id])

    if !current_user || current_user.id.to_i != education.user_id.to_i
      return render :json => { :success => false, :errors => "You are not authorized for this update" }
    end

    begin
      Education.transaction do
        education.location = params[:location] if params[:location]
        education.degree = params[:degree] if params[:degree]
        education.start_year = params[:start_year] if params[:start_year]
        education.end_year = params[:end_year] if params[:end_year]
        education.field_of_study = params[:field_of_study] if params[:field_of_study]
        education.save!
      end
    rescue => e
      Rollbar.log('critical', e)
      return render :json => { :success => false, :errors => "Failed to update education" }
    end

    render :json => { :success => true, :user => current_user.for_show }
  end

  def destroy
    education = Education.find(params[:id])

    if !current_user || current_user.id.to_i != education.user_id.to_i
      return render :json => { :success => false, :errors => "You are not authorized for this update" }
    end

    education.destroy

    render :json => { :success => true }
  end
end
