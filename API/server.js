const express = require('express');
const app = express();


const files = __dirname

app.use(express.static(files))


app.get('/', function(req, res){
  console.log(files);
});

app.listen(8080);
