/*
 * File: window_manager.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: window manager
 * 
 * Copyright (c) 2011 - 2014	Li XianJing <xianjimli@hotmail.com>
 * 
 */
  
function WindowManager(app, canvas) {
	this.app = app;
	this.canvas = canvas;
	
	this.w = canvas.width;
	this.h = canvas.height;
	
	this.last_point = 0;
	this.pointerDown = 0;
	this.target = null;
	this.requestCount = 0;
	this.windows = new Array();
	this.grabWindows = new Array();
	this.eventLogging = false;
	this.pointerDownPoint = {x:0, y:0};
	this.lastPointerPoint = {x:0, y:0};

	return;
}

WindowManager.prototype.getApp = function() {
	return this.app;
}

WindowManager.prototype.logEvent = function(type, e, arg) {
	var evt = {t:type};
	var date = new Date();
	var thisEventTime = date.getTime();
	var lastEvent = this.events.length > 0 ? this.events[this.events.length-1] : null;

	if(!this.pointerDown && lastEvent && type === C_EVT_POINTER_MOVE && lastEvent.t === C_EVT_POINTER_MOVE) {
		var dx = lastEvent.p.x - arg.x;
		var dy = lastEvent.p.y - arg.y;

		if(Math.abs(dx) < 5 && Math.abs(dy) < 5) {
			console.log("Skip move event");
			return;
		}
	}

	evt.tm = date.getTime() - thisEventTime;
	this.lastEventTime = thisEventTime;

	switch(type) {
		case C_EVT_POINTER_DOWN:	{
				console.log("Record: Mouse down:" + arg.x + " x " + arg.y);
		}
		case C_EVT_POINTER_UP: {
				console.log("Record: Mouse up:" + arg.x + " x " + arg.y);
		}
		case C_EVT_CONTEXT_MENU: 
		case C_EVT_POINTER_MOVE:
		case C_EVT_DOUBLE_CLICK: {
			evt.p = arg;
			break;
		}
		case C_EVT_KEY_DOWN: 
		case C_EVT_KEY_UP: {
			evt.c = arg;
			break;
		}
		default:break;
	}

	if(targetIsEditor(e)) {
		evt.other = true;
	}

	this.events.push(evt);
	
	return;
}

WindowManager.prototype.replayEvents = function(eventsJson) {
	if(eventsJson) {
		try {
			this.events = JSON.parse(eventsJson);
		}
		catch(e) {
			return;
		}
	}

	if(!this.events || this.events.length < 1) {
		return;
	}

	var self = this;
	this.replayIndex = 0;
	self.eventReplaying = true;

	console.log("replay events start.");

	function playNextEvent() {
		var evt = self.events[self.replayIndex];
		var type = evt.t;
		
		if(evt.other) {
			/*TODO*/
			if(type === C_EVT_KEY_DOWN) {
			}
			else if(type === C_EVT_KEY_UP) {
			}
		}
		else {
			switch(type) {
				case C_EVT_CONTEXT_MENU: {
					self.onContextMenu(evt.p);
					console.log("Inject: Mouse down:" + evt.p.x + " x " + evt.p.y);
					break;
				}
				case C_EVT_POINTER_DOWN: {
					self.onPointerDown(evt.p);
					console.log("Inject: Mouse down:" + evt.p.x + " x " + evt.p.y);
					break;
				}
				case C_EVT_POINTER_MOVE: {
					self.onPointerMove(evt.p);
					break;
				}
				case C_EVT_POINTER_UP: {
					self.onPointerUp(evt.p);
					console.log("Inject: Mouse up:" + evt.p.x + " x " + evt.p.y);
					break;
				}
				case C_EVT_DOUBLE_CLICK: {
					self.onDoubleClick(evt.p);
					break;
				}
				case C_EVT_KEY_DOWN: { 
					self.onKeyDown(evt.c);
					break;
				}
				case C_EVT_KEY_UP: {
					self.onKeyUp(evt.c);
					break;
				}
				default:break;
			}
		}

		self.replayIndex++;
		if(self.replayIndex < self.events.length) {
			evt = self.events[self.replayIndex];
			setTimeout(playNextEvent, evt.t);
		}
		else {
			self.eventReplaying = false;
			console.log("replay events end.");
		}
	}
	
	setTimeout(playNextEvent, 0);

	return;
}

WindowManager.prototype.preprocessEvent = function(type, e, arg) {
	this.currentEvent = e.originalEvent ? e.originalEvent : e;
	return true;
}

WindowManager.prototype.getCanvas2D = function() {
	return this.canvas.getContext("2d");
}

WindowManager.prototype.getCanvas = function() {
	return this.canvas;
}

WindowManager.prototype.findTargetWin = function(point) {
	 var target = null;
	 var nr = this.grabWindows.length;
	 
	 if(nr > 0) {
		  target = this.grabWindows[nr-1];
	 }
	 else {
		  nr = this.windows.length;
		  for(var i = nr-1; i >= 0; i--) {
				var win = this.windows[i];
				if(!win.visible || win.insensitive || !win.focusable) {
					 continue;
				}
				
				if(isPointInRect(point, win.rect)) {
					 target = win;
					 break;
				 }
		  }
	 }
		  
	 return target;
}
		
WindowManager.prototype.resize = function(w, h) {
	this.w = w;
	this.h = h;
	this.postRedraw();

	return;
}

WindowManager.prototype.grab = function(win) {
	 this.grabWindows.push(win);
	 
	 return;
}

WindowManager.prototype.ungrab = function(win) {
	 this.grabWindows.remove(win);
	 
	 return;
}

