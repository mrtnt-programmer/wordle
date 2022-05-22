let myFont, starting_time;

function preload() {
  myFont = loadFont('font/Salma.otf');
}


function setup(){
  createCanvas(windowWidth, windowHeight);
  starting_time = millis();
}

function draw(){
  let squaresize = 200;
  affiche_lettre('a', 100, 100, squaresize);
}

function affiche_lettre(letter, x, y, size){
  push();
  let time = millis() - starting_time;
  angleMode(DEGREES);
  let angle = min(time/2, 360);
  translate(x+size/2, y+size/2);
  rectMode(CENTER);
  fill('lightgray');
  rect(0,0,size,size);
  rotate(angle);
  textSize(size*0.93);
  textFont(myFont);
  textAlign(CENTER);
  fill('black');
  text(letter,0,size*.2); 
  pop();
}
