class Letter{
  constructor(r,c){
    this.r = r;
    this.c = c;
    this.letter = "empty";
    this.color = "gray";//gray green yellow
    this.animation = false;
    this.starting_time = 0;
  }

    draw(squareX,squareY){
      let time = millis() - this.starting_time;
      let angle = min(time/2, 360);

      //color
      fill(255);
      rect(squareX,squareY,squareSize(),squareSize());//draw a first background of square for contrast
      if(this.color == "green"){//correct
        fill(0,255,0,angle/2);//green
      }else if(this.color == "yellow"){
        fill(255,255,0,angle/2);//yellow
      }
      rect(squareX,squareY,squareSize(),squareSize());//draw the real background of square

      //angle
      translate(squareX+squareSize()/2,squareY+squareSize()/2*1.46);//moving for letters
      if(this.animation){
        angleMode(DEGREES)
        rotate(angle);
      }
      //drawing
      textSize(squareSize()*0.87);
      textFont(myFont);
      textAlign(CENTER);
      fill(60);
      rectMode(CENTER)
      //translate(-squareSize(),-squareSize());//reset the translate of background
      text(this.letter,0,0);//draw letters
    }
    
  startAnimation(){
    this.animation = true;
    this.starting_time = millis();
  }
}
