//global variables 
// let gameStatus = "playing";
let miscMessage = "";//contain a message to draw under letters
let animating = [];//keep track of animating letters

let wordle;
let keyboard;

class colorSquare{
  constructor(visible=false){
    this.color = 'black';
    this.visible = visible;
  }

  draw(){
    if (this.visible){
      push();
      fill(this.color);
      rect(width-40,0,20);
      pop();
    }
  }
}
let square = new colorSquare(false); // true to see colored square indicator of touch actions

class Wordle{
  constructor(){
    this.letter = [];
    this.minLetters = 4;
    this.maxLetters = 8;
    this.possibleLangue = ['francais','english','spanish','norway'];
    this.numberOfTries = 6;
    
    this.option = { 'langue': 'francais', 
                    'numberOfLetters': 5,
                    'keyboard': 'on'
    }
    this.dict = { 'frequent': '',
                  'all': ''
    }
    this.background_image = '';
    this.icon_menu = '';
    this.currentTry = 1;
    this.word ='';
    this.button = {'X': 10, 'Y': 10, 'W':0}; 
    this.status = "playing";
  }
}

function preload(){
  wordle = new Wordle();
  
  //get options from cookies
  wordle.option.numberOfLetters = getCookie("numberOfLetters", 5);
  wordle.option.langue = getCookie("langue", 'english');
  wordle.option.keyboard = getCookie("keyboard", 'on');
  console.log('after loading cookies:', wordle.option.langue, wordle.option.numberOfLetters, wordle.option.keyboard);
  
  // background image:
  let suffix = '_square';
  if (windowWidth > windowHeight*1.25) {
    suffix = '_wide';
  }
  if (windowHeight > windowWidth*1.25) {
    suffix = '_tall';
  }
  let filename = 'background/background_'+wordle.option.langue+suffix+'.jpg';
  wordle.background_image = loadImage(filename);
  
  // menu:
  wordle.icon_menu = loadImage('icon_menu.png');
  
  // dictionaries:
  filename = 'dict/'+wordle.option.langue +'_frequent_'+wordle.option.numberOfLetters.toString()+'.txt'
  wordle.dict.frequent = loadStrings(filename);
  filename = 'dict/'+wordle.option.langue +'_all_'+wordle.option.numberOfLetters.toString()+'.txt'
  wordle.dict.all = loadStrings(filename);
  
  // fonts:
  myFont = loadFont('Salma.otf');
  
  // keyboard:
  keyboard = new Keyboard(wordle.option.keyboard, wordle.option.langue);
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  for(let r = 0;r<wordle.numberOfTries;r++){
    let line = [];
    for(let c = 0;c<wordle.option.numberOfLetters;c++){
      let newLetter = new Letter(r,c);
      line.push(newLetter);
    }
    wordle.letter.push(line);
  }
  while(wordle.word == ''){ // the last line of each dictionary is an empty word
    wordle.word = random(wordle.dict.frequent);
  }
  currentDictionary = wordle.dict.frequent;
  wordle.button.W = min(width, height)/20;
}

function draw(){
  showgame();
  checkStatus();
  square.draw();
}

function squareSize(){
  return min(height*0.66/wordle.numberOfTries, width*0.6/wordle.option.numberOfLetters);
}

function margin(){
  return squareSize()/15;
}

function gridWidth(){
  return (squareSize()+margin())*wordle.option.numberOfLetters + 3*margin();
}

function gridX(){
  return (width - gridWidth()) / 2;
}

function showgame(){
  push();
  background(wordle.background_image);
  fill(60);
  rect(gridX(),0,gridWidth(),height);//background
  pop();
  Grid();
  keyboard.draw();
  misc();
  settingsButton();
}

function checkStatus(){
  if(wordle.status == "playing"){
    if(wordle.currentTry>wordle.numberOfTries){
      wordle.status = "gameover";
      keyboard.visible=false;
      let dico = {'francais': "C'était '", 'english': "It was '", 'spanish': "Era '", 'norway': "Det var '"};
      miscMessage = dico[wordle.option.langue] + wordle.word + "'!";
    }
    if(wordle.currentTry != 1){
      if(wordle.word == findWord(wordle.currentTry-2)){
        wordle.status = "victory";
        keyboard.visible=false;
        let dico = {'francais': "Bravo !", 'english': "Well done!", 'spanish': "¡Bien hecho!", 'norway': "Godt gjort!"};
        miscMessage = dico[wordle.option.langue];
      }
    }
  }
}

function Grid(){
  for(let r = 0;r<wordle.numberOfTries;r++){
    for(let c = 0;c<wordle.option.numberOfLetters;c++){
      push();//important so that background color does not affect other letter
      fill(245,245,245,100);
      stroke(0);
      strokeWeight(3);
      let squareX = gridX()+ 2*margin() + c*(squareSize()+margin());
      let squareY = 2*margin() + r*(squareSize()+margin());
      rect(squareX,squareY,squareSize(),squareSize());//draw empty square
      if(wordle.letter[r][c].letter != "empty"){
        wordle.letter[r][c].draw(squareX,squareY);
      }
      pop();
    }
  }
}

