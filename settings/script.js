let data = [0,0,0];
data[0] = getCookie("numberOfLetters", 5);
data[1] = getCookie("langue", 'english');
data[2] = getCookie("keyboard", 'on');
console.log('after loading cookies:', data);

// create dropdown langue
let text = '';
for (const langue of ['english', 'francais', 'norway']){
  text += '<input type="radio" id="';
  text += langue+'"';
  text += ' name="fav_language" onclick="data[1] ='; 
  text += "'" + langue + "'" + '"';
  if (langue == data[1]){
    text += ' checked="checked"';
  }
  text += '>\n';
  text += '<label for="';
  text += langue;
  langue_menu = {'english': 'English', 'francais': 'Français', 'norway':'Norwegian'};
  text += '">' + langue_menu[langue] +'</label>';
  if (langue != 'norway'){
    text += '<br><br>';
  }
  text += '\n';
}
document.getElementById("dropdown_langue").innerHTML = text;

// create dropdown letters
text = '';
for (const number of ['4', '5', '6', '7', '8']){
  text += '<input type="radio" id="';
  text += number+'"';
  text += ' name="nb_letters" onclick="data[0] =' + number + '"';
  if (number == data[0].toString()){
    text += ' checked="checked"';
  }
  text += '><label for="' + number + '">' + number + '</label>';
  if (number != '8'){
    text += '<br><br>';
  }
  text += '\n';
}
document.getElementById("dropdown_letters").innerHTML = text;

// create dropdown keyboard
text ='';
for (const control of ['on', 'off']){
  text += '<input type="radio" id="' + control + '" ';
  text += 'name="keyboard" onclick="data[2] = ' + "'" + control + "'" + '"';
  if (control == data[2]){
    text += ' checked="checked"';
  }
  text += '><label for="' + control + '">' + control + '</label>';
  if (control != 'off'){
    text += '<br><br>';
  }
  text += '\n';
}
console.log(text);
document.getElementById("dropdown_keyboard").innerHTML = text;

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
