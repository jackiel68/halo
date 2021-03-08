class OnboardingsController < ApplicationController
  layout "clean", :only => [:index, :university]

  before_filter :require_user!, :only => [:index, :university, :create_profile_info]
  skip_before_filter :redirect_to_onboarding

  HUBSPOT_API_KEY = '11e865ee-8a6e-401e-8271-f738bfb569ef'

  def index
    @title = "Onboarding"

    @user_title_options = UserProfileInfo::TITLE.map do |key, value|
      {
        key: key.to_s,
        text: value,
        value: key.to_s,
      }
    end

    @areas_of_expertise = UserProfileInfo::AREA_OF_EXPERTISE.map do |key, value|
      {
        key: key.to_s,
        text: value.to_s,
        value: key.to_s,
      }
    end

    @research_keywords = ResearchKeyword.all.map do |keyword|
      {
        key: keyword.research_type,
        text: keyword.research_type,
        value: keyword.research_type,
      }
    end

    gon.current_user = {
      email: current_user.email
    }
    gon.user_title_options = @user_title_options
    gon.areas_of_expertise = @areas_of_expertise
    gon.research_keywords = @research_keywords
  end

  def university
    @title = "University Onboarding"

    @user_title_options = UserProfileInfo::UNIVERSITY_TITLE.map do |key, value|
      {
        key: key.to_s,
        text: value,
        value: key.to_s,
      }
    end

    @areas_of_expertise = UserProfileInfo::AREA_OF_EXPERTISE.map do |key, value|
      {
        key: key.to_s,
        text: value.to_s,
        value: key.to_s,
      }
    end

    gon.user_title_options = @user_title_options
    gon.areas_of_expertise = @areas_of_expertise
  end

  def create_profile_info
    # params
    # user: {
    #   first_name: 'Justin',
    #   last_name: 'Chen',
    # },
    # user_profile_info: {
    #   title: "postdoctoral_researcher",
    #   location: "Stanford University",
    #   area_of_expertise: "immunology",
    #   location_start_year: "2019",
    #   keywords: "Hematology,Dermatology, Skin,Cardiovascular"
    # }

    user_params = params[:user]
    user_profile_info = params[:user_profile_info]

    user = User.find(current_user.id)
    user.first_name = user_params[:first_name] if user_params.present?
    user.last_name = user_params[:last_name] if user_params.present?
    user.save

    keywords = user_profile_info[:keywords] ? user_profile_info[:keywords].split(/,(?!\s)/) : []

    output = nil
    UserProfileInfo.transaction do
      profile_info = UserProfileInfo.create({
        :title => user_profile_info[:title],
        :location => user_profile_info[:location],
        :location_details => user_profile_info[:location_details],
        :location_start_year => user_profile_info[:location_start_year],
        :area_of_expertise => user_profile_info[:area_of_expertise],
        :user => current_user,
      })

      if params[:startup] && params[:startup][:startup_name].present?
        Startup.create({
          :startup_name => params[:startup][:startup_name],
          :url => params[:startup][:url],
          :start_year => params[:startup][:start_year],
          :user => current_user,
        })
      end

      if profile_info.errors.present?
        output = { :success => false, :errors => profile_info.errors }
      else
        keywords.each do |keyword|
          UserKeyword.create({
            :user => current_user,
            :research_keyword => ResearchKeyword.where(:research_type => keyword).first,
          })
        end
        output = { :success => true, :user_profile_info => user_profile_info }
      end
    end

    if Rails.env.production?
      areas_of_expertise =
          if user_profile_info[:area_of_expertise]
            user_profile_info[:area_of_expertise].split(/,(?!\s)/).map do |expertise|
              UserProfileInfo::AREA_OF_EXPERTISE[expertise.try(:to_sym)]
            end.compact.join(';')
          else
            ''
          end

      hubspot_url = "https://api.hubapi.com/contacts/v1/contact/email/#{current_user.email}/profile?hapikey=#{HUBSPOT_API_KEY}";
      options = {
        :body => {
          :properties => [
            { property: 'job_function', value: UserProfileInfo::HUBSPOT_TITLE_CONVERSION[user_profile_info[:title].to_sym] },
            { property: 'research_area', value: areas_of_expertise },
            { property: 'institute_affiliations', value: params[:startup] ? params[:startup][:startup_name] : user_profile_info[:location] },
          ]
        }.to_json,
        :headers => {
          'Content-Type' => 'application/x-www-form-urlencoded',
        },
      }
      response = HTTParty.post(hubspot_url, options)
    end

    respond_to do |format|
      format.json {
        render json: output
      }
    end
  end
end
