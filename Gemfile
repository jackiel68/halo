source 'https://rubygems.org'
ruby '2.5.3'

# Essentials
gem 'rails', '4.2.8'
gem 'puma'
gem 'pg', '0.20'

# Search
gem 'pg_search'

# Assets
gem 'sass-rails', '~> 5.0'
gem 'uglifier'
gem 'bower-rails', '~> 0.10.0'

# Webpacker
gem 'webpacker', '~> 4.x'

# Authentication
gem 'bcrypt'
gem 'omniauth-facebook'
gem 'devise'
gem 'omniauth-orcid', '~> 2.1.1'

# Forms
gem 'simple_form'

# Versions
gem 'paper_trail', '~> 4.0.0'

# Permissions
gem 'cancancan'

# Admin
gem 'rails_admin', github: 'sferik/rails_admin', ref: '49aafbb'

# Payments
gem 'stripe'

# Metatags
gem 'meta-tags'
gem 'sitemap_generator'

# Exceptions
gem 'rollbar', '~> 2.11.4'

# Analytics
gem 'analytics-ruby', '~> 2.0.0'

# Ruby variables in Javascript
gem 'gon'

# Images
gem 'aws-sdk'
gem 'carrierwave'
gem 'mini_magick'
gem 'carrierwave-aws'
gem 'unf'

# Utilities
gem 'date_validator'
gem 'acts_as_list'
gem 'friendly_id'
gem 'redcarpet'
gem 'bitly'
gem 'customerio'

gem 'nokogiri', :require => true
gem 'httparty', :require => true

# Use reverse proxy for WordPress blog
gem "rack-reverse-proxy", require: "rack/reverse_proxy"

group :development do
  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'quiet_assets'
  gem 'awesome_print'
  gem 'annotate'
end

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'pry-rails'
  gem 'factory_bot_rails'
  gem 'rspec-rails', '~> 3.6'
  gem 'dotenv-rails'
end

group :production do
  gem 'rails_12factor'
end
