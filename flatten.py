import json
import os
import csv


with open('Datasets/dict.json', encoding="utf8") as f:
    dict=json.load(f)

flatWriter = csv.writer(open('Datasets/flat_dict.csv', 'w', newline=''), delimiter=',')
for record in dict:
    date=[record][0]
    for song in dict[record]:
        pos=dict[record][song]['position']
        track=dict[record][song]['track']
        artist=dict[record][song]['artist']
        streams=dict[record][song]['streams']
        url=dict[record][song]['url']

        try:
            flatWriter.writerow([date,pos,track,artist,streams,url])
        except UnicodeEncodeError:
            print('contained characters not compatible with csv file')
            continue
