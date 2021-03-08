# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20200208082635) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "available_resources", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "request_for_proposal_id"
    t.string   "resource_type"
    t.text     "description"
  end

  add_index "available_resources", ["request_for_proposal_id"], name: "index_available_resources_on_request_for_proposal_id", using: :btree
  add_index "available_resources", ["resource_type"], name: "index_available_resources_on_resource_type", using: :btree

  create_table "campaign_advisors", force: :cascade do |t|
    t.string   "name",        default: "", null: false
    t.string   "title",       default: "", null: false
    t.string   "sector",      default: "", null: false
    t.string   "quote",       default: "", null: false
    t.string   "image",       default: "", null: false
    t.integer  "campaign_id",              null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "campaign_notes", force: :cascade do |t|
    t.integer  "advisor_id",               null: false
    t.integer  "campaign_id",              null: false
    t.string   "title",       default: "", null: false
    t.text     "description", default: "", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "campaign_questions", force: :cascade do |t|
    t.text     "question",    default: "", null: false
    t.text     "answer",      default: "", null: false
    t.integer  "position",                 null: false
    t.integer  "campaign_id",              null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "campaigns", force: :cascade do |t|
    t.string   "name",                                      default: "",    null: false
    t.string   "slug"
    t.text     "description",                               default: "",    null: false
    t.text     "use_of_funds",                              default: "",    null: false
    t.text     "timeline",                                  default: "",    null: false
    t.text     "risks",                                     default: "",    null: false
    t.decimal  "goal",             precision: 11, scale: 2, default: 0.0
    t.datetime "deadline",                                                  null: false
    t.integer  "disease_id",                                                null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "is_featured",                               default: false, null: false
    t.string   "image",                                     default: ""
    t.string   "social_message",                            default: "",    null: false
    t.integer  "sponsor_id"
    t.datetime "launched_at"
    t.datetime "closed_at"
    t.text     "long_description",                          default: "",    null: false
    t.datetime "launch_date"
    t.string   "cover",                                     default: "",    null: false
    t.string   "facebook_image",                            default: ""
  end

  create_table "companies", force: :cascade do |t|
    t.string  "company_name"
    t.text    "description"
    t.boolean "is_partner",        default: false, null: false
    t.string  "identifier"
    t.string  "url"
    t.string  "logo_url"
    t.string  "company_image_url"
    t.string  "hero_image_url"
    t.string  "location"
    t.string  "employee_count"
    t.string  "sales_amount"
    t.string  "funding_amount"
  end

  add_index "companies", ["company_name"], name: "index_companies_on_company_name", using: :btree
  add_index "companies", ["identifier"], name: "index_companies_on_identifier", using: :btree

  create_table "companies_relations", force: :cascade do |t|
    t.integer "company_id"
    t.integer "user_id"
    t.boolean "verified"
  end

  add_index "companies_relations", ["company_id"], name: "index_companies_relations_on_company_id", using: :btree
  add_index "companies_relations", ["user_id"], name: "index_companies_relations_on_user_id", using: :btree

  create_table "company_focus_types", force: :cascade do |t|
    t.string  "focus_type"
    t.integer "company_id"
  end

  add_index "company_focus_types", ["company_id"], name: "index_company_focus_types_on_company_id", using: :btree

  create_table "company_followers", force: :cascade do |t|
    t.integer "company_id"
    t.integer "user_id"
  end

  add_index "company_followers", ["company_id"], name: "index_company_followers_on_company_id", using: :btree
  add_index "company_followers", ["user_id"], name: "index_company_followers_on_user_id", using: :btree

  create_table "company_images", force: :cascade do |t|
    t.string  "image_url"
    t.integer "company_id"
  end

  add_index "company_images", ["company_id"], name: "index_company_images_on_company_id", using: :btree

  create_table "company_partners", force: :cascade do |t|
    t.string  "institution_name"
    t.string  "partner_name"
    t.string  "research_area"
    t.text    "description"
    t.integer "company_id"
  end

  add_index "company_partners", ["company_id"], name: "index_company_partners_on_company_id", using: :btree

  create_table "company_quotes", force: :cascade do |t|
    t.string  "employee_name"
    t.string  "role"
    t.text    "quote"
    t.string  "image_url"
    t.integer "company_id"
  end

  add_index "company_quotes", ["company_id"], name: "index_company_quotes_on_company_id", using: :btree

  create_table "company_reviewers", force: :cascade do |t|
    t.string  "reviewer_name"
    t.string  "position"
    t.string  "image_url"
    t.text    "introduction"
    t.integer "company_id"
  end

  add_index "company_reviewers", ["company_id"], name: "index_company_reviewers_on_company_id", using: :btree

  create_table "disease_categories", force: :cascade do |t|
    t.string   "name",                default: "",    null: false
    t.text     "description",         default: "",    null: false
    t.string   "image"
    t.string   "slug"
    t.boolean  "feature_on_homepage", default: false, null: false
    t.integer  "position"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "disease_categories_diseases", id: false, force: :cascade do |t|
    t.integer "disease_category_id"
    t.integer "disease_id"
  end

  add_index "disease_categories_diseases", ["disease_category_id"], name: "index_disease_categories_diseases_on_disease_category_id", using: :btree
  add_index "disease_categories_diseases", ["disease_id"], name: "index_disease_categories_diseases_on_disease_id", using: :btree

  create_table "diseases", force: :cascade do |t|
    t.string   "name",                default: "",    null: false
    t.text     "description",         default: "",    null: false
    t.text     "stats",               default: "",    null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "slug"
    t.text     "intro",               default: "",    null: false
    t.text     "image",               default: "",    null: false
    t.string   "cover"
    t.boolean  "feature_on_homepage", default: false, null: false
    t.integer  "position"
  end

  create_table "diseases_users", id: false, force: :cascade do |t|
    t.integer "disease_id"
    t.integer "user_id"
  end

  add_index "diseases_users", ["disease_id"], name: "index_diseases_users_on_disease_id", using: :btree
  add_index "diseases_users", ["user_id"], name: "index_diseases_users_on_user_id", using: :btree

  create_table "donations", force: :cascade do |t|
    t.integer  "campaign_id",                                                    null: false
    t.integer  "user_id",                                                        null: false
    t.string   "loved_one_name",                             default: "",        null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.decimal  "amount",             precision: 8, scale: 2, default: 10.0
    t.boolean  "is_anonymous",                               default: false,     null: false
    t.integer  "referrer_id"
    t.string   "stripe_charge_id"
    t.string   "status",                                     default: "pending", null: false
    t.integer  "parent_donation_id"
  end

  create_table "educations", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
    t.string   "location"
    t.string   "degree"
    t.string   "start_year"
    t.string   "end_year"
    t.string   "field_of_study"
  end

  add_index "educations", ["user_id"], name: "index_educations_on_user_id", using: :btree

  create_table "email_response_templates", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
    t.text     "content"
    t.string   "title"
  end

  create_table "followers", force: :cascade do |t|
    t.integer  "campaign_id"
    t.string   "email",       null: false
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "followers", ["campaign_id"], name: "index_followers_on_campaign_id", using: :btree
  add_index "followers", ["email"], name: "index_followers_on_email", unique: true, using: :btree

  create_table "foundations", force: :cascade do |t|
    t.string "foundation_name"
    t.text   "description"
  end

  add_index "foundations", ["foundation_name"], name: "index_foundations_on_foundation_name", using: :btree

  create_table "friendly_id_slugs", force: :cascade do |t|
    t.string   "slug",                      null: false
    t.integer  "sluggable_id",              null: false
    t.string   "sluggable_type", limit: 50
    t.string   "scope"
    t.datetime "created_at"
  end

  add_index "friendly_id_slugs", ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true, using: :btree
  add_index "friendly_id_slugs", ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type", using: :btree
  add_index "friendly_id_slugs", ["sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_id", using: :btree
  add_index "friendly_id_slugs", ["sluggable_type"], name: "index_friendly_id_slugs_on_sluggable_type", using: :btree

  create_table "fundings", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
    t.text     "description"
    t.integer  "sponsor_id"
    t.datetime "date"
    t.decimal  "amount"
    t.string   "title"
    t.string   "sponsor_type"
    t.string   "grant_type"
    t.string   "url"
    t.datetime "end_date"
    t.string   "other_sponsor"
    t.integer  "award_recipient_id"
  end

  add_index "fundings", ["award_recipient_id"], name: "index_fundings_on_award_recipient_id", using: :btree
  add_index "fundings", ["user_id"], name: "index_fundings_on_user_id", using: :btree

  create_table "government_organizations", force: :cascade do |t|
    t.string "org_name"
    t.text   "description"
  end

  add_index "government_organizations", ["org_name"], name: "index_government_organizations_on_org_name", using: :btree

  create_table "identities", force: :cascade do |t|
    t.string   "uid",                     null: false
    t.string   "provider",                null: false
    t.string   "name",       default: "", null: false
    t.string   "email",      default: "", null: false
    t.string   "image",      default: "", null: false
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "identities", ["user_id"], name: "index_identities_on_user_id", using: :btree

  create_table "innovation_types", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "request_for_proposal_id"
    t.string   "value"
  end

  add_index "innovation_types", ["request_for_proposal_id"], name: "index_innovation_types_on_request_for_proposal_id", using: :btree
  add_index "innovation_types", ["value"], name: "index_innovation_types_on_value", using: :btree

  create_table "organizations", force: :cascade do |t|
    t.string   "name",          default: "",    null: false
    t.string   "url",           default: "",    null: false
    t.integer  "disease_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "logo",          default: "",    null: false
    t.string   "type"
    t.boolean  "is_university", default: false, null: false
    t.string   "tagline",       default: "",    null: false
  end

  create_table "patents", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
    t.string   "title"
    t.string   "patent_office"
    t.string   "application_number"
    t.string   "url"
    t.text     "description"
    t.datetime "issue_date"
    t.string   "status"
    t.text     "abstract"
    t.datetime "filing_date"
  end

  add_index "patents", ["user_id"], name: "index_patents_on_user_id", using: :btree

  create_table "proposal_discussions", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "proposal_id"
    t.text     "text"
    t.boolean  "deleted_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "proposal_discussions", ["proposal_id"], name: "index_proposal_discussions_on_proposal_id", using: :btree
  add_index "proposal_discussions", ["user_id"], name: "index_proposal_discussions_on_user_id", using: :btree

  create_table "proposals", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "request_for_proposal_id"
    t.integer  "user_id"
    t.text     "research_hypothesis"
    t.text     "hypothesis_basis"
    t.text     "validation_procedure"
    t.text     "future_validation"
    t.boolean  "completed",               default: false
    t.integer  "status",                  default: 0,     null: false
    t.boolean  "submitted_for_pi",        default: false
    t.string   "identifier"
    t.datetime "first_completed_at"
  end

  add_index "proposals", ["identifier"], name: "index_proposals_on_identifier", using: :btree
  add_index "proposals", ["request_for_proposal_id", "status"], name: "index_proposals_on_request_for_proposal_id_and_status", using: :btree
  add_index "proposals", ["request_for_proposal_id"], name: "index_proposals_on_request_for_proposal_id", using: :btree
  add_index "proposals", ["user_id"], name: "index_proposals_on_user_id", using: :btree

  create_table "proposals_fundings", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "proposal_id"
    t.integer  "funding_id"
  end

  add_index "proposals_fundings", ["funding_id"], name: "index_proposals_fundings_on_funding_id", using: :btree
  add_index "proposals_fundings", ["proposal_id"], name: "index_proposals_fundings_on_proposal_id", using: :btree

  create_table "proposals_patents", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "proposal_id"
    t.integer  "patent_id"
  end

  add_index "proposals_patents", ["patent_id"], name: "index_proposals_patents_on_patent_id", using: :btree
  add_index "proposals_patents", ["proposal_id"], name: "index_proposals_patents_on_proposal_id", using: :btree

  create_table "proposals_publications", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "proposal_id"
    t.integer  "publication_id"
  end

  add_index "proposals_publications", ["proposal_id"], name: "index_proposals_publications_on_proposal_id", using: :btree
  add_index "proposals_publications", ["publication_id"], name: "index_proposals_publications_on_publication_id", using: :btree

  create_table "publications", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
    t.string   "title"
    t.text     "abstract"
    t.string   "publication_name"
    t.datetime "date"
    t.string   "url"
  end

  add_index "publications", ["user_id"], name: "index_publications_on_user_id", using: :btree

  create_table "request_for_proposal_notifications", force: :cascade do |t|
    t.string   "email"
    t.integer  "request_for_proposal_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "request_for_proposal_notifications", ["email"], name: "index_request_for_proposal_notifications_on_email", unique: true, using: :btree
  add_index "request_for_proposal_notifications", ["request_for_proposal_id"], name: "index_rfp_notifications_on_rfp", using: :btree

  create_table "request_for_proposals", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
    t.string   "therapeutic_area"
    t.text     "why_it_matters"
    t.text     "in_scope_proposals"
    t.text     "out_of_scope_proposals"
    t.text     "additional_resource_details"
    t.datetime "deadline"
    t.string   "title"
    t.text     "summary"
    t.integer  "company_id",                  default: 0,  null: false
    t.string   "identifier"
    t.boolean  "enabled"
    t.string   "subtitle"
    t.string   "image",                       default: "", null: false
  end

  add_index "request_for_proposals", ["identifier"], name: "index_request_for_proposals_on_identifier", using: :btree
  add_index "request_for_proposals", ["user_id"], name: "index_request_for_proposals_on_user_id", using: :btree

  create_table "research_follows", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "email"
    t.string   "research_area"
  end

  add_index "research_follows", ["email"], name: "index_research_follows_on_email", using: :btree
  add_index "research_follows", ["research_area", "email"], name: "index_research_follows_on_research_area_and_email", unique: true, using: :btree

  create_table "research_keywords", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "research_type"
  end

  add_index "research_keywords", ["research_type"], name: "index_research_keywords_on_research_type", using: :btree

  create_table "scientific_advisors", force: :cascade do |t|
    t.string "full_name"
    t.string "title"
    t.string "institution"
    t.string "linkedin_profile"
    t.string "image",            default: "", null: false
  end

  create_table "startups", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
    t.string   "startup_name"
    t.string   "url"
    t.string   "start_year"
    t.string   "end_year"
  end

  add_index "startups", ["user_id"], name: "index_startups_on_user_id", using: :btree

  create_table "universities", force: :cascade do |t|
    t.string "name"
  end

  create_table "user_follows", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "company_id"
    t.integer  "user_id"
  end

  add_index "user_follows", ["company_id"], name: "index_user_follows_on_company_id", using: :btree
  add_index "user_follows", ["user_id"], name: "index_user_follows_on_user_id", using: :btree

  create_table "user_keywords", force: :cascade do |t|
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "research_keyword_id"
  end

  add_index "user_keywords", ["research_keyword_id"], name: "index_user_keywords_on_research_keyword_id", using: :btree
  add_index "user_keywords", ["user_id"], name: "index_user_keywords_on_user_id", using: :btree

  create_table "user_profile_infos", force: :cascade do |t|
    t.string   "title"
    t.string   "location"
    t.string   "area_of_expertise"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "about"
    t.string   "location_details"
    t.string   "location_start_year"
    t.string   "location_end_year"
    t.string   "headline"
  end

  add_index "user_profile_infos", ["user_id"], name: "index_user_profile_infos_on_user_id", using: :btree

  create_table "user_saved_request_for_proposals", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
    t.integer  "request_for_proposal_id"
  end

  add_index "user_saved_request_for_proposals", ["request_for_proposal_id"], name: "index_user_saved_rfp_on_rfp_id", using: :btree
  add_index "user_saved_request_for_proposals", ["user_id"], name: "index_user_saved_request_for_proposals_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "first_name",             default: "",    null: false
    t.string   "email",                                  null: false
    t.string   "password_digest_old",    default: "",    null: false
    t.boolean  "omniauth_only",          default: false, null: false
    t.string   "auth_token",             default: "",    null: false
    t.string   "referrer_token",         default: "",    null: false
    t.boolean  "is_admin",               default: false, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "stripe_customer_id",     default: "",    null: false
    t.string   "last_name",              default: "",    null: false
    t.string   "encrypted_password",     default: "",    null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,     null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.integer  "role",                   default: 0,     null: false
    t.string   "image",                  default: "",    null: false
    t.string   "phone"
    t.integer  "sub_role",               default: 0,     null: false
  end

  add_index "users", ["auth_token"], name: "index_users_on_auth_token", unique: true, using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["referrer_token"], name: "index_users_on_referrer_token", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  create_table "version_associations", force: :cascade do |t|
    t.integer "version_id"
    t.string  "foreign_key_name", null: false
    t.integer "foreign_key_id"
  end

  add_index "version_associations", ["foreign_key_name", "foreign_key_id"], name: "index_version_associations_on_foreign_key", using: :btree
  add_index "version_associations", ["version_id"], name: "index_version_associations_on_version_id", using: :btree

  create_table "versions", force: :cascade do |t|
    t.string   "item_type",      null: false
    t.integer  "item_id",        null: false
    t.string   "event",          null: false
    t.string   "whodunnit"
    t.text     "object"
    t.datetime "created_at"
    t.text     "object_changes"
    t.integer  "transaction_id"
  end

  add_index "versions", ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id", using: :btree
  add_index "versions", ["transaction_id"], name: "index_versions_on_transaction_id", using: :btree

  add_foreign_key "followers", "campaigns"
end
