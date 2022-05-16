numberOfLetters = 6;
numberOfTries = 6;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  fill(60);
  rect(width/3,0,width/3,height);
  Grid();
}

function Grid(){
  margin = 5;
  let x = width/3;
  let y = 0;
  let w = width/3;
  let h = w;
  for(let c = 0;c<numberOfLetters;c++){
    for(let r = 0;r<numberOfTries;r++){
      fill(0);
      rect(x+(w/numberOfLetters*c)+margin,y+(h/numberOfTries*r)+margin,(w/numberOfLetters)-margin*2,(h/numberOfTries)-margin*2);
    }
  }
}