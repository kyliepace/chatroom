//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socket_io = require('socket.io');
var express = require('express');

var app = express();
app.use(express.static('public')); 
//app.listen(8080);

var http = require('http');

var server = http.Server(app); //wrap express app in server so that socketio can run alongside express
//var io = socket_io(server); //pass server into socket io to create a socket io server, which is an eventEmitter
//var io = require("socket.io")(server);
//var io = socketio.listen(server);
var io = require('socket.io').listen(server);


io.on('connection', function (socket) {
    socket.nickname = "guest"; //would have a sign in that calls an addNickname function that emits a "set nickname" listener
    console.log(socket.nickname + ' Connected');
    
    socket.emit("updating", "just connected", socket.nickname);
    
    //when socket.emit("message"),
    socket.on('message', function(message) {
        console.log('Received message:', message);
        socket.broadcast.emit('message', message);
    });
    
    //when someone is pressing a key that isn't enter
    socket.on("updating", function(update){
      socket.emit("updating", update, socket.nickname);
    });
    socket.on("doneUpdating", function(){
      socket.emit("updating", "", "");
    });
});

//does this disconnect bit work?
io.on("disconnect", function(socket){
  socket.emit("updating", "just disconnected", socket.nickname);
});

server.listen(8080);








/*

// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));
var messages = [];
var sockets = [];

io.on('connection', function (socket) {
    messages.forEach(function (data) {
      socket.emit('message', data);
    });

    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });

    socket.on('message', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;

      socket.get('name', function (err, name) {
        var data = {
          name: name,
          text: text
        };

        broadcast('message', data);
        messages.push(data);
      });
    });

    socket.on('identify', function (name) {
      socket.set('name', String(name || 'Anonymous'), function (err) {
        updateRoster();
      });
    });
  });

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});

*/
