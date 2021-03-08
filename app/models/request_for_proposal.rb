class RequestForProposal < ActiveRecord::Base
  include PgSearch

  pg_search_scope :search_for, against: %i(title), using: { tsearch: { any_word: true } }

  belongs_to :user
  belongs_to :company
  has_many :innovation_types
  has_many :available_resources

  validates :therapeutic_area, presence: true
  validates :company_id, presence: true
  validates :title, presence: true
  validates :summary, presence: true

  scope :enabled, -> { where(:enabled => true) }

  alias_attribute :research_area, :therapeutic_area

  def self.generate_identifier(rfp_title)
    identifier = rfp_title.downcase.split(' ').join('-').gsub(/[^0-9a-z\-]/i, '')
    if self.where(:identifier => identifier).exists?
      "#{identifier}-#{rand(99999)}"
    else
      identifier
    end
  end

  # Not good for large datasets with N+1 but fine for small outputs
  def as_json(options = { })
    h = super(options)
    h["proposal_count"] = Proposal.where(:request_for_proposal_id => id, :completed => true).count
    h["proposal_open_count"] = Proposal.where(:request_for_proposal_id => id, :completed => true).open.count
    h["proposal_qualified_count"] = Proposal.where(:request_for_proposal_id => id, :completed => true).qualified.count
    h["proposal_screened_count"] = Proposal.where(:request_for_proposal_id => id, :completed => true).screened.count
    h["proposal_declined_count"] = Proposal.where(:request_for_proposal_id => id, :completed => true).declined.count
    h["therapeutic_area"] = UserProfileInfo::AREA_OF_EXPERTISE.with_indifferent_access[therapeutic_area]
    h["research_area"] = therapeutic_area
    h["innovation_types"] = innovation_types.map(&:as_json)
    h["available_resources"] = available_resources
    h["company"] = company
    h
  end
end

# == Schema Information
#
# Table name: request_for_proposals
#
#  id                          :integer          not null, primary key
#  created_at                  :datetime
#  updated_at                  :datetime
#  user_id                     :integer
#  therapeutic_area            :string
#  why_it_matters              :text
#  in_scope_proposals          :text
#  out_of_scope_proposals      :text
#  additional_resource_details :text
#  deadline                    :datetime
#  title                       :string
#  summary                     :text
#  company_id                  :integer          default(0), not null
#  identifier                  :string
#  enabled                     :boolean
#  subtitle                    :string
#  image                       :string           default(""), not null
#
# Indexes
#
#  index_request_for_proposals_on_identifier  (identifier)
#  index_request_for_proposals_on_user_id     (user_id)
#
