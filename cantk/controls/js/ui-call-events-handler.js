/*
 * File: ui-call-events-handler.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: call events handler 
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */

///////////////////////////////////////////////////////////////
UIElement.eventsStoped = {};
UIElement.prototype.callOnUpdateTransformHandler = function(canvas) {
	if(this.isInDesignMode() || !this.events) return true;

	if(!this.handleOnUpdateTransform) {
		var sourceCode = this.events["onUpdateTransform"];
		if(sourceCode) {
			sourceCode = "this.handleOnUpdateTransform = function(canvas) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnUpdateTransform eval", e)
			}
		}
	}

	if(this.hasEventListener("updatetransform")) {
		var event = this.createEvent("updatetransform");
		event.canvas = canvas;

		this.dispatchEvent(event);
	}

	if(this.handleOnUpdateTransform) {
		try {
			this.handleOnUpdateTransform(canvas);
		}catch(e) {
			UIElement.logError("this.handleOnUpdateTransform", e)
		}
	}

	return;
}

UIElement.prototype.callOnPointerDownHandler = function(point, beforeChild) {
	if(this.isUIWindow) {
		UIElement.eventsStoped.click = false;
		UIElement.eventsStoped.pointerDown = false;
	}

	if(!this.enable || !this.events || UIElement.eventsStoped.pointerDown) {
		return false;
	}
	
	if(this.hasEventListener("pointerdown")) {
		var event = this.createEvent("pointerdown");
		event.point = point;
		event.beforeChild = beforeChild;

		if(this.dispatchEvent(event)) {
			UIElement.eventsStoped.pointerDown = true;
			return true;
		}
	}

	if(!this.handlePointerDown) {
		var sourceCode = this.events["onPointerDown"];
		if(sourceCode) {
			sourceCode = "this.handlePointerDown = function(point, beforeChild) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handlePointerDown eval", e)
			}
		}
	}

	if(this.handlePointerDown) {
		try {
			if(this.handlePointerDown(point, beforeChild)) {
				UIElement.eventsStoped.pointerDown = true;
			}
		}catch(e) {
			UIElement.logError("this.handlePointerDown", e)
		}
	}

	return true;
}

UIElement.prototype.callOnPointerMoveHandler = function(point, beforeChild) {
	if(this.isUIWindow) {
		UIElement.eventsStoped.pointerMove = false;
	}

	if(!this.enable || !this.events || UIElement.eventsStoped.pointerMove) {
		return false;
	}

	if(this.hasEventListener("pointermove")) {
		var event = this.createEvent("pointermove");
		event.point = point;
		event.beforeChild = beforeChild;

		if(this.dispatchEvent(event)) {
			UIElement.eventsStoped.pointerMove = true;
			return true;
		}
	}

	if(!this.handlePointerMove) {
		var sourceCode = this.events["onPointerMove"];
		if(sourceCode) {
			sourceCode = "this.handlePointerMove = function(point, beforeChild) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handlePointerMove eval", e)
			}
		}
	}

	if(this.handlePointerMove) {
		try {
			if(this.handlePointerMove(point, beforeChild)) {
				UIElement.eventsStoped.pointerMove = true;
			}
		}catch(e) {
			UIElement.logError("this.handlePointerMove", e)
		}
	}

	return true;
}

UIElement.prototype.callOnPointerUpHandler = function(point, beforeChild) {
	if(this.isUIWindow) {
		UIElement.eventsStoped.pointerUp = false;
	}

	if(!this.enable || !this.events || UIElement.eventsStoped.pointerUp) {
		return false;
	}

	if(this.hasEventListener("pointerup")) {
		var event = this.createEvent("pointerup");
		event.point = point;
		event.beforeChild = beforeChild;

		if(this.dispatchEvent(event)) {
			UIElement.eventsStoped.pointerUp = true;
			return true;
		}
	}

	if(!this.handlePointerUp) {
		var sourceCode = this.events["onPointerUp"];
		if(sourceCode) {
			sourceCode = "this.handlePointerUp = function(point, beforeChild) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handlePointerUp eval", e)
			}
		}
	}

	if(this.handlePointerUp) {
		try{
			if(this.handlePointerUp(point, beforeChild)) {
				UIElement.eventsStoped.pointerUp = true;
			}
		}catch(e) {
			UIElement.logError("this.handlePointerUp", e)
		}
	}
	
	return true;
}

UIElement.prototype.callOnClickHandler = function(point) {
	if(!this.enable || !this.events || this.isInDesignMode()) {
		return false;
	}

	if(UIElement.eventsStoped.click) {
		return true;
	}

	if(this.hasEventListener("click")) {
		var event = this.createEvent("click");
		event.point = point;

		if(this.dispatchEvent(event)) {
			UIElement.eventsStoped.click = true;
			return true;
		}
	}

	if(!this.handleClick) {
		var sourceCode = this.events["onClick"];
		if(sourceCode) {
			sourceCode = "this.handleClick = function(point) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleClick eval", e)
			}
		}
	}

	if(this.handleClick) {
		try {
			if(this.handleClick(point)) {
				UIElement.eventsStoped.click = true;
			}
		}catch(e) {
			UIElement.logError("this.handleClick", e)
		}
	}

	return true;
}

