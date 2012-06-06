/*
* WeCanPlay : Library for html5 games
* http://www.wecanplay.fr/
* Version 0.3
*
* Copyright © WeCanPlay
* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files (the
* "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish,
* distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to
* the following conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*/

(function(a,b,c){function d(){this.debug=!1,this.ctx=0,this.canvas=0,this.width=0,this.height=0}"use strict",d.prototype.setCanvas=function(a,c,d){this.canvas=b.getElementById(a),c>0&&d>0&&(this.canvas.width=c,this.canvas.height=d),this.width=this.canvas.clientWidth,this.height=this.canvas.clientHeight,this.ctx=this.canvas.getContext("2d"),this.initScenes(),this.fire("canvasReady")},d.prototype.setMode=function(a){console.error("DEPRECATED - for log use WCP.log(true)")},d.prototype.log=function(a){typeof a=="boolean"&&(this.logEnable=a),this.logEnable&&console.log(a)},d.prototype.extend=function(a,b){console.error("DEPRECATED - see wiki template - kiss LeMulot")},window.WCP=new d})(window,document,undefined),function(a,b,c){function d(){}function e(){a.ctx.clearRect(0,0,a.width,a.height)}function f(a,b){var d=c.createElement("canvas");return d.width=a,d.height=b,d.ctx=d.getContext("2d"),d}function g(a,b){return Math.floor(Math.random()*(b-a+1))+a}"use strict",d.makeArray=function(a){return a instanceof Array||(a=[a]),a},d.inArray=function(a,b){for(var c=0;c<b.length;c++)if(b[c]===a)return!0;return!1},d.getCanvasPos=function(){var b=a.canvas,c=0,d=0;while(b.offsetParent)c+=b.offsetTop,d+=b.offsetLeft,b=b.offsetParent;return{top:c,left:d}},d.cloneObject=function(a){var b={};for(var c in a)return a.hasOwnProperty(c)&&(b[c]=a[c]),b},d.degresToRadian=function(a){return a*Math.PI/180},a.Tools=d,a.clear=e,a.bufferCanvas=f,a.random=g}(WCP,window,document),function(a){"use strict",a.utils={},a.utils.makeArray=function(a){return typeof a.length=="undefined"&&(a=[a]),a},a.utils.merge=function(a){for(var b=1;b<arguments.length;b++){var c=arguments[b];for(var d in c)c.hasOwnProperty(d)&&(a[d]=c[d])}return a},a.utils.clone=function(b){var c=new b.__proto__.constructor;return a.utils.merge(c,b),c.prototype.clone&&c.clone(),c}}(WCP),function(a){function b(a,b,c,d){arguments.length==1&&typeof a=="object"?(this.x=a.x,this.y=a.y):arguments.length==4?(this.x=c-a,this.y=d-b):(this.x=a,this.y=b)}"use strict",b.prototype.get=function(){return{x:this.x,y:this.y}},b.prototype.norm=function(){return Math.sqrt(this.x*this.x+this.y*this.y)},b.prototype.normalize=function(){var a=this.norm();return new b(this.x/a,this.y/a)},b.prototype.add=function(a){return new b(this.x+a.x,this.y+a.y)},b.prototype.sub=function(a){return new b(this.x-a.y,this.y-a.y)},b.prototype.mult=function(a){return new b(this.x*a,this.y*a)},b.prototype.dot=function(a){return this.x*a.x+this.y*a.y},b.prototype.cross=function(a){return this.x*a.y+this.y*a.x},b.prototype.tangent=function(){return new b(-this.y,this.x)},b.prototype.angleTo=function(a){return Math.atan2(this.cross(a)/(this.norm()*a.norm()),this.dot(a))},b.prototype.absoluteAngle=function(){return Math.atan2(this.cross(new b(1,0)),this.dot(new b(1,0)))},b.norm=function(a,b){return Math.sqrt(a*a+b*b)},b.normalize=function(a,c){var d=b.norm(a,c);return{x:a/d,y:c/d}},b.add=function(a,b,c,d){return{x:a+c,y:b+d}},b.sub=function(a,b,c,d){return{x:a-c,y:b-d}},a.Vector=b}(WCP),function(a){function b(){return Date.now()/1e3}function c(){return Date.now()}function d(a){this.timeout=a||0,this.reset()}function e(){this.timer=new d,this.timeouts=[],this.nTimeouts=0,this.intervals=[],this.nIntervals=0,this.clear(),this.reset()}function f(a){this.precision=.1,this.duration=a||5,this.size=Math.ceil(this.duration/this.precision)+1,this.filled=0,this.index=0,this.previousTime=0,this.startTime=0,this.data=new Array(this.size),this.reset()}"use strict",a.internalTime=0,d.prototype.elapsedTime=function(){return this.pauseStart>0?this.pauseStart-this.startTime-this.pauseDuration:c()-this.startTime-this.pauseDuration},d.prototype.pause=function(){this.pauseStart===0&&(this.pauseStart=c())},d.prototype.unpause=function(){this.pauseStart>0&&(this.pauseDuration+=c()-this.pauseStart,this.pauseStart=0)},d.prototype.paused=function(){return this.pauseStart>0},d.prototype.expired=function(){return this.timeout?this.elapsedTime()>this.timeout:!1},d.prototype.reset=function(){this.startTime=c(),this.pauseStart=0,this.pauseDuration=0},e.prototype.update=function(){if(this.paused())return;var a=this.timer.elapsedTime(),b,c;for(b in this.timeouts){c=this.timeouts[b];if(c[0]<a)try{c[1]()}catch(d){throw d}finally{delete this.timeouts[b],this.nTimeouts--}}for(b in this.intervals){c=this.intervals[b];if(c[0]+c[1]<a){c[0]=a;try{c[2]()}catch(d){throw d}}}},e.prototype.clear=function(){this.timeouts=[],this.intervals=[],this.nTimeouts=0,this.nIntervals=0},e.prototype.setTimeout=function(a,b){return this.timeouts.push([this.timer.elapsedTime()+a,b]),this.nTimeouts++,this.timeouts.length-1},e.prototype.setInterval=function(a,b){return this.intervals.push([this.timer.elapsedTime(),a,b]),this.nIntervals++,this.intervals.length-1},e.prototype.clearTimeout=function(a){return this.timeouts[a]?(delete this.timeouts[a],this.nTimeouts--,!0):!1},e.prototype.clearInterval=function(a){return this.intervals[a]?(delete this.intervals[a],this.nIntervals--,!0):!1},e.prototype.reset=function(){this.timer.reset()},e.prototype.pause=function(){this.timer.pause()},e.prototype.unpause=function(){this.timer.unpause()},e.prototype.paused=function(){return this.timer.paused()},f.prototype.get=function(){var a=0,b=0;for(var c=0;c<this.size&&c<this.filled;c++)c!==this.index&&this.data[c]>0&&(a+=this.data[c],b++);return b===0?0:a/b/this.precision},f.prototype.tick=function(){var b=a.time(),c=b-this.startTime,d=Math.floor(c/this.precision)%this.size;this.index!==d&&(this.data[d]=0),this.data[d]++,this.index=d,d>this.filled&&(this.filled=d)},f.prototype.reset=function(){this.index=0,this.filled=0,this.startTime=0;for(var a=0;a<this.size;a++)this.data[a]=0},a.time=b,a.millitime=c,a.Timer=d,a.TimeScheduler=e,a.TimeCounter=f}(WCP),function(a){function e(a,d,e){this.img=a,this.x=d||0,this.y=e||0,this.width=a.width,this.height=a.height,this.sliceX=0,this.sliceY=0,this.sliceWidth=this.width,this.sliceHeight=this.height,this.alpha=1,this.id=b++,this.originX=0,this.originY=0,this.originType=c,this.rotation=0,this.scaleX=1,this.scaleY=1,this.matrix=[1,0,0,1,0,0],this.symmetryX=this.symmetryY=!1}function f(a,b,c,d,f){var g=new e(a,0,0);return g.setSlice(b,c,d,f),g}"use strict";var b=1,c=0,d=1;e.prototype.clone=function(b,c){var d=new a.Sprite(this.img,b,c);for(var e in this)this.hasOwnProperty(e)&&e!=="id"&&(d[e]=this[e]);return d},e.prototype.setSubRect=function(a){this.sliceX=a.x,this.sliceY=a.y,this.sliceWidth=a.width,this.sliceHeight=a.height},e.prototype.setSlice=function(a,b,c,d){this.width=c,this.height=d,this.sliceX=a,this.sliceY=b,this.sliceWidth=c,this.sliceHeight=d},e.prototype.draw=function(b){b=b||a.ctx;var d=this.x,e=this.y;b.save(),b.globalAlpha=this.alpha;var f=this.width,g=this.height;if(this.originType===c)var h=this.originX,i=this.originY;else var h=f*this.originX,i=g*this.originY;var j=this.symmetryX===!0?-1:1,k=this.symmetryY===!0?-1:1;j===-1&&(h+=this.width),k===-1&&(i+=this.height),b.translate(this.x,this.y),b.rotate(this.rotation),b.scale(j,k),b.drawImage(this.img,this.sliceX,this.sliceY,this.sliceWidth,this.sliceHeight,-h,-i,f,g),b.restore()},e.prototype.move=function(a,b){this.x+=a,this.y+=b},e.prototype.position=function(a,b){this.x=a,this.y=b},e.prototype.scale=function(a,b){typeof b=="undefined"&&(b=a),this.scaleX=a,this.scaleY=b,this.width=this.sliceWidth*this.scaleX,this.height=this.sliceHeight*this.scaleY},e.prototype.symmetry=function(a,b){this.symmetryX=a,this.symmetryY=b},e.prototype.vector=function(){return new a.Vector(this.x,this.y)},e.prototype.getPos=function(){return{x:this.x,y:this.y}},e.prototype.getRect=function(){return{x:this.x,y:this.y,width:this.width,height:this.height}},e.prototype.setOrigin=function(a,b){!b&&typeof a[0]!="undefined"?(this.originX=a[0],this.originY=a[1]):(this.originX=a,this.originY=b),this.originType=d},e.prototype.setOriginPos=function(a,b){this.originX=a,this.originY=b,this.originType=c},e.ORIGIN_TOPLEFT=[0,0],e.ORIGIN_TOP=[.5,0],e.ORIGIN_TOPRIGHT=[1,0],e.ORIGIN_LEFT=[0,.5],e.ORIGIN_CENTER=[.5,.5],e.ORIGIN_RIGHT=[1,.5],e.ORIGIN_BOTLEFT=[0,1],e.ORIGIN_BOT=[.5,1],e.ORIGIN_BOTRIGHT=[1,1],a.Sprite=e,a.SliceSprite=f}(WCP),function(){function a(){this.callbacks=new Array}function b(b,c){c?typeof c=="Object"?this.event=c:this.event=new a:this.event=new a,this.type=b}function c(){}b.prototype.rename=function(a){this.type=a},b.prototype.suscribe=function(a){this.event.callbacks.push(a)},b.prototype.unsuscribe=function(a){var b=!1;for(var c in this.event.callbacks)if(this.event.callbacks[c]==a||!a)delete this.event.callbacks[c],b=!0;return b},b.prototype.fire=function(a){for(var b in this.event.callbacks)this.event.callbacks[b](a)},c.extend=function(a){a.prototype.initEvents=c.prototype.initEvents,a.prototype.listen=c.prototype.listen,a.prototype.handleEvents=c.prototype.handleEvents,a.prototype.custom=c.prototype.custom,a.prototype.getEvent=c.prototype.getEvent,a.prototype.register=c.prototype.register,a.prototype.suscribe=c.prototype.suscribe,a.prototype.unsuscribe=c.prototype.unsuscribe,a.prototype.on=c.prototype.on,a.prototype.fire=c.prototype.fire},c.extendObject=function(a){a.initEvents=c.prototype.initEvents,a.listen=c.prototype.listen,a.handleEvents=c.prototype.handleEvents,a.custom=c.prototype.custom,a.getEvent=c.prototype.getEvent,a.register=c.prototype.register,a.suscribe=c.prototype.suscribe,a.unsuscribe=c.prototype.unsuscribe,a.on=c.prototype.on,a.fire=c.prototype.fire},c.prototype.initEvents=function(){this.events||(this.events=new Array)},c.prototype.listen=function(a){this.initEvents();var c=a?a:WCP.canvas;if(!c)return;this.events.push(new b("mousemove")),this.events.push(new b("mouseover")),this.events.push(new b("mouseout")),this.events.push(new b("mousedown")),this.events.push(new b("mouseup")),this.events.push(new b("keydown")),c.addEventListener("mouseover",function(a){return function(b){a.handleEvents(b)}}(this),!1),c.addEventListener("mouseout",function(a){return function(b){a.handleEvents(b)}}(this),!1),c.addEventListener("mousemove",function(a){return function(b){a.handleEvents(b)}}(this),!1),c.addEventListener("mousedown",function(a){return function(b){a.handleEvents(b)}}(this),!1),c.addEventListener("mouseup",function(a){return function(b){a.handleEvents(b)}}(this),!1),window.onkeydown=function(a){return function(b){a.handleEvents(b)}}(this)},c.prototype.handleEvents=function(a){this.fire(a.type,a)},c.prototype.getEvent=function(a){if(typeof a=="object")return a;for(var b in this.events)if(this.events[b].type==a)return this.events[b]},c.prototype.register=function(a){a.prototype.suscribe=function(a){return function(b,c){a.on(b,c)}}(this),a.prototype.on=function(a,b){this.suscribe(a,b)},a.prototype.unsuscribe=function(a){return function(b,c){a.unsuscribe(b,c)}}(this),a.prototype.custom=function(a){return function(b){a.custom(b)}}(this)},c.prototype.custom=function(a,c){var d=this.getEvent(a);if(d&&c===!0)this.unsuscribe(a);else if(d&&!c)return;return d=new b(a),this.events.push(d),d},c.prototype.on=function(a,b){this.suscribe(a,b)},c.prototype.suscribe=function(a,b){var c=this.getEvent(a);c&&c.suscribe(b)},c.prototype.unsuscribe=function(a,b){var c=this.getEvent(a);if(!a)for(var d in this.events)this.events[d].unsuscribe();else c&&c.unsuscribe(b)},c.prototype.fire=function(a,b){var c=this.getEvent(a);c&&c.fire(b)},WCP.EventTarget=c,c.extendObject(WCP),WCP.initEvents(),WCP.custom("canvasReady"),KEY_DOWN=40,KEY_UP=38,KEY_LEFT=37,KEY_RIGHT=39,KEY_END=35,KEY_BEGIN=36,KEY_BACK_TAB=8,KEY_TAB=9,KEY_SH_TAB=16,KEY_ENTER=13,KEY_ESC=27,KEY_SPACE=32,KEY_DEL=46,KEY_A=65,KEY_B=66,KEY_C=67,KEY_D=68,KEY_E=69,KEY_F=70,KEY_G=71,KEY_H=72,KEY_I=73,KEY_J=74,KEY_K=75,KEY_L=76,KEY_M=77,KEY_N=78,KEY_O=79,KEY_P=80,KEY_Q=81,KEY_R=82,KEY_S=83,KEY_T=84,KEY_U=85,KEY_V=86,KEY_W=87,KEY_X=88,KEY_Y=89,KEY_Z=90,KEY_PF1=112,KEY_PF2=113,KEY_PF3=114,KEY_PF4=115,KEY_PF5=116,KEY_PF6=117,KEY_PF7=118,KEY_PF8=119,KEY_0=48,KEY_1=49,KEY_2=50,KEY_3=51,KEY_4=52,KEY_5=53,KEY_6=54,KEY_7=55,KEY_8=56,KEY_9=57}(),function(a){function b(){this.styles={},this.options={strokeStyle:"Black",fillStyle:"White",lineWidth:1},this.ctx=a.ctx;var b=function(b){return function(){b.ctx=a.ctx}}(this);a.on("canvasReady",b)}b.prototype.setContext=function(a){this.ctx=a},b.prototype.draw=function(a){var b;a?this.styles[a]?b=this.styles[a]:a instanceof Object&&(b=a):b=this.options;for(var c in this.options)b[c]||(b[c]=this.options[c]);this.ctx.lineWidth=b.lineWidth,this.ctx.strokeStyle=b.strokeStyle,this.ctx.fillStyle=b.fillStyle,this.ctx.fill(),this.ctx.stroke()},b.prototype.defaultStyle=function(a){for(var b in this.options)a[b]===undefined&&(a[b]=this.options[b]);this.options=a},b.prototype.newStyle=function(){return{}},b.prototype.addStyle=function(a,b){b!==undefined&&(this.styles[b]=a)},b.prototype.deleteStyle=function(a){return this.styles[a]?(this.styles[a]=0,!0):!1},b.prototype.newPolygon=function(){return{array:new Array,length:0,add:function(a,b){var c={x:a,y:b};this.array[this.length++]=c}}},b.prototype.point=function(a,b,c,d){c||(c=1),this.ctx.save(),d&&(this.ctx.fillStyle=d),this.ctx.fillRect(a-(c/2>=1?c/2:0),b-(c/2>=1?c/2:0),c,c),this.ctx.restore()},b.prototype.line=function(a,b,c,d,e){this.ctx.save(),this.ctx.beginPath(),this.ctx.moveTo(a,b),this.ctx.lineTo(c,d),this.ctx.closePath(),this.draw(e),this.ctx.restore()},b.prototype.circle=function(a,b,c,d){this.x=a,this.y=b,this.radius=c,this.style=d},b.prototype.circle.prototype.draw=function(){a.Draw.ctx.save(),a.Draw.ctx.beginPath(),a.Draw.ctx.arc(this.x,this.y,this.radius,0,2*Math.PI,!1),a.Draw.ctx.closePath(),a.Draw.draw(this.style),a.Draw.ctx.restore()},b.prototype.ellipse=function(a,b,c,d,e){this.ctx.save(),this.ctx.beginPath(),this.ctx.moveTo(a,b-d/2),this.ctx.bezierCurveTo(a+c/2,b-d/2,a+c/2,b+d/2,a,b+d/2),this.ctx.bezierCurveTo(a-c/2,b+d/2,a-c/2,b-d/2,a,b-d/2),this.ctx.closePath(),this.draw(e),this.ctx.restore()},b.prototype.rect=function(a,b,c,d,e){this.ctx.save(),this.ctx.beginPath(),this.ctx.moveTo(a,b),this.ctx.lineTo(a+c,b),this.ctx.lineTo(a+c,b+d),this.ctx.lineTo(a,b+d),this.ctx.lineTo(a,b),this.ctx.closePath(),this.draw(e),this.ctx.restore()},b.prototype.polygon=function(a,b){a.array!==undefined&&a.array instanceof Array&&(a=a.array);if(a instanceof Array){this.ctx.save(),this.ctx.beginPath(),a.reverse();var c=a.pop();this.ctx.moveTo(c.x,c.y);while(a.length>0){var d=a.pop();d&&this.ctx.lineTo(d.x,d.y)}this.ctx.lineTo(c.x,c.y),this.ctx.closePath(),this.draw(b),this.ctx.restore()}},b.prototype.quadraCurve=function(a,b,c,d,e,f,g){this.ctx.save(),this.ctx.beginPath(),this.ctx.moveTo(a,b),this.ctx.quadraticCurveTo(c,d,e,f),this.draw(g),this.ctx.restore()},b.prototype.bezierCurve=function(a,b,c,d,e,f,g,h,i){this.ctx.save(),this.ctx.beginPath(),this.ctx.moveTo(a,b),this.ctx.bezierCurveTo(c,d,e,f,g,h),this.draw(i),this.ctx.restore()},a.Draw=new b}(WCP),function(a){function d(){b[c]=this,this.animateId=c,c++,this.timeLine=new Array,this.time=0,this.stop=!1,this.speed=1,this.startTime=-1}function e(){this.clip=this,this.effectList=new Array,this.effectIndex=1,this.speed=1,this.stop=!1}function f(a){b[c]=this,this.animateId=c,c++,this.sprite=a,this.isSpriteAdd=!1,this.bundles=new Array,this.curBundle=0,this.lastBundle=-1,this.spriteOrigin=null,this.startTime=-1,this.time=0}function g(a,b,c,d,e,f,g){var h=(a+c)/2,i=(b+d)/2,j=i-b,k=a-h,l=Math.sqrt(j*j+k*k);if(k==0)if(j>0)var m=-Math.PI/2;else var m=Math.PI/2;else{var n=Math.atan(j/Math.abs(k));if(k>0)var m=n;else var m=Math.PI-n}if(g)var o=2*e*Math.PI;else var o=-2*e*Math.PI;var p=m+o,q={};return q.x=Math.floor(h+l*Math.cos(p)),q.y=Math.floor(i+l*Math.sin(p)),q}var b=new Array,c=0;d.prototype.add=function(a,b){if(this.timeLine.length===0)this.timeLine.push({time:a,object:b});else{var c=!1;for(x in this.timeLine)if(a<=this.timeLine[x].time){this.timeLine.splice(x,0,{time:a,object:b}),c=!0;break}c===!1&&this.timeLine.push({time:a,object:b})}},d.prototype.start=function(){this.startTime<0&&(this.startTime=a.millitime(),this.step())},d.prototype.step=function(){if(this.stop===!1){while(this.timeLine.length>0&&this.timeLine[0].time<=this.time)typeof this.timeLine[0].object!="undefined"&&this.timeLine[0].object.start(),this.timeLine.shift();this.time=a.millitime()-this.startTime}a.setTimeout(0,function(a){return function(){a.step()}}(b[this.animateId]))},e.prototype.addEffect=function(a){this.effectList[this.effectIndex]=a,this.effectIndex++},e.prototype.start=function(){if(this.stop===!1)for(x in this.effectList)var a=this.effectList[x].start()},e.prototype.clone=function(){var a=new e;for(var b in this.effectList)a.effectList[a.effectIndex]=this.effectList[b].clone(),a.effectIndex++;return a.effectIndex=this.effectIndex,a.speed=this.speed,a.stop=this.stop,a.animate(),a},e.prototype.pause=function(){this.stop=!0},e.prototype.resume=function(){this.stop=!1},e.prototype.setSpeed=function(a){this.speed=a},f.prototype.animate=function(){return arguments.length>0&&this.addBundle(arguments),this},f.prototype.addBundle=function(a){var b=new Array;for(var c=0;c<a.length;c++){var d=this.createEffect(a[c]);b.push(d)}this.bundles.push(b)},f.prototype.createEffect=function(a){return a.properties={complete:!1,duration:typeof a.duration!="undefined"&&a.duration>=0?a.duration:0,shift:typeof a.shift!="undefined"?a.shift:h.line},delete a.duration,a},f.prototype.start=function(){this.startTime<0&&(this.isSpriteAdd===!1&&(a.add(this.sprite),this.isSpriteAdd=!0),this.startTime=a.millitime(),this.step())},f.prototype.step=function(){if(this.bundles.length===0)return;if(this.curBundle>=this.bundles.length)return;if(this.curBundle!==this.lastBundle){this.spriteOrigin!=null&&delete this.spriteOrigin,this.spriteOrigin=new Array;for(var c in this.sprite)this.sprite.hasOwnProperty(c)&&(this.spriteOrigin[c]=this.sprite[c]);this.startTime=a.millitime(),this.lastBundle=this.curBundle}var d=this.bundles[this.curBundle];if(d.length>0){var e=!0;this.time=a.millitime()-this.startTime;for(var c=0;c<d.length;c++){var f=d[c];f.properties.complete===!1&&(this.stepEffect(f),e=!1)}e===!0&&this.curBundle++}a.setTimeout(0,function(a){return function(){a.step()}}(b[this.animateId]))},f.prototype.stepEffect=function(b){typeof b.remove!="undefined"&&(this.sprite.position(-1e3,-1e3),a.remove(this.sprite),this.isSpriteAdd=!0,b.properties.complete=!0);var c=this.time/b.properties.duration;this.time>b.properties.duration&&(c=1);for(var d in b)b.hasOwnProperty(d)&&d!=="properties"&&d!=="x"&&d!=="y"&&(this.sprite[d]=this.spriteOrigin[d]+c*(b[d]-this.spriteOrigin[d]));var e=typeof b.x!="undefined"?b.x:this.sprite.x,f=typeof b.y!="undefined"?b.y:this.sprite.y;if(e!==this.spriteOrigin.x||f!==this.spriteOrigin.y){var g=b.properties.shift.calculate(this.spriteOrigin.x,this.spriteOrigin.y,e,f,c);this.sprite.x=g.x,this.sprite.y=g.y}this.time>=b.properties.duration&&(b.properties.complete=!0)},f.prototype.wait=function(a){var b=new Array;return b.push({duration:a}),this.addBundle(b),this},f.prototype.remove=function(){var a=new Array;a.push({remove:!0}),this.addBundle(a)},f.prototype.offset=function(a,b){this.sprite.x+=a,this.sprite.y+=b;for(bundle in this.bundles)for(effect in this.bundles[bundle])typeof this.bundles[bundle][effect].x!="undefined"&&(this.bundles[bundle][effect].x+=a),typeof this.bundles[bundle][effect].y!="undefined"&&(this.bundles[bundle][effect].y+=b)},f.prototype.clone=function(b){a.add(b);var c=new f(b);for(var d in this)this.hasOwnProperty(d)&&d!=="animateId"&&d!=="bundles"&&d!=="sprite"&&(c[d]=this[d]);for(var e in this.bundles){var g=new Array;for(var h in this.bundles[e]){var i={};for(var d in this.bundles[e][h])if(d==="properties"){var j={};for(var k in this.bundles[e][h][d])j[k]=this.bundles[e][h][d][k];i[d]=j}else i[d]=this.bundles[e][h][d];g.push(i)}c.bundles.push(g)}return c};var h={line:{calculate:function(a,b,c,d,e){var f={};return f.x=a+e*(c-a),f.y=b+e*(d-b),f}},circle:{calculate:function(a,b,c,d,e){return g(a,b,c,d,e,1,2)}},circleReverse:{calculate:function(a,b,c,d,e){return g(a,b,c,d,e,-1,2)}},semiCircle:{calculate:function(a,b,c,d,e){return g(a,b,c,d,e,1,1)}},semiCircleReverse:{calculate:function(a,b,c,d,e){return g(a,b,c,d,e,-1,1)}}},i={none:{calculate:function(a){return a}},parabolic:{calculate:function(a){return a*a}},parabolicReverse:{calculate:function(a){return 1-(a-1)*(a-1)}}},j={REMOVE:1};a.Clip=e,a.TimeLine=d,a.Animation=f,a.Ease=i,a.Shift=h,a.AnimationOnComplete=j}(WCP),function(a){function b(){this.assetsCollection={},this.assetsCount=0,this.assetsLoaded=0,this.callbackLoadProgress=null,this.callbackLoadComplete=null}b.prototype.add=function(a,b){var c=this;if(typeof a!="object"){var e=b.substr(b.length-4).toLowerCase();if(e==".jpg"||e==".png"||e==".svg"||e==".gif"){var f=new Image;return f.loadFromSrc=b,f.loaded=!1,f.loading=!1,f.type=e,f.onload=function(){c.imageLoaded(f)},this.assetsCollection[a]=f,this.assetsCount++,f}if(e==".ogg"||e==".mp3"){var f=new Audio(b);return f.loadFromSrc=b,f.type=e,f.load(),this.assetsCollection[a]=f,this.assetsCount++,this.assetsLoaded++,f}console.log("Error type file(s) loading");return}for(var d in a)this.add(d,a[d])},b.prototype.loadAll=function(){for(var a in this.assetsCollection){var b=this.assetsCollection[a];!b.loaded&&!b.loading&&(b.src=b.loadFromSrc,b.loading=!0)}},b.prototype.get=function(a){return this.assetsCollection[a]},b.prototype.size=function(){return this.assetsCount},b.prototype.imageLoaded=function(a){this.assetsLoaded++,a.loaded=!0,a.loading=!1,this.callbackLoadProgress&&this.callbackLoadProgress.apply(null,[this,a,this.assetsLoaded,this.assetsCount]),this.assetsLoaded==this.assetsCount&&this.callbackLoadComplete&&this.callbackLoadComplete.apply(null,[this])},b.prototype.onLoadProgress=function(a){this.callbackLoadProgress=a},b.prototype.onLoadComplete=function(a){this.callbackLoadComplete=a},a.Assets=new b}(WCP),function(a){function b(a,b){typeof a=="object"?this.sound=a:(this.sound=new Audio,this.sound.src=a),this.sound.volume=.5,this.param(b)}function c(a,c){this.sounds=[],this.audio=a,this.params=c,this.sounds.push(new b(a,c)),this.clonable=!1,this.setLimit(10)}function d(){this.sounds=[]}b.prototype.param=function(a){for(i in a)i==="volume"?this.sound[i]=a[i]/100:this.sound[i]=a[i]},b.prototype.play=function(){this.sound.play()},b.prototype.pause=function(){this.sound.pause()},b.prototype.paused=function(){return this.sound.paused||this.sound.currentTime===0||this.sound.currentTime==this.sound.duration},b.prototype.togglePlay=function(){this.sound.paused||this.sound.currentTime===0?this.sound.play():this.sound.pause()},b.prototype.mute=function(){this.sound.muted=!0},b.prototype.unmute=function(){this.sound.muted=!1},b.prototype.toggleMute=function(){this.sound.muted?this.unmute():this.mute()},b.prototype.muted=function(){return this.sound.muted},b.prototype.volume=function(a){return a&&(a>100&&(a=100),a<0&&(a=0),this.sound.volume=a/100),this.sound.volume*100},b.prototype.duration=function(a){return this.sound.duration},b.prototype.time=function(a){return a>=0&&(this.sound.currentTime=a),this.sound.currentTime},b.prototype.rearward=function(a){this.sound.currentTime-=a||1,this.sound.currentTime<=0&&(this.sound.currentTime=0,this.sound.play())},b.prototype.forward=function(a){this.sound.currentTime+=a||1},c.prototype.setLimit=function(a){this.limit=a;while(this.sounds.length<this.limit)this.clone()},c.prototype.getNew=function(){return new b(this.audio.src,this.params)},c.prototype.clone=function(){this.sounds.push(this.getNew())},c.prototype.play=function(){var a;for(a=0;a<this.sounds.length-1;a++){this.sounds[a].time()==this.sounds[a].duration()&&this.sounds[a].time(0);if(this.sounds[a].paused()){this.sounds[a].play();return}}},c.prototype.pause=function(){},d.prototype.sound=function(a,c){var d=new b(a,c);return c.id?this.sounds[c.id]=d:src&&(this.sounds[d.src]=d),d},d.prototype.channel=function(a,b){var d=new c(a,b);return b.id?this.sounds[b.id]=d:src&&(this.sounds[snd.src]=d),d},d.prototype.get=function(a){var b;for(b in this.sounds)if(b===a)return this.sounds[b]},d.prototype.shutDown=function(){var a;for(a in this.sounds)this.sounds[a].pause()},a.SoundManager=d}(WCP),function(a,b,c){function e(a){var b=c.createElement("span");c.body.appendChild(b),b.setAttribute("id","spanBuffer"),d=c.getElementById("spanBuffer"),d.style.font=a.weight+" "+a.size+"px "+a.font;var e=c.createTextNode(a.text);b.appendChild(e);var f=d.offsetHeight,g=d.offsetWidth,h=0,i=0;return c.body.removeChild(d),{height:f,width:g,descent:h,ascent:i}}function f(b,c){a.ctx.save(),a.ctx.rotate(a.Tools.degresToRadian(c.rotation)),a.ctx.textBaseline=c.baseline,a.ctx.fillStyle=c.color,a.ctx.font=c.weight+" "+c.size+"px "+c.font,a.ctx.fillText(b,c.x,c.y),a.ctx.restore()}function g(b,c,d,f,g){return this.id=a.random(10,99999),typeof b=="object"?(this.txt=b.text||"",this.x=b.x||0,this.y=b.y||0,this.width=b.maxwidth||a.canvas.width,this.color=b.color||"#333333",this.rotation=b.rotation||0,this.baseline=b.baseline||"top",this.font=b.font||"sans-serif",this.size=b.size||12,this.weight=b.weight||"normal",this.wordwarp=b.wordwarp||!0):(this.txt=b||"",this.x=c||0,this.y=d||this.y,this.width=f||a.canvas.width,this.color=g||a.ctx.fillStyle,this.rotation=0,this.baseline="top",this.font="sans-serif",this.size=12,this.weight="normal",this.wordwarp=!0),this.metrics=e(this),this}"use strict";var d;g.prototype.draw=function(){if(this.txt!==""){var b=a.ctx.measureText(this.txt).width;if(b+this.x>this.width&&this.wordwarp){var c=this.txt.split(" "),d="";for(var e=0;e<c.length;e++){var g=d+c[e]+" ",h=a.ctx.measureText(g).width;h>this.width-this.x?(f(d,this),d=c[e]+" ",this.y+=this.metrics.height):d=g}f(d,this)}else f(this.txt,this)}},g.prototype.setFont=function(a,b,c){return arguments.lenght!==0&&(this.size=b||this.size,this.weight=c||this.weight,this.font=a),this.weight+" "+this.size+"px "+this.font},g.prototype.setSize=function(a){return arguments.lenght!==0&&(this.size=a,this.metrics=e(this)),this.size},g.prototype.setColor=function(b){return arguments.lenght!==0&&(this.color=b),a.ctx.fillStyle},g.prototype.setText=function(a){return arguments.lenght!==0&&(this.txt=a,this.metrics=e(this)),this.txt},g.prototype.setBaseline=function(a){return arguments.lenght!==0&&(this.baseline=a),this.baseline},a.Text=g}(WCP,window,document),function(a){function b(){}"use strict",b.blur=function(a,b){return this.applyFilter(a,"blur",b)},b.brightness=function(a,b){return this.applyFilter(a,"brightness",b)},b.colorAdjust=function(a,b){return this.applyFilter(a,"colorAdjust",b[0],b[1],b[2])},b.contrast=function(a,b){return this.applyFilter(a,"contrast",b)},b.grayscale=function(a){return this.applyFilter(a,"grayscale")},b.hue=function(a,b){return this.applyFilter(a,"hue",b)},b.invert=function(a){return this.applyFilter(a,"invert")},b.lightness=function(a,b){return this.applyFilter(a,"lightness",b)},b.mosaic=function(a,b){return this.applyFilter(a,"mosaic",b)},b.saturation=function(a,b){return this.applyFilter(a,"saturation",b)},b.sepia=function(a){return this.applyFilter(a,"sepia")},b.solarize=function(a){return this.applyFilter(a,"solarize")},b.threshold=function(a,b){return this.applyFilter(a,"threshold",b)},b.filter=function(a,b,c){return this.applyFilter(a,c[0],c[1],c[2],c[3])},b.applyFilter=function(b,c,d,e,f){if(!b)return a.log("filter: Unable to apply a filter on an inexisting object"),null;var g=a.bufferCanvas(b.width,b.height);b instanceof a.Sprite?g.ctx.drawImage(b.img,b.sliceX,b.sliceY,b.sliceWidth,b.sliceHeight,0,0,b.width,b.height):b instanceof Image&&g.ctx.drawImage(b,0,0,b.width,b.height);var h=this.filterApplyFilter(g.ctx,b,c,d,e,f);return g.ctx.putImageData(h,0,0),g},b.filterApplyFilter=function(a,b,c,d,e,f){var g={blur:this.filterApplyBlur,brightness:this.filterApplyBrightness,colorAdjust:this.filterApplyColorAdjust,contrast:this.filterApplyContrast,grayscale:this.filterApplyGrayscale,hue:this.filterApplyHueOrSaturation,invert:this.filterApplyInvert,lightness:this.filterApplyLightness,mosaic:this.filterApplyMosaic,saturation:this.filterApplyHueOrSaturation,sepia:this.filterApplySepia,solarize:this.filterApplySolarize,threshold:this.filterApplyThreshold},h=a.getImageData(0,0,b.width,b.height);return c==="hue"?e=0:c==="saturation"&&(e=d,d=0),c==="colorAdjust"&&typeof e=="undefined"&&typeof f=="undefined"&&(e=d[1],f=d[2],d=d[0]),g[c]&&g[c](h.data,h.width,h.height,d,e,f),h},b.filterApplyBlur=function(a,b,c,d){d=Math.max(1,d);var e=a;for(var f=0;f<d;f++){for(var g=0;g<b;g++)for(var h=0;h<c;h++){var i=(g+(h-1)*b)*4,j=a[i],k=a[i+1],l=a[i+2],m=(g-1+h*b)*4,n=a[m],o=a[m+1],p=a[m+2],q=(g+h*b)*4,r=a[q],s=a[q+1],t=a[q+2],u=(g+1+h*b)*4,v=a[u],w=a[u+1],x=a[u+2],y=(g+(h+1)*b)*4,z=a[y],A=a[y+1],B=a[y+2];h-1<0&&(j=a[q],k=a[q+1],l=a[q+2]),g-1<0&&(n=a[q],o=a[q+1],p=a[q+2]),g+1>=b&&(v=a[q],w=a[q+1],x=a[q+2]),h+1>=c&&(z=a[q],A=a[q+1],B=a[q+2]),e[q]=(j+n+r*2+v+z)/6,e[q+1]=(k+o+s*2+w+A)/6,e[q+2]=(l+p+t*2+x+B)/6}a=e}},b.filterApplyBrightness=function(a,b,c,d){d=Math.max(-150,Math.min(150,d))*100/150;for(var e=0;e<b;e++)for(var f=0;f<c;f++){var g=(e+f*b)*4,h=a[g],i=a[g+1],j=a[g+2];a[g]=Math.round(h*(1+d/100)),a[g+1]=Math.round(i*(1+d/100)),a[g+2]=Math.round(j*(1+d/100))}},b.filterApplyColorAdjust=function(a,b,c,d,e,f){d=Math.round(Math.max(0,Math.min(255,d))-255),e=Math.round(Math.max(0,Math.min(255,e))-255),f=Math.round(Math.max(0,Math.min(255,f))-255);for(var g=0;g<b;g++)for(var h=0;h<c;h++){var i=(g+h*b)*4,j=a[i]+d,k=a[i+1]+e,l=a[i+2]+f;j>255?a[i]=255:j<0?a[i]=0:a[i]=j,k>255?a[i+1]=255:k<0?a[i+1]=0:a[i+1]=k,l>255?a[i+2]=255:l<0?a[i+2]=0:a[i+2]=l}},b.filterApplyContrast=function(a,b,c,d){d=Math.max(-1,d);for(var e=0;e<b;e++)for(var f=0;f<c;f++){var g=(e+f*b)*4,h=a[g],i=a[g+1],j=a[g+2];a[g]=Math.round(h+d*(h-127)),a[g+1]=Math.round(i+d*(i-127)),a[g+2]=Math.round(j+d*(j-127))}},b.filterApplyGrayscale=function(a,b,c){for(var d=0;d<b;d++)for(var e=0;e<c;e++){var f=(d+e*b)*4,g=a[f],h=a[f+1],i=a[f+2],j=.3*g+.59*h+.11*i;a[f]=j,a[f+1]=j,a[f+2]=j}},b.filterApplyHueOrSaturation=function(a,b,c,d,e){d=Math.max(-180,Math.min(180,d)),d=d%360/360;var f=d*6;e=Math.max(-100,Math.min(100,e))/100,e<0?e++:e=e*2+1;for(var g=0;g<b;g++)for(var h=0;h<c;h++){var i=(g+h*b)*4,j=a[i],k=a[i+1],l=a[i+2],m=j;k>m&&(m=k),l>m&&(m=l);var n=j;k<n&&(n=k),l<n&&(n=l);var o=m-n,p=(n+m)/510;if(p>0&&o>0){var q=0,r=0,s=0;p<=.5?(q=o/(m+n)*e,q>1&&(q=1),r=p*(1+q)):(q=o/(510-m-n)*e,q>1&&(q=1),r=p+q-p*q),j===m?k===n?s=5+(m-l)/o+f:s=1-(m-k)/o+f:k===m?l===n?s=1+(m-j)/o+f:s=3-(m-l)/o+f:j===n?s=3+(m-k)/o+f:s=5-(m-j)/o+f,s<0&&(s+=6),s>=6&&(s-=6);var t=p+p-r,u=s>>0;u===0?(j=r*255,k=(t+(r-t)*(s-u))*255,l=t*255):u===1?(j=(r-(r-t)*(s-u))*255,k=r*255,l=t*255):u===2?(j=t*255,k=r*255,l=(t+(r-t)*(s-u))*255):u===3?(j=t*255,k=(r-(r-t)*(s-u))*255,l=r*255):u===4?(j=(t+(r-t)*(s-u))*255,k=t*255,l=r*255):u===5&&(j=r*255,k=t*255,l=(r-(r-t)*(s-u))*255)}j>255?a[i]=255:j<0?a[i]=0:a[i]=j,k>255?a[i+1]=255:k<0?a[i+1]=0:a[i+1]=k,l>255?a[i+2]=255:l<0?a[i+2]=0:a[i+2]=l}},b.filterApplyInvert=function(a,b,c){for(var d=0;d<b;d++)for(var e=0;e<c;e++){var f=(d+e*b)*4;a[f]=255-a[f],a[f+1]=255-a[f+1],a[f+2]=255-a[f+2]}},b.filterApplyLightness=function(a,b,c,d){d=Math.max(-100,Math.min(100,d))/100;for(var e=0;e<b;e++)for(var f=0;f<c;f++){var g=(e+f*b)*4,h=a[g],i=a[g+1],j=a[g+2];d<0?(h*=d+1,i*=d+1,j*=d+1):d>0&&(h=h*(1-d)+d*255,i=i*(1-d)+d*255,j=j*(1-d)+d*255),h>255?a[g]=255:h<0?a[g]=0:a[g]=h,i>255?a[g+1]=255:i<0?a[g+1]=0:a[g+1]=i,j>255?a[g+2]=255:j<0?a[g+2]=0:a[g+2]=j}},b.filterApplyMosaic=function(a,b,c,d){d=Math.max(2,d);for(var e=0;e<b;e+=d)for(var f=0;f<c;f+=d){var g=(e+f*b)*4,h=a[g],i=a[g+1],j=a[g+2],k=d,l=d;k+e>b&&(k=b-e),l+f>c&&(l=c-f);for(var m=e;m<e+k;m++)for(var n=f;n<f+l;n++){var o=(m+n*b)*4;a[o]=h,a[o+1]=i,a[o+2]=j}}},b.filterApplySepia=function(a,b,c){for(var d=0;d<b;d++)for(var e=0;e<c;e++){var f=(d+e*b)*4,g=a[f],h=a[f+1],i=a[f+2],j=g*.393+h*.769+i*.189,k=g*.349+h*.686+i*.168,l=g*.272+h*.534+i*.131;j>255?a[f]=255:j<0?a[f]=0:a[f]=j,k>255?a[f+1]=255:k<0?a[f+1]=0:a[f+1]=k,l>255?a[f+2]=255:l<0?a[f+2]=0:a[f+2]=l}},b.filterApplySolarize=function(a,b,c){for(var d=0;d<b;d++)for(var e=0;e<c;e++){var f=(d+e*b)*4,g=a[f],h=a[f+1],i=a[f+2];g>127&&(g=255-g),h>127&&(h=255-h),i>127&&(i=255-i),a[f]=g,a[f+1]=h,a[f+2]=i}},b.filterApplyThreshold=function(a,b,c,d){d=Math.max(0,Math.min(254,d));for(var e=0;e<b;e++)for(var f=0;f<c;f++){var g=(e+f*b)*4,h=a[g],i=a[g+1],j=a[g+2],k=0;.2126*h+.7152*i+.0722*j>=d&&(k=255),a[g]=k,a[g+1]=k,a[g+2]=k}},b.AQUA=[0,255,255],b.BLACK=[0,0,0],b.BLUE=[0,0,255],b.FUCHSIA=[255,0,255],b.GRAY=[128,128,128],b.GREEN=[0,128,0],b.LIME=[0,255,0],b.MAROON=[128,0,0],b.NAVY=[0,0,128],b.OLIVE=[128,128,0],b.PURPLE=[128,0,128],b.RED=[255,0,0],b.SILVER=[192,192,192],b.TEAL=[0,128,128],b.WHITE=[255,255,255],b.YELLOW=[255,255,0],a.Filter=b}(WCP),function(a){function c(c){this.id=b.scenesLength,this.refresh=c.refreshRate||1e3/60,this.lastUpdate=0,this.active=!1,this.paused=!1,this.sched=new a.TimeScheduler,this.drawElements=[],this.drawElementsLength=0,this.fn={init:c.init||function(){},loop:c.loop||function(){},draw:c.draw||function(){},destroy:c.destroy||function(){}},b.scenes[this.id]=this,b.scenesLength++}function d(a){return typeof a!="object"&&b.scenes[a]?b.scenes[a]:typeof a=="object"?a:null}function e(b,c){var e=d(b);e?e.start(c):a.log("WCP.startScene: invalid scene identifier: "+b)}function f(b){var c=d(b);c?c.stop():a.log("WCP.stopScene: invalid scene identifier: "+b)}function g(b){var c=d(b);c?c.pause():a.log("WCP.pauseScene: invalid scene identifier: "+b)}function h(b){var c=d(b);c?c.unpause():a.log("WCP.unpauseScene: invalid scene identifier: "+b)}function i(){for(var a=0;a<b.scenesLength;a++)if(b.scenes[a]){var c=b.scenes[a];c.active&&(c.destroy(),c.active=!1)}}function j(b){b=b<1?1:b>60?60:b,console.log(b),a.globalFps=b}function k(){return a.globalFps}function l(){return a.fpsCounter.get()}function m(a,c){return c?function(){b.updatingScene&&b.updatingScene[c][a].apply(b.updatingScene[c],arguments)}:function(){b.updatingScene&&b.updatingScene[a].apply(b.updatingScene,arguments)}}function n(){window.requestAnimFrame(n);var c=a.millitime();if(c-b.lastGlobalUpdateTime<1e3/a.globalFps)return;b.lastGlobalUpdateTime=c;var d=!1;for(var e=0;e<b.scenesLength;e++)if(typeof b.scenes[e]!="undefined"){var f=b.scenes[e];f.lastUpdate===0&&(f.lastUpdate=b.lastGlobalUpdateTime),d||(a.clear(),a.fpsCounter.tick(),d=!0),f.active===!0?f.update():f.paused&&f.draw(),f.lastUpdate=b.lastGlobalUpdateTime}}"use strict",window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a,b){window.setTimeout(a,50)}}();var b={scenes:[],scenesLength:0,updatingScene:null,lastGlobalUpdateTime:0};a.globalFps=60,a.fpsCounter=new a.TimeCounter,c.prototype.update=function(){this.active&&(b.updatingScene=this,this.sched.update(),this.fn.loop.call(this),this.draw(),b.updatingScene=null)},c.prototype.draw=function(){for(var a in this.drawElements)if(this.drawElements.hasOwnProperty(a)){var b=this.drawElements[a];b.draw()}this.fn.draw.call(this)},c.prototype.start=function(a){this.active=!0,b.updatingScene=this,this.fn.init.call(this,a),b.updatingScene=null},c.prototype.stop=function(){b.updatingScene=this,this.fn.destroy.call(this),b.updatingScene=null,this.active=!1,this.paused=!1,this.lastUpdate=0,this.drawElements=[],this.drawElementsLength=0,this.sched.reset()},c.prototype.pause=function(){!this.paused&&this.active&&(this.paused=!0,this.active=!1,this.sched.unpause())},c.prototype.unpause=function(){this.paused&&(this.paused=!1,this.active=!0,this.sched.unpause())},c.prototype.add=function(b){if(!b.id){a.log('Scene.addSprite: invalid parameter "s": not a WCP.Sprite');return}this.drawElements[b.id]||(this.drawElements[b.id]=b)},c.prototype.remove=function(b){if(!b.id){a.log('Scene.addSprite: invalid parameter "s": not a WCP.Sprite');return}this.drawElements[b.id]&&delete this.drawElements[b.id]},c.prototype.elapsed=function(){return b.lastGlobalUpdateTime-this.lastUpdate},a.Scene=c,a.startScene=e,a.stopScene=f,a.clearScenes=i,a.setFps=j,a.getFps=k,a.getRealFps=l,a.add=m("add"),a.remove=m("remove"),a.setTimeout=m("setTimeout","sched"),a.clearTimeout=m("clearTimeout","sched"),a.setInterval=m("setInterval","sched"),a.clearInterval=m("clearInterval","sched"),a.scenesData=b,a.initScenes=function(){a.fpsCounter.reset(),n()}}(WCP);