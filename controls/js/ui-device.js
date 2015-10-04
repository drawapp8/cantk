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

UIDevice.prototype.deviceToJson = function(o) {
	o.config = this.config;

	return;
}

UIDevice.prototype.deviceFromJson = function(js) {
	if(js.config) {
		this.config = dupDeviceConfig(js.config);
	}

	return;
}

UIDevice.prototype.resize = function(w, h) {
	if(this.state === Shape.STAT_NORMAL) {
		this.realResize(w, h);
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
	this.x = this.x - delta;
	this.y = this.y + delta;

	var screenX = 0;
	var screenY = 0;
	var screenW = this.config.screenW;
	var screenH = this.config.screenH;

	if(currDirection === UIDevice.PORTRAIT) {
		this.y = 100;
		screenX = this.config.screenY;
		screenY = w - (this.config.screenX + this.config.screenW);
	}
	else {
		this.y = 0;
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
	this.regSerializer(this.deviceToJson, this.deviceFromJson);
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

	if(windowManager.mode != Shape.MODE_EDITING) {
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

		json.x = this.x;
		json.y = this.y;

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

			shape.setPosition(x, y);
			shape.setSize(w, h);
			shape.relayout();
		}

		if(shape.isUIButton) {
			shape.setMode(Shape.MODE_RUNNING);
			if(this.config.screenW > 400) {
				shape.x = this.config.screenX;
				shape.w = this.config.screenW / 4;
			}
			else {
				shape.x = 20;
				shape.w = (this.w-40)/4;
			}
			shape.style.setFontSize(shape.w < 100 ? 10 : 16);

			y = this.config.screenY - shape.h - 5;

			if(y < 0) {
				y += 10;
			}

			if(shape.name === "button-prev") {
				x = shape.x;
				shape.setText(dappGetText("Prev Window"));
				shape.onClick = function(point, beforeChild) {
					if(beforeChild) {
						return;
					}
					var windowManager = device.getWindowManager();
					if(windowManager.mode === Shape.MODE_PREVIEW) {
						device.exitPreview();	
					}
					if(windowManager) {
						windowManager.showPrevFrame();
					}

					return;
				}
			}
			
			if(shape.name === "button-next") {
				x = shape.x + shape.w;
				shape.setText(dappGetText("Next Window"));
				shape.onClick = function(point, beforeChild) {
					if(beforeChild) {
						return;
					}
					var windowManager = device.getWindowManager();
					if(windowManager.mode === Shape.MODE_PREVIEW) {
						device.exitPreview();	
					}
					if(windowManager) {
						windowManager.showNextFrame();
					}

					return;
				}
			}
			
			if(shape.name === "button-direction") {
				var direction = device.getDirection();
				var buttonText = (direction === UIDevice.PORTRAIT) ? "Landscape" : "Portrait";
				
				x = shape.x + shape.w * 2;
				shape.setText(dappGetText(buttonText));

				shape.onClick = function(point, beforeChild) {
					if(beforeChild) {
						return;
					}
					
					var windowManager = device.getWindowManager();
					if(windowManager.mode === Shape.MODE_PREVIEW) {
						device.exitPreview();	
					}
					
					var direction = device.getDirection();
					if(direction === UIDevice.PORTRAIT) {
						buttonText = "Portrait";
						device.setDirection(UIDevice.LANDSCAPE);
					}
					else {
						buttonText = "Landscape";
						device.setDirection(UIDevice.PORTRAIT);
					}
					this.setText(dappGetText(buttonText));

					return;
				}
			}
		
			if(shape.name === "button-preview") {
				shape.isInPreviewMode = false;
				x = shape.x + shape.w * 3;

				shape.setText(dappGetText("Preview"));
				shape.onClick = function(point, beforeChild) {
					if(beforeChild) {
						return;
					}

					this.isInPreviewMode = !this.isInPreviewMode;
					this.getApp().setPreviewMode(this.isInPreviewMode);

					if(this.isInPreviewMode) {
						device.enterPreview();						
					}
					else {
						device.exitPreview();	
					}

					return;
				}
			}
			
			if(shape.name === "button-status") {
				shape.h = 40;
				shape.w = this.config.screenW/2;	
				shape.style.setFontSize(shape.w < 100 ? 12 : 18);
				y = this.config.screenY - 2 * shape.h - 10;
				x = this.config.screenX + (this.config.screenW - shape.w)/2;
				this.statusButton = shape;
				this.statusButton.getLocaleText = function() {
					var windowManager = device.getWindowManager();
					return windowManager ? windowManager.getStatusString() : "";
				}
			}

			shape.setMode = function(mode, recursive) {
				this.mode = Shape.MODE_RUNNING;
			}
		}

		shape.setPosition(x, y);
		shape.setUserMovable(false);
		shape.setUserResizable(false);
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

