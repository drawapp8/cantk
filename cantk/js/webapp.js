/*
 * File: webapp.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: web app.
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function webappInit(type) {
	cantkRegisterUIElements();

	if(type === AppBase.TYPE_PREVIEW) {
		document.body.style.overflow = "scroll";
	}
	else {
		document.body.style.overflow = "hidden";
	}

	return;
}

function WebApp(type) {
	var args = ["main_canvas", type];
	AppBase.apply(this, args);

	webappInit(type);

	this.onCanvasSized = function(w, h) {
		this.win.resize(w, h);
		this.view.resize(w, h);

		return;
	}

	this.onSizeChanged = function() {
		var viewPort = cantkGetViewPort();

		if(viewPort.width === this.viewPort.width && viewPort.height === this.viewPort.height) {
			console.log("onSizeChanged: size is not changed.");
			return;
		}

		this.adjustCanvasSize();
		
		var w = this.canvas.width;
		var h = this.canvas.height;
		
		console.log("onSizeChanged: w=" + w + " h=" + h);

		this.manager.resize(w, h);
		this.win.resize(w, h);
		this.view.resize(w, h);
		this.view.resizeWindowManager(w, h);
		this.view.moveEditor();

		this.viewPort = viewPort;
	}

	this.exitApp = function() {
		if(isTizen()) {
			tizen.application.getCurrentApplication().exit();
		}
		else if(navigator.app) {
			navigator.app.exitApp();
		}
		console.log("exitApp");
		return;
	}

	this.viewPort = cantkGetViewPort();

	return this;
}

WebApp.prototype.runWithURL = function(dataURL) {
	var rInfo = {};
	var app = this;

	rInfo.url = dataURL;
	rInfo.headers = {};
	rInfo.method = "GET";
	rInfo.noCache = true;
	rInfo.onDone = function(result, xhr, respContent) {
		var jsonStr = xhr.responseText;
		app.runWithData(jsonStr);
		
		return;
	}
	httpDoRequest(rInfo);	
	console.log("dataURL:" + dataURL);

	return;
}

WebApp.prototype.createWindow = function() {
	var x = 0;
	var y = 0;

	var w = this.canvas.width;
	var h = this.canvas.height;

	this.win = WWindow.create(this.manager, 0, 0, w, h);
	this.view = WAppView.create(this.win, x, y, w, h, this);
	this.view.forPreview = this.type === AppBase.TYPE_PREVIEW;
	this.win.paintBackground = function(canvas) {};
	if(!this.view.forPreview) {
		this.view.paintBackground = function(canvas) {};
	}
	
	var view = this.view;
	this.win.onGesture = function(gesture) {
		return view.onGesture(gesture);
	}

	return;
}

WebApp.prototype.showWindow = function() {
	this.view.showIt();
	this.win.showAll(1);
	var meta = this.view.getMeta();

	if(meta && meta.general) {
		document.title = "七巧板互动:" + meta.general.appname;
	}

	return;
}

WebApp.prototype.runWithData = function(jsonStr) {
	this.createWindow();
	this.view.loadFromJson(jsonStr);
	this.showWindow();	

	return;
}

WebApp.prototype.previewWithDeviceData = function(deviceJson) {
	this.createWindow();

	this.view.beforeLoad(deviceJson);
	this.view.fixDeviceConfig(deviceJson);
	this.view.meta = deviceJson.meta;
	this.view.device = ShapeFactoryGet().createShape(deviceJson.type, C_CREATE_FOR_PROGRAM)
	this.view.deviceJson = deviceJson;
	this.view.afterLoad(deviceJson);

	this.showWindow();

	return;
}

WebApp.prototype.runWithDeviceData = function(deviceJson) {
	this.createWindow();

	this.view.fixDeviceConfig(deviceJson);
	this.view.device = deviceJson;
	this.view.meta = deviceJson.meta;

	this.view.createWindowManager = function() {
		var js = null;
		var wm = this.getWindowManager();

		js = wm;
		this.beforeLoad(deviceJson);
		wm = ShapeFactoryGet().createShape(js.type, C_CREATE_FOR_PROGRAM);
		wm.fromJson(js);
		this.afterLoad(deviceJson);

		return wm;
	}

	this.showWindow();

	return;
}

function webappRunWithData(jsonStr) {
	var app = new WebApp(AppBase.TYPE_WEBAPP);
	
	app.runWithData(jsonStr);

	return app;
}

function webappRunWithDeviceData(deviceJson) {
	var app = new WebApp(AppBase.TYPE_WEBAPP);
	
	app.runWithDeviceData(deviceJson);

	return app;
}

function webappPreviewWithDeviceData(deviceJson) {
	var app = new WebApp(AppBase.TYPE_PREVIEW);
	
	app.previewWithDeviceData(deviceJson);

	return app;
}

function webappPreviewWithData(jsonStr) {
	var app = new WebApp(AppBase.TYPE_PREVIEW);
	
	app.runWithData(jsonStr);

	return app;
}

function webappRunWithURL(dataURL) {
	var app = new WebApp(AppBase.TYPE_WEBAPP);
	
	app.runWithURL(dataURL);

	return app;
}

function webappPreviewWithURL(dataURL) {
	var app = new WebApp(AppBase.TYPE_PREVIEW);
	
	app.runWithURL(dataURL);

	return app;
}

function shapeFixImagePath(shape, oldConfig, newConfig) {
	var oldVersion	= oldConfig.version;
	var oldPlatform = oldConfig.platform;
	var oldDensity	= oldConfig.lcdDensity;
	var newVersion	= newConfig.version;
	var newPlatform = newConfig.platform;
	var newDensity	= newConfig.lcdDensity;

	for(var key in shape.images) {
		var value = shape.images[key];
		if(key === "display") {
			continue;
		}
		
		var src = value;
		if(src) {
			src = src.replaceAll("/" + oldVersion + "/", "/" + newVersion + "/");
			src = src.replaceAll("/" + oldPlatform + "/", "/" + newPlatform + "/");
			src = src.replaceAll("/" + oldDensity + "/", "/" + newDensity + "/");
			shape.images[key] = src;
		}
	}

	if(shape.children) {
		for(var i = 0; i < shape.children.length; i++) {
			shapeFixImagePath(shape.children[i], oldConfig, newConfig);
		}
	}

	return;
}

function WAppView() {
}

WAppView.prototype = new WViewBase();
WAppView.prototype.init = function(parent, x, y, w, h, app) {
	this.app = app;
	this.type = "app-view";
	WViewBase.prototype.init.call(this, parent, x, y, w, h);
	
	this.forPreview = false;
	this.platform = "windowphone";
	if(browser.versions.android) {
		this.platform = "android";
	}
	else if(browser.versions.iPhone) {
		this.platform = "iphone";
	}

	return this;
}

WAppView.prototype.clearBg = function(canvas, color) {
	var r = this.rect;
	canvas.fillStyle = color;
	canvas.fillRect(r.x, r.y, r.w, r.h);
}

WAppView.prototype.showPageIndicator = function(canvas) {
	return;
}

WAppView.prototype.showLogo = function(canvas) {
	return;
}

WAppView.prototype.drawGrid = function(canvas) {
	return;
}

WAppView.prototype.onGesture = function(gesture) {
	if(this.windowManager) {
		var curWin = this.windowManager.getCurrentFrame();
		if(curWin) {
			curWin.onGesture(gesture);
		}
	}

	return;
}

WAppView.prototype.setTarget = function(shape) {
	for(var i = this.allShapes.length - 1; i >= 0; i--) {
		var g = this.allShapes[i];

		if(shape !== g) {
			g.setSelected(false);
		}
	}					
	
	this.targetShape = shape;	
	
	return;
}

WAppView.prototype.onPointerDown = function(p) { 
	var point = this.translatePoint(p);

	this.pointerDownPosition.x = point.x;
	this.pointerDownPosition.y = point.y;
	this.lastPointerPosition.x = point.x;
	this.lastPointerPosition.y = point.y;
	
	this.updateLastPointerPoint(point);
	for(var i = this.allShapes.length - 1; i >= 0; i--) {
		var shape = this.allShapes[i];
		if(shape.onPointerDown(point)) {
			this.setTarget(shape);
			break;
		}
	}

	this.postRedraw();

	return;
}

WAppView.prototype.onPointerMove = function(p) {
	var point = this.translatePoint(p);
	
	this.updateLastPointerPoint(point);
	if(this.targetShape) {
		this.targetShape.onPointerMove(point);
	
		if(this.targetShape.pointerDown) {
			this.postRedraw();
		}
		
		return;
	}

	return;
}

WAppView.prototype.onPointerUp = function(p) {
	var point = this.translatePoint(p);

	this.updateLastPointerPoint(point);
	if(this.targetShape) {
		this.targetShape.onPointerUp(point);
		this.postRedraw();
	}

	return;
}

WAppView.prototype.onKeyDown = function(code) {		
	if(!this.targetShape && this.allShapes && this.allShapes.length) {
		this.targetShape = this.allShapes[0];
	}

	if(this.targetShape) {
		this.targetShape.onKeyDown(code);
		this.postRedraw();
	}
	
	return;
}

WAppView.prototype.onKeyUp = function(code) {
	if(this.targetShape) {
		this.targetShape.onKeyUp(code);
		this.postRedraw();
	}
	
	return;
}

WAppView.prototype.extractDevices = function(js) {
	this.devices = [];

	for(var pageIndex = 0; pageIndex < js.pages.length; pageIndex++) {
		var page = js.pages[pageIndex];
		for(var i = 0; i < page.shapes.length; i++) {
			var shape = page.shapes[i];

			if(shape.type === "ui-device") {
				if(!this.forPreview) {
					shape.images = {display:0};
					this.fixDeviceConfig(shape);
				}

				var device = ShapeFactoryGet().createShape(shape.type, C_CREATE_FOR_PROGRAM);
				if(device) {
					device.fromJson(shape);
				}
				this.devices.push(device);
			}
		}
	}

	return this.devices.length;
}

WAppView.prototype.getDevice = function() {
	if(!this.device) {
		for(var i = 0; i < this.devices.length; i++) {
			var device = this.devices[i];
			var config = device.config;

			if(!device.config) continue;
			if(config.platform != this.platform) continue;

			this.device = device;
		}

		if(!this.device) {
			this.device = this.devices[0];
		}
	}

	return this.device;
}

WAppView.prototype.getScreen = function() {
	if(!this.screen) {
		var device = this.getDevice();
		for(var i = 0; i < device.children.length; i++) {
			var child = device.children[i];
			if(child.isUIScreen) {
				this.screen = child;
			}
		}
	}

	return this.screen;
}

WAppView.prototype.getWindowManager = function(detach) {
	if(!this.windowManager) {
		var screen = this.getScreen();
		for(var i = 0; i < screen.children.length; i++) {
			var child = screen.children[i];
			if(child.isUIWindowManager) {
				this.windowManager = child;
				if(detach) {
					screen.children.remove(child);
					child.parentShape = null;
				}
				break;
			}
		}
	}

	return this.windowManager;
}

WAppView.prototype.detectDeviceConfig = function() {
	if(this.detectedDeviceConfig) {
		return this.detectedDeviceConfig;
	}

	var deviceConfig = cantkDetectDeviceConfig();
		
	deviceConfig.screenW = this.rect.w;
	deviceConfig.screenH = this.rect.h; 

	this.detectedDeviceConfig = deviceConfig;

	console.log("deviceConfig.lcdDensity:" + deviceConfig.lcdDensity);
	console.log("deviceConfig.platform:" + deviceConfig.platform);
	console.log("deviceConfig.screenW:" + deviceConfig.screenW);
	console.log("deviceConfig.screenH:" + deviceConfig.screenH);

	return deviceConfig;
}

WAppView.prototype.showIt = function() {
	if(this.forPreview) {
		this.showDevice();
	}
	else {
		this.showWindowManager();
	}

	this.targetShape = this.getWindowManager();
	console.log("Set targetShape: " + this.targetShape.type);

	var view = this;
	setTimeout(function() {
		view.postRedraw();
	}, 500);
	
	setTimeout(function() {
		view.postRedraw();
	}, 1000);

	setTimeout(function() {
		view.postRedraw();
	}, 2000);

	setTimeout(function() {
		view.postRedraw();
	}, 3000);

	return;
}

WAppView.prototype.showDevice = function() {
	var x = 0;
	var y = 0;
	var w = this.rect.w;
	var h = this.rect.h;

	var device = this.getDevice();
	UIElement.disableGetRelativePathOfURL = true;
	var js = this.deviceJson ? this.deviceJson : device.toJson();
	UIElement.disableGetRelativePathOfURL = false;

	var screen = null;
	for(var i = 0; i < js.children.length; i++) {
		var child = js.children[i];
		if(child.type === "ui-screen") {
			screen = child;
		}
	}
	js.children.clear();
	js.children.push(screen);

	this.device = device = ShapeFactoryGet().createShape(js.type, C_CREATE_FOR_PROGRAM);
	device.fromJson(js);

	var viewPort = cantkGetViewPort();
	if(device.h < viewPort.height && device.w < viewPort.width) {
		y = (viewPort.height - device.h)/2;
		document.body.style.overflow = "hidden";
	}

	x = (w - device.w)/2;
	device.move(x, y);
	device.setMode(Shape.MODE_RUNNING, true);
	this.addShape(device);

	var wm = this.getWindowManager();
	this.runApp(wm);

	return;
}

WAppView.prototype.getDeviceConfig = function() {
	var device = this.getDevice();

	return device ? device.config : null;
}

WAppView.prototype.resizeWindowManager = function(w, h) {
	if(this.windowManager) {
		this.windowManager.resize(w, h);
		console.log("this.windowManager.x=" + this.windowManager.x);
		console.log("this.windowManager.y=" + this.windowManager.y);
		console.log("this.windowManager.w=" + this.windowManager.w);
		console.log("this.windowManager.h=" + this.windowManager.h);
		
		var wm = this.windowManager;

		setTimeout(function() {
			wm.relayoutChildren();
			wm.postRedraw();
		}, 200);
	}

	return;
}

WAppView.prototype.moveEditor = function() {
	setTimeout(function() {
		cantkMoveEditorWhenResize();
	}, 300);
	cantkMoveEditorWhenResize();

	return;
}

WAppView.prototype.createWindowManager = function() {
	return this.getWindowManager(true);
}

WAppView.prototype.fixDeviceConfig = function(device) {
	var oldConfig = device.config;
	var newConfig = this.detectDeviceConfig();
	
	if(this.app.type === AppBase.TYPE_PREVIEW) {
		newConfig.lcdDensity = oldConfig.lcdDensity;
		console.log("run in preview mode.");
	}

	if(newConfig.platform !== oldConfig.platform 
		&& newConfig.version !== oldConfig.version 
		&& newConfig.lcdDensity !== oldConfig.lcdDensity) {
		shapeFixImagePath(device, oldConfig, newConfig);
	}

	return;
}

WAppView.prototype.loadUserScripts = function() {
	if(this.meta) {
		var scripts = this.meta.extlibs;
		var force = window.location.href.indexOf("appid=preview") > 0;
		if(scripts) {
			for(var i = 0; i < scripts.length; i++) {
				ResLoader.loadScript(scripts[i], force);
			}
		}
	}

	return;
}

WAppView.prototype.runApp = function(wm) {
	this.loadUserScripts();

	wm.systemInit();
	wm.postRedraw();

	return;
}

WAppView.prototype.showWindowManager = function() {
	var wm = null;
	var w = this.rect.w;
	var h = this.rect.h;
	var newConfig = this.detectDeviceConfig();

	wm = this.createWindowManager();
	wm.deviceConfig = this.getDeviceConfig();

	if(this.app.type === AppBase.TYPE_PREVIEW) {
		newConfig.lcdDensity = wm.deviceConfig.lcdDensity;
	}

	if(this.meta && this.meta.general) {
		var general = this.meta.general;
		var orientation = general.orientation;
		wm.forcePortrait = false;
		wm.forceLandscape = false;
		if(orientation === "landscape" && wm.w > wm.h) {
			wm.forceLandscape = true;
		}
		else if(orientation === "portrait" && wm.h > wm.w) {
			wm.forcePortrait = true;
		}
		wm.screenScaleMode = general.screenscale; 
	}

	this.addShape(wm);
	
	wm.setDeviceConfig(newConfig);
	wm.setMode(Shape.MODE_RUNNING, true);
	wm.move(0, 0);
	wm.resize(w, h);

	this.runApp(wm);
	
	this.windowManager = wm;	

	console.log("w:" + w + " h:" + h);
	return;
}

WAppView.prototype.getMeta = function() {
	return this.meta;
}

WAppView.prototype.loadJson = function(js) {
	this.meta = js ? js.meta : null;
	this.beforeLoad(js);

	if(!js || !js.pages || !this.extractDevices(js)) {
		console.log("It is not a valid webapp.");
		return;
	}
	this.afterLoad(js);

//////////////////////////////////////////////
	var appid = js.docid;
	var tag = document.createElement("script"); 
	tag.src = "http://appusage.duapp.com/count?appid=" + appid; 
	var node = document.head ? document.head : document.body;
		node.appendChild(tag);

	return;
}

WAppView.create = function(parent, x, y, w, h, app) {
	var view = new WAppView();
	return view.init(parent, x, y, w, h, app);
}

function dappGetText(text) {
	return text;
}

function dappIsEditorApp() {
	return false;
}


if(isWeiXin()) {
	document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
	//	WeixinJSBridge.call('hideToolbar');
	});
}

window.webappSetLocaleStrings = webappSetLocaleStrings;
window.webappPreviewWithURL = webappPreviewWithURL;
window.webappPreviewWithData = webappPreviewWithData;
window.webappPreviewWithDeviceData = webappPreviewWithDeviceData;
window.webappRunWithURL = webappRunWithURL;
window.webappRunWithData = webappRunWithData;
window.webappRunWithDeviceData = webappRunWithDeviceData;

