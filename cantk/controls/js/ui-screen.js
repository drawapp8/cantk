/*
 * File: ui-screen.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: Screen 
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIScreen() {
	return;
}

UIScreen.prototype = new UIElement();
UIScreen.prototype.isUIScreen = true;

UIScreen.prototype.initUIScreen = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	
	return this;
}

UIScreen.prototype.getWindowManager = function() {
	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		
		if(child.isUIWindowManager) {
			return child;
		}
	}

	return;
}

UIScreen.prototype.shapeCanBeChild = function(shape) {
	if(!shape.isUIStatusBar && !shape.isUIWindowManager) {
		return false;
	}

	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		if(child.type === shape.type) {
			return false;
		}
	}

	return true;
}

UIScreen.prototype.beforeRelayoutChild = function(shape) {
	this.relayoutChildren();

	return false;
}

UIScreen.prototype.relayoutChildren = function() {
	if(this.disableRelayout) {
		return;
	}

	var x = 0;
	var y = 0;
	var h = 0;
	var w = this.w;
	var menuBar = null;
	var statusBar = null;
	var windowManager = null;

	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];

		child.left = 0;
		child.w = w;
		child.setUserMovable(false);
		child.setUserResizable(false);
		child.widthAttr = UIElement.WIDTH_FILL_PARENT;

		if(child.type === "ui-status-bar") {
			statusBar = child;
			if(child.h > this.h/4) {
				child.h = this.h/4;
			}
			child.move(0, 0);
			child.relayout();
			continue;
		}

		if(child.type === "ui-menu-bar") {
			var config = this.getDeviceConfig();
			var visible = config && config.hasMenuBar && this.h > this.w;

			if(visible) {
				menuBar = child;
				if(child.h > this.h/4) {
					child.h = this.h/4;
				}
				child.move(0, this.h - child.h);
				child.relayout();
			}
			else {
				child.top = 0;
				child.left = 0;
			}
			child.setVisible(visible);
			child.setEnable(visible);
			continue;
		}

		if(child.isUIWindowManager) {
			windowManager = child;
			continue;
		}
	}

	h = this.h;
	if(windowManager) {
		if(statusBar) {
			y = statusBar.h;
			h = h - statusBar.h;
		}

		if(menuBar) {
			h = h - menuBar.h;
		}

		windowManager.h = h;
		windowManager.relayout();
	}

	return;
}

UIScreen.drawRuler = function(canvas, w, h, rotateText) {
	var y = 0;
	var len = 0;
	canvas.beginPath();
	for(var x = 10; x < w; x += 10) {
		if(x%100 === 0) {
			len = 12;
		}
		else if(x%50 === 0) {
			len = 8;
		}
		else {
			len = 5;
		}

		canvas.moveTo(x, 0);
		canvas.lineTo(x, len);
		canvas.moveTo(x, h);
		canvas.lineTo(x, h-len);
		if(len > 5) {
			canvas.textBaseline = "center"
			canvas.textAlign = "center";
			y = -6;
			canvas.fillText(x.toString(), x, y);
			y = h + 8;
			if(rotateText) {
				canvas.save();
				canvas.translate(x, y);
				canvas.rotate(Math.PI);
				canvas.translate(-x, -y);
				canvas.fillText(x.toString(), x, y);
				canvas.restore();
			}
			else {
				y = -6;
				y = h + 14;
				canvas.fillText(x.toString(), x, y);
			}
		}
	}
	canvas.stroke();

	return;
}

UIScreen.prototype.drawRulers = function(canvas) {
	if(!this.isInDesignMode()) {
		return;
	}

	canvas.translate(this.left, this.top);
	canvas.lineWidth = 1;
	canvas.fillStyle = "#101010";
	canvas.strokeStyle = "#101010";
	canvas.font = "10px sans"

	var cx = this.w >> 1;
	var cy = this.h >> 1;
	UIScreen.drawRuler(canvas, this.w, this.h);

	canvas.translate(cx, cy);
	canvas.rotate(0.5 * Math.PI);
	canvas.translate(-cy, -cx);
	UIScreen.drawRuler(canvas, this.h, this.w, true);

	return;
}

UIScreen.prototype.paintSelf = function(canvas) {
	canvas.save();
	canvas.beginPath();
	canvas.rect(this.left, this.top, this.w, this.h);
	canvas.clip();
	canvas.beginPath();
	UIElement.prototype.paintSelf.call(this, canvas);
	canvas.restore();
	
	canvas.save();
	this.drawRulers(canvas);
	canvas.restore();

	return; 
}


function UIScreenCreator(w, h) {
	var args = ["ui-screen", "ui-screen", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIScreen();
		return g.initUIScreen(this.type, w, h);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIScreenCreator(640, 960));

