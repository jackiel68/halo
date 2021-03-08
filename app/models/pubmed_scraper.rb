class PubmedScraper

  # Example url: https://www.ncbi.nlm.nih.gov/pubmed/30726003?report=xml&format=text
  def initialize(pubmed_url)
    @url = pubmed_url
    parse_page = Nokogiri::XML(HTTParty.get(@url))
    @document = Nokogiri::XML(parse_page.children[1].children[0].content)
  end

  def publisher_name
    @publisher_name ||= @document.xpath('//PublisherName').children.map(&:content).join(' ') if @document.xpath('//PublisherName').present?
  end

  def abstract
    @abstract ||= @document.xpath('//AbstractText').children.map(&:content).join(' ') if @document.xpath('//AbstractText').present?
  end

  def article_title
    @article_title ||= @document.xpath('//ArticleTitle').children.map(&:content).join(' ') if @document.xpath('//ArticleTitle').present?
  end

  def journal_title
    @journal_title ||= @document.xpath('//Journal/Title').children.map(&:content).join(' ') if @document.xpath('//Journal/Title').present?
  end

  def book_title
    @book_title ||= @document.xpath('//BookTitle').children.map(&:content).join(' ') if @document.xpath('//BookTitle').present?
  end

  def pubdate_year
    @pubdate_year ||= @document.xpath('//PubDate/Year').children.map(&:content).join(' ') if @document.xpath('//PubDate/Year').present?
  end

  def pubdate_month
    @pubdate_month ||= @document.xpath('//PubDate/Month').children.map(&:content).join(' ') if @document.xpath('//PubDate/Month').present?
  end

  def url
    @url
  end
end