UIElement.prototype.callOnDoubleClickHandler = function(point) {
	if(this.isUIWindow) {
		UIElement.eventsStoped.doubleClick = false;
	}

	if(!this.enable || !this.events || this.isInDesignMode()) {
		return false;
	}

	if(UIElement.eventsStoped.doubleClick) {
		return false;
	}
	
	if(this.hasEventListener("doubleclick")) {
		var event = this.createEvent("doubleclick");
		event.point = point;

		if(this.dispatchEvent(event)) {
			UIElement.eventsStoped.doubleClick = true;
			return true;
		}
	}

	if(!this.handleDoubleClick) {
		var sourceCode = this.events["onDoubleClick"];
		if(sourceCode) {
			sourceCode = "this.handleDoubleClick = function(point) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleDoubleClick eval", e)
			}
		}
	}

	if(this.handleDoubleClick) {
		try {
			if(this.handleDoubleClick(point)) {
				UIElement.eventsStoped.doubleClick = true;
			}
		}catch(e) {
			UIElement.logError("this.handleDoubleClick", e)
		}
	}

	this.hitTestResult = 0;

	return true;
}

UIElement.prototype.callOnLongPressHandler = function(point) {
	if(!this.enable || !this.events) {
		return false;
	}

	if(!this.handleLongPress) {
		var sourceCode = this.events["onLongPress"];
		if(sourceCode) {
			sourceCode = "this.handleLongPress = function(point) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleLongPress eval", e)
			}
		}
	}
	
	if(this.hasEventListener("longpress")) {
		var event = this.createEvent("longpress");
		event.point = point;

		this.dispatchEvent(event);
	}

	if(this.handleLongPress) {
		try {
			this.handleLongPress(point);
		}catch(e) {
			UIElement.logError("this.handleLongPress", e)
		}
	}

	return true;
}

UIElement.prototype.callOnPaintHandler = function(canvas2dCtx) {
	if(this.isInDesignMode()) {
		return true;
	}
	
	if(!this.enable || !this.events) {
		return false;
	}

	if(!this.handlePaint) {
		var sourceCode = this.events["onPaint"];
		if(sourceCode) {
			sourceCode = "this.handlePaint = function(canvas2dCtx) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handlePaint eval", e)
			}
		}
	}
	
	if(this.hasEventListener("paint")) {
		var event = this.createEvent("paint");
		event.canvas2dCtx = canvas2dCtx;

		this.dispatchEvent(event);
	}

	if(this.handlePaint) {
		try {
			this.handlePaint(canvas2dCtx);
		}catch(e) {
			UIElement.logError("this.handlePaint", e)
		}
	}

	return true;
}

UIElement.prototype.callOnScrollDoneHandler = function(xOffset, yOffset) {
	if(!this.enable || !this.events) {
		return false;
	}
	
	if(this.hasEventListener("scrolldone")) {
		var event = this.createEvent("scrolldone");
		event.xOffset = xOffset;
		event.yOffset = yOffset;

		if(this.dispatchEvent(event)) {
			return true;
		}
	}

	if(!this.handleOnScrollDone) {
		var sourceCode = this.events["onScrollDone"];
		if(sourceCode) {
			sourceCode = "this.handleOnScrollDone = function(xOffset, yOffset) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnScrollDone eval", e)
			}
		}
	}

	if(this.handleOnScrollDone) {
		try {
			this.handleOnScrollDone(xOffset, yOffset);
		}catch(e) {
			UIElement.logError("this.handleOnScrollDone", e)
		}
	}

	return true;
}

UIElement.prototype.callOnScrollingHandler = function(xOffset, yOffset) {
	if(!this.enable || !this.events || this.isInDesignMode()) {
		return false;
	}
	
	if(this.hasEventListener("scrolling")) {
		var event = this.createEvent("scrolling");
		event.xOffset = xOffset;
		event.yOffset = yOffset;

		if(this.dispatchEvent(event)) {
			return true;
		}
	}

	if(!this.handleOnScrolling) {
		var sourceCode = this.events["onScrolling"];
		if(sourceCode) {
			sourceCode = "this.handleOnScrolling = function(xOffset, yOffset) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnScrolling eval", e)
			}
		}
	}

	if(this.handleOnScrolling) {
		try {
			this.handleOnScrolling(xOffset, yOffset);
		}catch(e) {
			UIElement.logError("this.handleOnScrolling", e)
		}
	}

	return true;
}

