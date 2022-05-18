let numberOfLetters = 6;
let langue = 'english'; // could also be 'francais'
let numberOfTries = 6;
let currentTry = 1;
let letters = [];
let word;
let gameStatus = "playing";


function setup() {
  createCanvas(windowWidth, windowHeight);
  for(let r = 0;r<numberOfTries;r++){
    let line = [];
    for(let c = 0;c<numberOfLetters;c++){
      line.push("empty");
    }
    letters.push(line);
  }
  word = 'access';
  // word = pickWord();
  print(word)
}

function draw() {
  showgame();
  checkStatus();
}

function showgame(){
  push();
  background(220);
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
      if(word == letters[currentTry-2].join("")){
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
      let squareW = (w/numberOfLetters)-margin*2
      let squareH = (h/numberOfTries)-margin*2
      rect(squareX,squareY,squareW,squareH);//draw squares
      if(letters[r][c] != "empty"){
        fill(255);
        if(letters[r][c] == word.charAt(c) && currentTry-1>r){//correct
          fill(0,255,0,200);
        }else if(word.includes(letters[r][c])&& currentTry-1>r){//is present at least once
          fill(255,255,0,200);
        }
        rect(squareX,squareY,squareW,squareH);//draw background of square
        rectMode(CENTER)
        textSize(squareW);
        fill(60);
        text(letters[r][c],squareX+squareW/4*3,squareY+squareH/2,squareW,squareH);//draw letters
      }
      pop();
    }
  }
}

function keyPressed(){
  console.log(letters);
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

function checkWord(){
  if(letters[currentTry-1][numberOfLetters-1] != "empty"){
    console.log("passed",currentTry,word,letters);
    currentTry++;
  }
}
  
function findEmptySpot(){
  for(let r = 0;r<currentTry;r++){
    for(let c = 0;c<numberOfLetters;c++){
      if(letters[r][c] == "empty"){
        letters[r][c] = key;
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
      if(letters[r][c] != "empty" && r>=currentTry-1){
        placeToDeleteR = r;
        placeToDeleteC = c;
        somethingToDelete = true;
      }
    }
  }
  if(somethingToDelete){
    letters[placeToDeleteR][placeToDeleteC] = "empty";
  }
}

async function pickWord(){
  filename = 'dict/'+langue +'_frequent_'+numberOfLetters.toString()+'.txt'
  const result = await loadStrings(filename);
  print(result[4]);
  return 'access'; // access
  // return random(result);
}
