/*
 * File: window_manager.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: window manager
 * 
 * Copyright (c) 2011 - 2015	Li XianJing <xianjimli@hotmail.com>
 * 
 */
  
function WWindowManager() {
	return;
}

WWindowManager.create = function(app, canvas) {
	WWindowManager.instance = new WWindowManager();

	return WWindowManager.instance.init(app, canvas);
}

WWindowManager.getInstance = function() {
	return WWindowManager.instance;
}

WWindowManager.prototype.init = function(app, canvas) {
	this.app = app;
	this.canvas = canvas;
	
	this.w = canvas.width;
	this.h = canvas.height;
	
	this.last_point = 0;
	this.pointerDown = 0;
	this.target = null;
	this.drawCount = 0;
	this.requestCount = 0;
	this.startTime = Date.now();
	this.windows = new Array();
	this.grabWindows = new Array();
	this.eventLogging = false;
	this.pointerDownPoint = {x:0, y:0};
	this.lastPointerPoint = {x:0, y:0};
	this.enablePaint = true;
	this.beforeDrawHandlers = [];

	return this;
}

WWindowManager.prototype.getApp = function() {
	return this.app;
}

WWindowManager.prototype.preprocessEvent = function(type, e, arg) {
	this.currentEvent = e.originalEvent ? e.originalEvent : e;
	return true;
}

WWindowManager.prototype.getCanvas2D = function() {
	var ctx = this.canvas.getContext("2d");

	ctx["imageSmoothingEnabled"] = true;
	ctx["webkitImageSmoothingEnabled"] = true;
	ctx["mozImageSmoothingEnabled"] = true;
	ctx["msImageSmoothingEnabled"] = true;

	return ctx;
}

WWindowManager.prototype.getCanvas = function() {
	return this.canvas;
}

WWindowManager.prototype.getWidth = function() {
	return this.canvas.width;
}

WWindowManager.prototype.getHeight = function() {
	return this.canvas.height;
}

WWindowManager.prototype.findTargetWin = function(point) {
	 var target = null;
	 var nr = this.grabWindows.length;
	 
	 if(nr > 0) {
	  	for(var i = nr-1; i >= 0; i--) {
		  target = this.grabWindows[i];
		  if(!target.visible) {
		  	continue;
		  }

		  return target;
	 	}
	 }
	  
	  nr = this.windows.length;
	  for(var i = nr-1; i >= 0; i--) {
			var win = this.windows[i];
			if(!win.visible) {
				 continue;
			}
			
			if(isPointInRect(point, win.rect)) {
				 target = win;
				 break;
			 }
	  }
		  
	 return target;
}
		
WWindowManager.prototype.resize = function(w, h) {
	this.w = w;
	this.h = h;
	this.postRedraw();

	return;
}

WWindowManager.prototype.grab = function(win) {
	 this.grabWindows.push(win);
	 
	 return;
}

WWindowManager.prototype.ungrab = function(win) {
	 this.grabWindows.remove(win);
	 
	 return;
}

WWindowManager.prototype.onDoubleClick = function(point) {	
	 this.target = this.findTargetWin(point);
	 
	if(this.target) {
		 this.target.onDoubleClick(point);
	 }
	 else {
		 console.log("Window Manager: no target for x=" + point.x + " y=" + point.y);
	 }
	 
	return;
}

WWindowManager.prototype.onLongPress = function(point) {	
	 this.target = this.findTargetWin(point);
	 
	if(this.target) {
		 this.target.onLongPress(point);
	 }
	 else {
		 console.log("Window Manager: no target for x=" + point.x + " y=" + point.y);
	 }
	 
	return;
}

WWindowManager.prototype.onGesture = function(gesture) {	
	cantkHideAllInput();

	var point = {x:this.w/2, y:this.h/2};
	this.target = this.findTargetWin(point);

	if(this.target) {
		this.target.onGesture(gesture);
		console.log("WWindowManager.prototype.onGesture: scale=" + gesture.scale + " rotation=" + gesture.rotation);
	}
	else {
		 console.log("Window Manager: no target for x=" + point.x + " y=" + point.y);
	}
	 
	return;
}

WWindowManager.setInputScale = function(xInputScale, yInputScale) {	
	WWindowManager.xInputScale = xInputScale;
	WWindowManager.yInputScale = yInputScale;

	return;
}

