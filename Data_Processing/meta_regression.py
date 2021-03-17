import csv
# import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

rows=[]
# x=[]
# y=[]
# y=np.loadtxt('Datasets/streams_meta.csv',delimiter=",",unpack=True,skiprows=1,usecols=0)
# x=np.loadtxt('Datasets/streams_meta.csv',delimiter=",",unpack=True,skiprows=1,usecols=np.arange(1,6))
# y1,x1,x2,x3,x4,x5,x6=np.loadtxt('Datasets/streams_meta.csv',delimiter=",",unpack=True,skiprows=1)
# print(len(x[0]))
# print(len(y))
df=pd.read_csv('Datasets/streams_meta.csv',delimiter=",")
print(df.head())

x = df[['acousticness','danceability','energy','liveness','speechiness','valence']]
y = df['streams']

lm = LinearRegression()
model = lm.fit(x,y)

coef=model.coef_
scalar=min(coef,key=abs)
str1=('Score: \t\t\t'+(model.score(x, y).astype('str')))
str2=('Intercept: \t\t\t'+(model.intercept_.astype('str')))
# str3=('Coefficients: \t\t'+(model.coef_.astype('str')))
str3=('------------\nCoefficients:')
str4=('acousticness: \t\t\t'+(coef[0].astype('str'))+'\t scaled: \t'+(coef[0]/scalar).astype('str'))
str5=('danceability: \t\t\t'+(coef[1].astype('str'))+'\t scaled: \t'+(coef[1]/scalar).astype('str'))
str6=('energy: \t\t\t'+(coef[2].astype('str'))+'\t scaled: \t'+(coef[2]/scalar).astype('str'))
str7=('liveness: \t\t\t'+(coef[3].astype('str'))+'\t scaled: \t'+(coef[3]/scalar).astype('str'))
str8=('speechiness: \t\t\t'+(coef[4].astype('str'))+'\t scaled: \t'+(coef[4]/scalar).astype('str'))
str9=('valence: \t\t\t'+(coef[5].astype('str'))+'\t scaled: \t'+(coef[5]/scalar).astype('str'))

out=(str1+'\n'+str2+'\n'+str3+'\n'+str4+'\n'+str5+'\n'+str6+'\n'+str7+'\n'+str8+'\n'+str9)
print(out)
out_file=open("regression_log.txt",'w')
out_file.write(out)
out_file.close()
