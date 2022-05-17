let numberOfLetters = 6;
let numberOfTries = 6;
let currentTry = 1;
let letters = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for(let r = 0;r<numberOfTries;r++){
    let line = [];
    for(let c = 0;c<numberOfLetters;c++){
      line.push("empty");
    }
    letters.push(line);
  }
}

function draw() {
  background(220);
  fill(60);
  rect(width/3,0,width/3,height);//background
  Grid();
}

function Grid(){
  let margin = 5;
  let x = width/3;
  let y = 0;
  let w = width/3;
  let h = w;
  for(let r = 0;r<numberOfTries;r++){
    for(let c = 0;c<numberOfLetters;c++){
      push();
      fill(245,245,245,100);
      stroke(0);
      strokeWeight(3);
      let squareX = x+(w/numberOfLetters*c)+margin;
      let squareY = y+(h/numberOfTries*r)+margin;
      let squareW = (w/numberOfLetters)-margin*2
      let squareH = (h/numberOfTries)-margin*2
      rect(squareX,squareY,squareW,squareH);//draw squares
      if(letters[r][c] != "empty"){
        fill(255,0,255,200);
        rect(squareX,squareY,squareW,squareH);
        textSize(squareW);
        text(letters[r][c],squareX,squareY,squareW,squareH);//draw letters
      }
      pop();
    }
  }
}

function keyPressed(){
  console.log(letters);
  typing();
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