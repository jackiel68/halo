if Rails.env.development?
  task :set_annotation_options do
    # You can override any of these by setting an environment variable of the
    # same name.
    Annotate.set_defaults({
      'position_in_routes'      => "after",
      'position_in_class'       => "after",
      'position_in_test'        => "after",
      'position_in_fixture'     => "after",
      'position_in_factory'     => "after",
      'position_in_serializer'  => "after",
      'show_foreign_keys'       => "true",
      'show_indexes'            => "true",
      'simple_indexes'          => "false",
      'model_dir'               => "app/models",
      'include_version'         => "false",
      'require'                 => "",
      'exclude_tests'           => "true",
      'exclude_fixtures'        => "true",
      'exclude_factories'       => "true",
      'exclude_serializers'     => "true",
      'ignore_model_sub_dir'    => "true",
      'skip_on_db_migrate'      => "false",
      'format_bare'             => "true",
      'format_rdoc'             => "false",
      'format_markdown'         => "false",
      'sort'                    => "false",
      'force'                   => "false",
      'trace'                   => "false",
    })
  end

  Annotate.load_tasks

  namespace :annotate do
    desc "Annotate our database models"
    task :models => :environment do
      Rake::Task["set_annotation_options"].invoke
      Rake::Task["annotate_models"].invoke
    end

    desc "Annotate our routes"
    task :routes do
      ENV['position'] = 'after'
      Rake::Task["annotate_routes"].invoke
    end
  end

  # Automatically updates the annotations after migration
  Rake::Task["db:migrate"].enhance do
    Rake::Task["annotate:models"].invoke
  end
end
