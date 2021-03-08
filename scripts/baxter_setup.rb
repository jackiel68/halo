
company = Company.where(:company_name => "Baxter").first
company.description = "Baxter is a multinational Fortune 500 health care company based in Deerfield, Illinois focused on products to treat hemophilia, kidney disease, immune disorders and other chronic and acute medical conditions."
company.logo_url = "https://res.cloudinary.com/hqwb64en1/image/upload/v1574153109/baxter-logo_fhhdwg.png"
company.company_image_url = "https://res.cloudinary.com/hqwb64en1/image/upload/v1574169395/baxter-company_rsqlpy.png"
company.hero_image_url = "https://res.cloudinary.com/hqwb64en1/image/upload/v1574169395/baxter-hero_pnrdg3.png"
company.location = "Deerfield, IL"
company.employee_count = "47k"
company.sales_amount = "$118B"
company.funding_amount = "$150,000 to $300,000"
company.save

CompanyReviewer.find_or_create_by(
  :reviewer_name => "Per-Ola Wictor, PhD",
  :position => "Director, HD Therapy and Water Technologies",
  :introduction => "For the past five years, I’ve led R&D and new product development for HD therapy and water technologies at Baxter. My team and I based in Lund, Sweden are excited to review your proposals.",
  :image_url => "https://res.cloudinary.com/hqwb64en1/image/upload/v1574153110/per-ola-wictor_shvoyd.png",
  :company => company
)

CompanyReviewer.find_or_create_by(
  :reviewer_name => "Matt Muller",
  :position => "Director, Device Engineering",
  :introduction => "I joined Baxter more than 22 years ago after receiving my PhD in biomedical engineering from Rensselaer Polytechnic Institute. Based in our headquarters outside Chicago, I’m responsible for Baxter’s home dialysis products, which contribute more $1.1B in annual revenue, and an R&D budget of approximately $45M.",
  :image_url => "https://res.cloudinary.com/hqwb64en1/image/upload/v1574153110/matt-muller_wzpyhq.png",
  :company => company
)

CompanyPartner.find_or_create_by(
  :institution_name => "John Hopkins University",
  :partner_name => "Jim Fateran, PhD",
  :description => "Partnering with John Hopkins University and Lifebridge Health to ID needs around colorectal surgery and support Baxter’s BioDesign",
  :research_area => "Nephrology",
  :company => company
)

CompanyPartner.find_or_create_by(
  :institution_name => "John Hopkins University",
  :partner_name => "Tom Gajewski, PhD",
  :description => "Launched new program with The University of Chicago and University of Illinois at Urbana-Champaign using cross disciplinary teams to solve complex problems",
  :research_area => "Clean Water",
  :company => company
)

CompanyPartner.find_or_create_by(
  :institution_name => "Tel Aviv University",
  :partner_name => "Susan Rogers, PhD",
  :description => "Collaborating with Ramot at Tel Aviv University and Tel AvIV Sourasky Medical Center to bring early-stage innovations in surgical care to market",
  :research_area => "Clean Water",
  :company => company
)

CompanyPartner.find_or_create_by(
  :institution_name => "Mayo Clinic",
  :partner_name => "Gerald Tuoey, PhD",
  :description => "Working with Mayo Clinic to develop a US renal care center that will serve patients across the continuum of renal care to drive better patient outcomes",
  :research_area => "Clean Water",
  :company => company
)

CompanyImage.find_or_create_by(
  :image_url => "https://res.cloudinary.com/hqwb64en1/image/upload/v1574169394/baxter-image-1_uttyyi.png",
  :company => company
)

CompanyImage.find_or_create_by(
  :image_url => "https://res.cloudinary.com/hqwb64en1/image/upload/v1574169394/baxter-image-2_en0ex4.png",
  :company => company
)

CompanyQuote.find_or_create_by(
  :employee_name => "Rahul Singh, PhD",
  :image_url => "https://res.cloudinary.com/hqwb64en1/image/upload/v1574169400/rahul-singh_vdejuu.png",
  :role => "Research Scientist",
  :quote => "My research has a direct impact on patient lives. Being in an industrial setting, I lead translation of novel materials into marketable medical products.",
  :company => company
)

CompanyQuote.find_or_create_by(
  :employee_name => "Jimmy Su, PhD",
  :image_url => "https://res.cloudinary.com/hqwb64en1/image/upload/v1574169397/jimmy-su_nnbh7r.png",
  :role => "2019 Baxter Young  Investigators Award Recipient",
  :quote => "Although the idea of laboratory-grown tissues or organs-on-demand for replacement therapies was once considered science fiction, we have made a lot of progress in recent decades.",
  :company => company
)

CompanyQuote.find_or_create_by(
  :employee_name => "Edward Osawa, PhD",
  :image_url => "https://res.cloudinary.com/hqwb64en1/image/upload/v1574169397/edward-osawa_eiopb7.png",
  :role => "Principal R&D Scientist, Advanced Surgery",
  :quote => "I think of other company mottos, we have the coolest one: saving and sustaining lives. At the manufacturing facility where we make Floseal in Hayward, California, our mission is ingrained in everybody.",
  :company => company
)

CompanyFocusType.find_or_create_by(
  :focus_type => "Nephrology",
  :company => company
)

CompanyFocusType.find_or_create_by(
  :focus_type => "Clean Water",
  :company => company
)

rfp = RequestForProposal.where(:identifier => "reducing-water-hardness").first

resource = AvailableResource.find_or_create_by(
  :resource_type => "funding",
  :request_for_proposal => rfp
)
resource.description = "Baxter offers grant funding of up to $300k"
resource.save

resource = AvailableResource.find_or_create_by(
  :resource_type => "mentorship_expertise",
  :request_for_proposal => rfp
)
resource.description = "Baxter has a team of 200 PhDs in materials science to help you"
resource.save

rfp.subtitle = "$150,000 to $300,000 in funding"
rfp.image = "https://res.cloudinary.com/hqwb64en1/image/upload/v1575101417/baxter-rfp-picture_o80hlq.png"
rfp.save
