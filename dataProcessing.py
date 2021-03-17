import pandas as pd

medFreq = pd.read_csv("Data/meddra_freq.tsv", sep='\t')
drugNames = pd.read_csv("Data/drug_names.tsv", sep='\t')

medFreq = medFreq[medFreq.Placebo!='placebo']

descriptions = ['common','postmarketing','rare','infrequent','frequent']
medFreq = medFreq[medFreq.FrequencyDesc!='common'] 
medFreq = medFreq[medFreq.FrequencyDesc!='postmarketing']
medFreq = medFreq[medFreq.FrequencyDesc!='rare']
medFreq = medFreq[medFreq.FrequencyDesc!='infrequent'] 
medFreq = medFreq[medFreq.FrequencyDesc!='frequent']

newData = pd.merge(medFreq,drugNames,on='StitchCID1')


newData = newData.drop(['StitchCID0','UmlsIDLabel','Placebo','MeddraType','UmlsIDMeddraTerm', 'FrequencyDesc', 'FrequencyLower','StitchCID1'],axis=1)
newData = newData.drop_duplicates()
result = newData.groupby(['Name','SideEffectName']) #.reset_index()
resultMean = result.mean().reset_index()
resultMean.columns = ['Name','SideEffectName',"MeanFrequency"] 
resultMax = result.max().reset_index()
resultMax.columns = ['Name','SideEffectName',"MaxFrequency"] 
resultMin = result.min().reset_index()
resultMin.columns = ['Name','SideEffectName',"MinFrequency"] 
resultRange = pd.merge(resultMin,resultMax)
master = pd.merge(resultRange,resultMean)
# print(resultMean)
# print(resultMax)
# print(resultMin)
# print(master)
# print(len(list(newData['SideEffectName'])))
master.to_csv('master.tsv',sep='\t',index=False)