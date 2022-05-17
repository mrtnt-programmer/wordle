import unidecode

for langue in ['francais', 'english']:
  for nb_letters in [6,7,8]:
    for suffix in ['frequent', 'all']:
      i = 0
      filename = langue+'_'+suffix+'.txt'
      with open(filename, 'r') as f:
        lines = f.readlines()
        
      words = set() 
      for line in lines:
        line.replace(" ", "") # remove spaces
        line = unidecode.unidecode(line) # remove accents
        word = ''
        for character in line: # remove special characters
          if character.isalnum():
            word += character
        word = word.upper()
        if len(word) == nb_letters:
          words.add(word+'\n')

      words = list(words)
      words.sort()
      
      filename = langue+'_'+suffix+'_'+str(nb_letters)+'.txt'
      with open(filename, 'w') as f:
        f.writelines(words)
