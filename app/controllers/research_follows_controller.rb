class ResearchFollowsController < ApplicationController
  def create
    email = params.require(:email)
    research_area = params.require(:research_area)

    if ResearchFollow.where(:email => email, :research_area => research_area).exists?
        render :json => { :status => 'success' }
    else
      @research_follow = ResearchFollow.new(email: email, research_area: research_area)
      @research_follow.save
    end

    render :json => { :status => 'success' }
  end
end
