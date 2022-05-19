let numberOfLetters = 6;
let langue = 'english'; // could also be 'francais'
let numberOfTries = 6;
let currentTry = 1;
let letter = [];
let word;
let dict_frequent;
let background_image;
let gameStatus = "playing";

function preload(){
  background_image = loadImage('background/background.jpg');
  filename = 'dict/'+langue +'_frequent_'+numberOfLetters.toString()+'.txt'
  dict_frequent = loadStrings(filename);
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  for(let r = 0;r<numberOfTries;r++){
    let line = [];
    for(let c = 0;c<numberOfLetters;c++){
      let newLetter = new Letter(r,c);
      line.push(newLetter);
    }
    letter.push(line);
  }
  word = random(dict_frequent);
  print(word)
}

function draw(){
  showgame();
  checkStatus();
}

function showgame(){
  push();
  // background(220);
  background(background_image);
  fill(60);
  rect(width/3,0,width/3,height);//background
  pop();

  Grid();
}

function checkStatus(){
  if(gameStatus == "playing"){
    if(currentTry>numberOfTries){
      gameStatus = "gameover";
    }
    if(currentTry != 1){
      if(word == findWord(currentTry-2)){
        gameStatus = "victory";
      }
    }
  }else{
    push();
    fill(0);
    strokeWeight(2);
    stroke(60);
    textSize(width/8);
    rectMode(CENTER);
    text(gameStatus,width/2,height/2,width/3,height/4)
    pop();
  }
}

function Grid(){
  let margin = 5;
  let x = width/3;
  let y = 0;
  let w = width/3;
  let h = w;
  for(let r = 0;r<numberOfTries;r++){
    for(let c = 0;c<numberOfLetters;c++){
      push();//important so that background color does not affect other letter
      fill(245,245,245,100);
      stroke(0);
      strokeWeight(3);
      let squareX = x+(w/numberOfLetters*c)+margin;
      let squareY = y+(h/numberOfTries*r)+margin;
      let squareW = (w/numberOfLetters)-margin*2;
      let squareH = (h/numberOfTries)-margin*2;
      rect(squareX,squareY,squareW,squareH);//draw squares
      if(letter[r][c].letter != "empty"){
        fill(255);
        console.log(r,c,letter[r][c].color);
        if(letter[r][c].color == "green"){//correct
          fill(0,255,0,200);//green
        }else if(letter[r][c].color == "yellow"){
          fill(255,255,0,200);//yellow
        }
        
        /*else if(word.includes(letter[r][c].letter)&& currentTry-1>r){//test if maybe more than 1 copy of the letter
          let answerCopies = copies(word,letter[r][c].letter);
          let tryCopies = copies(findWord(r),letter[r][c].letter);//same but for the word tested
          let yellow = false;
          let count;
          for(let l= 0;l<numberOfLetters;l++){
            if(letter[r][l].letter == letter[r][c].letter){
              count++;
            }
            if(count<l && c>=l){
              yellow = true;
              break;
            }
            if(count>answerCopies)break;         
          }
          console.log("yellow",answerCopies,tryCopies);
          if(yellow){
            console.log("more yellow");
            fill(255,255,0,200);//yellow
          }
        }
        */
        rect(squareX,squareY,squareW,squareH);//draw background of square
        rectMode(CENTER)
        textSize(squareW);
        fill(60);
        text(letter[r][c].letter,squareX+squareW/4*3,squareY+squareH/2,squareW,squareH);//draw letters
      }
      pop();
    }
  }
}

function copies(w, letter){//number of times a letter apears in the word w (given in 'abcde')
  //convert
  let wSeperated = [];//in ['a','b']format
  for(let i = 0;i<numberOfLetters;i++){
    wSeperated.push(str(w[i]));
  }
  //count
  let c = 0;
  for(let i = 0;i<numberOfLetters;i++){
    if(letter == wSeperated[i]){
      c++;
    }
  }
  return c;
}

function checkWord(){
  if(letter[currentTry-1][numberOfLetters-1].letter != "empty"){
    for(let c=0;c<numberOfLetters;c++){
      console.log("checkword");
      if(letter[currentTry-1][c].letter == word.charAt(c)){
        letter[currentTry-1][c].color = "green";
      }
      console.log("checkword",letter[currentTry-1][c].letter,word.charAt(c),letter[currentTry-1][c].color);
    }
    currentTry++;
  }
}

function findWord(line){//outputs the word at a line
  let w = "";
  for(let i= 0;i<numberOfLetters;i++){
    w = w+letter[line][i].letter
  }
  return w;
}

function keyPressed(){
  if(gameStatus == "playing"){
    typing();
  }
}

function typing(){
  if(keyCode == ENTER){
    checkWord();
  }else if(keyCode == BACKSPACE){
    deleteLastLetter();
  }else{
    findEmptySpot();
  }
}
  
function findEmptySpot(){
  for(let r = 0;r<currentTry;r++){
    for(let c = 0;c<numberOfLetters;c++){
      if(letter[r][c].letter == "empty"){
        letter[r][c].letter = key;
        return;
      }
    }
  }
}

function deleteLastLetter(){
  let placeToDeleteR = 0;
  let placeToDeleteC = 0;
  let somethingToDelete = false;
  for(let r = 0;r<numberOfTries;r++){
    for(let c = 0;c<numberOfLetters;c++){
      if(letter[r][c].letter != "empty" && r>=currentTry-1){
        placeToDeleteR = r;
        placeToDeleteC = c;
        somethingToDelete = true;
      }
    }
  }
  if(somethingToDelete){
    letter[placeToDeleteR][placeToDeleteC].letter = "empty";
  }
}