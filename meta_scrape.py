import json
import main
# Scaper for Spotify Meta Data

# Meta Data that will be harvested for each song:
# Top Genre, Year, BPM, Energy, Dance, loudness, liveness, valence, mode, speechiness, acousticness, instrumentalness, tempo, duration_ms
urlLists = []
metaList = {}

with open('Datasets/unique_songs.json', encoding="utf8") as f:
    dict= json.load(f)

urltempList = list( dict.keys() )

x = 0
y = len( urltempList )

for i in range(x, y,100):
    trackMetas = main.spotify.audio_features( urltempList[x:x+100] )
    for row in range(len(trackMetas)):
        metaList[urltempList[x+row]]=trackMetas[row]
    x+=100

# write song meta data to a json for further use
with open( 'Datasets/songMeta.json', 'w' ) as outfile:
    json.dump( metaList, outfile )
