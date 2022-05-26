let numberOfLetters = 5;
let minMaxLetters = [4,8];
let langue = 'francais'; // can be 'francais', 'english' or 'norway'
let possibleLangue = ['francais','english','norway'];
let numberOfTries = 6;
let currentTry = 1;
let letter = [];
let word;
let dict_frequent;
let dict_all;
let background_image, icon_menu;
let gameStatus = "playing";
let myFont;
let buttonX,buttonY,buttonW,buttonH;
let miscMessage = "";//contain a message to draw under letters
let animating = [];//keep track of animating letters
let keyboard, showKeyboard;

function preload(){ 
//   console.log("data from settings",sessionStorage.getItem("numberOfLetters"),sessionStorage.getItem("langue"))
  if(sessionStorage.getItem("numberOfLetters")>=minMaxLetters[0] &&
    sessionStorage.getItem("numberOfLetters")<=minMaxLetters[1] &&
    possibleLangue.includes(sessionStorage.getItem("langue"))){//check if were being sent valid data
    numberOfLetters = sessionStorage.getItem("numberOfLetters");
    langue = sessionStorage.getItem("langue");  
    showKeyboard = sessionStorage.getItem("keyboard"); 
    console.log('showKeyboard in preload:', showKeyboard);
  }
  let suffix = '_square';
  if (windowWidth > windowHeight*1.25) {
    suffix = '_wide';
  }
  if (windowHeight > windowWidth*1.25) {
    suffix = '_tall';
  }
  let filename = 'background/background_'+langue+suffix+'.jpg';
  background_image = loadImage(filename);
  icon_menu = loadImage('icon_menu.png');
  filename = 'dict/'+langue +'_frequent_'+numberOfLetters.toString()+'.txt'
  dict_frequent = loadStrings(filename);
  filename = 'dict/'+langue +'_all_'+numberOfLetters.toString()+'.txt'
  dict_all = loadStrings(filename);
  myFont = loadFont('Salma.otf');
//   myFont = loadFont('OddlyCalming.ttf');
  keyboard = new Keyboard(showKeyboard);
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
  word = '';
  while(word == ''){ // the last line of each dictionary is an empty word
    word = random(dict_frequent);
  }
  currentDictionary = dict_frequent;
  buttonX = 10;
  buttonY = 10;
  buttonW = min(width, height)/20;
  buttonH = buttonW;
}

function draw(){
  showgame();
  checkStatus();
}

function squareSize(){
  return min(height*0.66/numberOfTries, width*0.6/numberOfLetters);
}

function margin(){
  return squareSize()/15;
}

function gridWidth(){
  return (squareSize()+margin())*numberOfLetters + 3*margin();
}

function gridX(){
  return (width - gridWidth()) / 2;
}

function showgame(){
  push();
  background(background_image);
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
    if(currentTry>numberOfTries){
      gameStatus = "gameover";
      keyboard.show=false;
      let dico = {'francais': "C'était '", 'english': "It was '", 'norway': "Det var '"};
      miscMessage = dico[langue] + word + "'!";
    }
    if(currentTry != 1){
      if(word == findWord(currentTry-2)){
        gameStatus = "victory";
        keyboard.show=false;
        let dico = {'francais': "Bravo !", 'english': "Well done!", 'norway': "Godt gjort!"};
        miscMessage = dico[langue];
      }
    }
  }
}

function Grid(){
  for(let r = 0;r<numberOfTries;r++){
    for(let c = 0;c<numberOfLetters;c++){
      push();//important so that background color does not affect other letter
      fill(245,245,245,100);
      stroke(0);
      strokeWeight(3);
      let squareX = gridX()+ 2*margin() + c*(squareSize()+margin());
      let squareY = 2*margin() + r*(squareSize()+margin());
      rect(squareX,squareY,squareSize(),squareSize());//draw empty square
      if(letter[r][c].letter != "empty"){
        letter[r][c].draw(squareX,squareY);
      }
      pop();
    }
  }
}

function misc(){
  let messageX = gridX()+ 2*margin();
  let messageY = 2*margin() + (numberOfTries+1)*(squareSize()+margin()) + margin() ;
  if(miscMessage != ""){
    fill(255);
    textSize(squareSize()*0.6);
    text(miscMessage,messageX,messageY);
  }
}

function checkWord(){
  if(letter[currentTry-1][numberOfLetters-1].letter != "empty" && dict_all.includes(findWord(currentTry-1))){
    let copies = [];
    for(let l=0;l<numberOfLetters;l++){//makes a list of all letters present to not draw letter multiple colors
      copies.push(word[l]);
    }

    for(let c=0;c<numberOfLetters;c++){
      if(letter[currentTry-1][c].letter == word.charAt(c)){
        letter[currentTry-1][c].color = "green";
        let todelete = copies.indexOf(letter[currentTry-1][c].letter);
        copies.splice(todelete,1);
      }
    }
    for(let c=0;c<numberOfLetters;c++){
      if(copies.includes(letter[currentTry-1][c].letter) && letter[currentTry-1][c].letter != word.charAt(c)){
        letter[currentTry-1][c].color = "yellow";
        let todelete = copies.indexOf(letter[currentTry-1][c].letter);
        copies.splice(todelete,1);
      }
    }
    //animation
    for(let c=0;c<numberOfLetters;c++){
      letter[currentTry-1][c].startAnimation();
      animating.push([currentTry-1,c]);
    }
    currentTry++;
    miscMessage = "";
  }else{
    let dico = {'francais': "Pas un mot valide !", 'english': "Not a valid word!", 'norway': "Ikke et gyldig ord!"};
    keyboard.show=false;
    miscMessage = dico[langue];
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

function settingsButton(){
  push();
  image(icon_menu, buttonX,buttonY,buttonW,buttonH);
  pop();
}

function detecteButton(){
  if(mouseX <buttonX+buttonW && mouseY<buttonY+buttonH && mouseX > buttonX && mouseY > buttonY){
    window.location.assign("https://mrtnt-programmer.github.io/wordle/settings");
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
  for(let r = 0;r<currentTry;r++){
    for(let c = 0;c<numberOfLetters;c++){
      if(letter[r][c].letter == "empty"){
        letter[r][c].letter = keyToPut;
        return;
      }
    }
  }
}

function deleteLastLetter(){
  miscMessage = '';
  keyboard.show=true;
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

function mousePressed(){
  keyboard.show=true;
  miscMessage = "";
  detecteButton();
  keyboard.detection();
}

