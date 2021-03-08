class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Concerns
  has_paper_trail
  mount_uploader :image, AvatarUploader

  include Contributor
  include Identifiable
  include Tokenizable
  tokenize :auth_token, :referrer_token

  # Relationships
  has_many :identities, dependent: :destroy
  has_and_belongs_to_many :diseases
  has_many :donations
  has_many :proposals
  has_many :campaigns, through: :donations
  has_many :user_keywords

  has_one :user_profile_info

  # Validations
  # validates :email, presence: true, email: true, uniqueness: true
  validates :password, presence: true, on: :create, unless: :omniauth_only

  after_create :identify_user, :track_signup

  ROLES = {
    :normal => 0,
    :company => 1,
    :university => 2,
  }.freeze

  SUB_ROLE = {
    :normal => 0,
    :admin => 1,
  }.freeze

  # Class Methods
  def self.create_with_omniauth(auth)
    if user = User.find_by(email: auth[:info][:email])
      user
    else
      name_array = auth[:info][:name].split(' ')

      create!(
        first_name: name_array.shift,
        last_name: name_array.join(' '),
        email: auth[:info][:email],
        password: Devise.friendly_token[0,20],
        omniauth_only: true
      )
    end
  end

  # Instance Methods
  def stripe_customer
    stripe_customer_id.present? ? Stripe::Customer.retrieve(stripe_customer_id) : nil
  end

  def name
    first_name.present? ? "#{ first_name } #{ last_name }" : email
  end

  def is_reviewer_admin?
    sub_role == SUB_ROLE[:admin]
  end

  def interests
    @interests ||= diseases.pluck(:name).join(',') if diseases.any?
  end

  def has_password?
    encrypted_password.present?
  end

  def profile_id
    [
      first_name.try(:downcase),
      last_name.try(:downcase),
      id,
    ].reject { |e| e.to_s.empty? }.join("-")
  end

  def track_signup
    if !Rails.env.development? && !Rails.env.test?
      Analytics.track(
        user_id: id,
        event: 'Signup'
      )
    end
  end

  def requires_onboarding?
    self.role == User::ROLES[:normal] && !UserProfileInfo.where(:user_id => self.id).exists?
  end

  def requires_university_onboarding?
    self.role == User::ROLES[:university] && !UserProfileInfo.where(:user_id => self.id).exists?
  end

  def company
    CompaniesRelation.company_for_user(self)
  end

  def for_show
    {
      company: CompaniesRelation.company_for_user(self),
      educations: Education.where(:user_id => id),
      startups: Startup.where(:user_id => id),
      profile_info: UserProfileInfo.where(:user_id => id).last,
      keywords: ResearchKeyword.where(:id => user_keywords.map(&:research_keyword_id)).map(&:research_type)  || [],
      created_at: created_at,
      updated_at: updated_at,
      email: email,
      image: image,
      first_name: first_name,
      last_name: last_name,
      id: id,
      profile_id: profile_id,
    }
  end

  # Not good for large datasets with N+1 but fine for small outputs
  def as_json(options = { })
    h = super(options)
    h["profile_info"] = UserProfileInfo.where(:user_id => id).last
    h["educations"] = Education.where(:user_id => id)
    h["startups"] = Startup.where(:user_id => id)
    h["company"] = CompaniesRelation.company_for_user(self)
    h
  end
end

# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  first_name             :string           default(""), not null
#  email                  :string           not null
#  password_digest_old    :string           default(""), not null
#  omniauth_only          :boolean          default(FALSE), not null
#  auth_token             :string           default(""), not null
#  referrer_token         :string           default(""), not null
#  is_admin               :boolean          default(FALSE), not null
#  created_at             :datetime
#  updated_at             :datetime
#  stripe_customer_id     :string           default(""), not null
#  last_name              :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :inet
#  last_sign_in_ip        :inet
#  role                   :integer          default(0), not null
#  image                  :string           default(""), not null
#  phone                  :string
#  sub_role               :integer          default(0), not null
#
# Indexes
#
#  index_users_on_auth_token            (auth_token) UNIQUE
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_referrer_token        (referrer_token) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#
