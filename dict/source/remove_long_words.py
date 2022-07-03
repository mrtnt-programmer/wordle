import unidecode

filename = 'norway_all.txt'
with open(filename, 'r') as f:
  lines = f.readlines()
  
small_words = []
for word in lines:
  if len(word) < 10:
    small_words.append(word)
    
small_words.sort()
      
filename = 'norway_all_small.txt'
with open(filename, 'w') as f:
  f.writelines(small_words)
    

