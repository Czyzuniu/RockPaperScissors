'use strict';

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


  $('#login').submit(function(e){
    e.preventDefault();
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
});



window.registerRedirect.addEventListener('click', function(){
  window.location = "/registerAccount";
});
