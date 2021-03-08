class Funding < ActiveRecord::Base
  has_many :proposals, through: :proposals_fundings
  has_many :proposals_fundings, :dependent => :delete_all, :autosave => true

  validates :title, presence: true
  validates :description, presence: true
  validates :amount, presence: true

  NIH_GRANT_TYPES = [
    'F32',
    'K99/R00',
    'P01',
    'P20',
    'P30',
    'P50',
    'R01',
    'R03',
    'R05',
    'R13',
    'R15',
    'R21',
    'R34',
    'R41/42',
    'R43/44',
    'R56',
    'U01',
    'R24',
    'R25',
    'X01',
  ].freeze

  SPONSOR_TYPES = {
    :government => "Government",
    :university => "University",
    :foundation => "Foundation",
    :company => "Industry"
  }.freeze

  SPONSOR_CLASS = {
    :government => "GovernmentOrganization",
    :university => "University",
    :foundation => "Foundation",
    :company => "Company"
  }

  def as_json(options = {})
    h = super(options)
    h["sponsor"] = SPONSOR_CLASS[(sponsor_type || :company).to_sym].constantize.find_by_id(sponsor_id)
    h
  end
end

# == Schema Information
#
# Table name: fundings
#
#  id                 :integer          not null, primary key
#  created_at         :datetime
#  updated_at         :datetime
#  user_id            :integer
#  description        :text
#  sponsor_id         :integer
#  date               :datetime
#  amount             :decimal(, )
#  title              :string
#  sponsor_type       :string
#  grant_type         :string
#  url                :string
#  end_date           :datetime
#  other_sponsor      :string
#  award_recipient_id :integer
#
# Indexes
#
#  index_fundings_on_award_recipient_id  (award_recipient_id)
#  index_fundings_on_user_id             (user_id)
#
