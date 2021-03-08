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


newData = newData.drop(['StitchCID0','UmlsIDLabel','Placebo','MeddraType','UmlsIDMeddraTerm', 'FrequencyDesc'],axis=1)
newData = newData.drop_duplicates()
print(newData)
newData.to_csv('newData.tsv',sep='\t',index=False)