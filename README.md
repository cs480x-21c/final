Final Project - Interactive Data Visualization  
===

Description
---

[Link to live website](https://philologybot.github.io/final/)

By using PhilologyBot you are able to see what time a word was most frequently used. 


API
---

To acquire the data, we created an AWS Lambda function which can be called through an API that gets data from the Google nGram viewer. To program our API, whenever a change is made to the `lambda_function.py` in the GitHub repository, GitHub Actions creates a zip of the `api/` folder and sends that to an S3 bucket for use. 

The data is processed in the API, which returns a JSON object containing a 201xN dictionary, where N is the number of unique words passed into the API and 201 is the number of years of data that is present. The API is only able to get data for twelve words at a time, so we break up each API call into groups of 12 words and merge them into the main data table containing years and word use. For this collection we are using a modified version of [this google ngram script](https://github.com/zslwyuan/google-ngrams) by zslwyuan. 

Though this process is not as fast as we would like, we believe it is far superior to loading in the raw dataset which is multiple gigabytes in size.
