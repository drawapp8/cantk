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

		child.x = 0;
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
				child.y = 0;
				child.x = 0;
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

function UIScreenCreator(w, h) {
	var args = ["ui-screen", "ui-screen", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIScreen();
		return g.initUIScreen(this.type, w, h);
	}
	
	return;
}

