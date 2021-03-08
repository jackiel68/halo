FactoryBot.define do
  factory :follower do
    campaign { build(:campaign) }
    email { 'myemail@gmail.com' }
  end
end
