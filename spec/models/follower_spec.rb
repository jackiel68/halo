require 'rails_helper'

RSpec.describe Follower, type: :model do
  subject { build(:follower) }

  it 'is valid' do
    expect(subject.valid?).to eq(true)
  end
end