UIElement.prototype.callOnRemovedHandler = function() {
	if(!this.enable || !this.events || this.isInDesignMode()) {
		return false;
	}

	if(!this.handleOnRemoved) {
		var sourceCode = this.events["onRemoved"];
		if(sourceCode) {
			sourceCode = "this.handleOnRemoved = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
				UIElement.logError("this.handleOnRemoved eval", e)
			}
		}
	}
	
	if(this.hasEventListener("removed")) {
		var event = this.createEvent("removed");

		this.dispatchEvent(event);
	}

	if(this.handleOnRemoved) {
		try {
			this.handleOnRemoved();
		}catch(e) {
			UIElement.logError("this.handleOnRemoved", e)
		}
	}

	return true;
}

UIElement.prototype.callOnChildDraggingHandler = function(sourceChildIndex, targetChildIndex) {
	if(!this.enable || !this.events) {
		return false;
	}

	if(!this.handleOnChildDragging) {
		var sourceCode = this.events["onChildDragging"];
		if(sourceCode) {
			sourceCode = "this.handleOnChildDragging = function(sourceChildIndex, targetChildIndex) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnChildDragging eval", e)
			}
		}
	}
	
	if(this.hasEventListener("childdragging")) {
		var event = this.createEvent("childdragging");
		event.sourceChildIndex = sourceChildIndex;
		event.targetChildIndex = targetChildIndex;
		this.dispatchEvent(event);
	}

	if(this.handleOnChildDragging) {
		try {
			this.handleOnChildDragging(sourceChildIndex, targetChildIndex);
		}catch(e) {
			UIElement.logError("this.handleOnChildDragging", e)
		}
	}

	return true;
}

UIElement.prototype.callOnChildDraggedHandler = function(sourceChildIndex, targetChildIndex) {
	if(!this.enable || !this.events) {
		return false;
	}

	if(!this.handleOnChildDragged) {
		var sourceCode = this.events["onChildDragged"];
		if(sourceCode) {
			sourceCode = "this.handleOnChildDragged = function(sourceChildIndex, targetChildIndex) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnChildDragged eval", e)
			}
		}
	}
	
	if(this.hasEventListener("childdragged")) {
		var event = this.createEvent("childdragged");
		event.sourceChildIndex = sourceChildIndex;
		event.targetChildIndex = targetChildIndex;
		this.dispatchEvent(event);
	}


	if(this.handleOnChildDragged) {
		try {
			this.handleOnChildDragged(sourceChildIndex, targetChildIndex);
		}catch(e) {
			UIElement.logError("this.handleOnChildDragged", e)
		}
	}

	return true;
}

UIElement.prototype.callOnChangingHandler = function(value) {
	if(!this.enable || this.isInDesignMode() || !this.events) {
		return false;
	}
	
	if(this.hasEventListener("changing")) {
		var event = this.createEvent("changing");
		event.value = value;
		this.dispatchEvent(event);
	}

	if(!this.handleOnChanging) {
		var sourceCode = this.events["onChanging"];
		if(sourceCode) {
			sourceCode = "this.handleOnChanging = function(value) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnChanging eval", e)
			}
		}
	}

	if(this.handleOnChanging) {
		try {
			this.handleOnChanging(value);
		}catch(e) {
			UIElement.logError("this.handleOnChanging", e)
		}
	}

	return true;
}

UIElement.prototype.callOnChangedHandler = function(value) {
	if(!this.enable || this.isInDesignMode() || !this.events) {
		return false;
	}
	
	if(this.hasEventListener("change")) {
		var event = this.createEvent("change");
		event.value = value;
		this.dispatchEvent(event);
	}

	if(this.hasEventListener("changed")) {
		var event = this.createEvent("changed");
		event.value = value;
		this.dispatchEvent(event);
	}

	if(!this.handleOnChanged) {
		var sourceCode = this.events["onChanged"];
		if(sourceCode) {
			sourceCode = "this.handleOnChanged = function(value) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnChanged eval", e)
			}
		}
	}

	if(this.handleOnChanged) {
		try {
			this.handleOnChanged(value);
		}catch(e) {
			UIElement.logError("this.handleOnChanged", e)
		}
	}

	return true;
}

UIElement.prototype.callOnInitHandler = function() {
	if(!this.events) return;

	if(!this.handleOnInit) {
		var sourceCode = this.events["onInit"];
		if(sourceCode) {
			sourceCode = "this.handleOnInit = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnInit eval", e)
			}
		}
	}
	
	if(this.hasEventListener("init")) {
		var event = this.createEvent("init");

		this.dispatchEvent(event);
	}

	if(this.handleOnInit) {
		try {
			this.handleOnInit();
		}catch(e) {
			UIElement.logError("this.handleOnInit", e)
		}
	}

	return true;
}

