class Campaign < ActiveRecord::Base
  # Concerns
  extend FriendlyId
  friendly_id :name
  has_paper_trail
  mount_uploader :image, FeaturedImageUploader
  mount_uploader :facebook_image, FeaturedImageUploader
  #mount_uploader :cover, CoverImageUploader

  include Rails.application.routes.url_helpers
  include SocialHelper

  # Relationships
  has_many :campaign_notes
  has_many :campaign_advisors, dependent: :destroy
  has_many :campaign_questions, dependent: :destroy
  has_many :donations, dependent: :destroy
  has_many :donors, through: :donations, source: :user
  has_many :followers, dependent: :destroy
  belongs_to :disease
  belongs_to :sponsor

  # Validations
  validates :name, presence: true, uniqueness: true
  validates :description, presence: true
  validates :long_description, presence: true
  validates :goal, numericality: { greater_than: 0 }
  validates :launch_date, presence: true, date: { after: Proc.new { Time.now } }, on: :create
  validates :deadline, presence: true, date: { after: Proc.new { Time.now } }
  validates :disease, presence: true
  validates :sponsor, presence: true
  # validates :image, presence: true
  #validates :cover, presence: true
  validate :valid_status_update

  # Scopes
  scope :open, -> { where('closed_at IS NULL') }
  scope :upcoming, -> { open.where('launch_date > ?', Time.now).where(is_featured: false).sorted }
  scope :sorted, -> { order(launch_date: :asc) }

  # Callbacks
  after_save :set_featured_campaign

  # Class Methods
  def self.current
    Campaign.where(is_featured: true).first
  end

  # Instance Methods
  def current?
    is_featured
  end

  def successful?
    current_funds > goal
  end

  def status
    if current?
      :current
    elsif closed_at
      :closed
    else
      :upcoming
    end
  end

  def current_funds
    donations.sum(:amount)
  end

  def current_funds_in_percentage
    current_funds * 100 / goal
  end

  def outcome
    return 'in_progress' unless closed_at
    successful? ? 'successful' : 'unsuccessful'
  end

  def public_donors
    donors = []
    donations.non_anonymous.each do |donation|
      donors << donation.user
    end
    donors.uniq.compact
  end

  def milestones
    current_milestone_funding_display = [105000, current_funds].max
    # hack to make the current funding amount to be more real (i.e. not just a round number like $5,000)
    if current_milestone_funding_display > current_funds
      current_milestone_funding_display += current_funds
    end

    [
      {
        position: 1,
        name: 'Proof of Concept',
        description: 'Developed working prototype that has been successfully used in surgeries on dozens of babies in 40+ countries',
        project_duration: 24,
        current_funds: 40000,
        goal: 40000,
        goal_progress_display: 40000,
        funding_status: 'Success',
        project_status: 'Success'
      },
      {
        position: 2,
        name: 'Design',
        description: 'Enlist medical device company to modify design to meet rigorous quality and safety standards',
        project_duration: 6,
        current_funds: current_milestone_funding_display,
        goal: 150000,
        goal_progress_display: 150000,
        current: true,
        funding_status: current_funds >= goal ? 'Success' : 'In Progress',
        project_status: current_funds >= goal ? 'Success' : 'In Progress'
      },
      {
        position: 3,
        name: 'FDA Approval',
        description: 'Implement safety and quality control system; File and receive FDA approval',
        project_duration: 10,
        current_funds: 0,
        goal: 150000,
        goal_progress_display: 150000,
        funding_status: 'Not Started',
        project_status: 'Not Started'
      },
    ]
  end

  def achievement_text
    'Device is available to pediatric surgeons in the United States'
  end

  def milestone_funding_message
    'Dr. Frykman reached Milestone 1 with external funding and volunteer support. Now he needs your help to fund Milestone 2.'
  end

  def update_status(event)
    case event
    when 'Launched'
      if self.update(launched_at: Time.now)
        track_events(event)
      end
    when 'Closed'
      if self.update(closed_at: Time.now)
        if successful?
          donations.update_all(status: 'distributed')
        else
          donations.update_all(status: 'undistributed')
        end
        track_events(event)
      end
    end
  end

  def trackable_properties
    @trackable_properties ||= {
      campaign_name: self.name,
      campaign_description: self.description,
      campaign_image: self.image_url(:big),
      campaign_goal: self.goal,
      campaign_current_funds: self.current_funds,
      campaign_deadline: self.deadline
    }.merge(share_urls_for(self, raw: true, disable_referrer: true))
  end

  private

  def set_featured_campaign
    if self.is_featured?
      Campaign.where(is_featured: true)
        .where.not(id: self.id)
        .update_all(is_featured: false)
    end
  end

  def track_events(event)
    recipient_ids_for(event).each do |recipient_id|
      Analytics.track(
        user_id: recipient_id,
        event: "Got #{ event } Campaign Notification",
        properties: trackable_properties
      )
    end
  end

  def recipient_ids_for(event)
    case event
    when 'Launched'
      User.all
    when 'Closed'
      donors
    end.pluck(:id).uniq
  end

  def valid_status_update
    errors.add(:base, 'There should be at least one featured campaign') if closed_at_changed? && is_featured?
  end
end

# == Schema Information
#
# Table name: campaigns
#
#  id               :integer          not null, primary key
#  name             :string           default(""), not null
#  slug             :string
#  description      :text             default(""), not null
#  use_of_funds     :text             default(""), not null
#  timeline         :text             default(""), not null
#  risks            :text             default(""), not null
#  goal             :decimal(11, 2)   default(0.0)
#  deadline         :datetime         not null
#  disease_id       :integer          not null
#  created_at       :datetime
#  updated_at       :datetime
#  is_featured      :boolean          default(FALSE), not null
#  image            :string           default("")
#  social_message   :string           default(""), not null
#  sponsor_id       :integer
#  launched_at      :datetime
#  closed_at        :datetime
#  long_description :text             default(""), not null
#  launch_date      :datetime
#  cover            :string           default(""), not null
#  facebook_image   :string           default("")
#
