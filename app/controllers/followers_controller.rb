class FollowersController < ApplicationController
  def create
    @follower = Follower.new(follower_params)

    if @follower.save
      flash[:notice] = "Followed #{@follower.campaign_name}!"

      redirect_to campaign_path(@follower.campaign_slug)
    else
      redirect_to campaign_path(@follower.campaign_slug), flash: { error: "You are already following #{@follower.campaign_name}." }
    end
  end

  private

  def follower_params
    params.require(:follower).permit(:campaign_id, :email)
  end
end
