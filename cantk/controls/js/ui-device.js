/*
 * File: ui-device.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: Device 
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIDevice() {
	return;
}

UIDevice.PORTRAIT = 0;
UIDevice.LANDSCAPE = 1;

UIDevice.prototype = new UIElement();

UIDevice.prototype.isUIDevice = true;

UIDevice.prototype.doToJson = function(o) {
	UIElement.prototype.doToJson(this, o);
	o.config = this.config;

	return;
}

UIDevice.prototype.drawSelectMarks = function(canvas) {
}

UIDevice.prototype.doFromJson = function(js) {
	UIElement.prototype.doFromJson.call(this, js);

	if(js.config) {
		this.config = dupDeviceConfig(js.config);
	}

	return;
}

UIDevice.prototype.getDirection = function() {
	return (this.h > this.w) ? UIDevice.PORTRAIT : UIDevice.LANDSCAPE;
}

UIDevice.prototype.setDirection = function(direction) {
	var currDirection = this.getDirection();
	if(direction === currDirection) {
		return;		
	}

	var oldJson = JSON.stringify(this.toJson());

	var w = this.w;
	var h = this.h;
	var delta = (h - w)/2;
	this.left = this.left - delta;
	this.top = this.top + delta;

	var screenX = 0;
	var screenY = 0;
	var screenW = this.config.screenW;
	var screenH = this.config.screenH;

	if(currDirection === UIDevice.PORTRAIT) {
		this.top = 100;
		screenX = this.config.screenY;
		screenY = w - (this.config.screenX + this.config.screenW);
	}
	else {
		this.top = 0;
		screenY = this.config.screenX;
		screenX = h - (this.config.screenY + this.config.screenH);
	}

	this.w = h;
	this.h = w;
	this.config.screenX = screenX;
	this.config.screenY = screenY;
	this.config.screenW = screenH;
	this.config.screenH = screenW;

	var newJson = JSON.stringify(this.toJson());
	this.exec(new PropertyCommand(this, oldJson, newJson));

	return;
}

UIDevice.prototype.setName = function(name) {
	this.name = name;
	this.loadConfig();

	return;
}

UIDevice.prototype.beforePropertyChanged = function() {
	this.oldConfig = dupDeviceConfig(this.config);

	return;
}

UIDevice.prototype.afterPropertyChanged = function() {
	if(!isDeviceConfigEqual(this.oldConfig, this.config)) {
		this.notifyDeviceConfigChanged(this.oldConfig, this.config);
	}
	this.relayout();

	return;
}

UIDevice.prototype.onDeviceConfigChanged = function(oldConfig, newConfig) {
	this.relayoutChildren();

	return;
}

UIDevice.prototype.loadConfig = function() {
	var config = cantkGetDeviceConfig(this.name);

	if(!config) {
		config  = cantkGetDeviceConfig("iphone5");
	}

	if(config) {
		this.config = config;
	}

	return;
}

UIDevice.prototype.initUIDevice = function(type, w, h, name, bg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setName(name);
	this.loadConfig();
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.setUserResizable(false);
	this.rectSelectable = false;
	this.events = {};

	return this;
}

UIDevice.prototype.drawBgImage = function(canvas) {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);
	if(image) {
		var hw = this.h/this.w;
		var ihw = image.height/image.width;

		if((hw <= 1 && ihw <= 1) || (hw >= 1 && ihw >= 1)) {
			this.drawImageAt(canvas, image, this.images.display, 0, 0, this.w, this.h);
		}
		else {
			canvas.save();
			canvas.translate(this.h/2, this.h/2);
			canvas.rotate(-Math.PI/2);
			canvas.translate(-this.h/2, -this.h/2);
			this.drawImageAt(canvas, image, this.images.display, 0, 0, this.h, this.w);
			canvas.restore();
		}
	}

	return;
}

UIDevice.prototype.getScreen = function() {
	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		
		if(child.isUIScreen) {
			return child;
		}
	}

	return null;
}

UIDevice.prototype.enterPreview = function(previewCurrentWindow) {
	var app = this.getApp();
	var screen = this.getScreen();
	var windowManager = this.getWindowManager();
	if(!windowManager || !screen || !app) {
		return;
	}

	if(!windowManager.isInDesignMode()) {
		return;
	}

	var current = windowManager.getCurrent();

	app.saveTemp();
	app.clearCommandHistory();

	var button = this.findChildByName("button-preview", false);
	if(button) {
		button.setText(dappGetText("Edit"));
	}
	
	windowManager.saveState();
	this.setMode(Shape.MODE_PREVIEW);
	screen.setMode(Shape.MODE_PREVIEW, true);

	ResLoader.reset();
	app.loadUserScripts();
	windowManager.systemInit();

	windowManager.setInitWindow(null);
	if(previewCurrentWindow) {
		windowManager.setInitWindow(current);
	}

	return;
}

UIDevice.prototype.exitPreview = function() {
	var screen = this.getScreen();
	var windowManager = this.getWindowManager();
	if(!windowManager || !screen || !this.app) {
		return;
	}

	if(windowManager.mode != Shape.MODE_PREVIEW) {
		return;
	}

	var button = this.findChildByName("button-preview", false);
	if(button) {
		button.setText(dappGetText("Preview"));
	}

	if(this.app) {
		this.app.clearCommandHistory();
	}

	windowManager.systemExit();
	this.setMode(Shape.MODE_EDITING);
	screen.setMode(Shape.MODE_EDITING, true);
	windowManager.restoreState();
	windowManager.clearState();
	this.setSelected(true);
	UIElement.timeScale = 1;

	return;
}

UIDevice.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIDevice) {
		var json = shape.toJson();

		json.x = this.left;
		json.y = this.top;

		this.fromJson(json);
		this.relayoutChildren();

		if(this.app) {
			this.app.clearCommandHistory();
		}

		return false;
	}

	return (shape.isUIScreen && this.getScreen() === null);
}

UIDevice.prototype.relayoutChildren = function() {
	if(this.disableRelayout) {
		return;
	}

	var x = 0;
	var y = 0;
	var w = 0;
	var h = 0;

	var device = this;
	for(var i = 0; i < this.children.length; i++) {
		var shape = this.children[i];
		if(shape.isUIScreen) {
			x = this.config.screenX;
			y = this.config.screenY;
			w = this.config.screenW;
			h = this.config.screenH;
			
			shape.widthAttr = UIElement.WIDTH_FIX;
			shape.heightAttr = UIElement.HEIGHT_FIX;

			shape.setLeftTop(x, y);
			shape.setSize(w, h);
			shape.relayout();
		}
		else {
			shape.setVisible(false);
		}
	}

	return true;
}

UIDevice.prototype.afterSetView = function() {
	this.relayoutChildren();

	return;
}

UIDevice.prototype.getWindowManager = function() {
	var screen = this.getScreen();

	return screen ? screen.getWindowManager() : null;
}

UIDevice.prototype.paintSelfOnly =function(canvas) {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);

	if(!image) {
		canvas.beginPath();
		drawRoundRect(canvas, this.w, this.h, 40);
		canvas.fill();
		canvas.stroke();
	}

	return;
}

UIDevice.prototype.onKeyDownRunning = function(code) {
	var wm = this.getWindowManager();

	return wm.onKeyDownRunning(code);
}

UIDevice.prototype.onKeyUpRunning = function(code) {
	var wm = this.getWindowManager();

	if(code == KeyEvent.DOM_VK_P) {
		this.snapIt();
	}

	return wm.onKeyUpRunning(code);
}

UIDevice.prototype.snapIt = function() {
	var el = null;
	var snapDevice = cantkGetQueryParam("snap-device");
	var snapScreen = cantkGetQueryParam("snap-screen");

	if(snapDevice) {
		el = this;
	}

	if(snapScreen) {
		el = this.getWindowManager();
	}

	if(!el) {
		return;
	}

	var value = null;

	value = cantkGetQueryParam("width");
	var width = value ? parseInt(value) : el.w;

	value = cantkGetQueryParam("height");
	var height = value ? parseInt(value) : el.h;

	var tcanvas = cantkGetTempCanvas(width, height);
	var ctx = tcanvas.getContext("2d");

	var xscale = width/el.w;
	var yscale = height/el.h;

	ctx.save();
	ctx.scale(xscale, yscale);
	ctx.translate(-el.x, -el.y);
	el.paint(ctx);
	ctx.restore();

	window.open(tcanvas.toDataURL(), "_blank");

	return;
}

function UIDeviceCreator(name, version, w, h) {
	var args = ["ui-device", "ui-device", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIDevice();
		g.initUIDevice(this.type, w, h, name+version, null);

		return g;
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIDeviceCreator("android", "", 420, 700));

