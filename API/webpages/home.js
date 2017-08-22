'use strict';

let socket = io()
let users = [];
let currentUser;
let myIndex;
let recentReq;

window.addEventListener ('load', function() {
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

      if(response.isAuthenticated){
        socket.emit('start', user);
      }
    }
  });
  return false;
});

window.logout.addEventListener ('click', function() {
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



socket.on ('newRequest', function(data) {
  let dialog = window.invitation;
  window.invitationBodyText.textContent = "You have a game request from " + data.onlineId;
  recentReq = data.onlineId;
  dialog.showModal();
})

socket.on('users', function(data){
  users = data;
  let isare = "is ";
  let plural = "user"
  if (users.length > 1 || users.length == 0) {
    isare = "are ";
    plural = "users";
  }
  window.foot.textContent = "There " + isare + " " + users.length + " active " + plural

  for (let i of users) {
    if(i.onlineId == currentUser){
      myIndex = users.indexOf(i);
    }
  }
});


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
        alert('request sent to ' + users[indexTo].onlineId)
      }
    }

    if(indexTo == null){
      alert("Sorry there is no online user with an id like " + friendId)
    }

});

window.declineReq.addEventListener('click', function() {
    let dialog = window.invitation;
    dialog.close();
    socket.emit('requestDeclined', )
});
