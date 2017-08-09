'use strict';

let socket = io.connect('http://localhost:8080', {
  'reconnection': true,
  'reconnectionDelay': 500,
  'reconnectionAttempts': 10
});
let users = [];
let currentUser;
let myIndex;

window.addEventListener('load', function() {
  $.ajax({
    url: '/getClientInformation',
    type: 'GET',
    data : "",
    success: function(response) {
      window.online_id.textContent = "Welcome " + response.name;
      window.avatar.style.backgroundImage = "url(/img/" + response.pic + ")";
      currentUser = response.name;

      let user = {
        id:socket.id,
        onlineId:currentUser
      };

      socket.emit('start', user);
    }
  });
  return false;
});

window.logout.addEventListener('click', function(){
  $.ajax({
    url: '/logout',
    type: 'POST',
    data : "",
    success: function(response) {
      if(response.status == 'success'){
        socket.disconnect();
        window.location.reload();
      }
    }
  });
  return false;
})


socket.on('users', function(data){
  users = data;
  let isare = "is ";
  let plural = "user"
  if(users.length > 1 || users.length == 0){
    isare = "are ";
    plural = "users";
  }
  window.foot.textContent = "There " + isare + " " + users.length + " active " + plural

  for(let i of users){
    if(i.onlineId == currentUser){
      myIndex = users.indexOf(i);
    }
  }
});




socket.on('request', function(data){
  console.log(data);
  let dialog = window.dialog;
  dialog.title = "Game request";
  dialog.textContent = "You have a request from : " + data.onlineId;

  $("#dialog").dialog({
      buttons : {
        "Confirm" : function() {
          console.log("ok");
        },
        "Cancel" : function() {
          $(this).dialog("close");
        }
      }
    });

    $("#dialog").dialog("open");
})




window.sendRequest.addEventListener('click', function(){
    let rounds = window.rounds.value;
    let friendId = window.friendId.value;
    let indexFrom;
    let indexTo;
    let valid = 0;
    for(let i of users) {
      if(i.onlineId == friendId){
        indexTo = users.indexOf(i);
        socket.emit('request', {user:i, indexTo:indexTo, indexFrom: myIndex});
        console.log("request");
      } else{
        valid++;
      }
    }

    if(valid > 0){
      alert("Sorry, there is no one with an id like this: " + friendId)
    }
});
