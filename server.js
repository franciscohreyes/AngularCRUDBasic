var express  = require('express');
var app      = express()
var request  = require('request');
var fs       = require('fs');
let http     = require('http');
var server   = http.Server(app);
/* SOCKET IO */
var socketIO = require('socket.io');
let io       = socketIO.listen(server);
/* PORT DEFAULT */
const port   = 3000;

/* Custom Header pass */
var headersOpt = {  
  "content-type": "application/json",
};

app.use(function(req, res, next) {
  /* CORS enabled */
  res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Content-Type', 'application/json')
  next();
});

server.listen(port, function(){
  console.log('Listening on: ', port);
});

io.on('connection', (socket) => {
  /* get list activity feed */
  socket.emit('list', ()=>{
    request.get({url:'http://127.0.0.1/API/api/getActivityFeed', headers: headersOpt, json: true,}, function (error, response, body) {
      io.emit('listActivity', body.items);
    });
  });

  /* add new item */
  socket.on('addNewItem', ()=>{
    request.get({url:'http://127.0.0.1/API/api/getActivityFeed', headers: headersOpt, json: true,}, function (error, response, body) {
      io.emit('listActivity', body.items);
    });

    request.get({url:'http://127.0.0.1/API/api/getPeople', headers: headersOpt, json: true,}, function (error, response, body) {
      io.emit('listPeople', body.items);
    });
  });

  /* edit item */
  socket.on('editItem', ()=>{
    request.get({url:'http://127.0.0.1/API/api/getActivityFeed', headers: headersOpt, json: true,}, function (error, response, body) {
      io.emit('listActivity', body.items);
    });
  });

  /* on delete item */
  socket.on('deleteItem', ()=>{
    request.get({url:'http://127.0.0.1/API/api/getActivityFeed', headers: headersOpt, json: true,}, function (error, response, body) {
      io.emit('listActivity', body.items);
    });

    request.get({url:'http://127.0.0.1/API/api/getTotal?type=active', headers: headersOpt, json: true,}, function (error, response, body) {
      io.emit('listActivity', body.items);
    });

    request.get({url:'http://127.0.0.1/API/api/getTotal?type=inactive', headers: headersOpt, json: true,}, function (error, response, body) {
      io.emit('listActivity', body.items);
    });
  });

  request.get({url:'http://127.0.0.1/API/api/getPeople', headers: headersOpt, json: true,}, function (error, response, body) {
    io.emit('posts', body.items);
  });

  io.on('refresh_odds', function(){
    console.log("Actualizando datos")
    request.get({url:'http://127.0.0.1/API/api/getPeople', headers: headersOpt, json: true,}, function (error, response, body) {
      io.emit('posts', body.items);
    });
  });
});