import ssl
import csv
import requests
import os

filename= os.path.abspath(os.path.dirname(__file__)) + '/chart_scrapes/'

countries = []
dates = []
weeks = []

with open( os.path.join('Datasets','countries.csv'), newline='') as csvfile:
    country_list = csv.reader(csvfile, delimiter=',')
    for row in country_list:
        countries.append(row[0])

with open( os.path.join('Datasets','dates.csv'), newline='') as csvfile:
    date_list = csv.reader(csvfile, delimiter=',')
    for row in date_list:
        dates.append(row[0])

with open( os.path.join('Datasets','weeks.csv'), newline='') as csvfile:
    week_list = csv.reader(csvfile, delimiter=',')
    for row in week_list:
        weeks.append(row[0])


for row in countries:
    country_path = os.path.join("chart_scrapes",row)
    if os.path.exists(country_path):
        print(country_path,"already exists")
    else:
        os.makedirs(country_path)


# for row in dates:
#     date = row[0]
#     url = "https://spotifycharts.com/regional/global/daily/%s/download" % (date)
#     writeFile = filename+date+'.csv'
#     r = requests.get(url,allow_redirects=True)
#     with open(writeFile, 'wb') as f:
#         f.write(r.content)

for row in countries:
    country = row
    # print("\ncountry:",country)
    url = "https://spotifycharts.com/regional/%s/daily/2021-03-08/download" % (country)
    writeFile = os.path.join("chart_scrapes",country,'2021-03-08_'+country+'.csv')
    r = requests.get(url,allow_redirects=True)
    with open(writeFile, 'wb') as f:
        f.write(r.content)

# country = "us"
# url = "https://spotifycharts.com/regional/%s/daily/2021-03-08/download" % (country)
# writeFile = filename+'2021-03-08_'+country+'.csv'
# r = requests.get(url,allow_redirects=True)
# with open(writeFile, 'wb') as f:
#     f.write(r.content)