import json
# import main
# Scaper for Spotify Meta Data
import csv
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

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
print(urlList)

x = 0
y = len( urltempList )

for i in range(x, y,100):
    trackMetas = spotify.audio_features( urltempList[x:x+100] )
    for row in range(len(trackMetas)):
        metaList[urltempList[x+row]]=trackMetas[row]
    x+=100

# write song meta data to a json for further use
with open( 'Datasets/songMeta.json', 'w' ) as outfile:
    json.dump( metaList, outfile )
