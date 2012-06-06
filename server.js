/*
 * CanvasRace
 * https://github.com/Pierrick/CanvasRace
 *
 * Copyright (c) 2012 Pierrick PAUL
 * Licensed under the MIT license.
 */
 
var express = require('express'),
app = express.createServer(),
io = require('socket.io').listen(app),
fs = require('fs');
  
var player = [];

app.listen(4242, "0.0.0.0");

var deleteplayer = function (n) {
    var t = [];
    for (var i = 0; i < player.length; i++ ) {
        if (player[i].name !== n) {
            t.push(player[i]);
        }
    }
    return t;
};

app.configure(function(){
    app.use(express.static(__dirname + '/../client'));
});

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/../index.html');
});

io.sockets.on('connection', function (socket) {
    console.log("New player");
    var newplayer = {name: socket.id, pos : {x: 200, y: 200}, rotation: 0, angle: 0, go : false};
    player.push(newplayer);
    socket.emit('welcome', {
        msg: 'Salut toi !',
        you :  newplayer,
        other : player
    });
    socket.broadcast.emit('newplayer', socket.id, player, function() {
        setTimeout(function(){io.sockets.emit('playeractualise', player);}, 100);
    });
    
    socket.on('move', function (p){
        //console.log('move', p);
        for (var i = 0; i < player.length; i++) {
            //console.log(player[i].name, p.name)
            if (player[i].name = p.name) {
                //console.log("maj info player", player[i]);
                player[i].pos.x = p.pos.x;
                player[i].pos.y = p.pos.y;
            }
        }
        //socket.broadcast.emit('playeractualise', player);
    });
    
    socket.on('disconnect', function (name) {
        player = deleteplayer(name); // fonctionne plus
        console.log("player dead");
        io.sockets.emit('playerdisconnected', player);
    });
    
});

//setInterval(function(){io.sockets.emit('playeractualise', player)}, 3000);

