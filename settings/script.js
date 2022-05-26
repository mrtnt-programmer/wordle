let data = [5,"english","ON"];
let path = location.origin + location.pathname.slice(0,-9);
let expireDate = "expires=Thu,1 Dec "+(new Date().getFullYear()+2)+" 12:00:00 UTC";
let loadedCookies = false;

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

function loadCookies(){
  if(!loadedCookies){
      data[0] = getCookie("numberOfLetters");
      data[1] = getCookie("langue");
      data[2] = getCookie("keyboard");
      console.log("received cookies",data);
      loadedCookies = true;
    }
  }

function backToGame(){
  sessionStorage.setItem("numberOfLetters", data[0]);
  sessionStorage.setItem("langue", data[1]);
  sessionStorage.setItem("keyboard", data[2]);
  console.log("session storage",sessionStorage);
  document.cookie = "numberOfLetters="+data[0]+";"+expireDate+";"+"path="+path+";"+"domain="+location.origin;
  document.cookie = "langue="+data[1]+";"+expireDate+";"+"domain="+path;
  document.cookie = "keyboard="+data[2]+";"+expireDate+";"+"domain="+path;
  console.log("cookies",document.cookie);
  console.log("cookies data",expireDate,path,location.origin);
  window.location.assign(path); // slice removes 'settings'
}

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function showFunction(id) {
  document.getElementById(id).classList.toggle('show');
  for (const id_other of ['dropdown_letters', 'dropdown_langue', 'dropdown_keyboard']){ 
    if (id != id_other) {  
      var myDropdown = document.getElementById(id_other);
      if (myDropdown.classList.contains('show')) {
        myDropdown.classList.remove('show');
      }
    }
  }
}
