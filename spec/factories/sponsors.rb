FactoryBot.define do
  factory :sponsor do
    name { 'Important Sponsor' }
    url { 'http://www.google.com' }
    is_university { false }
    tagline { '' }
    logo { Rack::Test::UploadedFile.new(Rails.root.join('public/halo.jpg'), 'image/jpeg') }
  end
end
