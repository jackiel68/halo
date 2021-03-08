module RailsAdmin
  module Config
    module Actions
      class LaunchCampaign < RailsAdmin::Config::Actions::Base
        # This ensures the action only shows up for Campaigns
        register_instance_option :visible? do
          authorized? && bindings[:object].class == Campaign && bindings[:object].launched_at.nil?
        end
        # We want the action on members, not the Campaigns collection
        register_instance_option :member do
          true
        end
        register_instance_option :link_icon do
          'icon-off'
        end
        # You may or may not want pjax for your action
        register_instance_option :pjax? do
          false
        end
        # Controller logic
        register_instance_option :controller do
          Proc.new do
            if @object.update_status('Launched')
              flash[:success] = 'Campaign successfully launched'
            else
              flash[:error] = @object.errors.full_messages.to_sentence
            end
            redirect_to(back_or_index)
          end
        end
      end
    end
  end
end
