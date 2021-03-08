require 'nokogiri'
require 'csv'

doc = File.open("#{Rails.root}/data/desc2019.xml") { |f| Nokogiri::XML(f) }

descriptors = Set.new(doc.xpath("//DescriptorName//String")) do |descriptor_node|
  descriptor_match = descriptor_node.to_s.match(/<String>(.+)<\/String>/)
  descriptor_match[1]
end.to_a

CSV.open("#{Rails.root}/data/descriptors.csv", 'w') do |writer|
  descriptors.each do |descriptor|
    writer << [descriptor]
  end
end
