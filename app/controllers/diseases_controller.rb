class DiseasesController < ApplicationController
  skip_before_action :http_basic_authenticate
  def show
    @disease = Disease.friendly.find(params[:id])
    @loved_ones = @disease.donations.pluck(:loved_one_name).uniq.reject(&:empty?)
  end
end
