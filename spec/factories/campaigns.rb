FactoryBot.define do
  factory :campaign do
    name { 'My Campaign' }
    slug { 'my-campaign' }
    description { 'Campaign to save the world.' }
    long_description { 'Campaign to save the world, very long.' }
    use_of_funds { 'For saving the world.' }
    disease { build(:disease) }
    sponsor { build(:sponsor) }
    goal { 150_000.00 }
    launch_date { 1.day.from_now }
    deadline { 3.weeks.from_now }
    is_featured { true }
  end
end