UIElement.prototype.callOnFocusInHandler = function() {
	if(this.onFocusIn) {
		try {
			this.onFocusIn();
		}
		catch(e) {
			console.log("onFocusIn:" + e.message);
		}
	}

	if(!this.events) return;
	if(!this.handleOnFocusIn) {
		var sourceCode = this.events["onFocusIn"];
		if(sourceCode) {
			sourceCode = "this.handleOnFocusIn = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnFocusIn eval", e)
			}
		}
	}

	if(this.hasEventListener("focusin")) {
		var event = this.createEvent("focusin");

		this.dispatchEvent(event);
	}

	if(this.handleOnFocusIn) {
		try {
			this.handleOnFocusIn();
		}catch(e) {
			UIElement.logError("this.handleOnFocusIn", e)
		}
	}

	return true;
}

UIElement.prototype.callOnFocusOutHandler = function() {
	if(this.onFocusOut) {
		try {
			this.onFocusOut();
		}
		catch(e) {
			UIElement.logError("this.onFocusOut ", e)
		}
	}

	if(!this.events) return;
	if(!this.handleOnFocusOut) {
		var sourceCode = this.events["onFocusOut"];
		if(sourceCode) {
			sourceCode = "this.handleOnFocusOut = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.onFocusOut eval", e)
			}
		}
	}
	
	if(this.hasEventListener("focusout")) {
		var event = this.createEvent("focusout");

		this.dispatchEvent(event);
	}

	if(this.handleOnFocusOut) {
		try {
			this.handleOnFocusOut();
		}catch(e) {
			UIElement.logError("this.onFocusOut", e)
		}
	}

	return true;
}

/////////////////////////////////////////////////////////

UIElement.prototype.callOnUpdateDataHandler = function() {
	if(!this.events) return;
	if(!this.handleOnUpdateData) {
		var sourceCode = this.events["onUpdateData"];
		if(sourceCode) {
			sourceCode = "this.handleOnUpdateData = function(value) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnUpdateData eval", e)
			}
		}
	}

	if(this.hasEventListener("updatedata")) {
		var event = this.createEvent("updatedata");

		this.dispatchEvent(event);
	}

	if(this.handleOnUpdateData) {
		try {
			this.handleOnUpdateData();
		}catch(e) {
			UIElement.logError("this.handleOnUpdateData", e)
		}
	}

	return true;
}

///////////////////////////////////////////////////////////////////

UIElement.prototype.callOnGestureHandler = function(gesture) {
	if(!this.enable || !this.events) {
		return false;
	}

	if(!this.handleOnGesture) {
		var sourceCode = this.events["onGesture"];
		if(sourceCode) {
			sourceCode = "this.handleOnGesture = function(gesture) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnGesture eval", e)
			}
		}
	}
	
	if(this.hasEventListener("gesture")) {
		var event = this.createEvent("gesture");
		event.gesture = gesture;

		this.dispatchEvent(event);
	}

	if(this.handleOnGesture) {
		try {
			this.handleOnGesture(gesture);
		}catch(e) {
			UIElement.logError("this.handleOnGesture", e)
		}
	}
	
	console.log("callOnGestureHandler: scale=" + gesture.scale + " rotation=" + gesture.rotation);

	return true;
}

UIElement.prototype.callOnBeforeOpenHandler = function(initData) {
	if(!this.events) return;
	if(!this.handleOnBeforeOpen) {
		var sourceCode = this.events["onBeforeOpen"];
		if(sourceCode) {
			sourceCode = "this.handleOnBeforeOpen = function(initData) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnBeforeOpen eval", e)
			}
		}
	}
	
	if(this.hasEventListener("beforeopen")) {
		var event = this.createEvent("beforeopen");
		event.initData = initData;

		this.dispatchEvent(event);
	}

	if(this.handleOnBeforeOpen) {
		try {
			this.handleOnBeforeOpen(initData);
		}catch(e) {
			UIElement.logError("this.handleOnBeforeOpen", e)
		}
	}

	return true;
}

UIElement.prototype.callOnOpenHandler = function(initData) {
	if(!this.events) return;
	if(!this.handleOnOpen) {
		var sourceCode = this.events["onOpen"];
		if(sourceCode) {
			sourceCode = "this.handleOnOpen = function(initData) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnOpen eval", e)
			}
		}
	}
	
	if(this.hasEventListener("open")) {
		var event = this.createEvent("open");
		event.initData = initData;

		this.dispatchEvent(event);
	}

	if(this.handleOnOpen) {
		try {
			this.handleOnOpen(initData);	
		}catch(e) {
			UIElement.logError("this.handleOnOpen", e)
		}
	}

	return true;
}

UIElement.prototype.callOnCloseHandler = function(retInfo) {
	if(!this.events) return;
	if(!this.handleOnClose) {
		var sourceCode = this.events["onClose"];
		if(sourceCode) {
			sourceCode = "this.handleOnClose = function(retInfo) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnClose eval", e)
			}
		}
	}

	if(this.hasEventListener("close")) {
		var event = this.createEvent("close");
		event.retInfo = retInfo;

		this.dispatchEvent(event);
	}

	if(this.handleOnClose) {
		try {
			this.handleOnClose(retInfo);
		}
		catch(e) {
			UIElement.logError("this.handleOnClose", e)
		}
	}

	return true;
}

