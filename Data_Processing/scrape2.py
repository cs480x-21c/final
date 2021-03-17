





#ignore me




import ssl
import csv
import requests
import os

filename= os.path.abspath(os.path.dirname(__file__)) + '/allData/'

with open( os.path.join('Datasets','dates_all.csv'), newline='') as csvfile:
    dates = csv.reader(csvfile, delimiter=' ')
    for row in dates:
        date=row[0]
        url = "https://spotifycharts.com/regional/global/daily/%s/download" % (date)
        writeFile=filename+date+'.csv'
        r=requests.get(url,allow_redirects=True)
        with open(writeFile, 'wb') as f:
            f.write(r.content)
