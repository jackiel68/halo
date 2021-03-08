# Require Custom Actions
require Rails.root.join('lib', 'rails_admin', 'launch_campaign.rb')
require Rails.root.join('lib', 'rails_admin', 'close_campaign.rb')
RailsAdmin::Config::Actions.register(RailsAdmin::Config::Actions::LaunchCampaign)
RailsAdmin::Config::Actions.register(RailsAdmin::Config::Actions::CloseCampaign)

# Standard Configuration
RailsAdmin.config do |config|
  # Authentication
  config.current_user_method(&:current_user)

  # Authorization
  config.authorize_with :cancan

  # Auditing
  config.audit_with :paper_trail, 'User', 'PaperTrail::Version'

  # Browser Validations
  config.browser_validations = false

  # Actions
  config.actions do
    dashboard # mandatory
    index # mandatory
    new
    export
    bulk_delete
    show
    edit
    delete
    show_in_app
    history_index
    history_show
    launch_campaign # custom
    close_campaign # custom
  end

  # Models

  config.excluded_models = ['CampaignNote']

  config.model 'Campaign' do
    list do
      field :name
      field :is_featured
      field :launch_date
      field :closed_at
    end

    edit do
      exclude_fields :donations
      exclude_fields :launched_at
      exclude_fields :closed_at
      exclude_fields :donors
      exclude_fields :campaign_advisors
      exclude_fields :campaign_questions
      exclude_fields :campaign_notes
      exclude_fields :slug
    end
  end

  config.model 'CampaignAdvisor' do
    parent Campaign
    label 'Expert'

    list do
      field :id
      field :name
      field :title
      field :sector
    end

    edit do
      exclude_fields :campaign_notes
    end
  end

  config.model 'CampaignQuestion' do
    parent Campaign
    label 'Question'

    list do
      field :id
      field :question
    end
  end

  config.model 'CampaignNote' do
    parent Campaign
    label 'Update'

    list do
      field :id
      field :title
    end
  end

  config.model 'Disease' do
    list do
      field :id
      field :name
      field :feature_on_homepage
      field :position
    end

    edit do
      exclude_fields :campaigns
      exclude_fields :foundations
      exclude_fields :users
      exclude_fields :donations
      exclude_fields :slug
    end
  end

  config.model 'ScientificAdvisor' do
    list do
      field :id
      field :full_name
      field :title
      field :institution
      field :linkedin_profile
    end

    # edit do
    #   exclude_fields :campaigns
    #   exclude_fields :foundations
    #   exclude_fields :users
    #   exclude_fields :donations
    #   exclude_fields :slug
    # end
  end

  config.model 'DiseaseCategory' do
    list do
      field :id
      field :name
      field :feature_on_homepage
      field :position
    end

    edit do
      exclude_fields :slug
    end
  end

  config.model 'Organization' do
    list do
      field :id
      field :name
      field :url
      field :type
    end

    edit do
      exclude_fields :type
      exclude_fields :campaigns
      exclude_fields :disease
    end
  end

  config.model 'RequestForProposal' do
    edit do
      exclude_fields :innovation_types
      exclude_fields :available_resources
    end
  end

  config.model 'Foundation' do
    list do
      field :id
      field :foundation_name
      field :description
    end
  end

  config.model 'Sponsor' do
    list do
      field :id
      field :name
      field :url
    end

    edit do
      exclude_fields :type
      exclude_fields :disease
      exclude_fields :campaigns
    end
  end

  config.model 'Donation' do
    list do
      field :id
      field :campaign
      field :user
      field :amount
      field :status
    end
  end

  config.model 'User' do
    list do
      field :id
      field :name
      field :email
    end

    edit do
      field :first_name
      field :last_name
      field :email
      exclude_fields :encrypted_password
    end
  end

  config.model 'Identity' do
    visible false
  end
end
