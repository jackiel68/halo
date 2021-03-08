class Donation < ActiveRecord::Base
  # Constants
  DEFAULT_AMOUNT = 10.00
  STATUSES = %w(pending distributed undistributed refunded redonated)

  # Virtual_attributes
  attr_reader :has_loved_one
  attr_accessor :stripe_card_token

  # Concerns
  has_paper_trail

  # Relationships
  belongs_to :campaign
  belongs_to :user
  belongs_to :parent_donation, class_name: 'Donation'

  # Validations
  validates :amount, numericality: { greater_or_equal_than: 1.00 }
  validates :status, presence: true, inclusion: { in: STATUSES }

  # Scopes
  scope :undistributed, -> { where(status: 'undistributed') }
  scope :non_anonymous, -> { where(is_anonymous: false) }

  # Callbacks
  after_create :notify_referrer

  # Instance methods
  def save_with_payment!
    if valid?
      # Create customer
      customer = Stripe::Customer.create(
        email: user.email,
        source: stripe_card_token
      )
      user.update!(stripe_customer_id: customer.id)

      # Create charge
      charge = Stripe::Charge.create(
        customer: customer.id,
        amount: amount_in_cents,
        currency: 'usd',
        description: "Donation to #{ campaign.name }"
      )
      self.stripe_charge_id = charge.id

      save!
    end
  rescue Stripe::CardError, Stripe::InvalidRequestError => e
    puts e
    Rollbar.log('critical', e)
    errors.add :base, 'There was a problem with your credit card.'
    false
  end

  def refund!
    Stripe::Refund.create(
      charge: stripe_charge_id
    )
    self.status = 'refunded'
    save!
  rescue Stripe::CardError, Stripe::InvalidRequestError => e
    Rollbar.log('critical', e)
    false
  end

  def redonate_to!(campaign)
    Donation.transaction do
      new_donation = self.dup
      new_donation.assign_attributes(
        campaign: campaign,
        status: 'pending',
        parent_donation_id: self.id
      )
      new_donation.save!

      self.update!(status: 'redonated', stripe_charge_id: nil)
    end
  end

  private

  def amount_in_cents
    (amount * 100).to_i
  end

  def notify_referrer
    return unless referrer_id

    Analytics.track(
      user_id: referrer_id,
      event: 'Got a referral conversion',
      properties: {
        donor_name: user.name,
        campaign_name: campaign.name,
        donation_amount: amount
      }
    )
  end
end

# == Schema Information
#
# Table name: donations
#
#  id                 :integer          not null, primary key
#  campaign_id        :integer          not null
#  user_id            :integer          not null
#  loved_one_name     :string           default(""), not null
#  created_at         :datetime
#  updated_at         :datetime
#  amount             :decimal(8, 2)    default(10.0)
#  is_anonymous       :boolean          default(FALSE), not null
#  referrer_id        :integer
#  stripe_charge_id   :string
#  status             :string           default("pending"), not null
#  parent_donation_id :integer
#
