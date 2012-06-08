/*
 * BumpCanvasCar
 * https://github.com/PierrickP/BumpCanvasCar
 *
 * Copyright (c) 2012 Pierrick PAUL
 * Licensed under the MIT license.
 */
 
var express = require('express'),
app = express.createServer(),
io = require('socket.io').listen(app),
fs = require('fs');
  
var players = [];

var deleteplayer = function (n) {
    var t = [];
    for (var i = 0; i < players.length; i++) {
        if (players[i].name !== n) {
            t.push(players[i]);
        }
    }
    return t;
};

app.configure(function () {
    app.use(express['static'](__dirname + '/client'));
});

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/client/index.html');
});

io.configure(function () {
    //io.set("transports", ["websocket"]);
    io.set("polling duration", 3);
});

function Player(s, n) {
    this.socket = s.id;
    this.name = n;
    this.pos = {x: 200, y: 200};
    this.rotation = 0;
    this.angle = 0;
    this.go = false;
}

io.sockets.on('connection', function (socket) {
    console.log("New player");
    var newplayer = new Player(socket, socket.id);
    players.push(newplayer);
    socket.emit('welcome', JSON.stringify({
        msg: 'Salut toi !',
        you :  newplayer,
        other : players
    }));
    socket.broadcast.emit('newplayer', socket.id, players, function () {
        // message of welcome
    });
    
    socket.on('move', function (p) {
        for (var i = 0; i < players.length; i++) {
            if (players[i].name === p.name) {
                players[i].pos.x = p.pos.x;
                players[i].pos.y = p.pos.y;
            }
        }
        socket.broadcast.emit('playeractualise', players);
    });
    
    socket.on('disconnect', function (name) {
        players = deleteplayer(name); // fonctionne plus
        console.log("player dead");
        io.sockets.emit('playerdisconnected', players);
    });
    
});

app.listen(process.env['app_port'] || 3000);
