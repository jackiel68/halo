class PatentsController < ApplicationController
  layout "clean", :only => [:index]

  before_filter :require_user!, :only => [:create]

  def create
    begin
      Patent.transaction do
        patent = Patent.new
        patent.user_id = current_user.id
        patent.title = params[:patent]['patentTitle']
        patent.status = params[:patent]['patentStatus']
        patent.patent_office = params[:patent]['patentOffice']
        patent.application_number = params[:patent]['patentAppNumber']
        patent.url = params[:patent]['patentUrl']
        patent.abstract = params[:patent]['patentAbstract']
        patent.filing_date = params[:patent]['patentFilingDate']
        patent.save!

        return render :json => { :success => true, :patent => patent }
      end
    rescue
      return render :json => { :success => false }
    end
  end

  def update
    patent = Patent.find(params[:id])

    if !current_user || current_user.id.to_i != patent.user_id.to_i
      return render :json => { :success => false, :errors => "You are not authorized for this update" }
    end

    begin
      Patent.transaction do
        patent.title = params[:patent]['patentTitle']
        patent.status = params[:patent]['patentStatus']
        patent.patent_office = params[:patent]['patentOffice']
        patent.application_number = params[:patent]['patentAppNumber']
        patent.url = params[:patent]['patentUrl']
        patent.abstract = params[:patent]['patentAbstract']
        patent.filing_date = params[:patent]['patentFilingDate']
        patent.save!

        return render :json => { :success => true, :patent => patent }
      end
    rescue
      return render :json => { :success => false }
    end
  end

  def index
    @patents = Patent.where(:user_id => params[:user_id])
    render :json => { :patents => @patents }
  end

  def destroy
    patent = Patent.find(params[:id])

    if !current_user || current_user.id.to_i != patent.user_id.to_i
      return render :json => { :success => false, :errors => "You are not authorized for this update" }
    end

    patent.destroy

    render :json => { :success => true }
  end
end
