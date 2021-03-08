# Cloning database
capture_production_db:
	heroku pg:backups capture --app halocures-production

restore_on_development_db:
	curl -o tmp/latest.dump `heroku pg:backups public-url --app halocures-production`
	bundle exec rake db:drop db:create
	! pg_restore --verbose --clean --no-acl --no-owner -h localhost -d halocures_development tmp/latest.dump
	heroku local:run bundle exec rake db:migrate

capture_production_db_and_restore_on_development_db:
	$(MAKE) capture_production_db
	$(MAKE) restore_on_development_db

cleanup_download:
	rm tmp/latest.dump

clone_production_db_to_staging:
	heroku pg:backups restore `heroku pg:backups public-url --app halocures-production` DATABASE --app halocures-staging

# Cloning S3 buckets
clone_production_bucket_to_clean_development_bucket:
	env $$(cat .env) aws s3 rm s3://halocures-development --recursive
	env $$(cat .env) aws s3 sync --acl public-read s3://halocures s3://halocures-development
