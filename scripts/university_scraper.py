import urllib.request as urllibrequest
from bs4 import BeautifulSoup
import csv

def find_universities(state_path, writer):
  print("Getting Universities for state: " + state_path.contents[0])
  state_page = base_page + state_path.get('href')
  page = urllibrequest.urlopen(state_page)
  state_soup = BeautifulSoup(page, 'html.parser')
  table = state_soup.find('table', attrs={'class': 'table'}).find('tbody')
  for links in table.findAll('a'):
    if links.contents[0].find('button') == -1:
      print(links.contents[0])
      if writer:
        writer.writerow([links.contents[0]])


with open('data/universities.csv', mode='w') as csv_file:
  university_writer = csv.writer(csv_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

  base_page = 'https://www.4icu.org'

  for country in ['us', 'ca']:
    university_page = base_page + '/' + country + '/universities'

    page = urllibrequest.urlopen(university_page)

    # parse the html using beautiful soup and store in variable `soup`
    soup = BeautifulSoup(page, 'html.parser')

    # Take out the <div> of table and get its value
    table = soup.find('table', attrs={'class': 'table'})

    for state_path in table.findAll('a'):
        find_universities(state_path, university_writer)

