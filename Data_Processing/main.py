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
import pycountry_convert as pc
basepath = os.path.abspath(os.path.dirname(__file__))
path= basepath + "/chart_scrapes"


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
    elif function=="weekly_meta_calc":
        weekly_meta_calc(weeks, countries)
    elif function=="find_minmaxes":
        find_minmaxes()
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
    c_id = 'bf02bcb1126f4363b3a4a057c623d182'
    c_secret = '6c563e24a4ff4700a2e25adc0a662d80'

    birdy_uri = 'spotify:artist:2WX2uTcsvV5OnS0inACecP'
    spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials(client_id=c_id, client_secret=c_secret))


    # Meta Data that will be harvested for each song:
    # Top Genre, Year, BPM, Energy, Dance, loudness, liveness, valence, mode, speechiness, acousticness, instrumentalness, tempo, duration_ms
    urlLists = []
    metaList = {}
    urlList = []
    # with open('Datasets/unique_songs.json', encoding="utf8") as f:
    #     dict= json.load(f)
    with open("Datasets/unique_songs.csv") as f:
        reader = csv.DictReader(f, delimiter=',')
        for row in reader:
            urlList.append(row['url'])
    urltempList = urlList
    # print(urlList)

    x = 0
    y = len( urltempList )

    for i in range(x, y,100):
        print(i)
        trackMetas = spotify.audio_features( urltempList[x:x+100] )
        for row in range(len(trackMetas)):
            metaList[urltempList[x+row]]=trackMetas[row]
        x+=100

    # write song meta data to a json for further use
    with open( 'Datasets/songMeta.json', 'w' ) as outfile:
        json.dump( metaList, outfile )

def meta_flatten():
    print("running meta_flatten")
    with open('Datasets/songMeta.json', encoding="utf8") as f:
        dict=json.load(f)


    flatWriter = csv.writer(open('Datasets/flat_meta.csv', 'w', newline=''), delimiter=',')
    flatWriter.writerow(["track_ref", "danceability", "energy", "key", "loudness", "mode", "speechiness", "acousticness", "instrumentalness",
    "liveness", "valence", "tempo","type", "id", "uri", "analysis_url", "duration_ms", "time_signature"])
    for record in dict:
        print(dict[record])
        if dict[record] == None:
            continue
        else:
            track_ref=[record][0]
            danceability=dict[record]['danceability']
            energy=dict[record]['energy']
            key=dict[record]['key']
            loudness=dict[record]['loudness']
            mode=dict[record]['mode']
            speechiness=dict[record]['speechiness']
            acousticness=dict[record]['acousticness']
            instrumentalness=dict[record]['instrumentalness']
            liveness=dict[record]['liveness']
            valence=dict[record]['valence']
            tempo=dict[record]['tempo']
            type=dict[record]['type']
            id=dict[record]['id']
            uri=dict[record]['uri']
            analysis_url=dict[record]['analysis_url']
            duration_ms=dict[record]['duration_ms']
            time_signature=dict[record]['time_signature']

            flatWriter.writerow([track_ref,danceability,energy,key,loudness,mode,speechiness,acousticness,instrumentalness,liveness,valence,tempo,type,id,uri,analysis_url,duration_ms,time_signature])
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

