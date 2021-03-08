class ResearchKeywordsController < ApplicationController
  include ActionView::Helpers::SanitizeHelper

  def search
    research_keywords = ResearchKeyword.search_for(sanitize(params[:research_type])).limit(500)

    return render :json => {
      :research_keywords => research_keywords.sort_by { |k| k.research_type }.map do |keyword|
        {
          key: keyword.research_type,
          text: keyword.research_type,
          value: keyword.research_type,
        }
      end.sort_by { |keyword| keyword[:text].downcase.index(params[:research_type].downcase) || 1000000000 },
    }
  end
end