WWindowManager.prototype.translatePoint = function(point) {	
	if(WWindowManager.xInputScale) {
		point.x = Math.round(point.x * WWindowManager.xInputScale);
	}

	if(WWindowManager.yInputScale) {
		point.y = Math.round(point.y * WWindowManager.yInputScale);
	}

	return point;
}

WWindowManager.prototype.onPointerDown = function(point) {	
	cantkHideAllInput();

	this.translatePoint(point);
	this.target = this.findTargetWin(point);

	for(var i = 0; i < this.windows.length; i++) {
		var win = this.windows[i];
		if(win.state === WWidget.STATE_SELECTED && win !== this.target) {
			win.setState(WWidget.STATE_NORMAL);
		}
	}

	this.pointerDown = true;
	this.pointerDownPoint.x = point.x;
	this.pointerDownPoint.y = point.y;
	this.lastPointerPoint.x = point.x;
	this.lastPointerPoint.y = point.y;

	if(this.target) {
		 this.target.onPointerDown(point);
	 }
	 else {
		 console.log("Window Manager: no target for x=" + point.x + " y=" + point.y);
	 }
	 
	return;
}

WWindowManager.prototype.onPointerMove = function(point) {
	this.translatePoint(point);
	var target = this.findTargetWin(point);
	  
	this.lastPointerPoint.x = point.x;
	this.lastPointerPoint.y = point.y;

	if(this.target && target != this.target) {
		 this.target.onPointerMove(point);
	}
	this.target = target;
	if(this.target) {
		 this.target.onPointerMove(point);
	}
	
	return;
}

WWindowManager.prototype.onPointerUp = function(point) {
	this.translatePoint(point);
	point = this.lastPointerPoint;
	this.target = this.findTargetWin(point);
	 
	if(this.target) {
		 this.target.onPointerUp(point);
	 }
	 else {
		  console.log("Window Manager: no target for x=" + point.x + " y=" + point.y);
	 }
	this.pointerDown = false;
	
	return;
}

WWindowManager.prototype.getLastPointerPoint = function() {
	return this.lastPointerPoint;
}

WWindowManager.prototype.isPointerDown= function() {
	return this.pointerDown;
}

WWindowManager.prototype.isClicked = function() {
	var dx = Math.abs(this.lastPointerPoint.x - this.pointerDownPoint.x);
	var dy = Math.abs(this.lastPointerPoint.y - this.pointerDownPoint.y);

	return (dx < 10 && dy < 10);
}

WWindowManager.prototype.isCtrlDown = function() {
	return this.currentEvent && this.currentEvent.ctrlKey;
}

WWindowManager.prototype.isAltDown = function() {
	return this.currentEvent && this.currentEvent.altKey;
}

WWindowManager.prototype.onContextMenu = function(point) {
	 this.target = this.findTargetWin(point);
	 
	if(this.target) {
		 this.target.onContextMenu(point);
	 }
	 else {
		  console.log("Window Manager: no target for x=" + point.x + " y=" + point.y);
	 }
	
	return;
}

WWindowManager.prototype.onKeyDown = function(code) {
	if(!this.target) {
		this.target = this.findTargetWin({x:50, y:50});
		console.log("onKeyDown: findTargetWin=" + this.target);
	}

	if(this.target !== null) {
		 this.target.onKeyDown(code);
	}
			
	return;
}

WWindowManager.prototype.onKeyUp = function(code) {
	if(this.target !== null) {
		this.target.onKeyUp(code);
	}
	
	return;
}

WWindowManager.prototype.onWheel = function(delta) {
	if(!this.target) {
		this.target = this.findTargetWin({x:50, y:50});
		console.log("onWheel : findTargetWin=" + this.target);
	}

	if(this.target !== null) {
		 return this.target.onWheel(delta);
	}
			
	return false;
}

WWindowManager.prototype.dispatchPointerMoveOut = function() {
	this.onPointerMove({x:-1, y:-1});
	this.target = null;

	return this;
}

WWindowManager.prototype.addWindow = function(win) {
	this.dispatchPointerMoveOut();
	this.windows.push(win);
	this.postRedraw();

	return;
}

WWindowManager.prototype.removeWindow = function(win) {
	this.ungrab(win);
	if(this.target === win) {
		this.target = null;
	}
	this.windows.remove(win);
	this.postRedraw();
	
	return;
}

WWindowManager.prototype.getFrameRate = function() {
	var duration = Date.now() - this.startTime;

	return Math.round(1000  * this.drawCount / duration);
}

