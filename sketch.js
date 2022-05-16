let numberOfLetters = 6;
let numberOfTries = 6;
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
  rect(width/3,0,width/3,height);
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
      rect(x+(w/numberOfLetters*c)+margin,y+(h/numberOfTries*r)+margin,(w/numberOfLetters)-margin*2,(h/numberOfTries)-margin*2);//draw squares
      if(letters[r][c] != "empty"){
        fill(255,0,255);
        text(letters[r][c],x+(w/numberOfLetters*c)+margin,y+(h/numberOfTries*r)+margin);
      }
      pop();
    }
  }
}

function keyPressed(){
  console.log(letters);
  typing(key);
}

function typing(key){

  if(keyCode == ENTER){
  }else if(keyCode == BACKSPACE){
    deleteLastLetter();
  }else{
    findEmptySpot(key);
  }
}
  
function findEmptySpot(key){
  for(let r = 0;r<numberOfTries;r++){
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
  for(let r = 0;r<numberOfTries;r++){
    for(let c = 0;c<numberOfLetters;c++){
      if(letters[r][c] != "empty"){
        placeToDeleteR = r;
        placeToDeleteC = c;
      }
    }
  }
  letters[placeToDeleteR][placeToDeleteC] = "empty";
}