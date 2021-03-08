class ResearchKeyword < ActiveRecord::Base
  include PgSearch

  pg_search_scope :search_for, against: %i(research_type), using: { tsearch: { normalization: 2, prefix: true, dictionary: "english", any_word: true } }
end

# == Schema Information
#
# Table name: research_keywords
#
#  id            :integer          not null, primary key
#  created_at    :datetime
#  updated_at    :datetime
#  research_type :string
#
# Indexes
#
#  index_research_keywords_on_research_type  (research_type)
#
