'use strict';

let socket = io();
let users = [];


socket.on('users', function(data){
  users = data;
});
