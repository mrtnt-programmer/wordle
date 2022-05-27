//global variables 
let gameStatus = "playing";
let miscMessage = "";//contain a message to draw under letters
let animating = [];//keep track of animating letters
let MakeCookieonce = true;

let wordle;
let keyboard;

class Wordle{
  constructor(){
    this.letter = [];
    this.minLetters = 4;
    this.maxLetters = 8;
    this.possibleLangue = ['francais','english','norway'];
    this.numberOfTries = 6;
    
    this.option = { 'langue': 'francais', 
                    'numberOfLetters': 5,
                    'keyboard': 'ON'
    }
    this.dict = { 'frequent': '',
                  'all': ''
    }
    this.background_image = '';
    this.icon_menu = '';
    this.currentTry = 1;
    this.word ='';
    this.button = {'X': 10, 'Y': 10, 'W':0}; 
  }
}

function preload(){
  wordle = new Wordle();
  
  //get  data from session storage or cookies
  let INPUTnumberOfLetters ;
  let INPUTlangue;
  let INPUTkeyboard;
  if(sessionStorage != null){
    INPUTnumberOfLetters = sessionStorage.getItem("numberOfLetters");
    INPUTlangue = sessionStorage.getItem("langue");
    INPUTkeyboard = sessionStorage.getItem("keyboard");
  }
  console.log("checking cookie",document.cookie);
  if(MakeCookieonce && sessionStorage.getItem("numberOfLetters") != null){
    MakeCookieonce =false;
    createCookies(INPUTnumberOfLetters,INPUTlangue,INPUTkeyboard);
  }
  if (document.cookie != "" ){
    INPUTnumberOfLetters = getCookie("numberOfLetters");
    INPUTlangue = getCookie("langue");
    INPUTkeyboard = getCookie("keyboard");
  }
  console.log("checking data",INPUTnumberOfLetters,INPUTlangue,INPUTkeyboard);
  if(INPUTnumberOfLetters>=wordle.minLetters &&
    INPUTnumberOfLetters<=wordle.maxLetters &&
    wordle.possibleLangue.includes(INPUTlangue)){//check if were being sent valid data
    wordle.option.numberOfLetters = INPUTnumberOfLetters;
    wordle.option.langue = INPUTlangue  
    console.log("cookies",document.cookie);
    console.log("session storage",sessionStorage);
  }
  
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
  let showKeyboard = INPUTkeyboard == 'ON'; 
  keyboard = new Keyboard(showKeyboard, wordle.option.langue);
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
  if(gameStatus == "playing"){
    if(wordle.currentTry>wordle.numberOfTries){
      gameStatus = "gameover";
      keyboard.visible=false;
      let dico = {'francais': "C'était '", 'english': "It was '", 'norway': "Det var '"};
      miscMessage = dico[wordle.option.langue] + wordle.word + "'!";
    }
    if(wordle.currentTry != 1){
      if(wordle.word == findWord(wordle.currentTry-2)){
        gameStatus = "victory";
        keyboard.visible=false;
        let dico = {'francais': "Bravo !", 'english': "Well done!", 'norway': "Godt gjort!"};
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
    let dico = {'francais': "Pas un mot valide !", 'english': "Not a valid word!", 'norway': "Ikke et gyldig ord!"};
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
  if(gameStatus == "playing"){
    typing();
  }
}

function settingsButton(){
  push();
  image(wordle.icon_menu, wordle.button.X,wordle.button.Y,wordle.button.W,wordle.button.W);
  pop();
}

function detecteButton(){
  if(  mouseX < wordle.button.X+wordle.button.W 
    && mouseY< wordle.button.Y+wordle.button.W 
    && mouseX > wordle.button.X && mouseY > wordle.button.Y){
      console.log('detecteButton', location.origin+ "/settings");
      window.location.assign(location.origin + "/settings");
  }
}

let possibleLetter = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
let possibleLetterM = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
function typing(otherKey){//takes a variable in case we call it in a virtual keyboard
  console.log("typing",otherKey);
  if(keyCode == ENTER || otherKey == "ENTER"){
    checkWord();
  }else if(keyCode == BACKSPACE || otherKey == "BACKSPACE" || keyCode == DELETE || keyCode == LEFT_ARROW){
    deleteLastLetter();
  }else if(possibleLetter.includes(key) || otherKey != null){
    if(otherKey != null){
      findEmptySpot(otherKey);
    }else{
      findEmptySpot(key);
    }
  }else if(possibleLetterM.includes(key)){//if lowercase 
    let k;
    for(let l=0;l<possibleLetterM.length;l++){
      if(possibleLetterM[l] == key){
        k = possibleLetter[l];
        break;
      }
    }
    findEmptySpot(k);
  }else{
    console.log("typing error");
  }
  keyCode = null;//to avoid key repetition
  key = null;
}
  
function findEmptySpot(keyToPut){
  for(let r = 0;r<wordle.currentTry;r++){
    for(let c = 0;c<wordle.option.numberOfLetters;c++){
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
  keyboard.toggleShow();
  miscMessage = "";
  detecteButton();
  keyboard.detection();
}
