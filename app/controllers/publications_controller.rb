class PublicationsController < ApplicationController
  layout "clean", :only => [:index]

  before_filter :require_user!, :only => [:create]

  def import
    url = params[:url]
    return render :json => {} unless url

    scraper = PubmedScraper.new(url)

    return render :json => {
      :abstract => scraper.abstract,
      :publisher_name => scraper.publisher_name,
      :journal_title => scraper.journal_title,
      :article_title => scraper.article_title,
      :book_title => scraper.book_title,
      :pubdate_year => scraper.pubdate_year,
      :pubdate_month => scraper.pubdate_month,
      :url => scraper.url,
    }
  end

  def create
    begin
      Publication.transaction do
        publication = Publication.new
        publication.user_id = current_user.id
        publication.title = params[:publication]['publicationTitle']
        publication.abstract = params[:publication]['publicationAbstract']
        publication.publication_name = params[:publication]['publicationName']
        publication.date = params[:publication]['publicationDate']
        publication.url = params[:publication]['publicationURL'] if params[:publication]['publicationURL']
        publication.save!

        return render :json => { :success => true, :publication => publication }
      end
    rescue
      return render :json => { :success => false };
    end
  end

  def update
    publication = Publication.find(params[:id])

    if !current_user || current_user.id.to_i != publication.user_id.to_i
      return render :json => { :success => false, :errors => "You are not authorized for this update" }
    end

    begin
      Publication.transaction do
        publication.title = params[:publication]['publicationTitle']
        publication.abstract = params[:publication]['publicationAbstract']
        publication.publication_name = params[:publication]['publicationName']
        publication.date = params[:publication]['publicationDate']
        publication.url = params[:publication]['publicationURL'] if params[:publication]['publicationURL']
        publication.save!

        return render :json => { :success => true, :publication => publication }
      end
    rescue
      return render :json => { :success => false };
    end
  end

  def index
    @publications = Publication.where(:user_id => params[:user_id])
    render :json => { :publications => @publications }
  end

  def destroy
    publication = Publication.find(params[:id])

    if !current_user || current_user.id.to_i != publication.user_id.to_i
      return render :json => { :success => false, :errors => "You are not authorized for this update" }
    end

    publication.destroy

    render :json => { :success => true }
  end
end
