/*
 * File: webapp.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  web app.
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

function TWebApp(preview) {
	document.body.style.overflow = "hidden";
	this.viewPort = cantkGetViewPort();

	this.preview = !!preview; 
	this.init(preview);

	return this;
}

TWebApp.prototype.prepareCanvas = function() {
	this.canvas	 = CantkRT.getMainCanvas();

	var canvas = this.canvas;
	var vp = cantkGetViewPort();
	var w = vp.width;
	var h = vp.height;
	CantkRT.resizeMainCanvas(w, h, w, w);

	this.manager = WWindowManager.create(this, this.canvas, this.canvas);

	return;
}

TWebApp.prototype.init = function() {
	this.prepareCanvas();
	var w = this.canvas.width;
	var h = this.canvas.height;

	var app = this;
	this.win = WWindow.create(this.manager, 0, 0, w, h);
	this.view = TRuntimeView.create(this.win, 0, 0, w, h, this);
	
	var view = this.view;
	this.win.paintBackground = function(canvas) {
	};
	
	this.win.onGesture = function(gesture) {
		return view.onGesture(gesture);
	};

	window.onresize = function() {
		setTimeout(app.onSizeChanged.bind(app), 50);
	}

	return;
}


TWebApp.prototype.resizeWin = function(w, h) {
	this.win.resize(w, h);
	this.view.resize(w, h);
}

TWebApp.prototype.resizeCanvas = function(w, h, x, y, styleW, styleH) {
	var canvas = this.canvas;

	CantkRT.moveMainCanvas(x, y);
	CantkRT.resizeMainCanvas(w, h, styleW, styleH);

	return;
}

TWebApp.prototype.onSizeChanged = function() {
	var viewPort = cantkGetViewPort();

	if(EditorElement.imeOpen) {
		console.log("EditorElement.imeOpen is true.");
		return;
	}

	if(viewPort.width === this.viewPort.width && viewPort.height === this.viewPort.height) {
		console.log("onSizeChanged: size is not changed.");
		return;
	}

	var w = viewPort.width;
	var h = viewPort.height;
	this.viewPort = viewPort;
	this.manager.resize(w, h);
	this.view.adjustWMSizePosition();
	UIElement.getMainCanvasScale(true);
}

TWebApp.prototype.exitApp = function() {
	if(isTizen()) {
		tizen.application.getCurrentApplication().exit();
	}
	else if(navigator.app) {
		navigator.app.exitApp();
	}
	console.log("exitApp");
	return;
}

TWebApp.prototype.runWithURL = function(url) {
	this.view.loadURL(url);
	return this;
}

TWebApp.prototype.runWithData = function(json) {
	if(typeof json === "string") {
		this.view.loadString(json);
	}
	else {
		this.view.loadJson(json);
	}
	return this;
}

window.webappRunWithURL = function(url) {
	var app = new TWebApp();
	
	return app.runWithURL(url);
}

window.webappRunWithData = function(json) {
	var app = new TWebApp();
	
	return app.runWithData(json);
}

window.webappPreviewWithURL = function(url) {
	var app = new TWebApp(true);
	
	return app.runWithURL(url);
}

window.webappPreviewWithData = function(json) {
	var app = new TWebApp(true);
	
	return app.runWithData(json);
}

window.webappGetText = webappGetText;
window.webappSetLocaleStrings = webappSetLocaleStrings;

window.webappSnapshot = function() {
	var canvas = CantkRT.getMainCanvas();
	var dataURL = canvas.toDataURL();
	
	var image = {};
	image.src = dataURL;
	image.width = canvas.width;
	image.height = canvas.height;

	return image;
}