WindowManager.prototype.onDoubleClick = function(point) {	
	 this.target = this.findTargetWin(point);
	 
	if(this.target) {
		 this.target.onDoubleClick(point);
	 }
	 else {
		 console.log("Window Manager: no target for x=" + point.x + " y=" + point.y);
	 }
	 
	return;
}

WindowManager.prototype.onLongPress = function(point) {	
	 this.target = this.findTargetWin(point);
	 
	if(this.target) {
		 this.target.onLongPress(point);
	 }
	 else {
		 console.log("Window Manager: no target for x=" + point.x + " y=" + point.y);
	 }
	 
	return;
}

WindowManager.prototype.onGesture = function(gesture) {	
	cantkHideAllInput();

	var point = {x:this.w/2, y:this.h/2};
	this.target = this.findTargetWin(point);

	if(this.target) {
		this.target.onGesture(gesture);
		console.log("WindowManager.prototype.onGesture: scale=" + gesture.scale + " rotation=" + gesture.rotation);
	}
	else {
		 console.log("Window Manager: no target for x=" + point.x + " y=" + point.y);
	}
	 
	return;
}

WindowManager.setInputScale = function(xInputScale, yInputScale) {	
	WindowManager.xInputScale = xInputScale;
	WindowManager.yInputScale = yInputScale;

	return;
}

WindowManager.prototype.translatePoint = function(point) {	
	if(WindowManager.xInputScale) {
		point.x = Math.round(point.x * WindowManager.xInputScale);
	}

	if(WindowManager.yInputScale) {
		point.y = Math.round(point.y * WindowManager.yInputScale);
	}

	return point;
}

WindowManager.prototype.onPointerDown = function(point) {	
	cantkHideAllInput();

	this.translatePoint(point);
	this.target = this.findTargetWin(point);

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

WindowManager.prototype.onPointerMove = function(point) {
	this.translatePoint(point);
	this.target = this.findTargetWin(point);
	  
	this.lastPointerPoint.x = point.x;
	this.lastPointerPoint.y = point.y;
	if(this.target) {
		 this.target.onPointerMove(point);
	 }
	
	return;
}

WindowManager.prototype.onPointerUp = function(point) {
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

WindowManager.prototype.getLastPointerPoint = function() {
	return this.lastPointerPoint;
}

WindowManager.prototype.isPointerDown= function() {
	return this.pointerDown;
}

WindowManager.prototype.isClicked = function() {
	var dx = Math.abs(this.lastPointerPoint.x - this.pointerDownPoint.x);
	var dy = Math.abs(this.lastPointerPoint.y - this.pointerDownPoint.y);

	return (dx < 10 && dy < 10);
}

WindowManager.prototype.isCtrlDown = function() {
	return this.currentEvent && (this.currentEvent.ctrlKey || this.ctrlDown);
}

WindowManager.prototype.isAltDown = function() {
	return this.currentEvent && (this.currentEvent.altKey || this.altDown);
}

WindowManager.prototype.onContextMenu = function(point) {
	 this.target = this.findTargetWin(point);
	 
	if(this.target) {
		 this.target.onContextMenu(point);
	 }
	 else {
		  console.log("Window Manager: no target for x=" + point.x + " y=" + point.y);
	 }
	
	return;
}

WindowManager.prototype.onKeyDown = function(code) {
	if(!this.target) {
		this.target = this.findTargetWin({x:50, y:50});
		console.log("onKeyDown: findTargetWin=" + this.target);
	}

	switch(code) {
		case KeyEvent.DOM_VK_SHIFT: {
			this.shitfDown = true; 
			break;
		}
		case KeyEvent.DOM_VK_CONTROL:  {
			this.ctrlDown = true;
			break;
		}
		case KeyEvent.DOM_VK_ALT: {
			this.altDown = true;
			break;
		}
		default: {
			if(this.target !== null) {
				 this.target.onKeyDown(code);
			}
		}
	}
			
	return;
}

WindowManager.prototype.onKeyUp = function(code) {
	switch(code) {
		case KeyEvent.DOM_VK_SHIFT: {
			this.shitfDown = false; 
			break;
		}
		case KeyEvent.DOM_VK_CONTROL:  {
			this.ctrlDown = false;
			break;
		}
		case KeyEvent.DOM_VK_ALT: {
			this.altDown = false;
			break;
		}
		default: {
			if(this.target !== null) {
		 		this.target.onKeyUp(code);
			}
		}
	}
	
	return;
}

WindowManager.prototype.addWindow = function(win) {
	this.windows.push(win);
	
	return;
}

WindowManager.prototype.removeWindow = function(win) {
	this.windows.remove(win);
	console.log("remove nr=" + this.windows.length);
	this.postRedraw();
	
	return;
}

WindowManager.prototype.postRedraw = function(rect) {
	this.requestCount++;

	var manager = this;
	function redrawAll() {
		manager.requestCount = 0;
		manager.draw();
	}

	if(this.requestCount < 2) {
		requestAnimFrame(redrawAll);
	}

	return;
}

WindowManager.prototype.drawWindows = function(canvas) {
	var nr = this.windows.length;
	for(var i = 0; i < nr; i++) {
		var win = this.windows[i];
		win.draw(canvas);
	}

	return;
}

WindowManager.prototype.redrawRect = function(rect) {
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
 
WindowManager.prototype.draw = function() {
	var canvas = this.getCanvas2D();
	
	canvas.save();
	this.drawWindows(canvas);
	canvas.restore();
	
	return;
}

 
