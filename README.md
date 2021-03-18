Final Project - Spotify Trends
===
By Nick Alescio, Hunter Caouette, Clay Oshiro-Leavitt
---
### Project Link: https://hcaouette.github.io/final/  
### Video:  [Lane Boiz \[OFFICIAL VIDEO\]](https://drive.google.com/file/d/1vIInPy8KWOIpbBy3iVZ43JOUddLCTg2q/view?usp=sharing)

This project is an interactive visualization dashboard showing music trends on the popular streaming platform 'Spotify' for the past two years. This data was based on the weekly top 200 songs for each reported country. Each songs' metadata was averaged to produce a set of summary statistics for each week per country. 

Project Structure
---
Our project has several components in the root directory:
- chart_scrapes

chart_scrapes contains our initial data scrapes of the 200 top songs weekly per country.

- Data Processing

This directory contains our Python data manipulation and processing scripts. The main one is main.py, which allows for all portions of the data processing pipeline to be executed through a series of command line arguments. These scripts are designed to be run from the route directory (Ex: python3 Data_Processing/main.py --function meta_add).

- Datasets

This directory contains our processed datasets.

- process_book

This directory contains our Process Book for the project and its requisite visuals.

- index.html

This is the html page that contains our visualization.

The other two files in the root directory are world.geojson and world.topojson - these are used to generate our choropleth.



<!-- [hot_dog.gif](hot_dog.gif)-->
![hot_dog](https://user-images.githubusercontent.com/12305393/111556394-d67c1b80-8760-11eb-8ab0-28d280619910.gif)


Resources
---
- https://bl.ocks.org/
- https://observablehq.com/
- https://developer.spotify.com/documentation/web-api/
- Professor Lane T. Harrison