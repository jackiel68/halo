class AvatarUploader < ImageUploader
  version :big do
    process resize_to_fill: [200, 200]
  end

  version :medium do
    process resize_to_fill: [100, 100]
  end

  version :small do
    process resize_to_fill: [50, 50]
  end
end
