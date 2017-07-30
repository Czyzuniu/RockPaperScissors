'use strict';

let socket = io();
let users = [];


socket.on('users', function(data){
  users = data;
  let isare = "is ";
  let plural = "user"
  if(users.length > 1){
    isare = "are ";
    plural = "users";
  }
  window.foot.textContent = "There " + isare + " " + users.length + " active " + plural
});

socket.on('onlineId', function(data){
  console.log(data);
  window.online_id.textContent = data.onlineId;
});
