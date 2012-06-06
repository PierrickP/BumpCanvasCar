/*
 * BumpCanvasCar
 * https://github.com/PierrickP/BumpCanvasCar
 *
 * Copyright (c) 2012 Pierrick PAUL
 * Licensed under the MIT license.
 */

"strict mode";

var me = {},
socket = io.connect(),
player = [],
SPEED_FACTOR = 3,
ROTATION_FACTOR = 2,
domplayerlist = document.getElementById('playerlist');

WCP.setCanvas("game", 800, 800);

var scRace = new WCP.Scene({
	init : function () {

		WCP.on('keydown', function (event) {
			if (event.keyCode === KEY_UP) {
				me.go = true;
			}
			if (event.keyCode === KEY_LEFT) {
				me.rotation = -1;
			}
			if (event.keyCode === KEY_RIGHT) {
				me.rotation = 1;
			}
		});
		WCP.Draw.addStyle({strokeStyle: "red", fillStyle: "red"}, "top");
		window.addEventListener('keyup', function (event) {
			if (event.keyCode === KEY_UP) {
				me.go = false;
			}
			if (event.keyCode === KEY_LEFT || event.keyCode === KEY_RIGHT) {
				me.rotation = 0;
			}
		});
	},
	loop : function () {
		if (me.rotation === 1) {
			me.angle -= (0.1 * ROTATION_FACTOR);
		} else if (me.rotation === -1) {
			me.angle += (0.1 * ROTATION_FACTOR);
		}
		if (me.go) {
			me.pos.y += Math.round(Math.cos(me.angle) * SPEED_FACTOR);
			me.pos.x += Math.round(Math.sin(me.angle) * SPEED_FACTOR);
            window.setTimeout(function () {
                socket.emit('move', me);
            }, 100);
		}
		new WCP.Draw.circle(me.pos.x, me.pos.y, 10).draw();
		new WCP.Draw.circle(me.pos.x + (Math.sin(me.angle) * 5), me.pos.y + (Math.cos(me.angle) * 5), 2, "top").draw();
		for (var i = 0; i < player.length; i++) {
			if (player[i].name !== me.name) {
				var p = player[i].pos;
				new WCP.Draw.circle(p.x, p.y, 10).draw();
			}
		}
	}
});

WCP.listen();

socket.on('welcome', function (data) {
    data = JSON.parse(data);
	console.log(data.msg);
	me = data.you;
    console.log("me", me);
	domplayerlist.innerHTML = player.length;
	WCP.startScene(scRace);
});

socket.on('newplayer', function (name, p) {
	console.log('new player: ', name);
	player = p;
	domplayerlist.innerHTML = player.length;
});

socket.on('playerdisconnected', function (p) {
	player = p;
	console.log("player dead");
	domplayerlist.innerHTML = player.length;
});

socket.on('playeractualise', function (p) {
	player = p;
});