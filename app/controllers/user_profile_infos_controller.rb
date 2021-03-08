class UserProfileInfosController < ApplicationController
  def update
    if !current_user || current_user.id != params[:user_id].to_i
      return render :json => { :success => false, :errors => "You are not authorized for this update" }
    end

    upi = UserProfileInfo.where(:user_id => params[:user_id]).last || UserProfileInfo.new
    begin
      UserProfileInfo.transaction do
        upi.about = params[:about] if params[:about]
        upi.headline = params[:headline] if params[:headline]
        upi.location = params[:location] if params[:location]
        upi.location_details = params[:location_details] if params[:location_details]
        upi.location_start_year = params[:location_start_year] if params[:location_start_year]
        upi.location_end_year = params[:location_end_year] if params[:location_end_year]
        upi.user_id = current_user.id if !upi.user_id
        upi.area_of_expertise = params[:area_of_expertise] if params[:area_of_expertise]
        upi.save!

        if params[:keywords]
          keywords = params[:keywords].split(/,(?!\s)/)
          existing_keywords = UserKeyword.where(:user_id => current_user.id).map(&:research_keyword)
          research_keywords = ResearchKeyword.where(:research_type => keywords)

          new_keywords = research_keywords - existing_keywords
          keywords_to_delete = existing_keywords - research_keywords

          new_keywords.each do |keyword|
            UserKeyword.create({
              :user => current_user,
              :research_keyword => keyword,
            })
          end

          keywords_to_delete.each do |keyword|
            UserKeyword.where({
              :user => current_user,
              :research_keyword => keyword,
            }).first.destroy
          end
        end
      end
    rescue => e
      Rollbar.log('critical', e)
      return render :json => { :success => false, :errors => "Failed to update user profile info" }
    end

    render :json => { :success => true, :user => current_user.for_show }
  end
end