function misc(){
  let messageX = gridX()+ 2*margin();
  let messageY = 2*margin() + (wordle.numberOfTries+1)*(squareSize()+margin()) + margin() ;
  if(miscMessage != ""){
    fill(255);
    textSize(squareSize()*0.6);
    text(miscMessage,messageX,messageY);
  }
}

function checkWord(){
  if(wordle.letter[wordle.currentTry-1][wordle.option.numberOfLetters-1].letter != "empty" && wordle.dict.all.includes(findWord(wordle.currentTry-1))){
    let copies = [];
    for(let l=0;l<wordle.option.numberOfLetters;l++){//makes a list of all letters present to not draw letter multiple colors
      copies.push(wordle.word[l]);
    }

    for(let c=0;c<wordle.option.numberOfLetters;c++){
      if(wordle.letter[wordle.currentTry-1][c].letter == wordle.word.charAt(c)){
        wordle.letter[wordle.currentTry-1][c].color = "green";
        let todelete = copies.indexOf(wordle.letter[wordle.currentTry-1][c].letter);
        copies.splice(todelete,1);
      }
    }
    for(let c=0;c<wordle.option.numberOfLetters;c++){
      if(copies.includes(wordle.letter[wordle.currentTry-1][c].letter) && wordle.letter[wordle.currentTry-1][c].letter != wordle.word.charAt(c)){
        wordle.letter[wordle.currentTry-1][c].color = "yellow";
        let todelete = copies.indexOf(wordle.letter[wordle.currentTry-1][c].letter);
        copies.splice(todelete,1);
      }
    }
    //animation
    for(let c=0;c<wordle.option.numberOfLetters;c++){
      wordle.letter[wordle.currentTry-1][c].startAnimation();
      animating.push([wordle.currentTry-1,c]);
    }
    wordle.currentTry++;
    miscMessage = "";
  }else{
    let dico = {'francais': "Pas un mot valide !", 'english': "Not a valid word!", 'spanish': "Ni una palabra válida", 'norway': "Ikke et gyldig ord!"};
    keyboard.visible=false;
    miscMessage = dico[wordle.option.langue];
  }
}

function findWord(line){//outputs the word at a line
  let w = "";
  for(let i= 0;i<wordle.option.numberOfLetters;i++){
    w = w+wordle.letter[line][i].letter
  }
  return w;
}

function keyPressed(){
    typing();
}

function settingsButton(){
  push();
  image(wordle.icon_menu, wordle.button.X,wordle.button.Y,wordle.button.W,wordle.button.W);
  pop();
}

function detectButton(){
  if(  mouseX < wordle.button.X+wordle.button.W 
    && mouseY< wordle.button.Y+wordle.button.W 
    && mouseX > wordle.button.X && mouseY > wordle.button.Y){
      console.log('detectButton');
      console.log('location.href:', location.href);
      console.log('location.origin:', location.origin);
      console.log('location.pathname:', location.pathname);
      console.log('location.hostname:', location.hostname);
      console.log('full address:', location.href+'settings');
      window.location.assign(location.href+'settings');
  }
}

function typing(otherKey){//takes a variable in case we call it in a virtual keyboard
  if (wordle.status == 'playing'){
    console.log("typing",otherKey);
    let possibleLetter = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    if (wordle.option.langue == 'norway'){
      possibleLetter = possibleLetter.concat(["å","ø","æ"]);
    }
    let lowerKey;
    if (otherKey != null){
      lowerKey = otherKey;
    }else{
      lowerKey = key.toLowerCase();
    }
    if(keyCode == ENTER || otherKey == "ENTER"){
      checkWord();
    }else if(keyCode == BACKSPACE || otherKey == "BACKSPACE" || keyCode == DELETE || keyCode == LEFT_ARROW){
      deleteLastLetter();
    }else if(possibleLetter.includes(lowerKey)){
      findEmptySpot(lowerKey);
    }else{
      console.log("unknown key");
    }
    keyCode = null;//to avoid key repetition
    key = null;
  }
}
  
function findEmptySpot(keyToPut){
  for(let r = 0; r < wordle.currentTry; r++){
    for(let c = 0; c < wordle.option.numberOfLetters; c++){
      if(wordle.letter[r][c].letter == "empty"){
        wordle.letter[r][c].letter = keyToPut;
        return;
      }
    }
  }
}

function deleteLastLetter(){
  miscMessage = '';
  keyboard.toggleShow();
  let placeToDeleteR = 0;
  let placeToDeleteC = 0;
  let somethingToDelete = false;
  for(let r = 0;r<wordle.numberOfTries;r++){
    for(let c = 0;c<wordle.option.numberOfLetters;c++){
      if(wordle.letter[r][c].letter != "empty" && r>=wordle.currentTry-1){
        placeToDeleteR = r;
        placeToDeleteC = c;
        somethingToDelete = true;
      }
    }
  }
  if(somethingToDelete){
    wordle.letter[placeToDeleteR][placeToDeleteC].letter = "empty";
  }
}

function mousePressed(){
  console.log('mousePressed');
  keyboard.toggleShow();
  miscMessage = "";
  detectButton();
  keyboard.detection();
}

function touchStarted(){
  console.log('touchStarted');
  square.color = 'red';
}

function touchEnded(){
  console.log('touchEnded');
  square.color = 'green';
}
