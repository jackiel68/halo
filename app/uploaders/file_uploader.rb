# encoding: utf-8

class FileUploader < CarrierWave::Uploader::Base

  # Include MiniMagick support:
  include CarrierWave::MiniMagick

  # Include the Sprockets helpers for Rails asset pipeline compatibility:
  include Sprockets::Rails::Helper

  # Override the directory where uploaded files will be stored.
  def store_dir
    "uploads/#{ model.class.model_name.plural }/#{ model.id }"
  end
end
