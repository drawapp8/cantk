/*
 * File: widget.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: widget is base class of all ui element.
 * 
 * Copyright (c) 2011 - 2015	Li XianJing <xianjimli@hotmail.com>
 * 
 */
 
function Widget(parent, x, y, w, h) {
	this.id    = 0;
	this.text  = "";
	this.enable = 1;
	this.visible = false; 
	this.listener = 0;
	this.focusable = 1;
	this.insensitive = 0;
	this.parent = parent;
	this.rect = new Rect(x, y, w, h);
	this.state = Widget.STATE_NORMAL;
	this.point = new Point(0, 0);	
	this.children = new Array();
	this.theme = CanTkTheme.get(this.type);
	this.lastPointerPoint = new Point(0, 0);
	this.pointerDownPoint = new Point(0, 0);

	if(this.parent !== null) {
		parent.appendChild(this);
	}

	this.useTheme = function(type) {
		var theme = CanTkTheme.get(type, true);

		if(theme) {
			this.theme = theme;
		}
		else {
			console.log("not found: " + type);
		}

		return;
	}

	this.setNeedRelayout = function(value) {
		this.needRelayout = value;

		return;
	}

	this.onAppendChild = function(child) {
	}

	this.appendChild = function(child) {
		child.parent = this;
		this.children.push(child);
		this.onAppendChild(child);

		return;
	}
	
	this.getManager = function() {
		return this.getTopWindow().manager;
	}
	
	this.getFrameRate = function() {
		return this.getManager().getFrameRate();
	}
	
	this.showFPS = function(maxFpsMode) {
		return this.getManager().showFPS(maxFpsMode);
	}

	this.isPointerDown = function() {
		return this.getManager().isPointerDown();
	}
	
	this.isClicked = function() {
		return this.getManager().isClicked();
	}
	
	this.isAltDown = function() {
		return this.getManager().isAltDown();
	}

	this.isCtrlDown = function() {
		return this.getManager().isCtrlDown();
	}
	
	this.getApp = function() {
		return this.getManager().getApp();
	}
	
	this.getCanvas2D = function() {
		return this.getManager().getCanvas2D();
	}
	
	this.getCanvas = function() {
		return this.getManager().getCanvas();
	}

	this.getLastPointerPoint = function() {
		return this.getManager().getLastPointerPoint();
	}

	this.getTopWindow = function() {
		 if(this.parent) {
			  return this.parent.getTopWindow();
		 }
		 
		 return this;
	}

	this.getX = function() {
		return this.rect.x;
	}
	
	this.getY = function() {
		return this.rect.y;
	}

	this.getWidth = function() {
		return this.rect.w;
	}
	
	this.getHeight = function() {
		return this.rect.h;
	}

	this.getAbsPosition =  function() {
		var x = this.rect.x;
		var y = this.rect.y;

		for(var parent = this.parent; parent; parent = parent.parent) {
			x = x + parent.rect.x;
			y = y + parent.rect.y;
		}
		
		return {x: x, y: y};
	}
	
	this.getRelatePoint =  function(point) {
		var p = this.getAbsPosition();

		return {x:point.x - p.x, y: point.y - p.y};
	}
	
	this.postRedrawAll = function() {
		this.getManager().postRedraw(null);

		return;
	}

	this.postRedraw =	 function(rect) {
		var p = this.getAbsPosition();
		
		if(!rect) {
			rect = {x:0, y:0, w:this.rect.w, h:this.rect.h};
		}

		rect.x = p.x + rect.x;
		rect.y = p.y + rect.y;
		
		this.getManager().postRedraw(rect);
		
		return;
	}
	
	this.redraw =	 function(rect) {
		var p = this.getAbsPosition();
		
		if(!rect) {
			rect = {x:0, y:0, w:this.rect.w, h:this.rect.h};
		}

		rect.x = p.x + rect.x;
		rect.y = p.y + rect.y;
		
		this.getManager().redraw(rect);
		
		return;
	}
	
	this.findTargetWidgetEx = function(point, recursive) {
		 if(!this.visible) {
		 	return null;
		 }

		 if(!isPointInRect(point, this.rect)) {
			  return null;
		 }
		 
		 if(recursive && this.children.length > 0) {
			  var n = this.children.length - 1;
			  var p = this.point;
			  p.x = point.x - this.rect.x;
			  p.y = point.y - this.rect.y;
			  
			  for(var i = n; i >= 0; i--) {
					var child = this.children[i];
					var ret = child.findTargetWidget(p);
					
					if(ret !== null) {
						 return ret;
					}
			  }
		 }
		 
		 return this;
	}
		
	this.findTargetWidget = function(point) {
		 return this.findTargetWidgetEx(point, true);
	}
	
	this.removeChild = function(child) {
		this.children.remove(child);
		child.parent = null;

		return;
	}
	
	this.setText = function(text) {
		 this.text = text;
		 
		 return;
	}
	
	this.setID = function(id) {
		 this.id = id;
		 
		 return;
	}
	
	this.setUserData = function(userData) {
		 this.userData = userData;
		 
		 return;
	}
	
	this.setEnable = function(value) {
		this.enable = value;
		
		if(!value) {
			this.state = Widget.STATE_INSENSITIVE;
		}
		else {
			if(this.state === Widget.STATE_INSENSITIVE) {
				this.state = Widget.STATE_NORMAL;
			}
		}
		
		return;
	}
	
	this.setState = function(state) {
		if(this.enable) {
			this.state = state;
		 }
		
		 return;
	}
	
	this.measure = function(canvas) {
		 return;
	}
	
	this.move = function(x, y) {
		 this.rect.x = x;
		 this.rect.y = y;
		 
		 return;
	}
	
	this.moveDelta = function(dx, dy) {
		 this.rect.x = this.rect.x + dx;
		 this.rect.y = this.rect.y + dy;
		 
		 return;
	}
	
	this.resize = function(w, h) {
		this.rect.w = w;
		this.rect.h = h;
		this.setNeedRelayout(true);

		return;
	}
	
	this.setListener = function(listener) {
		 this.listener = listener;
		 
		 return;
	}
		
	this.lookup = function(id) {
		if(this.id === id) {
			return this;
		}
		
		if(this.children.length === 0) {
			 return null;
		}
		
		for(var i = 0; i < this.children.length; i++) {
			 var child = this.children[i];
			
			var r = child.lookup(id);
			if(r !== null) {
				return r;
			}
		}
		
		return null;
	}
	
	this.relayout = function(canvas, force) {
		 return;
	}
	
	this.paintBackground = function(canvas) {
		 var image = this.theme[this.state].image;

		 if(image) {
		 	image.draw9Patch(canvas, this.rect.x, this.rect.y, this.rect.w, this.rect.h);
		 }
		 else {
			if(this.theme[this.state].bg) {
				canvas.fillStyle = this.theme[this.state].bg;
				canvas.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
			}
		}
		
		return;
	}
	
	this.paintSelf = function(canvas) {
		 return;
	}
	
	this.beforePaint = function(canvas) {
		return;
	}
	
	this.afterPaint = function(canvas) {
		return;
	}

	this.draw = function(canvas) {
		var focusChild = null;
		 if(!this.visible) {
			  return;
		 }
	  
		canvas.lineWidth = 1;
		canvas.fillStyle = "White";
		canvas.strokeStyle = "Black";
		canvas.beginPath();
		this.beforePaint(canvas);
		this.relayout(canvas, 0);
		this.paintBackground(canvas);
		this.paintSelf(canvas);
		
		if(this.children.length === 0) {
			return;
		}
		
		canvas.save();
		canvas.translate(this.rect.x, this.rect.y);
		for(var i = 0; i < this.children.length; i++) {
			child = this.children[i];

			if(child.state === Widget.STATE_OVER) {
				focusChild = child;
			}
			else {
				child.draw(canvas);
			}
		}

		if(focusChild) {
			focusChild.draw(canvas);
		}

		canvas.restore();
		this.afterPaint(canvas);
		canvas.closePath();

		return;
	}

	this.isVisible = function() {
		return this.visible;
	}

	this.onShow = function(visible) {
		return true;
	}

	this.show = function(visible) {
		var visible = !!visible;
		if(visible != this.visible) {
			this.visible = visible;
			this.onShow(visible);
		}

		return;
	}
	
	this.showAll = function(visible) {
		this.show(visible);

		for(var i = 0; i < this.children.length; i++) {
			this.children[i].showAll(visible);
		}
		
		this.relayout(this.getCanvas2D(), false);
		
		if(!this.parent) {
			this.postRedraw();
		}
		
		return;
	}
	
	this.onDoubleClick = function(point) {
		return;
	}
	
	this.onLongPress = function(point) {
		return;
	}
	
	this.onGesture = function(gesture) {
		return;
	}
	
	this.onGesture = function(gesture) {
		return;
	}

	this.onPointerDown = function(point) {
		 this.getTopWindow().grab(this);

		 if(this.state !== Widget.STATE_INSENSITIVE) {
		 	this.state = Widget.STATE_ACTIVE;
		 	this.postRedraw();
		 }

		return;
	}

	this.onPointerMove = function(point) {
		this.lastPointerPoint.x = point.x;
		this.lastPointerPoint.y = point.y;
		return;
	}

	this.onPointerUp = function(point) {
		if(this.state !== Widget.STATE_INSENSITIVE) {
			this.state = Widget.STATE_NORMAL;
		}
		this.getTopWindow().ungrab();
		if(this.listener && this.state !== Widget.STATE_INSENSITIVE) {
			this.listener(this);
		}
		this.postRedraw();

		return;
	}
	
	this.onContextMenu = function(point) {
		return;
	}
	
	this.onKeyDown = function(code) {
		console.log("onKeyUp Widget:" + this.id + " code=" + code)
		return;
	}

	this.onKeyUp = function(code) {
		console.log("onKeyUp Widget:" + this.id + " code=" + code)
		return;
	}	

	return this;
}

Widget.STATE_NORMAL		 = 0;
Widget.STATE_ACTIVE		 = 1;
Widget.STATE_OVER			 = 2;
Widget.STATE_INSENSITIVE   = 3;
Widget.STATE_NR			 = 4;
Widget.TYPE_NONE = 0;
Widget.TYPE_WINDOW = 1;
Widget.TYPE_DIALOG = 2;
Widget.TYPE_MENU_BAR = 3;
Widget.TYPE_TOOL_BAR = 4;
Widget.TYPE_MENU_ITEM = 5;
Widget.TYPE_MENU_BUTTON = 6;
Widget.TYPE_CONTEXT_MENU_BAR=7;
Widget.TYPE_MENU = 8;
Widget.TYPE_POPUP = 9;
Widget.TYPE_HBOX = 10;
Widget.TYPE_VBOX = 11;
Widget.TYPE_GRID = 12;
Widget.TYPE_USER = 13;
Widget.TYPE_NR = 14;
Widget.MENU_ITEM_HEIGHT = 40;
