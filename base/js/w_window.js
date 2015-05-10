/*
 * File: window.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: window
 * 
 * Copyright (c) 2011 - 2015	Li XianJing <xianjimli@hotmail.com>
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
	this.manager.addWindow(this);

	return this;
}

WWindow.prototype.grab = function(widget) {
	 this.grabWidget = widget;
	 this.manager.grab(this);
}

WWindow.prototype.ungrab = function() {
	 this.grabWidget = null;
	 this.manager.ungrab(this);
}

WWindow.prototype.moveToCenter = function() {
	var view = cantkGetViewPort();
	var sw = Math.min(this.manager.w, view.width);
	var sh = Math.min(this.manager.h, view.height);
	
	var x = (sw - this.rect.w)/2;
	var y = (sh - this.rect.h)/2 + getScrollTop();

	this.rect.x = x;
	this.rect.y = y;
	
	return;
}

WWindow.prototype.onPointerDown = function(point) {
	this.pointerDown = true;

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
		return;
	}

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

WWindow.prototype.close = function(retInfo) {
	if(this.onClosed) {
		this.onClosed(retInfo);
	}

	this.manager.ungrab(this);
	this.manager.removeWindow(this);
	this.destroy();

	return;
}

WWindow.create =  function(manager, x, y, w, h) {
	var win = new WWindow();
	this.onClosed = null;

	return win.init(manager, x, y, w, h);
}
