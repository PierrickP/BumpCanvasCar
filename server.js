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
fs = require('fs'),
mongoose = require('mongoose'),
crypto = require('crypto');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name : String,
    password : String,
    email : String
});
var User = mongoose.model('User', userSchema);
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
    page: "",
    errors: {},
    session: {}
};

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(express['static'](__dirname + '/static'));
    app.enable("jsonp callback");
    app.use(express.session({ secret: "keyboard cat" }));
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
    
    //db = mongoserver.connect();
    // app.use(express.logger({ format: ':method :url' }));
});

app.configure('production', function(){
   app.use(express.errorHandler()); 
});


app.error(function(err, req, res, next){
   res.render('500.ejs', { locals: { error: err },status: 500 });	
});

function checkSession(req, res, next) {
    if (req.session ) {
        locals.session.name = (req.session.name) ? req.session.name : ""; 
    }
    next();
}

/*
*  Routing
*/

app.get('/', checkSession, function (req, res) {
    locals.date = new Date().toLocaleDateString();
    res.render('index.ejs', locals);
});

app.get('/players', checkSession, function (req, res) {
    User.find({}, function (err, docs) {
        locals.title = "WeCanPlay";
        locals.users = docs;
        res.render('players.ejs', locals);    
    });
});

app.get('/login', checkSession, function (req, res) {
    res.render('login.ejs', locals);
});

app.get('/logout', checkSession, function (req, res) {
    req.session.destroy();
    res.redirect('/');
});

app.post('/login', function (req, res) {
    console.log("here");
    var name = req.body.user.login;
    var password = req.body.user.password;
    var error = {};
    locals.title = "WeCanPlay - players's list";
    locals.errors = {};
    if (name ==  "") {
        locals.errors.name = {msg : "Name required"};
    }
    if (password ==  "") {
        locals.errors.password = {msg : "Password required"};
    }
    if (name != "" && password != "") {
        User.count({name: name, password: crypto.createHash('md5').update(password).digest("hex")}, function(err, nb) {
            if (nb === 1) {
                req.session.name = name;
                console.log('login OK -> ', req.session.name)
                res.redirect('/');
            } else {
                locals.errors.user = {msg : "unknow user :("};
                res.render('login.ejs', locals);
            }
        });
    } else {
        res.render('login.ejs', locals);
    }
});

app.get('/player/:name', checkSession, function (req, res) {
    console.log("player -> "+req.params.name);
    User.findOne({name: req.params.name},['name'],  function (err, docs){
        //Control name
        console.log("Player details -> ", docs);
        locals.user = docs
        res.render('player.ejs', locals);
    });
});

app.get('/me', checkSession, function (req, res) {
    res.redirect('/player/'+req.session.name);
});

app.get('/registration', checkSession, function(req, res){
    res.render('registration.ejs', locals);
});

app.post('/registration', function(req, res){
    function send() {
        if (password == "") {
            errors.password = {msg : "Password required"};
        }
        console.log("la", errors);
        if (!errors.password && !errors.name) {
            var instance = new User();
            instance.name = name;
            instance.password = crypto.createHash('md5').update(password).digest("hex");
            instance.email = req.body.user.email;
            instance.save(function (err) {
                locals.msg = "Thx for your registration";
                res.render("play.ejs", locals)
            });
        } else {
            locals.errors = errors;
            res.render('registration.ejs', locals);
        }
    }
    
    var errors = {};
    console.log(req.body.user);
    var name = req.body.user.login;
    var password = req.body.user.password;
    if (name ==  "") {
        errors.name = {msg : "Name required"};
        send();
    } else {
        User.count({name: name}, function(err, nb) {
            console.log("count", err, nb);
            if (nb >= 1) {
                errors.name = {msg : "Name already use"};
                console.log("ici", errors);
            }
            send();
        });
    }
});

app.get('/play',  checkSession, function(req, res) {
    res.render("play.ejs", locals);
});

app.get('/*', checkSession, function(req, res){
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

var connection = mongoose.connect('mongodb://localhost/bumpcanvascar', function (err) {
    console.error(err);
});

app.listen(process.env['app_port'] || 3000);
console.log("Listening on port %d in %s mode", app.address().port, app.settings.env);

