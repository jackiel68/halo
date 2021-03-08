# Halo

## To get your environment up and running:

1. Requirements
  * Ruby 2.2.4
  * Postgres 9.4
  * Heroku Toolbelt
  * Node Package Manager
  * Bower

2. Install proper ruby version, postgresql, yarn, bundler, node package manager.
Bundler v2 requires Ruby 2.3.0+ so you can downgrade to lower version for this to work.
  ```bash
  brew install rbenv
  rbenv install 2.2.4
  brew install postgresql
  brew install yarn
  brew tap heroku/brew && brew install heroku

  npm install -g bower
  gem install bundler -v "~>1.0"
  ```
  You may need to start postgresql too
  ```bash
  pg_ctl -D /usr/local/var/postgres start && brew services start postgresql
  ```
  You can see tables in postgresql locally by running
  ```bash
  pspsql -d halocures_development -U [your_username]
  ```
  followed by
  ```bash
  SELECT * FROM pg_catalog.pg_tables;
  ```

3. Clone the repo and set up your .env file. Once inside .env, paste in a SECRET_KEY_BASE
  ```bash
  git clone git@github.com:halocures/halo.git
  cd halo
  vim .env
  ```

4. Install the required gems from inside the repo
  ```bash
  bundle install
  ```

5. Setup your development's database
  ```bash
  bundle exec rake db:setup
  ```

6. Start the server
  ```bash
  heroku local:start
  ```
  OR
  ```bash
  bundle exec puma -C config/puma.rb
  ```
  To turn on webpack for frontend live reloading, run:
  ```bash
  bundle exec ./bin/webpack-dev-server
  ```
  along with the Rails server.

7. Visit your localhost

  If using Pow first run `echo 5000 > ~/.pow/halo` then:

  ```bash
  open http://www.halo.dev
  ```

  If not using Pow:

  ```bash
  open http://lvh.me:5000/
  ```

### Running scripts on Heroku

Fill in the details of this command
```bash
heroku run bundle exec rails runner ./scripts/script.rb -a my-heroku-app
```

Run
```bash
upload_universities.rb
upload_sponsors.rb
upload_descriptors.rb
upload_foundation_government.rb
upload_new_scimago.rb
```

### Bower

1. Add the assets you'd like to include on the Bowerfile specifying main files

  ```
  asset 'bootstrap-sass', '3.3.6' do
    main_files [
      'assets/javascripts/bootstrap.js',
      'assets/stylesheets/_bootstrap',
      'assets/stylesheets/bootstrap/*'
    ]
  end
  ```
2. Install it, clean non main assets and resolve asset paths
  ```
  rake bower:install
  rake bower:clean
  rake bower:resolve
  ```
3. Manually review asset_path occurrences and update if required. For instance you might want to replace `<%= asset_path 'images/sy-loader.gif' %>` with `<%= asset_path 'slippry/images/sy-loader.gif' %>`
4. Make sure assets get versioned, and do not commit changes to packages you are not updating intentionally.

### Debug

1. If you are getting issues with fsevents/node-gyp while running `yarn install --check-files` then run a `yarn upgrade` first
