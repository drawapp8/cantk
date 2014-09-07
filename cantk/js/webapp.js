/*
 * File: webapp.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: web app.
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function webappInit(type) {
	cantkRegisterUIElements();

	if(type === C_APP_TYPE_PREVIEW) {
		document.body.style.overflow = "scroll";
	}
	else {
		document.body.style.overflow = "hidden";
	}

	return;
}

function WebApp(type) {
	var args = ["idraw_canvas", type];
	AppBase.apply(this, args);

	webappInit(type);

	this.onSizeChanged = function() {
		var viewPort = getViewPort();

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

	this.viewPort = getViewPort();

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

	this.win = new Window(this.manager, 0, 0, w, h);
	this.win.theme[0].bg = "White";
	
	this.view = new AppView(this.win, x, y, w, h, this);
	this.view.forPreview = this.type === C_APP_TYPE_PREVIEW;
	
	var view = this.view;

	if(!this.view.forPreview) {
		this.win.paintBackground = function(canvas) {
		}
	}

	this.win.onGesture = function(gesture) {
		return view.onGesture(gesture);
	}

	return;
}

WebApp.prototype.showWindow = function() {
	this.view.showIt();
	this.win.showAll(1);

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
	var app = new WebApp(C_APP_TYPE_WEBAPP);
	
	app.runWithData(jsonStr);

	return app;
}

function webappRunWithDeviceData(deviceJson) {
	var app = new WebApp(C_APP_TYPE_WEBAPP);
	
	app.runWithDeviceData(deviceJson);

	return app;
}

function webappPreviewWithDeviceData(deviceJson) {
	var app = new WebApp(C_APP_TYPE_PREVIEW);
	
	app.previewWithDeviceData(deviceJson);

	return app;
}

function webappPreviewWithData(jsonStr) {
	var app = new WebApp(C_APP_TYPE_PREVIEW);
	
	app.runWithData(jsonStr);

	return app;
}

function webappRunWithURL(dataURL) {
	var app = new WebApp(C_APP_TYPE_WEBAPP);
	
	app.runWithURL(dataURL);

	return app;
}

function webappPreviewWithURL(dataURL) {
	var app = new WebApp(C_APP_TYPE_PREVIEW);
	
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

function AppView(parent, x, y, w, h, app) {
	ViewBase.apply(this, arguments);

	this.allUserAppScriptsLoaded = false;

	this.forPreview = false;

	this.postRedraw =	 function(rect) {
		if(!this.allUserAppScriptsLoaded) {
			return;
		}

		var p = this.getAbsPosition();
		
		if(!rect) {
			rect = {x:0, y:0, w:this.rect.w, h:this.rect.h};
		}

		rect.x = p.x + rect.x;
		rect.y = p.y + rect.y;
		
		this.getManager().postRedraw(rect);
	}

	this.init = function() {

		this.platform = "windowphone";
		if(browser.versions.android) {
			this.platform = "android";
		}
		else if(browser.versions.iPhone) {
			this.platform = "iphone";
		}

		return;
	}
	
	this.showPageIndicator = function(canvas) {
		return;
	}
	
	this.showLogo = function(canvas) {
		return;
	}

	this.drawGrid = function(canvas) {
		return;
	}
	
	this.onGesture = function(gesture) {
		if(this.windowManager) {
			var curWin = this.windowManager.getCurrentFrame();
			if(curWin) {
				curWin.onGesture(gesture);
			}
		}

		return;
	}

	this.setTarget = function(shape) {
		for(var i = this.allShapes.length - 1; i >= 0; i--) {
			var g = this.allShapes[i];

			if(shape !== g) {
				g.setSelected(false);
			}
		}					
		
		this.targetShape = shape;	
		
		return;
	}
	
	this.onPointerDown = function(p) { 
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
	
	this.onPointerMove = function(p) {
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
	
	this.onPointerUp = function(p) {
		var point = this.translatePoint(p);

		this.updateLastPointerPoint(point);
		if(this.targetShape) {
			this.targetShape.onPointerUp(point);
			this.postRedraw();
		}

		return;
	}
	
	this.onKeyDown = function(code) {		
		if(!this.targetShape && this.allShapes && this.allShapes.length) {
			this.targetShape = this.allShapes[0];
		}

		if(this.targetShape) {
			this.targetShape.onKeyDown(code);
			this.postRedraw();
		}
		
		return;
	}

	this.onKeyUp = function(code) {
		if(this.targetShape) {
			this.targetShape.onKeyUp(code);
			this.postRedraw();
		}
		
		return;
	}

	this.extractDevices = function(js) {
		this.devices = new Array();

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

	this.getDevice = function() {
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
	
	this.getScreen = function() {
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
	
	this.getWindowManager = function(detach) {
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

	this.detectDeviceConfig = function() {
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

	this.showIt = function() {
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

	this.showDevice = function() {
		var x = 0;
		var y = 0;
		var w = this.rect.w;
		var h = this.rect.h;

		var device = this.getDevice();
		var js = this.deviceJson ? this.deviceJson : device.toJson();
	
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

		var viewPort = getViewPort();
		if(device.h < viewPort.height && device.w < viewPort.width) {
			y = (viewPort.height - device.h)/2;
			document.body.style.overflow = "hidden";
		}

		x = (w - device.w)/2;
		device.move(x, y);
		device.setMode(C_MODE_RUNNING, true);
		this.addShape(device);

		var wm = this.getWindowManager();
		this.runApp(wm);

		return;
	}

	this.getDeviceConfig = function() {
		var device = this.getDevice();

		return device ? device.config : null;
	}
	
	this.resizeWindowManager = function(w, h) {
		if(this.windowManager) {
			this.windowManager.setSizeLimit(w, h, w, h);
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

	this.moveEditor = function() {
		setTimeout(function() {
			cantkMoveEditorWhenResize();
		}, 300);
		cantkMoveEditorWhenResize();

		return;
	}

	this.createWindowManager = function() {
		return this.getWindowManager(true);
	}
	
	this.fixDeviceConfig = function(device) {
		var oldConfig = device.config;
		var newConfig = this.detectDeviceConfig();
		
		if(app.type === C_APP_TYPE_PREVIEW) {
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

	this.getUserAppScripts = function() {
		if(this.meta) {
			return this.meta.extlibs;
		}
		return null;
	}

	this.runApp = function(wm) {
		var view = this;
		var scripts = this.getUserAppScripts();
	
		if(!scripts || !scripts.length) {
			view.allUserAppScriptsLoaded = true;

			wm.systemInit();
			wm.showInitWindow();
			wm.postRedraw();

			return;
		}

		for(var i = 0; i < scripts.length; i++) {
			addUserAppScript(scripts[i]);
		}

		loadUserAppScripts(function() {
			console.log("All User App Scripts Loaded");
			view.allUserAppScriptsLoaded = true;

			wm.systemInit();
			wm.showInitWindow();
			wm.postRedraw();
		});

		return;
	}

	this.showWindowManager = function() {
		var wm = null;
		var w = this.rect.w;
		var h = this.rect.h;
		var newConfig = this.detectDeviceConfig();

		wm = this.createWindowManager();
		wm.deviceConfig = this.getDeviceConfig();

		if(app.type === C_APP_TYPE_PREVIEW) {
			newConfig.lcdDensity = wm.deviceConfig.lcdDensity;
		}

		wm.setDeviceConfig(newConfig);
		wm.setSizeLimit(w, h, w, h);
		wm.setSize(w, h);
		wm.move(0, 0);
		wm.setMode(C_MODE_RUNNING, true);
		this.addShape(wm);
		this.runApp(wm);
		
		this.windowManager = wm;	

		console.log("w:" + w + " h:" + h);
		return;
	}

	this.loadJson = function(js) {
		this.meta = js.meta;
		this.beforeLoad(js);

		if(!js || !js.pages || !this.extractDevices(js)) {
			console.log("It is not a valid webapp.");
			return;
		}
		this.afterLoad(js);

		return;
	}

	this.init();

	return this;
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

