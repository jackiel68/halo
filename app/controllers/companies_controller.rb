class CompaniesController < ApplicationController
  include ActionView::Helpers::SanitizeHelper

  def show
    @company = Company.find_by_identifier(params[:identifier])
    render :json => { :company => @company }
  end

  def index
    @companies = Company.all
    render :json => { :companies => @companies }
  end

  def search
    companies = Company.search_for(sanitize(params[:company_name])).limit(500)

    return render :json => {
      :companies => companies.map do |company|
        {
          key: company.id,
          text: company.company_name,
          value: company.id,
        }
      end.sort_by { |company| company[:text].downcase.index(params[:company_name].downcase) || 1000000000 },
    }
  end

  def follow_company
    company = Company.find(params[:company_id])

    CompanyFollower.create({
      :user_id => current_user.id,
      :company_id => company.id,
    })

    respond_to do |format|
      format.json {
        render json: { :success => true }
      }
    end
  end

  def unfollow_company
    company = Company.find(params[:company_id])

    CompanyFollower.where(
      :user_id => current_user.id,
      :company_id => company.id,
    ).first.try(:destroy)

    respond_to do |format|
      format.json {
        render json: { :success => true }
      }
    end
  end
end
