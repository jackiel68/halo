require 'rails_helper'

RSpec.describe Campaign, type: :model do
  subject { build(:campaign) }
  
  it 'is valid' do
    expect(subject.valid?).to eq(true)
  end
end
