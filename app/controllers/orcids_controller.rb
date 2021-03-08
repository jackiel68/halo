require 'uri'
require 'net/http'
require 'net/https'
require 'json'

class OrcidsController < ApplicationController
  layout "clean", :only => [:redirect]

  def redirect
    Rails.logger.info(params)
    omniauth = request.env["omniauth.auth"]
    session[:omniauth] = omniauth
    session[:params]   = params

    @code = ActionView::Base.new.sanitize(params[:code])
    gon.authorization_code = @code

    @body = {
      client_id: ENV['ORCID_CLIENT_ID'],
      client_secret: ENV['ORCID_CLIENT_SECRET'],
      grant_type: 'authorization_code',
      code: @code,
      redirect_uri: ENV['ORCID_REDIRECT'],
    }.to_json

    uri = URI.parse("https://#{ENV['ORCID_URL']}/oauth/token")
    https = Net::HTTP.new(uri.host, uri.port)
    https.use_ssl = true
    req = Net::HTTP::Post.new(uri.path, 'Content-Type' => 'application/json')
    req.body = "#{@body}"
    res = https.request(req)
  end
end
