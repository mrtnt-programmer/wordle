function setup(){
  createCanvas(windowWidth, windowHeight);
}

function draw(){
  let squaresize = 80;
  let x = 0;
  let y = 0;
  for (const letter of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']) {
    affiche_lettre(letter, x, y, squaresize);
    x += squaresize*1.1;
  }
  x = 0;
  y += squaresize*1.1;
  for (const letter of ['j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r']) {
    affiche_lettre(letter, x, y, squaresize);
    x += squaresize*1.1;
  }
  x = 0;
  y += squaresize*1.1;
  for (const letter of ['s', 't', 'u', 'v', 'w', 'x', 'y', 'z']) {
    affiche_lettre(letter, x, y, squaresize);
    x += squaresize*1.1;
  }
}

function affiche_lettre(letter, x, y, size){
  push();
  rectMode(CORNER);
  fill('lightgray');
  rect(x,y,size,size);
  textSize(size*0.93);
  textAlign(CENTER);
  fill('black');
  rectMode(CENTER);
  text(letter,x + size/2, y + size/2 *1.53); 
  pop();
}