UIElement.prototype.callOnSwitchToBackHandler =function() {
	if(!this.events) return;
	if(!this.handleOnSwitchToBack) {
		var sourceCode = this.events["onSwitchToBack"];
		if(sourceCode) {
			sourceCode = "this.handleOnSwitchToBack = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnSwitchToBack eval", e)
			}
		}
	}

	if(this.hasEventListener("switchtoback")) {
		var event = this.createEvent("switchtoback");
		this.dispatchEvent(event);
	}

	if(this.handleOnSwitchToBack) {
		try {
			this.handleOnSwitchToBack();
		}
		catch(e) {
			UIElement.logError("this.handleOnSwitchToBack", e)
		}
	}

	return true;
}

UIElement.prototype.callOnSwitchToFrontHandler = function() {
	if(!this.events) return;
	if(!this.handleOnSwitchToFront) {
		var sourceCode = this.events["onSwitchToFront"];
		if(sourceCode) {
			sourceCode = "this.handleOnSwitchToFront = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnSwitchToFront eval", e)
			}
		}
	}

	if(this.hasEventListener("switchtofront")) {
		var event = this.createEvent("switchtofront");
		this.dispatchEvent(event);
	}

	if(this.handleOnSwitchToFront) {
		try {
			this.handleOnSwitchToFront();
		}
		catch(e) {
			UIElement.logError("this.handleOnSwitchToFront", e)
		}
	}

	return true;
}

UIElement.prototype.callOnLoadHandler =function() {
	if(!this.events) return;
	if(!this.handleOnLoad) {
		var sourceCode = this.events["onLoad"];
		if(sourceCode) {
			sourceCode = "this.handleOnLoad = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnLoad eval", e)
			}
		}
	}
	
	if(this.hasEventListener("load")) {
		var event = this.createEvent("load");
		this.dispatchEvent(event);
	}

	if(this.handleOnLoad) {
		try {
			this.handleOnLoad();
		}
		catch(e) {
			UIElement.logError("this.handleOnLoad", e)
		}
	}

	return true;
}

UIElement.prototype.callOnUnloadHandler =function() {
	if(!this.events) return;
	if(!this.handleOnUnload) {
		var sourceCode = this.events["onUnload"];
		if(sourceCode) {
			sourceCode = "this.handleOnUnload = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnUnload eval", e)
			}
		}
	}

	if(this.hasEventListener("unload")) {
		var event = this.createEvent("unload");
		this.dispatchEvent(event);
	}

	if(this.handleOnUnload) {
		try {
			this.handleOnUnload();
		}
		catch(e) {
			UIElement.logError("this.handleOnUnload", e)
		}
	}

	return true;
}

/////////////////////////////////////////////////////////////

UIElement.prototype.callOnMovedHandler = function() {
 	if(this.cameraFollowMe) {
		this.getWindow().cameraFollow(this);
	} 
	
	if(this.hasEventListener("moved")) {
		var event = this.createEvent("moved");

		this.dispatchEvent(event);
	}

   	if(!this.events) return;
	if(!this.handleOnMoved) {
		var sourceCode = this.events["onMoved"];
		if(sourceCode) {
			sourceCode = "this.handleOnMoved = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnMoved eval", e)
			}
		}
	}
	
	if(this.handleOnMoved) {
		try {
			this.handleOnMoved();
		}catch(e) {
			UIElement.logError("this.handleOnMoved", e)
		}
	}

	return true;
}

UIElement.prototype.callOnPreSolveHandler = function(body, contact, oldManifold) {
	if(!this.events) return;

	if(!this.handleOnPreSolve) {
		var sourceCode = this.events["onPreSolve"];
		if(sourceCode) {
			sourceCode = "this.handleOnPreSolve = function(body, contact, oldManifold) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnPreSolve eval", e)
			}
		}
	}

	if(this.hasEventListener("presolve")) {
		var event = this.createEvent("presolve");
		event.body = body;
		event.contact = contact;
		event.oldManifold = oldManifold;

		this.dispatchEvent(event);
	}

	if(this.handleOnPreSolve) {
		try {
			this.handleOnPreSolve(body, contact, oldManifold);
		}catch(e) {
			UIElement.logError("this.handleOnPreSolve", e)
		}
	}

	return true;
}

UIElement.prototype.callOnPostSolveHandler = function(body, contact, impulse) {
	if(!this.events) return;

	if(!this.handleOnPostSolve) {
		var sourceCode = this.events["onPostSolve"];
		if(sourceCode) {
			sourceCode = "this.handleOnPostSolve = function(body, contact, impulse) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnPostSolve eval", e)
			}
		}
	}
	
	if(this.hasEventListener("postsolve")) {
		var event = this.createEvent("postsolve");
		event.body = body;
		event.contact = contact;
		event.impulse = impulse;

		this.dispatchEvent(event);
	}

	if(this.handleOnPostSolve) {
		try {
			this.handleOnPostSolve(body, contact, impulse);
		}catch(e) {
			UIElement.logError("this.handleOnPostSolve", e)
		}
	}

	return true;
}

