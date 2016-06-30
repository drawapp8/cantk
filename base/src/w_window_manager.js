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

WWindowManager.create = function(app, canvas, eventElement) {
	WWindowManager.instance = new WWindowManager();
	WEventsManager.setEventsConsumer(WWindowManager.instance, eventElement);

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

WWindowManager.onMultiTouch = function(action, points, event) {
}

WWindowManager.prototype.onMultiTouch = function(action, points, event) {
	for(var i = 0; i < points.length; i++) {
		this.translatePoint(points[i]);
	}

	WWindowManager.onMultiTouch(action, points, event);
}

WWindowManager.prototype.preprocessEvent = function(type, e, arg) {
	this.currentEvent = e.originalEvent ? e.originalEvent : e;
	return true;
}

WWindowManager.prototype.getCanvas = function() {
	return this.canvas;
}

WWindowManager.prototype.getWidth = function() {
	return this.w;
}

WWindowManager.prototype.getHeight = function() {
	return this.h;
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
    this.translatePoint(point);
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

WWindowManager.setInputOffset = function(xInputOffset, yInputOffset) {	
	WWindowManager.xInputOffset = xInputOffset;
	WWindowManager.yInputOffset = yInputOffset;

	return;
}


WWindowManager.prototype.getInputScale = function() {	
	return {x:WWindowManager.xInputScale, y:WWindowManager.yInputScale};
}

WWindowManager.prototype.translatePoint = function(point) {	
	if(WWindowManager.xInputOffset) {
		point.x -= WWindowManager.xInputOffset;
	}
	
	if(WWindowManager.yInputOffset) {
		point.y -= WWindowManager.yInputOffset;
	}

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
		point.time = Date.now();
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
		point.time = Date.now();
		this.target.onPointerMove(point);
	}
	
	return;
}

WWindowManager.prototype.onPointerUp = function(point) {
	this.translatePoint(point);
	point = this.lastPointerPoint;
	this.target = this.findTargetWin(point);
	 
	if(this.target) {
		point.time = Date.now();
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
	this.postRedraw();

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

WWindowManager.prototype.setTopWindowAsTarget = function() {
	var windows = this.windows;
	var n = windows.length;

	this.target = null;
	for(var i = n - 1; i >= 0; i--) {
		var iter = windows[i];
		if(iter.visible) {
			this.target = iter;
			break;
		}
	}

	return this;
}

WWindowManager.prototype.addWindow = function(win) {
	this.dispatchPointerMoveOut();
	this.target = win;
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
	var fps = Math.round(1000  * this.drawCount / duration);

	if(duration > 1000) {
		this.drawCount = 0;
		this.startTime = Date.now();
	}

	return fps;
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

WWindowManager.prototype.onDrawFrame = function() {
	this.drawCount++;
	this.requestCount = 0;
	this.draw();

	return;
}

WWindowManager.prototype.postRedraw = function(rect) {
	if(!this.enablePaint) {
		return;
	}
	
	this.requestCount++;
	if(this.requestCount < 2) {
		requestAnimationFrame(this.onDrawFrame.bind(this));
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

	WWidget.hideTipsCanvas();
	var p = tipsWidget.getPositionInView();

	var win = tipsWidget.getWindow();
	if(win.canvas) {
		canvas = win.canvas.getContext("2d");
		var p = tipsWidget.getPositionInWindow();
		canvas.save();
		canvas.translate(p.x, p.y);
		canvas.beginPath();
		tipsWidget.drawTips(canvas);
		canvas.restore();
	}
	else {
		canvas.save();
		canvas.translate(p.x, p.y);
		canvas.beginPath();
		tipsWidget.drawTips(canvas);
		canvas.restore();
	}

	return;
}

WWindowManager.prototype.beforeDrawWindows = function(canvas) {}

WWindowManager.prototype.afterDrawWindows = function(canvas) {}

WWindowManager.prototype.drawWindows = function(canvas) {
    var nr = this.windows.length;
    this.beforeDrawWindows(canvas);
    for (var i = 0; i < nr; i++) {
        var win = this.windows[i];
        win.draw(canvas);
    }
    this.drawTips(canvas);
    this.afterDrawWindows(canvas);

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

//overwrite checkNeedRedraw to limit fps 
WWindowManager.prototype.checkNeedRedraw = function(timeStep) {
	return true;
}

WWindowManager.canvasContextName = "2d";
WWindowManager.setCanvasContextName = function(name) {
	WWindowManager.canvasContextName = name;
}

WWindowManager.prototype.getCanvas2D = function() {
	if(!this.ctx) {
		var ctx = this.canvas.getContext(WWindowManager.canvasContextName);

		if(!ctx) {
			ctx = this.canvas.getContext("2d");
			ctx["imageSmoothingEnabled"] = true;
		}

		if(!ctx.beginFrame) {
			ctx.beginFrame = function() {}
		}
		if(!ctx.endFrame) {
			ctx.endFrame = function() {}
		}
		if(!ctx.clipRect) {
			ctx.clipRect = function(x, y, w, h) {
				ctx.beginPath();
				ctx.rect(x, y, w, h);
				ctx.clip();
				ctx.beginPath();
			}
		}
		this.ctx = ctx;
	}

	return this.ctx;
}

WWindowManager.prototype.doDraw = function(ctx) {
	var now = Date.now();
	var timeStep = now - (this.lastUpdateTime || 0);

	if(!this.checkNeedRedraw(timeStep)) {
		return;
	}

	ctx.now = now;
	ctx.animating = 0;
	ctx.needRedraw = 0;
	ctx.timeStep = timeStep;
	ctx.lastUpdateTime = this.lastUpdateTime;
	WWindowManager.dispatchTimers(ctx.now);

	ctx.save();
	this.drawWindows(ctx);
	ctx.restore();

	if(this.shouldShowFPS) {
		var str = this.getFrameRate();
		var w = 100;
		var h = 30;
		ctx.beginPath();
		ctx.rect(0, 0, w, h);
		ctx.fillStyle = "Black";
		ctx.fill();
		
		ctx.save();
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = "20px Sans";
		ctx.fillStyle = "White";
		ctx.fillText(str, w >> 1, h >> 1);
		ctx.restore();
	}

	if(window.cantkRTV8 || this.maxFpsMode || ctx.needRedraw > 0) {
		this.postRedraw();
	}

	this.lastUpdateTime = ctx.now;
}

WWindowManager.prototype.draw = function() {
	var ctx = this.getCanvas2D();

	ctx.beginFrame();
	this.doDraw(ctx);
	ctx.endFrame();

	return;
}

WWindowManager.timerID = 1000;
WWindowManager.timerFuncs = [];
WWindowManager.intervalFuncs = [];

WWindowManager.dispatchTimers = function(t) {
	var arr = WWindowManager.timerFuncs;
	var n = arr.length;
	if(n > 0) {
		WWindowManager.timerFuncs = [];
		for(var i = 0; i < n; i++) {
			var info = arr[id];
			if(info.removed) continue;

			if(info.timeout <= t) {
				callback.call(window);
			}
			else {
				WWindowManager.timerFuncs.push(info);
			}
		}
	}

	arr = WWindowManager.intervalFuncs;
	n = arr.length;
	if(n > 0) {
		WWindowManager.intervalFuncs = [];
		for(var i = 0; i < n; i++) {
			var info = arr[id];
			if(info.removed) continue;

			if(info.timeout <= t) {
				callback.call(window);
				info.timeout = t + info.duration;
			}
			WWindowManager.timerFuncs.push(info);
		}
	}

	return;
}

WWindowManager.setTimeout = function(callback, duration) {
	if(!callback) return;

	var id = WWindowManager.timerID++;
	var info = {id:id, callback:callback};
	info.timeout = Date.now() + duration/1000;

	WWindowManager.timerFuncs.push(info);

	return id;
}

WWindowManager.setInterval = function(callback, duration) {
	if(!callback) return;

	var id = WWindowManager.timerID++;
	var info = {id:id, callback:callback};

	info.duration = duration/1000;
	info.timeout = Date.now() + info.duration;

	WWindowManager.intervalFuncs.push(info);

	return id;
}

WWindowManager.removeTimerInArr = function(arr, id) {
	var n = arr.length;
	for(var i = 0; i < n; i++) {
		var iter = arr[i];
		if(iter.id === id) {
			iter.removed = true;
			break;
		}
	}

	return;
}

WWindowManager.clearTimeout = function(id) {
	WWindowManager.removeTimerInArr(WWindowManager.timerFuncs, id);
}

WWindowManager.clearInterval = function(id) {
	WWindowManager.removeTimerInArr(WWindowManager.intervalFuncs, id);
}

