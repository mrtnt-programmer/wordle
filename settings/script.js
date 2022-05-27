let data = [0,0,0];
data[0] = getCookie("numberOfLetters", 5);
data[1] = getCookie("langue", 'english');
data[2] = getCookie("keyboard", 'ON');
console.log('after loading cookies:', data);

function backToGame(){
  createCookies(...data);
  let path = location.origin + location.pathname.slice(0,-9); // slice removes 'settings'
  window.location.assign(path); 
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
