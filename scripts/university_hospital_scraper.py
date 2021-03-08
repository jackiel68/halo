import urllib.request as urllibrequest
from bs4 import BeautifulSoup
import csv
import re

with open('data/university_hospitals.csv', mode='w') as csv_file:
  university_writer = csv.writer(csv_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

  base_page = 'https://en.wikipedia.org/wiki/List_of_university_hospitals'

  page = urllibrequest.urlopen(base_page)

  # parse the html using beautiful soup and store in variable `soup`
  soup = BeautifulSoup(page, 'html.parser')

  body = soup.find('div', attrs={'id': 'mw-content-text'})

  items = []
  university_hospital_set = set()

  for ul in body.findAll('ul'):
    for item in ul.findAll('li', attrs={'class': None}):
      if item.contents and len(item.contents) > 0:
        content = re.sub(r"\[\d+\]", "", item.text)
        content = re.sub(r"w:ja.*", "", content).split('\n')[0].strip()
        print(content)
        university_hospital_set.add(content)

  print(university_hospital_set)
  print(len(university_hospital_set))


  ###################


  independent_research_page = 'https://www.airi.org/about-airi/membership/member-list'
  page = urllibrequest.urlopen(independent_research_page)

  # parse the html using beautiful soup and store in variable `soup`
  soup = BeautifulSoup(page, 'html.parser')

  body = soup.find('div', attrs={'id': 'bt-content'})
  for ol in body.findAll('ol'):
    for item in ol.findAll('li', attrs={'class': None}):
      if item.contents and len(item.contents) > 0:
        content = re.sub(r"\(\w+\)", "", item.text).strip()
        print(content)
        university_hospital_set.add(content)

  print(university_hospital_set)
  print(len(university_hospital_set))

  for university_hospital in university_hospital_set:
    university_writer.writerow([university_hospital])
