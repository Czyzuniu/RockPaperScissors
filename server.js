'use strict'

const express = require('express');
const app = express();
const mysql = require('mysql');
const http = require('http').Server(app);
const io = require('socket.io')(http)
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const files = __dirname + "/API/webpages";

app.use(express.static(files))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));

let users = []

let sql = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'RPS'
});

sql.connect();

app.post('/onlineIdUsed', function(req,res){
    let onlineId = req.body.onlineId;
    console.log(onlineId);

    sql.query("SELECT * FROM USERS WHERE onlineId = ?", [onlineId], function(err,result){
        if(result.length == 1){
          res.send({status:"exists"});
        }else{
          res.send({status:"success"});
        }
    });
});

app.get('/playFriend',checkAuth, function(req,res){
  res.sendFile(__dirname + '/API/routes/playFriend.html')
});

app.get('/',checkAuth, function(req,res){
  res.sendFile(__dirname + '/API/routes/home.html')
});

app.get('/home',checkAuth, function(req,res){
  res.sendFile(__dirname + '/API/routes/home.html')
});

app.get('/registerAccount', function(req,res){
  res.sendFile(__dirname + '/API/routes/register.html')
});


app.post('/registerAccount', function(req,res){

  let passReg = /^.{8,}$/

  let onlineId = req.body.onlineId;
  let password = req.body.password;
  let repassword = req.body.passwordRepeat;

  if (passReg.test(password) && passReg.test(repassword)) {
      if(password === repassword){
          if(onlineId.length > 2){
            let user = {
              onlineId: onlineId,
              password: password
            };
            sql.query("INSERT INTO USERS SET ? ", user, function(err,result){
              if(err){
                console.log(err);
              }else{
                res.send({status:"success"})
              }
          });
      }
    }
  }
});


app.post('/login', function(req,res){
    let onlineId = req.body.username;
    let password = req.body.password;

    sql.query('SELECT * FROM USERS WHERE OnlineId = ? AND Password = ?',[onlineId, password], function(err, result){
        let numRows = result.length;
        if(numRows == 1){
          let sid = req.sessionID;
          let id = result[0].Id;
          req.session.user_id = id;
          req.session.online_id = onlineId;
          connect(req,res);
          sql.query('UPDATE USERS SET SessionId = ? WHERE ID = ?', [sid,id], function(err, result){
              if(err){
                console.log(err);
              }else{
                console.log(result.affectedRows);
              }
          });
          res.send({status:"success"});
        }else{
          res.send({status:"err"});
        }
    });

});


function connect(req,res){
  if(req.session.user_id){
    io.on('connection', function(socket) {
      var user = {
        id: socket.id,
        onlineId:req.session.online_id
      };

      socket.emit('onlineId', {onlineId:req.session.online_id});

      if(users.length >= 1){
          for(let i of users){
            if(i.onlineId != req.session.online_id){
              users.push(user);
            }
          }
      } else{
          users.push(user);
      }

      socket.on('disconnect', function() {
        for(let i of users){
          if(i.id == socket.id){
            users.splice(users.indexOf(i), 1);
          }
        }
      })



      // socket.on('nameUpdate', function(onlineId){
      //   for(let i of users){
      //     if(i.id == socket.id){
      //       i.onlineId = onlineId
      //     }
      //   }
      // })

    });
  }
}




setInterval(function() {
  io.sockets.emit('users', users)
}, 2000)


function checkAuth(req,res, next){
  if(!req.session.user_id) {
    res.sendFile(__dirname + '/API/routes/index.html')
  }else{
    next();
  }
}


http.listen(8080);
