class Proposal < ActiveRecord::Base
  STATUS = {
    :open => 0, # 0
    :qualified => 3, # 1
    :screened => 4, # 2
    :contacted => 1, # 3
    :declined => 2, # 4
  }.freeze

  belongs_to :request_for_proposal
  belongs_to :user
  has_many :proposals_patents, :dependent => :delete_all, :autosave => true
  has_many :proposals_fundings, :dependent => :delete_all, :autosave => true
  has_many :proposals_publications, :dependent => :delete_all, :autosave => true
  has_many :patents, through: :proposals_patents
  has_many :fundings, through: :proposals_fundings
  has_many :publications, through: :proposals_publications
  has_many :proposal_discussions

  scope :open, -> { where(:status => STATUS[:open]) }
  scope :contacted, -> { where(:status => STATUS[:contacted]) }
  scope :declined, -> { where(:status => STATUS[:declined]) }
  scope :qualified, -> { where(:status => STATUS[:qualified]) }
  scope :screened, -> { where(:status => STATUS[:screened]) }

  before_save :add_identifier

  def add_identifier
    self.identifier = self.identifier ? self.identifier : SecureRandom.uuid
  end

  # Not good for large datasets with N+1 but fine for small outputs
  def as_json(options = { })
    h = super(options)
    h["user"] = User.find_by_id(user_id).try(:for_show)
    h["patents"] = patents
    h["publications"] = publications
    h["fundings"] = fundings
    h
  end
end

# == Schema Information
#
# Table name: proposals
#
#  id                      :integer          not null, primary key
#  created_at              :datetime
#  updated_at              :datetime
#  request_for_proposal_id :integer
#  user_id                 :integer
#  research_hypothesis     :text
#  hypothesis_basis        :text
#  validation_procedure    :text
#  future_validation       :text
#  completed               :boolean          default(FALSE)
#  status                  :integer          default(0), not null
#  submitted_for_pi        :boolean          default(FALSE)
#  identifier              :string
#  first_completed_at      :datetime
#
# Indexes
#
#  index_proposals_on_identifier                          (identifier)
#  index_proposals_on_request_for_proposal_id             (request_for_proposal_id)
#  index_proposals_on_request_for_proposal_id_and_status  (request_for_proposal_id,status)
#  index_proposals_on_user_id                             (user_id)
#
