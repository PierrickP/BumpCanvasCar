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

/*
*  Init and config
*/

io.configure(function () {
    //io.set("transports", ["websocket"]);
    io.set("polling duration", 3);
});

var locals = {
    title: 		 'BumpCanvasCar',
    description: 'A simple multiplayer Bump Car game',
    author: 	 'Pierrick PAUL'
};

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express['static'](__dirname + '/static'));
    app.use(app.router);
    app.enable("jsonp callback");
});

app.configure('development', function(){
   app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
    // app.use(express.logger({ format: ':method :url' }));
});

app.configure('production', function(){
   app.use(express.errorHandler()); 
});


app.error(function(err, req, res, next){
   res.render('500.ejs', { locals: { error: err },status: 500 });	
});

/*
*  Routing
*/

app.get('/', function (req, res) {
    locals.date = new Date().toLocaleDateString();
    res.render('index.ejs', locals);
});

app.get('/registration', function(req, res){
    res.render('registration.ejs', locals);
});

app.post('/registration', function(req, res){
  console.log(req.body.user);
  //res.redirect('/');
});

app.get('/*', function(req, res){
    res.render('404.ejs', locals);
});

/* Game */

function deleteplayer(n) {
    var t = [];
    for (var i = 0; i < players.length; i++) {
        if (players[i].name !== n) {
            t.push(players[i]);
        }
    }
    return t;
}

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
console.log("Listening on port %d in %s mode", app.address().port, app.settings.env);
