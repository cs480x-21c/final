import pandas as pd

# input: string of sentences/words 
# output: string of unique words seperated by commas
def unique_words(passage):
    result = ""
    a= pd.Series(passage)
    passage = a.str.split(' ')
    history = []
    for word in passage.array[0]:
        if not(('!' in word) or (',' in word) or ('?' in word)):
            if not(word in history):
                result = result + word + ","
                history.append(word)
        else:
            if not(word[:-1] in history):
                result = result + word[:-1] + ","
                history.append(word[:-1])
    return(result)

