import unidecode

langue = 'francais' 
nb_letters = [4,5,6,7,8]
words = { 'all': [0,0,0,0,0,0,0,0,0], 'frequent': [0,0,0,0,0,0,0,0,0] }
for suffix in ['all', 'frequent']:
  for nb in nb_letters:
    words[suffix][nb] = set()

suffix = 'all'
filename = langue+'_'+suffix+'.txt'
with open(filename, 'r') as f:
  lines = f.readlines()
  
for i, line in enumerate(lines):
  line.replace(" ", "") # remove spaces
  line = line[:-1] # remove linebreak
  line = unidecode.unidecode(line) # remove accents
  validWord = all([character.isalnum() for character in line])
  if (validWord):
    line = line.lower()
    words['all'][len(line)].add(line + '\n')
    if i < 5000:
      words['frequent'][len(line)].add(line + '\n')
  
for suffix in ['all', 'frequent']:
  for nb in nb_letters:
    print(len(words[suffix][nb]))
    words[suffix][nb] = list(words[suffix][nb])
    filename = langue+'_'+suffix+'_'+str(nb)+'.txt'
    with open(filename, 'w') as f:
      print(suffix, nb, len(words[suffix][nb]) )
      f.writelines(words[suffix][nb])
    
