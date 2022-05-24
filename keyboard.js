//the keyboard layout must have a complete list,no holes!
//
class Keyboard{
  constructor(){
    this.keys = [["q","w","e","r","t","y","u","i","o","p"],
                ["a","s","d","f","g","h","j","k","l","↲"],
                ["empty","z","x","c","v","b","n","m","empty","⛞"]
                             ];//list containing all the keys of the keyboard 
    this.rows = this.keys.length;//number of rows in the layout
    this.cols = this.keys[0].length;
    this.show = true;
  }
  
  draw(){
    if (this.show){
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
            fill(40);
            rect(x,y,w,h);
            fill(255);
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
    for(let r = 0;r<this.keys.length;r++){
      for(let c = 0;c<this.keys[r].length;c++){
        if(mouseX>this.keyCoor(r,c)[0] && mouseY>this.keyCoor(r,c)[1] && mouseX<this.keyCoor(r,c)[0]+this.keyCoor(r,c)[2] && mouseY<this.keyCoor(r,c)[1]+this.keyCoor(r,c)[3]){
          this.input(r,c);
          return;
        }
      }
    }
  }
  
  input(r,c){
    keyCode = null;//to avoid key repetition
    key = null;
    if(this.keys[r][c] == "↲"){
      typing("ENTER");
    }else if(this.keys[r][c] == "⛞"){
      typing("BACKSPACE");
    }else{
      typing(this.keys[r][c]);
    }
  }

  keyboardCoor(){
    let keyboardX = gridX()+margin();
    let keyboardY = numberOfTries*(squareSize()+margin())+margin()*2;
    let keyboardW = gridWidth()-margin()*2;
    let keyboardH = height - margin() - keyboardY;
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
