var express = require('express');
var app = express();
module.exports = app ;

app.get('/', function getHome(req, res){
  res.status(200).send(`<h1>Hello World</h1>`)
});

