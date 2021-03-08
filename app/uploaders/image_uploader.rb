class ImageUploader < FileUploader
  DEFAULT_IMAGE = "/assets/icons/halo-o.svg"
  # Provide a default URL as a default if there hasn't been a file uploaded:
  def default_url
    asset_path(DEFAULT_IMAGE) #+ [version_name, "halo-o.svg"].compact.join('_'))
  end

  # Add a white list of extensions which are allowed to be uploaded.
  def extension_white_list
    %w(jpg jpeg gif png)
  end
end