WWindowManager.prototype.setMaxFPSMode = function(maxFpsMode) {
	this.maxFpsMode = maxFpsMode;

	return this;
}

WWindowManager.prototype.showFPS = function(shouldShowFPS) {
	this.drawCount = 1;
	this.startTime = Date.now();
	this.shouldShowFPS = shouldShowFPS;

	return this;
}

WWindowManager.prototype.getPaintEnable = function() {
	return this.enablePaint;
}

WWindowManager.prototype.setPaintEnable = function(enablePaint) {
	this.enablePaint = enablePaint;
	console.log("setPaintEnable:" + enablePaint);

	if(enablePaint) {
		this.postRedraw();
	}

	return this;
}

WWindowManager.onDraw = function() {
	var manager = WWindowManager.getInstance();

	manager.drawCount++;
	manager.requestCount = 0;
	manager.draw();

	return;
}

WWindowManager.prototype.postRedraw = function(rect) {
	if(!this.enablePaint) {
		return;
	}
	
	this.requestCount++;
	if(this.requestCount < 2) {
		requestAnimFrame(WWindowManager.onDraw);
	}

	return;
}

WWindowManager.prototype.setTipsWidget = function(widget) {
	this.tipsWidget = widget;

	return;
}

WWindowManager.prototype.drawTips = function(canvas) {
	var tipsWidget = this.tipsWidget;
	if(!tipsWidget || !tipsWidget.parent) return;

	var p = tipsWidget.getPositionInView();

	canvas.save();
	canvas.translate(p.x, p.y);
	tipsWidget.drawTips(canvas);
	canvas.restore();

	return;
}

WWindowManager.prototype.drawWindows = function(canvas) {
	var nr = this.windows.length;
	for(var i = 0; i < nr; i++) {
		var win = this.windows[i];
		win.draw(canvas);
	}
	this.drawTips(canvas);

	return;
}

WWindowManager.prototype.redrawRect = function(rect) {
	var canvas = this.getCanvas2D();
	canvas.save();
	if(rect) {
		canvas.beginPath();
		canvas.rect(rect.x, rect.y, rect.w, rect.h);
		canvas.clip();
	}
	this.drawWindows(canvas);
	canvas.restore();

	return;
}
 
WWindowManager.prototype.addBeforeDrawHandler = function(func) {
	var handlers = this.beforeDrawHandlers;
	for(var i = 0; i < handlers.length; i++) {
		var iter = handlers[i];
		if(iter === func) {
			return this;
		}
	}

	if(func) {
		handlers.push(func);
	}
	console.log("WWindowManager.prototype.addBeforeDrawHandler n=" + this.beforeDrawHandlers.length);

	return this;
}

WWindowManager.prototype.removeBeforeDrawHandler = function(func) {
	var handlers = this.beforeDrawHandlers;
	for(var i = 0; i < handlers.length; i++) {
		var iter = handlers[i];
		if(iter === func) {
			handlers.splice(i, 1);
			return this;
		}
	}

	console.log("WWindowManager.prototype.addBeforeDrawHandler n=" + this.beforeDrawHandlers.length);

	return this;
}

WWindowManager.prototype.callBeforeDrawHandlers = function(canvas) {
	var handlers = this.beforeDrawHandlers;
	for(var i = 0; i < handlers.length; i++) {
		var iter = handlers[i];
		iter(canvas);
	}

	return this;
}

WWindowManager.prototype.draw = function() {
	var canvas = this.getCanvas2D();

	canvas.animating = 0;
	canvas.needRedraw = 0;
	canvas.now = Date.now();
	canvas.lastUpdateTime = this.lastUpdateTime;
	canvas.timeStep = canvas.now - (canvas.lastUpdateTime || 0);

	this.callBeforeDrawHandlers(canvas);

	canvas.save();
	this.drawWindows(canvas);
	canvas.restore();

	if(this.shouldShowFPS) {
		var str = "fps:" + this.getFrameRate();
		canvas.save();
		canvas.textAlign = "left";
		canvas.textBaseline = "top";
		canvas.font = "20px Sans";
		canvas.fillStyle = "Green";
		canvas.fillText(str, 10, 10);
		canvas.restore();
	}

	if(window.cantkRTV8 || this.maxFpsMode || canvas.needRedraw > 0) {
		this.postRedraw();
	}

	this.canvas.flush();
	this.lastUpdateTime = canvas.now;

	return;
}

 
