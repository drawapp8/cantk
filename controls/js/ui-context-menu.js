/*
 * File:   ui-context-menu.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Context Menu
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIContextMenu() {
	return;
}

UIContextMenu.prototype = new UIElement();
UIContextMenu.prototype.isUIMenu = true;
UIContextMenu.prototype.isUIContextMenu = true;

UIContextMenu.prototype.initUIContextMenu = function(type) {
	this.initUIElement(type);

	this.setMargin(5, 5);
	this.setDefSize(300, 80);
	this.setAlwaysOnTop(true);
	this.setTextType(Shape.TEXT_NONE);
	this.setHideWhenPointerUp(true);

	return this;
}

UIContextMenu.prototype.onModeChanged = function() {
	if(this.mode === Shape.MODE_EDITING) {
		this.setVisible(true);
	}
	else {
		this.setVisible(false);
	}

	return;
}

UIContextMenu.prototype.show = function(callerElement) {
	this.showDown = true;
	this.fromLeft =  true;

	this.callerElement = callerElement;
	if(callerElement) {
		if(callerElement == this.getParent()) {
			var p = this.getParent();
			if(this.y > p.h/2) {
				this.showDown = false;
			}
		}
		else {
			var y = this.y;
			var winH = this.getWindow().h;
			var pos = callerElement.getPositionInWindow();
			var offset = callerElement.getParent().offset;
			
			if(offset) {
				pos.y -= offset;
			}

			if((pos.y + callerElement.h + this.h) < winH) {
				y = pos.y + callerElement.h;
			}
			else {
				y = pos.y - this.h;
				this.showDown = false;
			}

			this.y = y;
		}
	}

	var animHint = this.showDown ? "anim-expand-down" : "anim-expand-up";
	
	this.animShow(animHint);
	this.getWindow().grab(this);

	return;
}

UIContextMenu.prototype.hide = function(animHint) {
	if(!this.visible) {
		return;
	}

	if(animHint) {
		animHint = this.showDown ? "anim-collapse-up" : "anim-collapse-down";
		this.animHide(animHint);
	}
	else {
		this.setVisible(false);
	}

	this.getWindow().ungrab(this);
	delete this.showDown;
	delete this.fromLeft;
	delete this.callerElement;

	return;
}

UIContextMenu.prototype.setHideWhenPointerUp = function(hideWhenPointerUp) {
	this.hideWhenPointerUp = hideWhenPointerUp;

	return;
}

UIContextMenu.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	var clickOutside = (!point) || (point.x > this.w || point.y > this.h);
	if(this.hideWhenPointerUp || clickOutside) {
		this.hide("default");
	}

	return;
}

UIContextMenu.prototype.paintSelfOnly =function(canvas) {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);

	if(!image) {
		canvas.fillRect(0, 0, this.w, this.h);
	}

	return;
}

UIContextMenu.prototype.afterChildAppended = function(shape) {
	shape.setUserMovable(false);
	shape.setUserResizable(false);

	return;
}

UIContextMenu.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIButton || shape.isUIGroup || shape.isUIImage || shape.isUILabel 
		|| shape.isUIViewPager || shape.isUILayout || shape.isUIImageView 
		|| shape.isUIGrid;
}

UIContextMenu.prototype.relayoutChildren = function() {
	var n = 0;
	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		if(!iter.visible) {
			continue;
		}

		n++;
	}

	if(this.disableRelayout || !n) {
		return;
	}

	var vMargin = this.getVMargin();
	var hMargin = this.getHMargin();
	var x = hMargin;
	var y = vMargin;
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	var vLayout = this.w < this.h;

	if(vLayout) {
		h = Math.floor(h/n);
	}
	else {
		w = Math.floor(w/n);
	}

	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		if(!iter.visible) {
			continue;
		}

		iter.x = x;
		iter.y = y;
		iter.w = w;
		iter.h = h;

		if(vLayout) {
			y = y + h;
		}
		else {
			x = x + w;
		}
		iter.relayoutChildren();
	}

	return;
}

function UIContextMenuCreator() {
	var args = ["ui-context-menu", "ui-context-menu", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIContextMenu();
		return g.initUIContextMenu(this.type);
	}
	
	return;
}

