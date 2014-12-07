/*
 * File:   ui-fan-menu.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Fan Menu
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */
function UIFanMenu() {
	return;
}

UIFanMenu.prototype = new UIElement();
UIFanMenu.prototype.isUIMenu = true;
UIFanMenu.prototype.isUIFanMenu = true;

UIFanMenu.prototype.initUIFanMenu = function(type, w, h) {
	this.initUIElement(type);
	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);

	return this;
}

UIFanMenu.prototype.getOriginElement = function() {
	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		if(iter.name === "ui-origin") {
			return iter;
		}
	}

	if(this.children.length > 0) {
		return this.children[0];
	}

	return null;
}

UIFanMenu.prototype.onModeChanged = function() {
	if(this.mode === Shape.MODE_EDITING) {
		this.restoreState();
	}
	else {
		this.relayout();
		this.saveState();
		this.collapse();
	}

	return;
}

UIFanMenu.prototype.restoreState = function() {
	if(this.save) {
		this.x = this.save.x;
		this.y = this.save.y;
		this.w = this.save.w;
		this.h = this.save.h;
		
		for(var i = 0; i < this.children.length; i++) {
			var iter = this.children[i];
			if(iter.save) {
				iter.x = iter.save.x;
				iter.y = iter.save.y;
				iter.opacity = 1;
			}
			iter.setVisible(true);
		}

		this.setVisible(true);
	}

	return;
}

UIFanMenu.prototype.saveState = function() {
	var origin = this.getOriginElement();

	if(origin) {
		this.save = {};
		this.save.x = this.x;
		this.save.y = this.y;
		this.save.w = this.w;
		this.save.h = this.h;
		
		for(var i = 0; i < this.children.length; i++) {
			var iter = this.children[i];
			iter.save = {};
			iter.save.x = iter.x;
			iter.save.y = iter.y;
			iter.save.opacity = iter.opacity;
		}
	}

	return;
}

UIFanMenu.prototype.expand = function() {
	this.getWindow().grab(this);

	if(this.save) {
		this.x = this.save.x;
		this.y = this.save.y;
		this.w = this.save.w;
		this.h = this.save.h;
	}

	return;
}

UIFanMenu.prototype.collapse = function() {
	var origin = this.getOriginElement();
	this.getWindow().ungrab(this);

	if(origin) {
		this.x = this.x + origin.x;
		this.y = this.y + origin.y;
		this.w = origin.w;
		this.h = origin.h;
		
		for(var i = 0; i < this.children.length; i++) {
			var iter = this.children[i];
			iter.setVisible(false);
		}

		origin.x = 0;
		origin.y = 0;
		origin.setVisible(true);
		this.relayout();
	}

	this.collapsed = true;

	return;
}

UIFanMenu.prototype.show = function() {
}

UIFanMenu.prototype.hide = function() {
	this.collapse();

	return;
}

UIFanMenu.prototype.showOrHideMenu = function() {
	if(this.collapsed) {
		this.showMenu();
	}
	else {
		this.hideMenu();
	}
}

UIFanMenu.prototype.showMenu = function() {
	var origin = this.getOriginElement();

	if(!origin || !this.collapsed) {
		return;
	}

	this.expand();
	origin.x = origin.save.x;
	origin.y = origin.save.y;
	
	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		iter.setVisible(true);
	}
	this.relayout();

	var config = {};
	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		iter.setVisible(true);
		iter.save.x = iter.x;
		iter.save.y = iter.y;
		
		if(iter != origin) {
			iter.x = origin.x;
			iter.y = origin.y;

			config.xStart = origin.x;
			config.yStart = origin.y;
			config.xEnd = iter.save.x;
			config.yEnd = iter.save.y;
			config.scaleStart = 0.5;
			config.scaleEnd = 1;
			config.opacityStart = 0.1;
			config.opacityEnd = 1;
			config.delay = 0;
			config.duration = 1000;
			
			iter.animate(config);
		}
	}

	delete this.collapsed;

	return;
}

UIFanMenu.prototype.hideMenu = function() {

	var origin = this.getOriginElement();
	if(!origin || this.collapsed) {
		return;
	}

	var config = {};
	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		if(iter != origin) {
			config.xStart = iter.x;
			config.yStart = iter.y;
			config.xEnd = origin.x;
			config.yEnd = origin.y;
			config.opacityStart = 1;
			config.opacityEnd = 0.1;
			config.scaleStart = 1;
			config.scaleEnd = 0.5;
			config.delay = 0;
			config.duration = 1000;
			
			iter.animate(config);
		}
	}

	var menu = this;

	setTimeout(function() {
		menu.collapse();
	}, 200);

	return;
}

UIFanMenu.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	var origin = this.getOriginElement();
	if(origin !== this.targetShape) {
		if(this.targetShape) {
			this.hide();
		}
		else {
			this.animHide();
		}
	}

	return;
}

UIFanMenu.prototype.beforePaintChildren = function(canvas) {
	canvas.save();
	canvas.rect(0, 0, this.w, this.h);
	if(this.mode == Shape.MODE_EDITING) {
		canvas.fillStyle = this.style.lineColor;
		canvas.stroke();
	}
	canvas.clip();

	var origin = this.getOriginElement();
	if(origin) {
		var ox = origin.x + origin.w/2;
		var oy = origin.y + origin.w/2;
		canvas.strokeStyle = "Green";
		canvas.fillStyle = this.style.fillColor;
		var maxR = 0;
		for(var i = 0; i < this.children.length; i++) {
			var iter = this.children[i];
			if(iter != origin) {
				var dx = ox - (iter.x+iter.w/2);
				var dy = oy - (iter.y+iter.h/2);
				var r = Math.sqrt(dx * dx + dy * dy);

				if(r > maxR) {
					maxR = r;
				}

				if(this.mode === Shape.MODE_EDITING) {
					canvas.beginPath();
					canvas.arc(ox, oy,r,0,2*Math.PI);
					canvas.stroke();
				}
			}
		}
		
		if(this.mode != Shape.MODE_EDITING) {
			canvas.beginPath();
			canvas.globalAlpha = 0.2;
			canvas.arc(ox, oy,maxR,0,2*Math.PI);
			canvas.fill();	
		}
		else {
			canvas.fill();
		}
	}

	canvas.restore();

	return;
}

function UIFanMenuCreator() {
	var args = ["ui-fan-menu", "ui-fan-menu", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIFanMenu();
		return g.initUIFanMenu(this.type, 200, 200);
	}
	
	return;
}
