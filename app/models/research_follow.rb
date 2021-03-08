class ResearchFollow < ActiveRecord::Base
  validates_presence_of :email
  validates_presence_of :research_area

  validates :email, uniqueness: { scope: :research_area }

  def readable_research_area
    research_area.titleize
  end
end

# == Schema Information
#
# Table name: research_follows
#
#  id            :integer          not null, primary key
#  created_at    :datetime
#  updated_at    :datetime
#  email         :string
#  research_area :string
#
# Indexes
#
#  index_research_follows_on_email                    (email)
#  index_research_follows_on_research_area_and_email  (research_area,email) UNIQUE
#
