let numberOfLetters = 6;
let minMaxLetters = [4,8];
let langue = 'francais'; // can be 'francais', 'english' (and soon 'norway')
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

function preload(){ 
  console.log("data from settings",sessionStorage.getItem("numberOfLetters"),sessionStorage.getItem("langue"))
  if(sessionStorage.getItem("numberOfLetters")>=minMaxLetters[0] &&
    sessionStorage.getItem("numberOfLetters")<=minMaxLetters[1] &&
    possibleLangue.includes(sessionStorage.getItem("langue"))){//check if were being sent valid data
    numberOfLetters = sessionStorage.getItem("numberOfLetters");
    langue = sessionStorage.getItem("langue");  
  }
  let suffix = '_square';
  if (windowWidth > windowHeight*1.25) {
    suffix = '_wide';
  }
  if (windowHeight > windowWidth*1.25) {
    suffix = '_tall';
  }
  let filename = 'background/background_'+langue+suffix+'.jpg';
  console.log(width, height, filename);
  background_image = loadImage(filename);
  icon_menu = loadImage('icon_menu.png');
  filename = 'dict/'+langue +'_frequent_'+numberOfLetters.toString()+'.txt'
  dict_frequent = loadStrings(filename);
  filename = 'dict/'+langue +'_all_'+numberOfLetters.toString()+'.txt'
  dict_all = loadStrings(filename);
  myFont = loadFont('Salma.otf');
//   myFont = loadFont('OddlyCalming.ttf');
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
  currentDictionary = dict_frequent;
  print(word)
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
  return min(height*0.66/numberOfLetters, width*0.6/numberOfLetters);
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
  settingsButton();
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
        fill(255); // white
        if(letter[r][c].color == "green"){//correct
          fill(0,255,0,200);//green
        }else if(letter[r][c].color == "yellow"){
          fill(255,255,0,200);//yellow
        }
        rect(squareX,squareY,squareSize(),squareSize());//draw background of square
        
        textSize(squareSize()*0.93);
        textFont(myFont);
        textAlign(CENTER);
        fill(60);
        rectMode(CENTER)
        text(letter[r][c].letter,squareX+squareSize()/2,squareY+squareSize()/2*1.53);//draw letters
      }
      pop();
    }
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

function settingsButton(){
  push();
  image(icon_menu, buttonX,buttonY,buttonW,buttonH);
//   fill(255,40);
//   rect(buttonX,buttonY,buttonW,buttonH);
  pop();
}

function detecteButton(){
  if(mouseX <buttonX+buttonW && mouseY<buttonY+buttonH && mouseX > buttonX && mouseY > buttonY){
    window.location.assign("https://mrtnt-programmer.github.io/wordle/settings");
  }
}

let possibleLetter = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
let possibleLetterM = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
function typing(){
  if(keyCode == ENTER){
    checkWord();
  }else if(keyCode == BACKSPACE){
    deleteLastLetter();
  }else if(possibleLetterM.includes(key)){//if lowercase 
    let k;
    for(let l=0;l<possibleLetterM.length;l++){
      if(possibleLetterM[l] == key){
        k = possibleLetter[l];
        break;
      }
    }
    findEmptySpot(k);
  }else if(possibleLetter.includes(key)){
    findEmptySpot(key);
  }
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
  detecteButton();
}

