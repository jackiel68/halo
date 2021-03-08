class GovernmentOrganizationsController < ApplicationController
  def index
    @government_organizations = GovernmentOrganization.all
    render :json => { :government_organizations => @government_organizations }
  end
end
