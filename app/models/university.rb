class University < ActiveRecord::Base
  include PgSearch

  pg_search_scope :search_for,
    against: %i(name),
    using: {
      tsearch: {
        normalization: 2,
        prefix: true,
        dictionary: "english",
        any_word: true,
      },
    }
end

# == Schema Information
#
# Table name: universities
#
#  id   :integer          not null, primary key
#  name :string
#
