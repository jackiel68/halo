class UniversitiesController < ApplicationController
  include ActionView::Helpers::SanitizeHelper

  def search
    universities = University.search_for(sanitize(params[:name])).limit(500)

    return render :json => {
      :universities => universities.map do |university|
        {
          key: university.id,
          text: university.name,
          value: university.name,
        }
      end.sort_by { |university| university[:text].downcase.index(params[:name].downcase) || 1000000000 }
    }
  end

  def index
    return render :json => {
      :universities => University.all.map do |university|
        {
          key: university.name,
          text: university.name,
          value: university.name,
        }
      end,
    }
  end
end
