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

function createCookies(CnumberOfLetters,Clangue,Ckeyboard){
  let expireDate = "expires=Thu,1 Dec "+(new Date().getFullYear()+2)+" 12:00:00 UTC";
  let path = "/wordle/";
  document.cookie = "numberOfLetters="+CnumberOfLetters+";"+expireDate+";"+"path="+path;
  document.cookie = "langue="+Clangue+";"+expireDate+";"+"path="+path;
  document.cookie = "keyboard="+Ckeyboard+";"+expireDate+";"+"path="+path;
  console.log("sending cookies",document.cookie);
}

function loadCookies(){
  if(!loadedCookies){
      data[0] = getCookie("numberOfLetters");
      data[1] = getCookie("langue");
      data[2] = getCookie("keyboard");
      console.log("received cookies",data);
      loadedCookies = true;
    }
  }
