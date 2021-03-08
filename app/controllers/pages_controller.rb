class PagesController < ApplicationController
  skip_before_action :http_basic_authenticate, except: [:home, :university_partners]
  def home
    if current_user
      if current_user.requires_onboarding?
        redirect_to "/onboarding"
      elsif current_user.role == User::ROLES[:company]
        redirect_to "/reviewer_dashboard"
      elsif current_user.role == User::ROLES[:university]
        redirect_to "/research/water"
      else
        redirect_to "/research/water"
      end
    end

    @getting_started_link = '/register'

    @upcoming_campaigns = Campaign.upcoming
    @featured_diseases = Disease.featured_on_homepage
    @diseases = Disease.alphabetized.all
  end

  def university_partners
    @universities = Organization.universities
  end

  def scientific_advisors
    @advisors = ScientificAdvisor.all
  end

  def coming_soon
  	@upcoming_campaigns = Campaign.upcoming
    @featured_diseases = Disease.featured_on_homepage

    # hiding for now
    # @diseases = Disease.alphabetized.all
  end

  def sign_up_thank_you

  end
end