UIElement.prototype.callOnBeginContactHandler = function(body, contact) {
	if(!this.events) return;

	if(this.hasEventListener("begincontact")) {
		var event = this.createEvent("begincontact");
		event.body = body;
		event.contact = contact;

		this.dispatchEvent(event);
	}

	if(!this.handleOnBeginContact) {
		var sourceCode = this.events["onBeginContact"];
		if(sourceCode) {
			sourceCode = "this.handleOnBeginContact = function(body, contact) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnBeginContact eval", e)
			}
		}
	}

	if(this.handleOnBeginContact) {
		try {
			this.handleOnBeginContact(body, contact);
		}catch(e) {
			UIElement.logError("this.handleOnBeginContact", e)
		}
	}

	return true;
}

UIElement.prototype.callOnEndContactHandler = function(body, contact) {
	if(!this.events) return;

	if(this.hasEventListener("endcontact")) {
		var event = this.createEvent("endcontact");
		event.body = body;
		event.contact = contact;

		this.dispatchEvent(event);
	}

	if(!this.handleOnEndContact) {
		var sourceCode = this.events["onEndContact"];
		if(sourceCode) {
			sourceCode = "this.handleOnEndContact = function(body, contact) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnEndContact eval", e)
			}
		}
	}

	if(this.handleOnEndContact) {
		try {
			this.handleOnEndContact(body, contact);
		}catch(e) {
			UIElement.logError("this.handleOnEndContact", e)
		}
	}

	return true;
}

UIElement.prototype.callOnAnimateDoneHandler = function(name) {
	if(!this.events) return;

	if(!this.handleOnAnimateDone) {
		var sourceCode = this.events["onAnimateDone"];
		if(sourceCode) {
			sourceCode = "this.handleOnAnimateDone = function(name) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnAnimateDone eval", e)
			}
		}
	}
	
	if(this.hasEventListener("animatedone")) {
		var event = this.createEvent("animatedone");
		event.name = name;

		this.dispatchEvent(event);
	}

	if(this.handleOnAnimateDone) {
		try {
			this.handleOnAnimateDone(name);
		}
		catch(e) {
			UIElement.logError("this.handleOnAnimateDone", e)
		}
	}

	return true;
}

UIElement.prototype.callOnSwipeLeftHandler = function(start, end) {
	if(!this.events) return;

	if(!this.handleOnSwipeLeft) {
		var sourceCode = this.events["onSwipeLeft"];
		if(sourceCode) {
			sourceCode = "this.handleOnSwipeLeft = function(start, end) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnSwipeLeft eval", e)
			}
		}
	}

	if(this.hasEventListener("swipeleft")) {
		var event = this.createEvent("swipeleft");
		event.start = start;
		event.end = end;

		this.dispatchEvent(event);
	}

	if(this.handleOnSwipeLeft) {
		try {
			this.handleOnSwipeLeft(start, end);
		}catch(e) {
			UIElement.logError("this.handleOnSwipeLeft", e)
		}
	}

	return true;
}

UIElement.prototype.callOnSwipeRightHandler = function(start, end) {
	if(!this.events) return;

	if(!this.handleOnSwipeRight) {
		var sourceCode = this.events["onSwipeRight"];
		if(sourceCode) {
			sourceCode = "this.handleOnSwipeRight = function(start, end) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnSwipeRight eval", e)
			}
		}
	}

	if(this.hasEventListener("swiperight")) {
		var event = this.createEvent("swiperight");
		event.start = start;
		event.end = end;

		this.dispatchEvent(event);
	}

	if(this.handleOnSwipeRight) {
		try {
			this.handleOnSwipeRight(start, end);
		}catch(e) {
			UIElement.logError("this.handleOnSwipeRight", e)
		}
	}

	return true;
}

UIElement.prototype.callOnSwipeUpHandler = function(start, end) {
	if(!this.events) return;

	if(!this.handleOnSwipeUp) {
		var sourceCode = this.events["onSwipeUp"];
		if(sourceCode) {
			sourceCode = "this.handleOnSwipeUp = function(start, end) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnSwipeUp eval", e)
			}
		}
	}

	if(this.hasEventListener("swipeup")) {
		var event = this.createEvent("swipeup");
		event.start = start;
		event.end = end;

		this.dispatchEvent(event);
	}

	if(this.handleOnSwipeUp) {
		try {
			this.handleOnSwipeUp(start, end);
		}catch(e) {
			UIElement.logError("this.handleOnSwipeUp", e)
		}
	}

	return true;
}

