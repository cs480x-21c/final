import ssl
import csv
import requests
import os
import shutil


countries = []
dates = []
weeks = []

# country_path = os.path.join('Datasets','reduced_countries1.csv')
country_path = os.path.join('Datasets','countries.csv')
with open( country_path, newline='') as csvfile:
    country_list = csv.reader(csvfile, delimiter=',')
    for row in country_list:
        countries.append(row[0])

date_path = os.path.join('Datasets','dates.csv')
with open( date_path, newline='') as csvfile:
    date_list = csv.reader(csvfile, delimiter=',')
    for row in date_list:
        dates.append(row[0])

# week_path = os.path.join('Datasets','weeks.csv')
week_path = os.path.join('Datasets','reduced_weeks.csv')
with open( week_path, newline='') as csvfile:
    week_list = csv.reader(csvfile, delimiter=',')
    for row in week_list:
        weeks.append(row[0])


# for row in countries:
#     country_path = os.path.join("chart_scrapes",row)
#     if os.path.exists(country_path):
#         shutil.rmtree(country_path)
#     os.makedirs(country_path)


for country in countries:
    # create dir for country if non-existent 
    country_path = os.path.join("chart_scrapes",country)
    if os.path.exists(country_path) == False:
        os.makedires(country_path)

    # iterate through each week for the current country
    for week in weeks:
        # format the request url and make the request
        url = "https://spotifycharts.com/regional/%s/weekly/%s/download" % (country,week)
        r = requests.get(url,allow_redirects=True)

        # format filename and write request's return to file
        filename = week+country+'.csv'
        writeFile = os.path.join("chart_scrapes",country,filename)
        with open(writeFile, 'wb') as f:
            f.write(r.content)
    # done with country
    print("just finished getting data for ",country,"!")


# for row in dates:
#     date = row[0]
#     url = "https://spotifycharts.com/regional/global/daily/%s/download" % (date)
#     writeFile = filename+date+'.csv'
#     r = requests.get(url,allow_redirects=True)
#     with open(writeFile, 'wb') as f:
#         f.write(r.content)

# country = "us"
# url = "https://spotifycharts.com/regional/%s/daily/2021-03-08/download" % (country)
# writeFile = filename+'2021-03-08_'+country+'.csv'
# r = requests.get(url,allow_redirects=True)
# with open(writeFile, 'wb') as f:
#     f.write(r.content)