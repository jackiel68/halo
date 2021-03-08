require 'segment/analytics'

if !Rails.env.test? && !Rails.env.development?
  Analytics = Segment::Analytics.new({
    write_key: ENV['SEGMENT_RB_WRITE_KEY'],
    on_error: Proc.new { |status, msg| print msg }
  })
end
