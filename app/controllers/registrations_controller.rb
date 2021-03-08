class RegistrationsController < Devise::RegistrationsController
  layout "clean", :only => [:index]

  def index
    if user_signed_in?
      redirect_to root_url
    end
    @title = "Register"
  end

  def create
    super

    if resource && resource.id
      # Partner registration
      if params[:user].try(:[], :company)
        CompaniesRelation.transaction do
          company_name = params[:user][:company]
          company = Company.find_or_create_by(:company_name => company_name)

          user = User.find(resource.id)
          user.role = User::ROLES[:company]
          user.save

          company_relation = CompaniesRelation.new
          company_relation.user_id = resource.id
          company_relation.company_id = company.id
          company_relation.save
        end
      end

      # University registration
      if resource && resource.id && params[:university]
        user = User.find(resource.id)
        user.role = User::ROLES[:university]
        user.save
      end
    end
  end
end
