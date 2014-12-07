/*
 * File: window.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: window
 * 
 * Copyright (c) 2011 - 2015	Li XianJing <xianjimli@hotmail.com>
 * 
 */
 
function Window(manager, x, y, w, h) {
	var args = [null, x, y, w, h];
	this.type  = Widget.TYPE_WINDOW;

	Widget.apply(this, args);
	
	this.center = false;
	this.grabWidget = null;
	this.focusWidget = null;
	this.manager = manager;
	
	this.setManager = function(manager) {
		this.manager = manager;
		
		return;
	}
	
	this.grab = function(widget) {
		 this.grabWidget = widget;
	}
	
	this.ungrab = function() {
		 this.grabWidget = 0;
	}
	
	this.setCenter = function(center) {
		this.center = center;
		
		return;
	}
	
	this.moveToCenter = function() {
		var view = cantkGetViewPort();
		var sw = Math.min(this.manager.w, view.width);
		var sh = Math.min(this.manager.h, view.height);
		
		var x = (sw - this.rect.w)/2;
		var y = (sh - this.rect.h)/2 + getScrollTop();

		this.rect.x = x;
		this.rect.y = y;
		
		return;
	}
	
	this.onDoubleClick = function(point) {
		 var target = this;

		 if(this.grabWidget) {
			  target = this.grabWidget;
		 }
		 else {
			  target = this.findTargetWidget(point);
		 }
		 
		 if(target && target !== this) {
			  target.onDoubleClick(point);
			  
			  this.focusWidget = target;
		 }
 
		return;
	}
	
	this.onLongPress = function(point) {
		 var target = this;

		 if(this.grabWidget) {
			  target = this.grabWidget;
		 }
		 else {
			  target = this.findTargetWidget(point);
		 }
		 
		 if(target && target !== this) {
			  target.onLongPress(point);
		 }
 
		return;
	}
	
	this.onGesture = function(gesture) {
		 var target = this;

		 if(this.grabWidget) {
			  target = this.grabWidget;
		 }
		 else {
			  target = this.findTargetWidget(point);
		 }
		 
		 if(target && target !== this) {
			  target.onGesture(gesture);
		 }
 
		return;
	}
	
	this.onPointerDown = function(point) {
		 var target = this;

		 if(this.grabWidget) {
			  target = this.grabWidget;
		 }
		 else {
			  target = this.findTargetWidget(point);
		 }
		 
		 if(target && target !== this) {
			  target.onPointerDown(point);
			  
			  this.focusWidget = target;
		 }
 
		return;
	}

	this.onPointerMove = function(point) {
		 var target = this;

		 if(this.grabWidget) {
			  target = this.grabWidget;
		 }
		 else {
			  target = this.findTargetWidget(point);
		 }
		 
		 if(target && target !== this) {
		 	if(this.lastTarget && target != this.lastTarget) {
				this.lastTarget.onPointerMove(point);
		 	}

			target.onPointerMove(point);

			this.lastTarget = target;
		 }


		return;
	}

	this.onPointerUp = function(point) {
		 var target = this;

		 if(this.grabWidget) {
			  target = this.grabWidget;
		 }
		 else {
			  target = this.findTargetWidget(point);
		 }
		 
		 if(target && target !== this) {
			  target.onPointerUp(point);
		 }
		 
		return;
	}
	
	this.onContextMenu = function(point) {
		 var target = this;

		 if(this.grabWidget) {
			  target = this.grabWidget;
		 }
		 else {
			  target = this.findTargetWidget(point);
		 }
		 
		 if(target && target !== this) {
			  target.onContextMenu(point);
		 }
		 
		return;
	}
	
	this.onKeyDown = function(code) {
		if(this.grabWidget) {
			 this.grabWidget.onKeyDown(code);
		}
		else if(this.focusWidget) {
			 this.focusWidget.onKeyDown(code);
		}
		else if(this.children.length > 0) {
			this.focusWidget = this.children[this.children.length-1];
			this.focusWidget.onKeyDown(code);
		}
		
		return;
	}

	this.onKeyUp = function(code) {
		if(this.grabWidget) {
			 this.grabWidget.onKeyUp(code);
		}
		
		if(this.focusWidget !== 0) {
			 this.focusWidget.onKeyUp(code);
		}		
		return;
	}
	
	this.manager.addWindow(this);
}
