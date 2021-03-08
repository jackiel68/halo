Rails.application.routes.draw do
  devise_for :users, controllers: { registrations: 'registrations', sessions: 'sessions' }

  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'

  #
  # Resources
  #
  resources :diseases, only: [:show]
  resources :disease_categories, only: [:show]
  resources :disease_categories, only: [:show]
  resources :campaigns, only: [:index, :show] do
    resources :donations, only: [:new, :create] do
      get :thank_you, on: :member
    end
  end
  resources :followers, only: [:create]

  scope :auth do
    get 'is_signed_in', to: 'auth#is_signed_in?'
  end

  get '/import_pubmed', to: 'publications#import'

  #
  # Pages
  #
  get '/about', to: 'pages#about'
  get '/coming_soon', to: "pages#home"
  get '/our_promise', to: 'pages#our_promise'
  get '/contact', to: 'pages#contact'
  get '/faq', to: 'pages#faq'
  get '/jobs', to: 'pages#jobs'
  get '/mission', to: 'pages#mission'
  get '/privacy_policy', to: 'pages#privacy_policy'
  get '/terms', to: 'pages#terms'
  get '/the_halo_difference', to: 'pages#the_halo_difference'
  get '/the_halo_effect', to: 'pages#the_halo_difference'
  get '/university_partners', to: 'pages#university_partners'
  get '/scientific_advisors', to: "pages#scientific_advisors"
  get '/sign_up_thank_you', to: 'pages#sign_up_thank_you'
  post '/subscribe', to: 'users#subscribe'
  #get 'scientific_advisors', to: "campaign_advisors#index"

  devise_scope :user do
    #
    # Authentication
    #
    get '/register', to: 'sessions#new'
    get '/login', to: 'sessions#login'
    get '/partners/register', to: 'sessions#company_signup'
    get '/partners/login', to: 'sessions#company_login'
    get '/universities/register', to: 'sessions#university_signup'
    get '/universities/login', to: 'sessions#university_login'

    match '/sign_out', to: 'sessions#destroy', via: [:get, :delete]
    get '/redirect_login', to: 'sessions#redirect_login'

    # Via Facebook
    match '/auth/:provider/callback', to: 'sessions#create_via_provider', via: [:get, :post]
  end

  get '/redirect_to_profile', to: 'users#redirect_to_profile'

  # Company Info
  get '/company_info/:identifier', to: 'companies#show'

  # Onboarding Flow
  get '/onboarding', to: 'onboardings#index'
  get '/onboarding/university', to: 'onboardings#university'
  post '/onboarding', to: 'onboardings#create_profile_info'

  # ORCID Flow
  get '/orcid/redirect', to: 'orcids#redirect'

  # Marketplace
  get '/marketplace', to: 'marketplaces#index'
  # Matching all subroutes for React Router routing
  get '/marketplace/home', to: 'marketplaces#index'
  match '/marketplace/request_for_proposal/:proposal', to: 'marketplaces#index', via: [:get]
  match '/company/:identifier', to: 'marketplaces#index', via: [:get]
  match '/profile/:id', to: 'marketplaces#index', via: [:get]
  post '/profile/image-upload', to: 'users#image_upload'
  match '/reviewer_dashboard', to: 'marketplaces#index', via: [:get]
  match '/reviewer_dashboard/proposals', to: 'marketplaces#index', via: [:get]
  match '/account', to: 'marketplaces#index', via: [:get]
  get '/research/:research_area/:opportunity', to: 'marketplaces#index'
  get '/research/:research_area', to: 'marketplaces#index'

  get '/search', to: 'marketplaces#search'
  post '/toggle_rfp', to: 'request_for_proposals#toggle_rfp'
  post '/save_rfp', to: 'request_for_proposals#save_rfp'
  post '/unsave_rfp', to: 'request_for_proposals#unsave_rfp'
  post '/follow_company', to: 'companies#follow_company'
  post '/unfollow_company', to: 'companies#unfollow_company'

  post '/request_for_proposals/waitlist', to: 'request_for_proposals#waitlist'

  # Submit Proposal
  get '/submit_proposal/:rfp_identifier', to: 'marketplaces#index'
  get '/submit_proposal/:rfp_identifier/confirmation/:proposal_identifier', to: 'marketplaces#index'

  put '/user_profile_infos/:user_id', to: 'user_profile_infos#update'

  resources :research_follows, only: [:create]
  resources :request_for_proposals, only: [:new, :create, :index]
  resources :proposals, only: [:create, :index, :update]
  resources :proposal_discussions, only: [:create, :update, :index]
  resources :startups, only: [:create, :update, :destroy]
  resources :patents, only: [:create, :index, :update, :destroy]
  resources :publications, only: [:create, :index, :update, :destroy]
  resources :fundings, only: [:create, :index, :update, :destroy]
  resources :users, only: [:show, :update]
  resources :educations, only: [:create, :update, :destroy]
  resources :universities, only: [:index]
  resources :companies, only: [:index]
  resources :foundations, only: [:index]
  resources :government_organizations, only: [:index]
  resources :email_response_templates, only: [:create, :index]

  get '/research_keywords/search', to: 'research_keywords#search'
  get '/universities/search', to: 'universities#search'

  # Send email
  post '/messages/proposal_contact', to: 'messages#proposal_contact'
  post '/messages/share_proposal', to: 'messages#share_proposal'
  post '/messages/request_for_proposal_contact', to: 'messages#request_for_proposal_contact'

  # campaign aliases
  get '/birthdefects', to: redirect('campaigns/anorectal-malformation')

  # Set Interests
  post '/set_interests', to: 'users#set_interests'

  # My donations
  resources :donations, only: [:index] do
    post :refund, on: :member
    post :redonate, on: :member
  end

  # Root Path
  # root 'pages#coming_soon'
  get 'home', to: 'pages#home'
  root 'pages#home'
end
