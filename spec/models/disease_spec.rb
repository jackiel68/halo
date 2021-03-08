require 'rails_helper'

RSpec.describe Disease, type: :model do
  subject { build(:disease) }
  
  it 'is valid' do
    expect(subject.valid?).to eq(true)
  end
end
