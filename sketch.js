//global variables 

let wordle;
let keyboard;
let message;

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

class Message{
  constructor(){
    this.text ='';
  }

  draw(){
    let X = gridX()+ 2*margin();
    let Y = 2*margin() + (wordle.numberOfTries+1)*(squareSize()+margin()) + margin() ;
    if(this.text != ""){
      fill(255);
      textSize(squareSize()*0.6);
      text(this.text, X, Y);
    }
  }

  reset(){
    this.text ='';
    keyboard.toggleShow();
  }

  update(flag){
    let dico;
    if (flag == 'notvalid'){
      dico = {
        'francais': "Pas un mot valide !", 
        'english': "Not a valid word!", 
        'spanish': "Ni una palabra válida", 
        'norway': "Ikke et gyldig ord!"
      };
    }else if(flag == 'victory'){
      dico = {
        'francais': "Bravo !", 
        'english': "Well done!", 
        'spanish': "¡Bien hecho!", 
        'norway': "Godt gjort!"
      };
    }else if(flag == 'gameover'){
      dico = {
        'francais': "C'était '" + wordle.word + "'!", 
        'english': "It was '" + wordle.word + "'!", 
        'spanish': "¡Era '" + wordle.word + "'!", 
        'norway': "Det var '" + wordle.word + "'!"};
    }
    this.text = dico[wordle.option.langue];
    keyboard.visible=false;
  }
}

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
//   currentDictionary = wordle.dict.frequent;
  wordle.button.W = min(width, height)/20;
  message = new Message();
}

function draw(){
  showgame();
  checkStatus();
  square.draw();
  message.draw();
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
  settingsButton();
  restartButton();
}

function restartButton(){
  if (wordle.status == "victory" || wordle.status == "gameover"){
  // if (true){
    push();
    RbuttonX=wordle.button.X+width/20;
    RbuttonY=wordle.button.Y;
    RbuttonW=wordle.button.W;
    fill(200);
    rect(RbuttonX,RbuttonY,RbuttonW,RbuttonW,10);
    textSize(RbuttonW*.3);
    fill(0);
    text("restart", RbuttonX+RbuttonW*.08,RbuttonY+RbuttonW*.38,RbuttonW,RbuttonW);
    pop();
  }
}

function checkStatus(){
  if(wordle.status == "playing"){
    if(wordle.currentTry>wordle.numberOfTries){
      wordle.status = "gameover";
      message.update('gameover');
    }
    if(wordle.currentTry != 1){
      if(wordle.word == findWord(wordle.currentTry-2)){
        wordle.status = "victory";
        message.update('victory');
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

function checkWord(){
  if(wordle.letter[wordle.currentTry-1][wordle.option.numberOfLetters-1].letter != "empty" && wordle.dict.all.includes(findWord(wordle.currentTry-1))){
    let copies = [];
    for(let l=0;l<wordle.option.numberOfLetters;l++){//makes a list of all letters of the correct word to not draw letter multiple colors
      copies.push(wordle.word[l]);
    }


    for(let c=0;c<wordle.option.numberOfLetters;c++){
      if(wordle.letter[wordle.currentTry-1][c].letter == wordle.word.charAt(c)){
        wordle.letter[wordle.currentTry-1][c].color = "green";//telling the letter it's color
        keyboard.setColor(wordle.letter[wordle.currentTry-1][c].letter,"green");//for the change of color of keys
        let todelete = copies.indexOf(wordle.letter[wordle.currentTry-1][c].letter);
        copies.splice(todelete,1);
      }
    }
    for(let c=0;c<wordle.option.numberOfLetters;c++){
      if(copies.includes(wordle.letter[wordle.currentTry-1][c].letter) && wordle.letter[wordle.currentTry-1][c].letter != wordle.word.charAt(c)){
        wordle.letter[wordle.currentTry-1][c].color = "yellow";//telling the letter it's color
        keyboard.setColor(wordle.letter[wordle.currentTry-1][c].letter,"yellow");//for the change of color of keys
        let todelete = copies.indexOf(wordle.letter[wordle.currentTry-1][c].letter);
        copies.splice(todelete,1);
      }
    }

    //putting all letters to gray. if it is already yellow or green it will not change
    for(let c=0;c<wordle.option.numberOfLetters;c++){
      keyboard.setColor(wordle.letter[wordle.currentTry-1][c].letter,"gray");
    }
      //animation
    for(let c=0;c<wordle.option.numberOfLetters;c++){
      wordle.letter[wordle.currentTry-1][c].startAnimation();
    }
    wordle.currentTry++;
    message.reset();
  }else{
    message.update('notvalid');
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
    && mouseX > wordle.button.X 
    && mouseY > wordle.button.Y){
      window.location.assign(location.href+'settings');
  }
  if( (wordle.status == 'victory' || wordle.status == 'gameover') 
    &&  mouseX < wordle.button.X+width/20+wordle.button.W 
    && mouseY< wordle.button.Y+wordle.button.W 
    && mouseX > wordle.button.X+width/20 
    && mouseY > wordle.button.Y){
      location.reload()
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
      if (message.text != ''){//take away the "wrong word" message even is we are keyboard only
        message.reset();
      }
    }else if(possibleLetter.includes(lowerKey)){
      findEmptySpot(lowerKey);
    }else{
      console.log("unknown key");
    }
    // keyCode = null;//to avoid key repetition // Je ne crois pas que ça serve à quelque chose
    // key = null;
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
  if (message.text != ''){
    message.reset();
  }
  detectButton();
  keyboard.detection();
}

function touchStarted(){
  // on ipad, each touch fires a touchStarted() and a mousePressed().
  // if touchStarted() is not defined, it fires another MousePressed, resulting in double typing.
  console.log('touchStarted');
  square.color = 'red';
}

function touchEnded(){
  // on laptop, touch fires mousePressed(), and release fires touchEnded()
  // we do nothing
  console.log('touchEnded');
  square.color = 'green';
}
