class FoundationsController < ApplicationController
  def index
    @foundations = Foundation.all
    render :json => { :foundations => @foundations }
  end
end
