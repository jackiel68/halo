class FeaturedImageUploader < ImageUploader
  version :big do
    process resize_to_fit: [1024, nil]
  end

  version :thumb do
    process resize_to_fill: [420, 221]
  end
end
