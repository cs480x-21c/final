import spotipy
import json
from spotipy.oauth2 import SpotifyClientCredentials

c_id = 'bf02bcb1126f4363b3a4a057c623d182'
c_secret = '6c563e24a4ff4700a2e25adc0a662d80'

birdy_uri = 'spotify:artist:2WX2uTcsvV5OnS0inACecP'
spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials(client_id=c_id, client_secret=c_secret))