def weekly_meta_calc(weeks, countries):
    songsMeta = pd.read_csv("Datasets/flat_meta.csv")
    print(songsMeta.head())
    country_data = []
    country_key = {}
    for country in countries:
        print(country)
        flatWriter = csv.writer(open('Datasets/Countries/' + country + '/average.csv', 'w', newline=''), delimiter=',')
        flatWriter.writerow(["week", "danceability", "energy", "key", "loudness", "mode", "speechiness", "acousticness", "instrumentalness",
        "liveness", "valence", "tempo", "duration_ms", "time_signature"])    
        country_path = os.path.join("Datasets/Countries",country)
        if os.path.exists(country_path) == False:
            os.makedirs(country_path)
        data = []
        dataJSON = {}
        for week in weeks:
            day_file = os.path.join(path,country,week+country+".csv")
            # print(str(day_file))
            with open(day_file) as f:
                first_line = f.readline()
                # print(first_line)
                if '<!doctype html>' in first_line:
                    continue
                else:
                    weekData = pd.read_csv(day_file, header=1)
                    # print(weekData.head())
                    weekWithMeta = weekData.join(songsMeta.set_index('track_ref'), on='URL')
                    weekWithMeta.reset_index(drop=True, inplace=True)
                    # print(weekWithMeta.head())
                    outputPath = os.path.join(basepath,"Datasets/Countries", country, week+country )
                    weekWithMeta.to_csv(outputPath+"_meta.csv")

                    weekAverages = weekWithMeta.mean()
                    outputPath = os.path.join(basepath,"Datasets/Countries", country, "average_"+country )
                    valueList = [week,weekAverages["danceability"],weekAverages["energy"],weekAverages["key"],
                    weekAverages["loudness"], weekAverages["mode"],weekAverages["speechiness"],weekAverages["acousticness"],
                    weekAverages["instrumentalness"], weekAverages["liveness"],weekAverages["valence"],weekAverages["tempo"], weekAverages["duration_ms"],weekAverages["time_signature"]]
                    flatWriter.writerow( valueList )
                    data.append(
                        {
                            "week":week,
                            "danceability":weekAverages["danceability"],
                            "energy":weekAverages["energy"],
                            "key":weekAverages["key"],
                            "loudness":weekAverages["loudness"], 
                            "mode":weekAverages["mode"],
                            "speechiness":weekAverages["speechiness"],
                            "acousticness":weekAverages["acousticness"],
                            "instrumentalness":weekAverages["instrumentalness"],
                            "liveness":weekAverages["liveness"],
                            "valence":weekAverages["valence"],
                            "tempo":weekAverages["tempo"],
                            "duration_ms":weekAverages["duration_ms"],
                            "time_signature":weekAverages["time_signature"]
                        }
                    )
                    dataJSON[week] = {
                        "danceability":weekAverages["danceability"],
                        "energy":weekAverages["energy"],
                        "key":weekAverages["key"],
                        "loudness":weekAverages["loudness"], 
                        "mode":weekAverages["mode"],
                        "speechiness":weekAverages["speechiness"],
                        "acousticness":weekAverages["acousticness"],
                        "instrumentalness":weekAverages["instrumentalness"],
                        "liveness":weekAverages["liveness"],
                        "valence":weekAverages["valence"],
                        "tempo":weekAverages["tempo"],
                        "duration_ms":weekAverages["duration_ms"],
                        "time_signature":weekAverages["time_signature"]
                    }
                    
                    weekAverages.to_csv(outputPath + "_average_meta.csv")
        country_data.append(
            {"country":country,
            "Alpha_3" : pc.country_name_to_country_alpha3(pc.country_alpha2_to_country_name(country.upper())),
            "data":data}
        )
        country_key[pc.country_name_to_country_alpha3(pc.country_alpha2_to_country_name(country.upper()))] =dataJSON


        with open('Datasets/Master_JSON.json', 'w') as json_file:
            json.dump(country_data, json_file) 
        with open('Datasets/country_key.json', 'w') as json_file2:
            json.dump(country_key, json_file2) 


def find_minmaxes():
    print("running find_minmaxes")
    with open('Datasets/country_key.json', encoding="utf8") as f:
        dict=json.load(f)

    modalities = dict["AND"]["2020-09-04--2020-09-11"].keys()
    # print(modalities)
    mm_dict = {}#dict of modalities
    for m in modalities:
        if(m == "temp"):
            mm_dict[m] = {"min":200.0, "max":0.0}
        mm_dict[m] = {"min":1.0, "max":0.0}

    print(mm_dict)
    
    for country in dict:
        for week in dict[country]:
            for modality in dict[country][week]:
                if dict[country][week][modality] < mm_dict[modality]["min"] :
                    mm_dict[modality]["min"] = dict[country][week][modality]
                    # print("NEW MIN: country:",country,", week: ",week,", modality: ",modality)
                if dict[country][week][modality] > mm_dict[modality]["max"] :
                    mm_dict[modality]["max"] = dict[country][week][modality]
                    # print("NEW MAX: country:",country,", week: ",week,", modality: ",modality)

    #loudness is negative, swap positions
    tmp = mm_dict['loudness']["max"]
    mm_dict['loudness']["max"] = mm_dict['loudness']["min"]
    mm_dict['loudness']["min"] = tmp
    print(mm_dict)
    with open('Datasets/mode_domains.json', 'w') as json_file:
            json.dump(mm_dict, json_file) 



def parser():
    arg_parser = argparse.ArgumentParser()
    arg_parser.add_argument(
        "--function",
        type=str,
        required= True,
        choices=["scrape","stitch","flatten","meta_scrape","meta_flatten", "unique_songs", "meta_add", "weekly_meta_calc","find_minmaxes"],
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
