class Patent < ActiveRecord::Base
  has_many :proposals, through: :proposals_patents
  has_many :proposals_patents, :dependent => :delete_all, :autosave => true

  validates :title, presence: true
  validates :url, presence: true
  validates :abstract, presence: true
  validates :filing_date, presence: true
  validates :status,
            inclusion: { in: %w(provisional non_provisional issued),
            message: "%{value} is not a valid patent status" },
            allow_blank: true

  STATUSES = {
    :provisional => "Provisional",
    :non_provisional => "Non-provisional",
    :issued => "Issued",
  }
end

# == Schema Information
#
# Table name: patents
#
#  id                 :integer          not null, primary key
#  created_at         :datetime
#  updated_at         :datetime
#  user_id            :integer
#  title              :string
#  patent_office      :string
#  application_number :string
#  url                :string
#  description        :text
#  issue_date         :datetime
#  status             :string
#  abstract           :text
#  filing_date        :datetime
#
# Indexes
#
#  index_patents_on_user_id  (user_id)
#
