'use strict';

let socket = io();
let users = [];
let name = window.playerName;
let error = true;
let loginButton = window.loginButton;


loginButton.addEventListener('click', function(){
  let onlineId = window.username;
  let password = window.password;

  if(!onlineId.value){
    onlineId.setCustomValidity("Please enter your onlineId");
    onlineId.style.borderColor = 'red';
  }else{
    onlineId.setCustomValidity("");
    onlineId.style.borderColor = null;
  }
  if (!password.value) {
    password.setCustomValidity("Please enter your password");
    password.style.borderColor = 'red';
  }else {
    password.setCustomValidity("");
    password.style.borderColor = null;
  }
});

$('#login').submit(function(){
  $.ajax({
    url: $('#login').attr('action'),
    type: 'POST',
    data : $('#login').serialize(),
    success: function(response){
      if(response.status == "success"){
        alert("logged in!");
        window.location = '/home';
      }else{
        alert("something is not quite right")
      }
    }
  });
  return false;
});
// name.addEventListener('input', () => {
//   socket.emit('nameUpdate', name.value);
//   if (name.value.length <= 2) {
//     name.style.backgroundColor = 'red';
//     error = true;
//   } else {
//     name.style.backgroundColor = 'lightgreen';
//     error = false;
//   }
//
//     disableButtons();
// });

socket.on('users', function(data){
  users = data;
});

//
// function disableButtons(){
//   for(let i of buttons){
//     if(error){
//       i.disabled = true;
//     }else{
//       i.disabled = false;
//     }
//   }
// }


window.addEventListener('load', () =>{

});


window.registerRedirect.addEventListener('click', function(){
  window.location = "/registerAccount";
});
