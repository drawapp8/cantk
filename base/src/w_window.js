/*
 * File: window.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: window
 * 
 * Copyright (c) 2011 - 2015	Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016	Holaverse Inc.
 * 
 */
 
function WWindow() {
}

WWindow.prototype = new WWidget();
WWindow.prototype.init = function(manager, x, y, w, h) {
	this.type = this.type ? this.type : WWidget.TYPE_WINDOW;
	WWidget.prototype.init.call(this, null, x, y, w, h);
	
	this.grabWidget = null;
	this.manager = manager ? manager : WWindowManager.getInstance();

	var me = this;
	setTimeout(function() {
		me.manager.addWindow(me);
	}, 0);

	this.onClosed = null;
	this.closeHandler = null;
	this.pointerDownPosition = {x:0, y:0};
	this.pointerUpPosition = {x:0, y:0};
	this.pointerLastPosition = {x:0, y:0};

	return this;
}

WWindow.prototype.grab = function(widget) {
	this.grabWidget = widget;
	this.manager.grab(this);
	
	return this;
}

WWindow.prototype.ungrab = function() {
	this.grabWidget = null;
	this.manager.ungrab(this);
	
	return this;
}

WWindow.prototype.moveToCenter = function() {
	var view = cantkGetViewPort();
	var sw = Math.min(this.manager.w, view.width);
	var sh = Math.min(this.manager.h, view.height);
	
	var x = (sw - this.rect.w)/2;
	var y = (sh - this.rect.h)/2 + getScrollTop();

	this.rect.x = x;
	this.rect.y = y;
	
	return this;
}

WWindow.prototype.onPointerDown = function(point) {
	this.pointerDown = true;
	this.pointerDownPosition.x = point.x;
	this.pointerDownPosition.y = point.y;
	this.pointerLastPosition.x = point.x;
	this.pointerLastPosition.y = point.y;

	if(this.grabWidget) {
		this.grabWidget.onPointerDown(point);
	}
	else {
		WWidget.prototype.onPointerDown.call(this, point);
	}
	
	this.postRedraw();

	return;
}

WWindow.prototype.onPointerMove = function(point) {
	this.pointerLastPosition.x = point.x;
	this.pointerLastPosition.y = point.y;

	if(this.grabWidget) {
		this.grabWidget.onPointerMove(point);
	}
	else {
		WWidget.prototype.onPointerMove.call(this, point);
	}
	
	this.postRedraw();

	return;
}

WWindow.prototype.onPointerUp = function(point) {
	if(!this.pointerDown) {
//		return;
	}

	this.pointerUpPosition.x = point.x;
	this.pointerUpPosition.y = point.y;
	if(this.grabWidget) {
		this.grabWidget.onPointerUp(point);
	}
	else {
		WWidget.prototype.onPointerUp.call(this, point);
	}
	this.pointerDown = false;
	
	this.postRedraw();

	return;
}

WWindow.prototype.isClicked = function() {
	var dx = this.pointerLastPosition.x - this.pointerDownPosition.x;
	var dy = this.pointerLastPosition.y - this.pointerDownPosition.y;

	return Math.abs(dx) < 5 && Math.abs(dy) < 5;
}

WWindow.prototype.onContextMenu = function(point) {
	if(this.grabWidget) {
		this.grabWidget.onContextMenu(point);
	}
	else {
		WWidget.prototype.onContextMenu.call(this, point);
	}

	return;
}

WWindow.prototype.onKeyDown = function(code) {
	if(this.grabWidget) {
		 this.grabWidget.onKeyDown(code);
	}
	else {
		WWidget.prototype.onKeyDown.call(this, code);
	}

	return;
}

WWindow.prototype.onKeyUp = function(code) {
	if(this.grabWidget) {
		 this.grabWidget.onKeyUp(code);
	}
	else {
		WWidget.prototype.onKeyUp.call(this, code);
	}

	return;
}

WWindow.prototype.beforePaint = function(canvas) {
	canvas.beginPath();
	canvas.rect(0, 0, this.rect.w, this.rect.h);
	canvas.clip();
	canvas.beginPath();

	return;
}

WWindow.prototype.show = function(visible) {
	WWidget.prototype.show.call(this, visible);
	this.manager.setTopWindowAsTarget();
	
	return this;
}

WWindow.prototype.close = function(retInfo) {
	var me = this;
	setTimeout(function() {
		me.closeSync(retInfo);
	},10);

	return this;
}

WWindow.prototype.setCloseHandler = function(closeHandler) {
	this.closeHandler = closeHandler;

	return this;
}

WWindow.prototype.closeSync = function(retInfo) {
	if(this.onClosed) {
		this.onClosed(retInfo);
	}

	if(this.closeHandler) {
		this.closeHandler();
	}

	this.manager.ungrab(this);
	this.manager.removeWindow(this);
	this.destroy();

	return;
}

WWindow.prototype.getCanvas2D = function() {
	return WWindowManager.getInstance().getCanvas2D();
}

WWindow.prototype.getCanvas = function() {
	return WWindowManager.getInstance().getCanvas();
}

WWindow.create =  function(manager, x, y, w, h) {
	var win = new WWindow();

	return win.init(manager, x, y, w, h);
}
