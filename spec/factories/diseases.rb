FactoryBot.define do
  factory :disease do
    name { 'Bad Disease' }
    slug { 'bad-disease' }
    intro { 'Each year in the U.S., many people suffer from bad disease.' }
    description { 'A very bad disease.' }
    stats { 'Many people are affected.' }
    image { Rack::Test::UploadedFile.new(Rails.root.join('public/halo.jpg'), 'image/jpeg') }
    cover { Rack::Test::UploadedFile.new(Rails.root.join('public/halo.jpg'), 'image/jpeg') }
  end
end
