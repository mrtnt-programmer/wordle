//the keyboard layout must have a complete list,no holes!
//
class Keyboard{
  constructor(show, langue){
    this.keys = [["q","w","e","r","t","y","u","i","o","p"],
                  ["empty","a","s","d","f","g","h","j","k","l"],
                  ["z","x","c","v","b","n","m","▢", "empty","↲"]
                  ]; //default list containing all the keys of the keyboard 

    if (langue == 'francais'){
      this.keys = [["a","z","e","r","t","y","u","i","o","p"],
                   ["q","s","d","f","g","h","j","k","l","m"],
                   ["empty","w","x","c","v","b","n","▢", "empty","↲"]
                  ];
    } 
    
    if (langue == 'english'){
      this.keys = [["q","w","e","r","t","y","u","i","o","p"],
                  ["empty","a","s","d","f","g","h","j","k","l"],
                  ["z","x","c","v","b","n","m","▢", "empty","↲"]
                  ];
    }

    if (langue == 'norway'){
      this.keys = [["q","w","e","r","t","y","u","i","o","p","å"],
                  ["a","s","d","f","g","h","j","k","l","ø","æ"],
                  ["empty","z","x","c","v","b","n","m","▢", "empty","↲"]
                  ];
    }

    this.keyColor;
    this.resetColor();

    this.rows = this.keys.length;//number of rows in the layout
    this.cols = this.keys[0].length;
    this.show = show == 'on';
    this.visible = this.show;
  }

  findKeyCoor(letter){
    for(let r = 0;r<this.keys.length;r++){
      for(let c = 0;c<this.keys[r].length;c++){
        if(this.keys[r][c] == letter){
          return [r,c];
        }
      }
    }
  }

  setColor(letter,color){
    let [r,c] = this.findKeyCoor(letter);
    if (color == "green"){
      this.keyColor[r][c] = "green";
    }
    if(color == "yellow" && this.keyColor[r][c] != "green"){//if it is green is should stay green
      this.keyColor[r][c] = "yellow";
    }
    if(color == "gray" && this.keyColor[r][c] != "yellow" && this.keyColor[r][c] != "green"){//if it is green is should stay green
      this.keyColor[r][c] = "gray";
    }
  }

  resetColor(){
    this.keyColor = JSON.parse(JSON.stringify(this.keys));
    for(let r = 0;r<this.keys.length;r++){
      for(let c = 0;c<this.keys[r].length;c++){
        if(this.keys[r][c] != "empty"){
          this.keyColor[r][c] = "white";
        }else{
          this.keyColor[r][c] = "empty";
        }
      }
    }
    console.log(this.keys);
    console.log(this.keyColor);
  }
  
  toggleShow(){
    this.visible = this.show; 
  }
  
  draw(){
    if (this.visible){
      push();
      //fill(60);
      fill(60);
      noStroke();
      rect(...this.keyboardCoor());

      for(let r = 0;r<this.keys.length;r++){
        for(let c = 0;c<this.keys[r].length;c++){
          if(this.keys[r][c] != "empty"){
            push();
            let [x,y,w,h] = this.keyCoor(r,c);
            x = x+w/2;//because we are drawing in CENTER mode
            y = y+h/2;
            rectMode(CENTER);
            fill(255);//background color of the rect
            if(this.keyColor[r][c] == "green"){
              fill(0,255,0);
            } 
            if(this.keyColor[r][c] == "yellow"){
              fill(255,255,0);
            }            
            if(this.keyColor[r][c] == "gray"){
              fill(60);
            }
            rect(x,y,w,h);
            fill(0);//color of the letter
            textAlign(CENTER);
            textSize(min(this.keyCoor(r,c)[2],this.keyCoor(r,c)[3]));
            text(this.keys[r][c],x,y+h/5);
            pop();
          }
        }
      }
      pop();
    }
  }

  detection(){
    if (this.visible){
      for(let r = 0;r<this.keys.length;r++){
        for(let c = 0;c<this.keys[r].length;c++){
          if(mouseX>this.keyCoor(r,c)[0] && mouseY>this.keyCoor(r,c)[1] && mouseX<this.keyCoor(r,c)[0]+this.keyCoor(r,c)[2] && mouseY<this.keyCoor(r,c)[1]+this.keyCoor(r,c)[3]){
            this.input(r,c);
            return;
          }
        }
      }
    }
  }
  
  input(r,c){
    keyCode = null;//to avoid key repetition
    key = null;
    if(this.keys[r][c] == "↲"){
      typing("ENTER");
    }else if(this.keys[r][c] == "▢"){
      typing("BACKSPACE");
    }else{
      typing(this.keys[r][c]);
    }
  }

  keyboardCoor(){
    let keyboardX = gridX()+margin();
    let keyboardY = wordle.numberOfTries*(squareSize()+margin())+margin()*2;
    let keyboardW = gridWidth()-margin()*2;
    let keyboardH = min(keyboardW, height - margin() - keyboardY);
    return [keyboardX,keyboardY,keyboardW,keyboardH];
  }

  keyCoor(r,c){
    let [keyboardX,keyboardY,keyboardW,keyboardH] = this.keyboardCoor();
    let keyX = keyboardX + ((keyboardW/this.cols))*(c) + margin()/2 ;
    let keyY = keyboardY + ((keyboardH/this.rows))*(r) + margin()/2;
    let keyW = ((keyboardW/this.cols)-margin());
    let keyH = ((keyboardH/this.rows)-margin());
    return [keyX,keyY,keyW,keyH];
  }
}