UIElement.prototype.callOnSwipeDownHandler = function(start, end) {
	if(!this.events) return;

	if(!this.handleOnSwipeDown) {
		var sourceCode = this.events["onSwipeDown"];
		if(sourceCode) {
			sourceCode = "this.handleOnSwipeDown = function(start, end) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnSwipeDown eval", e)
			}
		}
	}

	if(this.hasEventListener("swipedown")) {
		var event = this.createEvent("swipedown");
		event.start = start;
		event.end = end;

		this.dispatchEvent(event);
	}

	if(this.handleOnSwipeDown) {
		try {
			this.handleOnSwipeDown(start, end);
		}catch(e) {
			UIElement.logError("this.handleOnSwipeDown", e)
		}
	}

	return true;
}

UIElement.prototype.callOnBecomeZeroHandler = function() {
	if(!this.events) return;

	if(!this.handleOnBecomeZero) {
		var sourceCode = this.events["onBecomeZero"];
		if(sourceCode) {
			sourceCode = "this.handleOnBecomeZero = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnBecomeZero eval", e)
			}
		}
	}
	
	if(this.hasEventListener("becomezero")) {
		var event = this.createEvent("becomezero");
		this.dispatchEvent(event);
	}

	if(this.handleOnBecomeZero) {
		try {
			this.handleOnBecomeZero();
		}catch(e) {
			UIElement.logError("this.handleOnBecomeZero", e)
		}
	}

	return true;
}

UIElement.prototype.callOnBecomeFullHandler = function() {
	if(!this.events) return;

	if(!this.handleOnBecomeFull) {
		var sourceCode = this.events["onBecomeFull"];
		if(sourceCode) {
			sourceCode = "this.handleOnBecomeFull = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnBecomeFull eval", e)
			}
		}
	}

	if(this.hasEventListener("becomefull")) {
		var event = this.createEvent("becomefull");
		this.dispatchEvent(event);
	}

	if(this.handleOnBecomeFull) {
		try {
			this.handleOnBecomeFull();
		}catch(e) {
			UIElement.logError("this.handleOnBecomeFull", e)
		}
	}

	return true;
}

UIElement.prototype.callOnTimeoutHandler = function() {
	if(!this.events) return;
	if(!this.handleOnTimeout) {
		var sourceCode = this.events["onTimeout"];
		if(sourceCode) {
			sourceCode = "this.handleOnTimeout = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnTimeout eval", e)
			}
		}
	}
	
	if(this.hasEventListener("timer")) {
		var event = this.createEvent("timer");
		this.dispatchEvent(event);
	}
	
	if(this.hasEventListener("timeout")) {
		var event = this.createEvent("timeout");
		this.dispatchEvent(event);
	}


	if(this.handleOnTimeout) {
		try {
			this.handleOnTimeout();
		}catch(e) {
			UIElement.logError("this.handleOnTimeout", e)
		}
	}

	return true;
}

UIElement.prototype.callOnSystemInitHandler = function() {
	if(!this.events) return;
	if(!this.handleOnSystemInit) {
		var sourceCode = this.events["onSystemInit"];
		if(sourceCode) {
			sourceCode = "this.handleOnSystemInit = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnSystemInit eval", e)
			}
		}
	}

	if(this.hasEventListener("systeminit")) {
		var event = this.createEvent("systeminit");

		this.dispatchEvent(event);
	}

	if(this.handleOnSystemInit) {
		try {
			this.handleOnSystemInit();
		}catch(e) {
			UIElement.logError("this.handleOnSystemInit", e)
		}
	}

	return true;
}

UIElement.prototype.callOnScrollOutOfRangeHandler = function(offset) {
	if(!this.enable || !this.events) {
		return false;
	}

	if(this.onScrollOutOfRange) {
		this.onScrollOutOfRange(offset);

		return;
	}

	if(!this.handleOnScrollOutOfRange) {
		var sourceCode = this.events["onScrollOutOfRange"];
		if(sourceCode) {
			sourceCode = "this.handleOnScrollOutOfRange = function(offset) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnScrollOutOfRange eval", e)
			}
		}
	}

	if(this.hasEventListener("scrolloutofrange")) {
		var event = this.createEvent("scrolloutofrange");
		event.offset = offset;

		this.dispatchEvent(event);
	}

	if(this.handleOnScrollOutOfRange) {
		try {
			this.handleOnScrollOutOfRange(offset);
		}catch(e) {
			UIElement.logError("this.handleOnScrollOutOfRange", e)
		}
	}

	return true;
}

UIElement.prototype.callOnBirthedHandler = function() {
	if(this.onBirthed) {
		this.onBirthed();
	}

	if(!this.events) return;
	if(!this.handleOnBirthed) {
		var sourceCode = this.events["onBirthed"];
		if(sourceCode) {
			sourceCode = "this.handleOnBirthed = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnBirthed eval", e)
			}
		}
	}
	
	if(this.hasEventListener("birthed")) {
		var event = this.createEvent("birthed");

		this.dispatchEvent(event);
	}

	if(this.handleOnBirthed) {
		try {
			this.handleOnBirthed();
		}catch(e) {
			UIElement.logError("this.handleOnBirthed", e)
		}
	}

	return true;
}

