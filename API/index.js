'use strict';

let socket = io();
let users = [];
let name = window.playerName;
let error = true;
const buttons = document.querySelectorAll('button[type=button]');



for (let i of buttons) {
  i.addEventListener('click', () => {
    //window.location = '/playFriend.html'
  });
}

name.addEventListener('input', () => {
  socket.emit('nameUpdate', name.value);
  if (name.value.length <= 2) {
    name.style.backgroundColor = 'red';
    error = true;
  } else {
    name.style.backgroundColor = 'lightgreen';
    error = false;
  }

    disableButtons();
});

socket.on('users', function(data){
  users = data;
});


function disableButtons(){
  for(let i of buttons){
    if(error){
      i.disabled = true;
    }else{
      i.disabled = false;
    }
  }
}


window.addEventListener('load', () =>{
  disableButtons();
});
