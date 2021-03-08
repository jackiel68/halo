module Tokenizable
  extend ActiveSupport::Concern

  included do
    before_validation :set_tokens
  end

  class_methods do
    attr_reader :tokenizable_attrs

    def tokenize(*tokenizable_attrs)
      @tokenizable_attrs = tokenizable_attrs
    end

    def tokenizable_attrs
      @tokenizable_attrs
    end
  end

  def set_tokens
    self.class.tokenizable_attrs.each do |column|
      set_token(column)
    end
  end

  def set_token(column)
    if self.send(column).blank?
      self.send("#{ column }=", generate_token(column))
    end
  end

  def generate_token(column)
    loop do
      t = SecureRandom.hex
      break t unless self.class.where("#{ column.to_s } = ?", t).any?
    end
  end
end
