import argparse
import requests
import ssl
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import shutil
import os
import csv
import json
import pandas as pd


def main(function,overwrite_old):
    # print("running function ",function)

    weeks = csv_to_list( os.path.join('Datasets','reduced_weeks.csv') )
    countries = csv_to_list( os.path.join('Datasets','countries.csv') )

    if(function == "scrape"):
        scrape(weeks, countries)
    elif function=="stitch":
        stitch(weeks, countries)
    elif function=="flatten":
        flatten()
    elif function=="meta_scrape":
        meta_scrape()
    elif function=="meta_flatten":
        meta_flatten()
    elif  function=="unique_songs":
        unique_songs()
    elif function=="meta_add":
        meta_add()
    else:
        assert False, f"failed to run function {function}"
    
def csv_to_list(path):
    out_list = []
    with open( path, newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        for row in reader:
            out_list.append(row[0])
    return out_list


def scrape(weeks, countries):
    print("running scrape")
    for country in countries:
        # create dir for country if non-existent 
        country_path = os.path.join("chart_scrapes",country)
        if os.path.exists(country_path) == False:
            os.makedirs(country_path)

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



def stitch(weeks, countries):
    print("running stitch")
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


def flatten():
    print("running flatten")

def meta_scrape():
    print("running meta_scrape")

def meta_flatten():
    print("running meta_flatten")

def unique_songs():
    print("running unique_songs")
    allSongs = pd.read_csv("Datasets/songs.csv")
    print("Length: " + str(allSongs.size ))
    uniqueSongs = allSongs.drop_duplicates(['track','artist'],keep='last')
    print("Length: " + str(uniqueSongs.size ))
    uniqueSongs.to_csv("Datasets/unique_songs.csv")

def meta_add():
    print( "Adding metadata to unique songs")
    uniqueSongs = pd.read_csv("Datasets/unique_songs.csv")
    # print(uniqueSongs.head())
    metaData = pd.read_csv("Datasets/flat_meta.csv")

    # print(metaData.head())
    songsWithMeta = uniqueSongs.join(metaData.set_index('track_ref'), on='url')
    # print(songsWithMeta.head())
    songsWithMeta.to_csv("Datasets/uniqueSongsWithMeta.csv")

def parser():
    arg_parser = argparse.ArgumentParser()
    arg_parser.add_argument(
        "--function",
        type=str,
        required= True,
        choices=["scrape","stitch","flatten","meta_scrape","meta_flatten", "unique_songs", "meta_add"],
        help="feature type 1 to extract, either audio, text or gps"
    )
    arg_parser.add_argument(
        "--overwrite_old",
        type=bool,
        required= False,
        default= False,
        choices=[True,False],
        help="whether or not to overwrite old spotifycharts scrape data"
    )
    return arg_parser


if __name__ == "__main__":
    print("\nrunning spotify feature processing utility")
    args = parser().parse_args()
    main(args.function, args.overwrite_old)
