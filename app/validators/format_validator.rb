class FormatValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    if value.present?
      unless value =~ self.class::REGEX
        record.errors[attribute] << (options[:message] || I18n.t(:incorrect_format))
      end
    end
  end
end
