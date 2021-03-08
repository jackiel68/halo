class DiseaseCategoriesController < ApplicationController
  def show
    @category = DiseaseCategory.friendly.find(params[:id])
  end
end
