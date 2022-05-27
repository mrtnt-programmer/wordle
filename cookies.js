function getCookie(cName, fallback='') {//from https://www.w3schools.com/js/js_cookies.asp
  let name = cName + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      const result = c.substring(name.length, c.length);
      if (result == ''){
        return fallback;
      }else{
        return result;
      }
    }
  }
  return fallback;
}

function createCookies(CnumberOfLetters,Clangue,Ckeyboard){
  let expireDate = "expires=Thu,1 Dec "+(new Date().getFullYear()+2)+" 12:00:00 UTC";
  let path = location.pathname.slice(0,-9); // slice removes 'settings'
  document.cookie = "numberOfLetters="+CnumberOfLetters+";"+expireDate+";"+"path="+path;
  document.cookie = "langue="+Clangue+";"+expireDate+";"+"path="+path;
  document.cookie = "keyboard="+Ckeyboard+";"+expireDate+";"+"path="+path;
  console.log("creating cookies",document.cookie);
}
