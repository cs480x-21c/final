import json
import os
import csv
path=os.path.abspath(os.path.dirname(__file__)) + '/allData/'
dates=[]
with open( os.path.join('Datasets','dates_all.csv'), newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=' ')
    for row in reader:
        dates.append(row)

#declare the dictionary
data={}
params=['position','track','artist','streams','url']

for row in range(len(dates)):
    c_date=str(dates[row][0])
    day_file=path+c_date+'.csv'
    titles={}
    with open(day_file,newline='', encoding="utf8") as csvfile:
        reader=csv.reader(csvfile,delimiter=',')
        line1=next(reader)
        line1_item=str(line1[0])
        if(line1_item=='<!doctype html>'):
            print('true')
            continue
        next(reader)
        for row2 in reader:
            song={}
            song['position']=row2[0]
            song['track']=row2[1]
            song['artist']=row2[2]
            song['streams']=row2[3]
            song['url']=row2[4]
            titles[row2[0]]=song
    data[c_date]=titles
    titles={}


#save dictionary to json
with open( os.path.join('Datasets','dict.json'), 'w') as outfile:
   json.dump(data, outfile)
