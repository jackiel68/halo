class CoverImageUploader < ImageUploader
  version :cover do
    process resize_to_fill: [1440, 790]
  end
end
