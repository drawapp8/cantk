/*
 * File:   ui-sliding-menu.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Sliding Menu
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UISlidingMenu() {
	return;
}

UISlidingMenu.prototype = new UIElement();
UISlidingMenu.prototype.isUISlidingMenu = true;

UISlidingMenu.prototype.initUISlidingMenu = function(type, w, h) {
	this.initUIElement(type);	

	this.offset = 0;
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.setCanRectSelectable(false, false);
	this.images.display = UIElement.IMAGE_DISPLAY_9PATCH;

	return this;
}

UISlidingMenu.prototype.onAppendedInParent = function() {
	var menu = this.getMenu();

	if(!menu) {
		return;
	}

	if(this.offset) {
		this.setOffset(menu.w);
	}
	else {
		this.setOffset(0);
	}

	return;
}

UISlidingMenu.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIPage && this.children.length < 2;
}

UISlidingMenu.prototype.afterChildAppended = function(shape) {
	shape.setUserMovable(false);

	if(this.children.length > 1 && this.mode == Shape.MODE_EDITING) {
		var menu = this.getMenu();
		this.setOffset(menu.w);
	}

	return;
}

UISlidingMenu.prototype.onDoubleClick = function(point, beforeChild) {
	if(beforeChild || this.mode != Shape.MODE_EDITING) {
		return;
	}

	if(this.offset) {
		this.hideMenu();
	}
	else {
		this.showMenu();
	}

	return;
}

UISlidingMenu.prototype.getMenu = function() {
	if(this.children.length > 0) {
		return this.children[0];
	}

	return null;
}

UISlidingMenu.prototype.getContent = function() {
	if(this.children.length >  1) {
		return this.children[1];
	}

	return null;
	
}

UISlidingMenu.prototype.showMenu = function() {
	var menu = this.getMenu();

	if(menu) {
		this.scrollTo(menu.w);
	}

	return;
}

UISlidingMenu.prototype.hideMenu = function() {
	var menu = this.getMenu();

	if(menu) {
		this.scrollTo(0);
	}

	return;
}

UISlidingMenu.prototype.relayoutChildren = function() {
	var menu = null;
	var content = null;
	var n = this.children.length;

	if(!n) {
		return;
	}

	if(n === 1) {
		menu = this.children[0];

		menu.y = 0;
		menu.x = 0;
		menu.h = this.h;
		menu.xAttr = UIElement.X_FIX_LEFT;
		menu.yAttr = UIElement.Y_FIX_TOP;
		menu.widthAttr = UIElement.WIDTH_SCALE;
		menu.heightAttr = UIElement.HEIGHT_FILL_PARENT;
		menu.relayout();
		
		return;
	}
	else {
		menu = this.children[0];
		content = this.children[1];

		var oldMenuW = menu.w;

		menu.y = 0;
		menu.h = this.h;
		menu.xAttr = UIElement.X_FIX_LEFT;
		menu.yAttr = UIElement.Y_FIX_TOP;
		menu.widthAttr = UIElement.WIDTH_SCALE;
		menu.heightAttr = UIElement.HEIGHT_FILL_PARENT;
		menu.relayout();
		
		if(oldMenuW === this.offset) {
			this.offset = menu.w;
		}

		var ratio = this.offset/menu.w;
		menu.x = -Math.round(0.5 * ((1-ratio) * menu.w));
	
		content.y = 0;
		content.x = this.offset;
		content.h = this.h;
		content.w = this.w;
		content.xAttr = UIElement.X_FIX_LEFT;
		content.widthAttr = UIElement.WIDTH_FIX;
		content.heightAttr = UIElement.HEIGHT_FILL_PARENT;

		menu.relayoutChildren();
		content.relayoutChildren();
	}

	return;
}

UISlidingMenu.prototype.getMinOffset = function() {
	return 0;
}

UISlidingMenu.prototype.getMaxOffset = function() {
	var menu = this.getMenu();

	return menu ? menu.w : 0;
}

UISlidingMenu.prototype.scrollTo = function(offsetEnd) {
	var me = this;
	var duration = 500;
	var offsetStart = this.offset;
	var range = offsetEnd - offsetStart;
	var startTime = (new Date()).getTime();
	var interpolator =  new DecelerateInterpolator();

	this.animating = true;
	function animStep() {
		var now = new Date();
		var timePercent = (now.getTime() - startTime)/duration;
		var percent = interpolator.get(timePercent);

		if(timePercent < 1) {
			me.setOffset(Math.floor(offsetStart + percent * range));
			setTimeout(animStep, 10);
		}
		else {
			me.setOffset(offsetStart + range);
			delete startTime;
			delete interpolator;
			delete me.animating;
		}

		delete now;
	}

	setTimeout(function() {
		animStep();
	}, 10);

	return;
}

UISlidingMenu.prototype.setOffset = function(offset) {
	var menu = this.getMenu();
	this.offset = offset;

	if(menu) {
		if(this.offset < 0) {
			this.offset = 0;
		}

		if(this.offset > menu.w) {
			this.offset = menu.w;
		}
	}

	this.relayoutChildren();
	this.postRedraw();

	return;
}

UISlidingMenu.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(beforeChild || this.animating) {
		return;
	}

	if(!this.velocityTracker) {
		this.velocityTracker = new VelocityTracker();
	}
	this.velocityTracker.clear();
	this.saveOffset = this.offset;

	return true;
}

UISlidingMenu.prototype.onPointerMoveRunning = function(point, beforeChild) {
	if(this.animating) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_HANDLED);
		return;
	}
	if(this.getLastEventStatus() == UIElement.EVENT_STATUS_HANDLED) {
		return;
	}
	if(beforeChild) {
		return;
	}
	this.setLastEventStatus(UIElement.EVENT_STATUS_HANDLED);
	
	this.addMovementForVelocityTracker();

	var dx = this.getMoveAbsDeltaX();
	var dy = this.getMoveAbsDeltaY();

	if(Math.abs(dx) > Math.abs(dy)) {
		this.setOffset(this.saveOffset + dx);
	}

	return;
}
	
UISlidingMenu.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(this.animating) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_HANDLED);
		return;
	}
	if(this.getLastEventStatus() == UIElement.EVENT_STATUS_HANDLED) {
		return;
	}
	if(beforeChild) {
		return;
	}
	this.setLastEventStatus(UIElement.EVENT_STATUS_HANDLED);

	var dx = this.getMoveAbsDeltaX();
	var dy = this.getMoveAbsDeltaY();

	if(Math.abs(dx) < Math.abs(dy)) {
		return;
	}

	var velocity = this.velocityTracker.getVelocity().x;
	var distance = dx + velocity/2;

	if(Math.abs(distance) < 10) {
		var menu = this.getMenu();
		if(this.offset > 10 && menu && (point.x > (menu.x + menu.w))) {
			this.hideMenu();
		}
		else {
			this.setOffset(this.saveOffset);
		}

		return;
	}

	var minOffset = this.getMinOffset();
	var maxOffset = this.getMaxOffset();
	var offset = this.saveOffset + dx + velocity;

	if(offset < minOffset) {
		offset = minOffset;
	}

	if(offset > maxOffset) {
		offset = maxOffset;
	}

	if(this.saveOffset > (minOffset + maxOffset)/2) {
		if(offset <= minOffset) {
			offset = minOffset;
		}
		else {
			offset = maxOffset;
		}
	}
	else {
		if(offset >= maxOffset) {
			offset = maxOffset;
		}
		else {
			offset = minOffset;
		}
	}

	this.scrollTo(offset);

	return;
}

UISlidingMenu.prototype.onInit = function() {
	if(this.offset) {
		var menu = this.getMenu();
		if(menu) {
			this.setOffset(menu.w);
		}
	}
	else {
		this.setOffset(0);
	}

	return;
}

UISlidingMenu.prototype.dispatchPointerDownToChildren = function(p) {
	var menu = this.getMenu();
	var content = this.getContent();

	var child = this.offset ? menu : content;

	if(menu && content && menu.x == content.x && menu.x == 0) {
		this.setOffset(0);
	}

	if(child && child.visible && child.onPointerDown(p)) {
		this.setTarget(child);

		return true;
	}

	return false;
}

UISlidingMenu.prototype.paintChildren = function(canvas) {
	canvas.save();	
	canvas.beginPath();
	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();
	canvas.beginPath();

	this.defaultPaintChildren(canvas);

	canvas.restore();

	return;
}

function UISlidingMenuCreator() {
	var args = ["ui-sliding-menu", "ui-sliding-menu", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISlidingMenu();

		return g.initUISlidingMenu(this.type, 200, 200);
	}
	
	return;
}

