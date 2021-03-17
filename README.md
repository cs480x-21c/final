Final Project - Interactive Data Visualization  
===
Team Members: Jean-Philippe Pierre, Joshua McKeen, Suryansh Goyal and Remy Allegro

Link for the website: 

Link for the screencast video: 

Overview
---

This website is an attempt to visualize the SIDER 4.0 database which contains information about drugs, their side-effects and their related frequencies. The different parts of this repository are:

### Data
We have extracted all the data (which was in .tsv format) and stored it in the "Data" folder. After some exploration, we realized that we are going to need two of the 6 tsv files:

1. drug_names.tsv: Contains the drug names and their respective STITCHCID1.
2. meddra_freq.tsv: Contains drugs represented by their STITCHCID1, their side-effects, their respective frequencies and some other related data points. 

We performed some data preprocessing and produced a new data file, which is usable for our project. It is the "master.tsv" file in the root directory. More information about data processing can be found in the Process Book file in the root directory. We utilized the "dataProcessing.py" script to perform data preprocessing.

### Website
The index.html file is the master file for our website. It is linked to styles.css for styling of different elements. The index.html features the following three visualizations:
1. Bubble chart: Gives an overview of the most common side-effects related to drugs.
2. Bar Chart: Ranks the top 20 drugs related to a particular side effect according to their mean frequencies.
3. Cleveland dot plot (Interval plot): Ranks the top 20 side-effects related to a particular side effect according to their mean frequencies. Also shows the range of frequencies for each side-effect.

References
---

- Data: http://sideeffects.embl.de/
- Sorted Bar chart: https://www.d3-graph-gallery.com/graph/barplot_ordered.html
- Interactive Bubble Chart: https://www.webtips.dev/how-to-make-interactive-bubble-charts-in-d3-js
- Select2 dropdown feature: https://select2.org/
