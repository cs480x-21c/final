import ssl
import csv
import requests
import os

filename= os.path.abspath(os.path.dirname(__file__)) + '/chart_scrapes/'

countries = []
dates = []

with open( os.path.join('Datasets','countries.csv'), newline='') as csvfile:
    country_list = csv.reader(csvfile, delimiter=',')
    for row in country_list:
        countries.append(row[0])

with open( os.path.join('Datasets','dates.csv'), newline='') as csvfile:
    date_list = csv.reader(csvfile, delimiter=',')
    for row in date_list:
        dates.append(row[0])
# for row in dates:
#     date = row[0]
#     url = "https://spotifycharts.com/regional/global/daily/%s/download" % (date)
#     writeFile = filename+date+'.csv'
#     r = requests.get(url,allow_redirects=True)
#     with open(writeFile, 'wb') as f:
#         f.write(r.content)

# https://spotifycharts.com/regional/us/daily/2021-03-08
# print(countries)
# print(dates)

for row in countries:
    country = row
    # print("\ncountry:",country)
    url = "https://spotifycharts.com/regional/%s/daily/2021-03-08/download" % (country)
    writeFile = filename+'2021-03-08_'+country+'.csv'
    r = requests.get(url,allow_redirects=True)
    with open(writeFile, 'wb') as f:
        f.write(r.content)

# country = "us"
# url = "https://spotifycharts.com/regional/%s/daily/2021-03-08/download" % (country)
# writeFile = filename+'2021-03-08_'+country+'.csv'
# r = requests.get(url,allow_redirects=True)
# with open(writeFile, 'wb') as f:
#     f.write(r.content)