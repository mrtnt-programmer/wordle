let data = [5,"english","ON"];

function backToGame(){
  window.location.assign(location.origin + location.pathname.slice(0,-9)); // slice removes 'settings'
  sessionStorage.setItem("numberOfLetters", data[0]);
  sessionStorage.setItem("langue", data[1]);
  sessionStorage.setItem("keyboard", data[2]);
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
