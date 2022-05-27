let path = '/';
let expireDate = "expires=Thu,1 Dec "+(new Date().getFullYear()+2)+" 12:00:00 UTC";

function getCookie(cName) {//from https://www.w3schools.com/js/js_cookies.asp
  let name = cName + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function createCookies(Cnumber){
  let string = "number="+Cnumber.toString()+";"+expireDate+";"+"path="+path;
  console.log("string", string);
  document.cookie = string;
  console.log("sending cookies",document.cookie);
}


let number;

function setup(){
  createCanvas(windowWidth, windowHeight);
  number = getCookie("number");
  createCookies(random([1,2,3,4,5]));
}

function draw(){
  text(number.toString(), 10,10)
}
