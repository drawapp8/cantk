/*
 * File:   cantk-rt.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  cantk runtime adapter
 * 
 * Copyright (c) 2015 - 2015 Tangram HD Inc.
 * 
 */
function CantkRT() {
}

CantkRT.init = function(onDeviceReady) {
	window.onload = onDeviceReady;
}

CantkRT.isNative = function() {
	return CantkRT.isCantkRTV8() || CantkRT.isCantkRTCordova();
}

CantkRT.isCantkRTV8 = function() {
	return !!window.cantkRTV8;
}

CantkRT.loadFont = function(name, url) {
	if(window.loadFont) {
		window.loadFont(name, url);
	}
	console.log("load font " + name + ":" + url);
}

CantkRT.isCantkRTCordova = function() {
	return !!window.cantkRTCordova;
}

CantkRT.getViewPort = function() {
	var width;
	var height;

	if(window.displayInfo) {
		width = window.displayInfo.width;
		height = window.displayInfo.height;
	}
	else if (typeof window.innerWidth != 'undefined'){
		width = window.innerWidth;
		height = window.innerHeight;
	}
	else if (typeof document.documentElement != 'undefined'
	&& typeof document.documentElement.clientWidth !=
	'undefined' && document.documentElement.clientWidth != 0)
	{
		width = document.documentElement.clientWidth;
		height = document.documentElement.clientHeight;
	}
	else{
		width = document.getElementsByTagName('body')[0].clientWidth;
		height = document.getElementsByTagName('body')[0].clientHeight;
	}
	
	return {width:width, height:height};
}

CantkRT.getMainCanvas = function() {
	var canvas = null;

	if(CantkRT.canvas) {
		return CantkRT.canvas;
	}

	canvas = document.getElementById('main_canvas');
	if(!canvas) {
		canvas = document.createElement("canvas");
		canvas.id = "main_canvas";
		canvas.style.zIndex = 0;
		document.body.appendChild(canvas);
	}

	if(canvas.setAsMainCanvas) {
		canvas.setAsMainCanvas();
	}

	if(!canvas.flush) {
		canvas.flush = function() {}
	}

	CantkRT.canvas = canvas;

	return canvas;
}

CantkRT.mainCanvasW = 0;
CantkRT.mainCanvasH = 0;
CantkRT.mainCanvasScale = {x:1, y:1};
CantkRT.mainCanvasPostion = {x:0, y:0};

CantkRT.moveMainCanvas = function(x, y) {
	var canvas = CantkRT.getMainCanvas();
	canvas.style.position = "absolute";
	canvas.style.top = y + "px";
	canvas.style.left = x + "px";
	CantkRT.mainCanvasPostion.x = x;
	CantkRT.mainCanvasPostion.y = y;
}

CantkRT.resizeMainCanvas = function(w, h, styleW, styleH) {
	var canvas = CantkRT.getMainCanvas();

	canvas.width = w;
	canvas.height = h;
	canvas.style.width = styleW + "px";
	canvas.style.height = styleH + "px";
	CantkRT.mainCanvasW = w;
	CantkRT.mainCanvasH = h;
	CantkRT.mainCanvasScale.x = w/styleW;
	CantkRT.mainCanvasScale.y = h/styleH;
}

CantkRT.getMainCanvasScale = function() {
	return CantkRT.mainCanvasScale;
}

CantkRT.getMainCanvasPosition = function() {
	return CantkRT.mainCanvasPostion;
}

CantkRT.isResSupportCrossOrgin = function(src) {
	if(src && src.indexOf("file://") < 0 
		&& src.indexOf("data:image") !== 0 
		&& src.indexOf("api.map.baidu.com") < 0 
		&& src.indexOf("maps.googleapis.com") < 0 
		&& src.indexOf(location.host) < 0) {
		return true;
	}
	else {
		return false;
	}
}

CantkRT.createImage = function(src, onLoad, onError) {
	var image = null;
	image = new Image();
	image.onload = function() {
		if(onLoad) {
			onLoad(image);
		}
	}
	
	image.onerror = function(e) {
		if(e) {
			console.log(this.src + " load error: " + e.message);
		}
		else {
			console.log(this.src + " load error");
		}

		if(image.crossOrigin) {
			var src = image.src;
			image.crossOrigin = null;
			image.src = null;
			image.src = src;
			console.log("try without image.crossOrigin:" + src);
			return;
		}

		if(onError) {
			onError(image);
		}

	}
	
	if(CantkRT.isResSupportCrossOrgin(src)) {
		image.crossOrigin = "Anonymous";
	}

	image.src = src;

	return image;
}

CantkRT.createImageFromCanvas = function(canvas, onLoad, onError) {
	if(!canvas) {
		if(onError) {
			onError();
		}

		return null;
	}

	if(onLoad) {
		onLoad(canvas);
	}

	return canvas;
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame 
	|| window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

CantkRT.requestAnimFrame = function(callback) {
	return window.requestAnimationFrame(callback);
}

CantkRT.createSound = function(src, soundEffect, onDone, onFail) {
	var audio = new Audio();

	audio.setAsSoundEffect(soundEffect);
	audio.onload = function() {
		if(onDone) {
			onDone(audio);
		}
	}
	audio.onerror = function(e) {
		if(onFail) {
			onFail(e);
		}
	}
	audio.src = src;

	return audio;
}

CantkRT.createSoundEffect = function(src, onDone, onFail) {
	return CantkRT.createSound(src, true, onDone, onFail);
}

CantkRT.createSoundMusic = function(src, onDone, onFail) {
	return CantkRT.createSound(src, false, onDone, onFail);
}
