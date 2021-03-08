class Ability
  include CanCan::Ability

  def initialize(user)
    can :read, :all # allow everyone to read everything
    if user && user.is_admin?
      can :access, :rails_admin # only allow admin users to access Rails Admin
      can :dashboard, :all
      can :manage, :all
      cannot [:update, :destroy], Campaign do |campaign|
        campaign.status == :closed
      end
      cannot [:create, :update, :destroy], [Donation, Identity, PaperTrail::Version, PaperTrail::VersionAssociation]
    end
  end
end
