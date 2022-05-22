let data = [6,"english"];
function change(value){
  console.log(value);
}

function backToGame(){
  window.location.assign("https://mrtnt-programmer.github.io/wordle");
  sessionStorage.setItem("numberOfLetters",data[0]);
  sessionStorage.setItem("langue",data[1]);
}
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction(id) {
  document.getElementById(id).classList.toggle('show');
}

// Close the dropdown if the user clicks outside of it

window.onclick = function(e) {
  if (!e.target.matches('.dropbtn')) {
    for (const id of ['dropdown_letters', 'dropdown_langue']){ 
      var myDropdown = document.getElementById(id);
      if (myDropdown.classList.contains('show')) {
        myDropdown.classList.remove('show');
      }
    }
  }
}
