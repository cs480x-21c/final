import json
import os
import csv
import pandas as pd
path=os.path.abspath(os.path.dirname(__file__)) + "/chart_scrapes"

# filename = week+country+'.csv'
# writeFile = os.path.join("chart_scrapes",country,filename)
# path=os.path.abspath(os.path.dirname(__file__)) + '/allData/'
# print( path )

# for root, subdirectories, files in os.walk(path):
#     for subdirectory in subdirectories:
#         print(os.path.join(root, subdirectory))
#     for file in files:
#         print(os.path.join(root, file))

# dates=[]
# with open( os.path.join('Datasets','dates_all.csv'), newline='') as csvfile:
#     reader = csv.reader(csvfile, delimiter=' ')
#     for row in reader:
#         dates.append(row)

weeks = []
# week_path = os.path.join('Datasets','weeks.csv')
week_path = os.path.join('Datasets','reduced_weeks.csv')
with open( week_path, newline='') as csvfile:
    week_list = csv.reader(csvfile, delimiter=',')
    for row in week_list:
        weeks.append(row[0])

countries = []
country_path = os.path.join('Datasets','countries.csv')
with open( country_path, newline='') as csvfile:
    country_list = csv.reader(csvfile, delimiter=',')
    for row in country_list:
        countries.append(row[0])

#declare the dictionary
data={}
with open( "Datasets/songs.csv", 'w') as csvfile:
    songwriter = csv.writer(csvfile)
    params=['chart_position','track','artist','streams','url']
    # songs = pd.DataFrame(columns = params )
    for country in countries:
        print(country)
        for week in weeks:
        # for date in range(len(dates)):
            # c_date=str(dates[row][0])
            day_file = os.path.join(path,country,week+country+".csv")
            # day_file=path+"/"+country+"/"+week+country+'.csv'
            # print(day_file)
            titles={}
            with open(day_file, newline='', encoding="utf8") as csvfile:
                reader=csv.reader(csvfile,delimiter=',')
                line1=next(reader)
                line1_item=str(line1[0])
                if(line1_item=='<!doctype html>'):
                    print('true')
                    continue
                next(reader)
                for row2 in reader:
                    song={}
                    song['chart_position']=row2[0]
                    song['track']=row2[1]
                    song['artist']=row2[2]
                    song['streams']=row2[3]
                    song['url']=row2[4]
                    titles[row2[0]]=song
                    songwriter.writerow(([row2[0],row2[1], row2[2], row2[3], row2[4]]))

            data[week]=titles
            data[country]=country
            titles={}
# songs = pd.DataFrame.from_dict(data)
# print(songs.size)
# print(songs.head())

# songs.DataFrame.to_csv("Datasets/dataFrame.csv", index=False)

#save dictionary to json
# with open( os.path.join('Datasets','dict.json'), 'w') as outfile:
#    json.dump(data, outfile)
