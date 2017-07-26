const express = require('express');
const app = express();
const mysql = require('mysql');
const http = require('http').Server(app);
const io = require('socket.io')(http)

const files = __dirname
app.use(express.static(files))


let users = []

let sql = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'my_db'
});

sql.connect();

io.on('connection', function(socket) {

  var user = {
    id: socket.id,
    onlineId:null
  };
  users.push(user)

  socket.on('disconnect', function() {
    for(let i of users){
      if(i.id == socket.id){
        users.splice(users.indexOf(i), 1);
      }
    }
  })

  socket.on('nameUpdate', function(onlineId){
    for(let i of users){
      if(i.id == socket.id){
        i.onlineId = onlineId
      }
    }
  })

});

setInterval(function() {
  io.sockets.emit('users', users)
}, 2000)


http.listen(8080);
