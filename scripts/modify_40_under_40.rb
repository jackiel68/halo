require 'csv'

CSV.foreach("#{Rails.root}/data/40_under_40.csv", { :headers => :first_row }) do |row|
  user = User.find_by_email(row[3])
  if user
    puts "Existing user #{row[2]}"
    user.email = row[2]
    user.save
  else
    new_email_user = User.find_by_email(row[2])

    if new_email_user
      new_email_user.password = "pugsley"
      new_email_user.password_confirmation = "pugsley"
      new_email_user.save
    else
      user = User.new(
        :email => row[2],
        :password => "pugsley",
        :password_confirmation => "pugsley",
        :first_name => row[0],
        :last_name => row[1]
      )
      user.save
    end
  end
end
