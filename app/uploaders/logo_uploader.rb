class LogoUploader < ImageUploader
  version :landscape do
    process resize_to_fit: [nil, 100]
  end
end
