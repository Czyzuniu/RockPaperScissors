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
const images = __dirname + '/API/img';

app.use(express.static(files))

app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


let userCount = 0;
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
    //console.log(onlineId);

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

app.get('/login', function(req,res){
  if(!req.session.isAuthenticated){
      res.sendFile(__dirname + '/API/routes/index.html')
  }else{
    res.sendFile(__dirname + '/API/routes/home.html')
  }

});

app.get('/getClientInformation', function(req,res){
  sql.query('SELECT onlineId, profilepic FROM USERS WHERE sessionId = ?',[req.sessionID], function(err, result) {
    let avatar = result[0].profilepic
    if(avatar == undefined){
      avatar = 'default.png';
    }
    let userdata = {
      name: result[0].onlineId,
      pic: avatar
    };
      res.send(userdata)
  });
});

app.get('/home',checkAuth, function(req,res){
  res.sendFile(__dirname + '/API/routes/home.html')
});

app.get('/registerAccount', function(req,res){
  res.sendFile(__dirname + '/API/routes/register.html')
});

app.post('/logout', function(req,res){
  req.session.destroy();
  if(!req.session){
    res.send({status:"success"})
  }
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

    if(!req.session.isAuthenticated){
      sql.query('SELECT * FROM USERS WHERE OnlineId = ? AND Password = ?',[onlineId, password], function(err, result){
          let numRows = result.length;
          if(numRows == 1) {
            let sid = req.sessionID;
            let id = result[0].Id;
            req.session.online_id = onlineId;
            req.session.isAuthenticated = true;
            sql.query('UPDATE USERS SET SessionId = ? WHERE ID = ?', [sid,id], function(err, result){
                if(err){
                  console.log(err);
                }else{
                  console.log(result.affectedRows);
                }
            });
            res.send({status:"success", userCount: userCount});
          }
      });
    }
    else{
      res.send({status:"err"});
    }
});


    io.on('connection', function(socket) {

      socket.on('start', function(data){
        users.push(data)
      });

      socket.on('disconnect', function() {
        for(let i of users){
          if(i.id == socket.id){
            let index = users.indexOf(i);
            users.splice(index,1)
          }
        }
      })

      socket.on('request', function(data){
          let requestFrom = users[data.indexFrom];
          let requestTo = users[data.indexTo];

          console.log(requestFrom, requestTo);
      });


      // socket.on('nameUpdate', function(onlineId){
      //   for(let i of users){
      //     if(i.id == socket.id){
      //       i.onlineId = onlineId
      //     }
      //   }
      // })
      //
      //


  });





setInterval(function() {
  io.sockets.emit('users', users)
}, 2000)


function checkAuth (req,res,next){
   if(req.session.isAuthenticated)
     return next();
   else
    res.redirect('/login');

}

http.listen(8080);