UIElement.prototype.callOnDeviceOrientation = function(x, y, z, evt) {
	if(!this.events) return;
	if(!this.handleOnDeviceOrientation) {
		var sourceCode = this.events["onDeviceOrientation"];
		if(sourceCode) {
			sourceCode = "this.handleOnDeviceOrientation = function(x, y, z, event) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleOnDeviceOrientation eval", e)
			}
		}
	}

	if(this.hasEventListener("deviceorientation")) {
		var event = this.createEvent("deviceorientation");
		event.x = x;
		event.y = y;
		event.z = z;
		event.event = evt;

		this.dispatchEvent(event);
	}

	if(this.handleOnDeviceOrientation) {
		try {
			this.handleOnDeviceOrientation(x, y, z, evt);
		}catch(e) {
			UIElement.logError("this.handleOnDeviceOrientation", e)
		}
	}

	return true;
}

UIElement.prototype.dispatchCustomEvent = function(eventName, args) {
	if(!this.events) return;
	if(!this.customEventHandler) {
		this.customEventHandler = {};
	}

	var handleCustomEvent = this.customEventHandler[eventName];
	if(!handleCustomEvent) {
		var sourceCode = this.events[eventName];
		if(sourceCode) {
			sourceCode = "this.handleCustomEvent = function(args) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleCustomEvent eval", e)
			}
		}

		if(this.handleCustomEvent) {
			handleCustomEvent = this.handleCustomEvent;
			this.customEventHandler[eventName] = handleCustomEvent;
			this.handleCustomEvent = null;
		}
	}

	if(handleCustomEvent) {
		try {
			handleCustomEvent.call(this, args);
		}catch(e) {
			UIElement.logError("this.handleCustomEvent", e)
		}
	}

	return true;
}

UIWindow.prototype.callOnMultiTouchHandler = function(action, points, evt) {
	if(!this.enable || !this.events) {
		return false;
	}

	if(this.isInDesignMode()) {
		return false;
	}
	
	if(!this.handleMultiTouch) {
		var sourceCode = this.events["onMultiTouch"];
		if(sourceCode) {
			sourceCode = "this.handleMultiTouch = function(action, points, event) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleMultiTouch eval", e)
			}
		}
	}
	
	if(this.hasEventListener("multitouch")) {
		var event = this.createEvent("multitouch");
		event.action = action;
		event.points = points;
		event.event = evt;

		this.dispatchEvent(event);
	}

	if(this.handleMultiTouch) {
		try {
			this.handleMultiTouch(action, points, evt);
		}catch(e) {
			UIElement.logError("this.handleMultiTouch", e)
		}
	}

	return;
}

UIElement.prototype.callOnDragStartHandler = function() {
	if(!this.enable || !this.events) {
		return false;
	}

	if(!this.handleDragStart) {
		var sourceCode = this.events["onDragStart"];
		if(sourceCode) {
			sourceCode = "this.handleDragStart = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleDragStart eval", e)
			}
		}
	}
	
	if(this.hasEventListener("dragstart")) {
		var event = this.createEvent("dragstart");

		this.dispatchEvent(event);
	}

	if(this.handleDragStart) {
		try {
			this.handleDragStart();
		}catch(e) {
			UIElement.logError("this.handleDragStart", e)
		}
	}

	return;
}

UIElement.prototype.callOnDragEndHandler = function() {
	if(!this.enable || !this.events) {
		return false;
	}

	if(!this.handleDragEnd) {
		var sourceCode = this.events["onDragEnd"];
		if(sourceCode) {
			sourceCode = "this.handleDragEnd = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleDragEnd eval", e)
			}
		}
	}

	if(this.hasEventListener("dragend")) {
		var event = this.createEvent("dragend");

		this.dispatchEvent(event);
	}

	if(this.handleDragEnd) {
		try {
			this.handleDragEnd();
		}catch(e) {
			UIElement.logError("this.handleDragEnd", e)
		}
	}

	return;
}

UIElement.prototype.callOnDraggingHandler = function() {
	if(!this.enable || !this.events) {
		return false;
	}

	if(!this.handleDragging) {
		var sourceCode = this.events["onDragging"];
		if(sourceCode) {
			sourceCode = "this.handleDragging = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				UIElement.logError("this.handleDragging eval", e)
			}
		}
	}

	if(this.hasEventListener("dragging")) {
		var event = this.createEvent("dragging");

		this.dispatchEvent(event);
	}

	if(this.handleDragging) {
		try {
			this.handleDragging();
		}catch(e) {
			UIElement.logError("this.handleDragging", e)
		}
	}

	return;
}
