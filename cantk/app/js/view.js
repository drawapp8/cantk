/*
 * File: view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief: view
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

function TView() {
}

TView.prototype = new WWidget();

TView.prototype.init = function(parent, x, y, w, h) {
	WWidget.prototype.init.call(this, parent, x, y, w, h);

	this.scale = 1;
	this.wmRect = {};
	this.lastPointerPosition = {x:0, y:0};
	this.pointerDownPosition = {x:0, y:0};

	return this;
}

TView.prototype.setDoc = function(doc) {
	this.doc = doc;

	return this;
}

TView.prototype.loadJson = function(json) {
	return this.doc.loadJson(json);
}

TView.prototype.loadString = function(str) {
	return this.doc.loadString(str);
}

TView.prototype.loadURL = function(url) {
	return this.doc.loadURL(url);
}

TView.prototype.getDeviceConfig = function() {
	return this.doc.getDeviceConfig();
}

TView.prototype.getWindowManager = function() {
	return this.doc.getWindowManager();
}

TView.prototype.getCurrentWindow = function() {
	return this.doc.getCurrentWindow();
}

TView.prototype.getMetaInfo = TView.prototype.getMeta = function() {
	return this.doc.getMeta();
}

TView.prototype.getMoveDeltaX = function() {
	return this.moveDeltaX;
}

TView.prototype.getMoveDeltaY = function() {
	return this.moveDeltaY;
}

TView.prototype.getMoveAbsDeltaX = function() {
	return this.moveAbsDeltaX;
}

TView.prototype.getMoveAbsDeltaY = function() {
	return this.moveAbsDeltaY;
}

TView.prototype.updateLastPointerPoint = function(point, pointerDown) {
	if(pointerDown) {
		this.pointerDownPosition.x = point.x;
		this.pointerDownPosition.y = point.y;
	}

	this.moveDeltaX = point.x - this.lastPointerPosition.x;
	this.moveDeltaY = point.y - this.lastPointerPosition.y;
	this.moveAbsDeltaX = point.x - this.pointerDownPosition.x;
	this.moveAbsDeltaY = point.y - this.pointerDownPosition.y;
	this.lastPointerPosition.x = point.x;
	this.lastPointerPosition.y = point.y;

	return;
}

TView.prototype.autoScale = function() {
	var wm = this.getWindowManager();

	if(!wm) return;
	
	var scale = 1;
	var w = this.getWidth();
	var h = this.getHeight();
	
	if(wm.w < wm.h) {
		scale = h/(wm.h+100);
	}
	else {
		scale = w/(wm.w+100);
	}

	if(scale > 1) {
		scale = 1;
	}

	this.zoomTo(scale);

	return;
}

TView.prototype.getScale = function() {
	return this.scale;
}

TView.prototype.onScaled = function(scale) {
	return;
}

TView.prototype.zoomTo = TView.prototype.setScale = function(scale) {

	this.scale = Math.min(2, Math.max(0.5, Math.round(scale * 10)/10));
	this.onScaled(this.scale);

	return this;
}

TView.prototype.zoomIn = function() {
	return this.zoomTo(this.scale * 1.2);
}

TView.prototype.zoomOut = function() {
	return this.zoomTo(this.scale * 0.8);
}

TView.prototype.getWmRect = function() {
	var r = this.wmRect;
	var wm = this.getWindowManager();
	if(wm) {
		var w = this.getWidth();
		var h = this.getHeight();
		r.w = wm.w * this.scale;
		r.h = wm.h * this.scale;
		r.x = (w - r.w) >> 1;
		r.y = (h - r.h) >> 1;
	}
	else {
		r.x = 0;
		r.y = 0;
		r.w = 0;
		r.h = 0;
	}

	return r;
}

TView.prototype.paintSelf = function(canvas) {
	var w = this.getWidth();
	var h = this.getHeight();

	canvas.save();
	canvas.beginPath();
	canvas.rect(0, 0, w, h);
	canvas.clip();
	canvas.beginPath();	

	var wm = this.getWindowManager();
	if(wm) {
		var r = this.getWmRect();	
		canvas.translate(r.x, r.y);
		canvas.scale(this.scale, this.scale);
		wm.setLeftTop(0, 0);
		wm.paintSelf(canvas);
	}
	canvas.restore();

	return;
}

TView.prototype.translatePointToWm = function(point) {
	var r = this.getWmRect();
	var pos = this.translatePoint(point);
	var p = {x:pos.x-r.x, y:pos.y-r.y};
			
	p.x = p.x/this.scale;
	p.y = p.y/this.scale;

	return p;
}

TView.prototype.translatePointToView = function(point) {
    var p = {x:point.x, y:point.y};
    
    var wm = this.getWindowManager();
    p.x += wm.getX();
    p.y += wm.getY();

    return p;
}

TView.prototype.onDoubleClick = function(point) {
	this.updateLastPointerPoint(point, true);

	WWidget.prototype.onDoubleClick.call(this, point);
	if(!this.target) {
		var wm = this.getWindowManager();
		if(wm) {
			var p = this.translatePointToWm(point);

			wm.onDoubleClick(p);
		}
	}

	return;
}

TView.prototype.onPointerDown = function(point) {
	this.updateLastPointerPoint(point, true);

	WWidget.prototype.onPointerDown.call(this, point);
	if(!this.target) {
		var wm = this.getWindowManager();
		if(wm) {
			var p = this.translatePointToWm(point);

			wm.onPointerDown(p);
		}
	}

	return;
}

TView.prototype.onPointerMove = function(point) {
	this.updateLastPointerPoint(point);
	WWidget.prototype.onPointerMove.call(this, point);
	if(!this.target) {
		var wm = this.getWindowManager();
		if(wm) {
			var p = this.translatePointToWm(point);
			wm.onPointerMove(p);
		}
	}

	return;
}

TView.prototype.onPointerUp = function(point) {
	WWidget.prototype.onPointerUp.call(this, point);
	if(!this.target) {
		var wm = this.getWindowManager();
		if(wm) {
			var p = this.translatePointToWm(point);
			wm.onPointerUp(p);
		}
	}

	return;
}

TView.prototype.onKeyDown = function(code) {
	WWidget.prototype.onKeyDown.call(this, code);
	if(!this.target) {
		var wm = this.getWindowManager();
		if(wm) {
			wm.onKeyDown(code);
		}
	}

	return;
}

TView.prototype.onKeyUp = function(code) {
	WWidget.prototype.onKeyUp.call(this, code);
	if(!this.target) {
		var wm = this.getWindowManager();
		if(wm) {
			wm.onKeyUp(code);
		}
	}

	return;
}

TView.prototype.detectDeviceConfig = function() {
	return this.doc.detectDeviceConfig();
}
