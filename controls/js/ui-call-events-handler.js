/*
 * File: ui-call-events-handler.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: call events handler 
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

///////////////////////////////////////////////////////////////
UIElement.prototype.callOnUpdateTransformHandler = function(canvas) {
	if(this.mode === Shape.MODE_EDITING) return true;

	if(!this.handleOnUpdateTransform) {
		var sourceCode = this.events["onUpdateTransform"];
		if(sourceCode) {
			sourceCode = "this.handleOnUpdateTransform = function(canvas) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnUpdateTransform) {
		try {
			this.handleOnUpdateTransform(canvas);
		}catch(e) {
			console.log("this.handleOnUpdateTransform:" + e.message);
		}
	}

	return;
}

UIElement.prototype.callOnPointerDownHandler = function(point, beforeChild) {
	if(!this.enable) {
		return false;
	}

	if(!this.handlePointerDown) {
		var sourceCode = this.events["onPointerDown"];
		if(sourceCode) {
			sourceCode = "this.handlePointerDown = function(point, beforeChild) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handlePointerDown) {
		try {
			this.handlePointerDown(point, beforeChild);
		}catch(e) {
			console.log("this.handlePointerDown:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnPointerMoveHandler = function(point, beforeChild) {
	if(!this.enable) {
		return false;
	}

	if(!this.handlePointerMove) {
		var sourceCode = this.events["onPointerMove"];
		if(sourceCode) {
			sourceCode = "this.handlePointerMove = function(point, beforeChild) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handlePointerMove) {
		try {
			this.handlePointerMove(point, beforeChild);
		}catch(e) {
			console.log("this.handlePointerMove:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnPointerUpHandler = function(point, beforeChild) {
	if(!this.enable) {
		return false;
	}

	if(!this.handlePointerUp) {
		var sourceCode = this.events["onPointerUp"];
		if(sourceCode) {
			sourceCode = "this.handlePointerUp = function(point, beforeChild) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handlePointerUp) {
		try{
			this.handlePointerUp(point, beforeChild);
		}catch(e) {
			console.log("this.handlePointerUp:" + e.message);
		}
	}
	
	return true;
}

UIElement.prototype.callOnLongPressHandler = function(point) {
	if(!this.enable) {
		return false;
	}

	if(!this.handleLongPress) {
		var sourceCode = this.events["onLongPress"];
		if(sourceCode) {
			sourceCode = "this.handleLongPress = function(point) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleLongPress) {
		try {
			this.handleLongPress(point);
		}catch(e) {
			console.log("this.handleLongPress:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnDoubleClickHandler = function(point) {
	if(this.mode === Shape.MODE_EDITING) {
		if(this.textType != Shape.TEXT_NONE) {
			this.editText(point);
		}
		else {
			this.showProperty();
		}

		return true;
	}
	
	if(!this.enable) {
		return false;
	}

	if(!this.handleDoubleClick) {
		var sourceCode = this.events["onDoubleClick"];
		if(sourceCode) {
			sourceCode = "this.handleDoubleClick = function(point) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleDoubleClick) {
		try {
			this.handleDoubleClick(point);
		}catch(e) {
			console.log("this.handleDoubleClick:" + e.message);
		}
	}

	this.hitTestResult = 0;

	return true;
}

UIElement.prototype.callOnPaintHandler = function(canvas2dCtx) {
	if(this.mode === Shape.MODE_EDITING) {
		return true;
	}
	
	if(!this.enable) {
		return false;
	}

	if(!this.handlePaint) {
		var sourceCode = this.events["onPaint"];
		if(sourceCode) {
			sourceCode = "this.handlePaint = function(canvas2dCtx) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handlePaint) {
		try {
			this.handlePaint(canvas2dCtx);
		}catch(e) {
			console.log("this.handlePaint:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnClickHandler = function(point) {
	if(!this.enable) {
		return false;
	}

	if(this.mode === Shape.MODE_EDITING) {
		return false;
	}
	
	if(this.onClicked) {
		this.onClicked(point);
	}

	if(!this.handleClick) {
		var sourceCode = this.events["onClick"];
		if(sourceCode) {
			sourceCode = "this.handleClick = function(point) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(!this.children.length) {
		console.log("clicked: " + this.type + "(" + this.name + ")");
	}

	if(this.handleClick) {
		try {
			this.handleClick(point);
		}catch(e) {
			console.log("this.handleClick:" + e.message + "\n" + e.stack);
		}
	}

	return;
}

UIElement.prototype.callOnScrollDoneHandler = function() {
	if(!this.enable) {
		return false;
	}

	if(!this.handleOnScrollDone) {
		var sourceCode = this.events["onScrollDone"];
		if(sourceCode) {
			sourceCode = "this.handleOnScrollDone = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnScrollDone) {
		try {
			this.handleOnScrollDone();
		}catch(e) {
			console.log("this.handleOnScrollDone:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnRemovedHandler = function() {
	if(!this.enable) {
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
			}
		}
	}

	if(this.handleOnRemoved) {
		try {
			this.handleOnRemoved();
		}catch(e) {
			console.log("this.handleOnRemoved:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnChildDraggingHandler = function(sourceChildIndex, targetChildIndex) {
	if(!this.enable) {
		return false;
	}

	if(!this.handleOnChildDragging) {
		var sourceCode = this.events["onChildDragging"];
		if(sourceCode) {
			sourceCode = "this.handleOnChildDragging = function(sourceChildIndex, targetChildIndex) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnChildDragging) {
		try {
			this.handleOnChildDragging(sourceChildIndex, targetChildIndex);
		}catch(e) {
			console.log("this.handleOnChildDragging:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnChildDraggedHandler = function(sourceChildIndex, targetChildIndex) {
	if(!this.enable) {
		return false;
	}

	if(!this.handleOnChildDragged) {
		var sourceCode = this.events["onChildDragged"];
		if(sourceCode) {
			sourceCode = "this.handleOnChildDragged = function(sourceChildIndex, targetChildIndex) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnChildDragged) {
		try {
			this.handleOnChildDragged(sourceChildIndex, targetChildIndex);
		}catch(e) {
			console.log("this.handleOnChildDragged:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnChangingHandler = function(value) {
	if(!this.enable || this.mode === Shape.MODE_EDITING) {
		return false;
	}

	if(!this.handleOnChanging) {
		var sourceCode = this.events["onChanging"];
		if(sourceCode) {
			sourceCode = "this.handleOnChanging = function(value) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnChanging) {
		try {
			this.handleOnChanging(value);
		}catch(e) {
			console.log("this.handleOnChanging:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnChangedHandler = function(value) {
	if(!this.enable || this.mode === Shape.MODE_EDITING) {
		return false;
	}

	if(this.onChanged) {
		this.onChanged(value);

		return;
	}

	if(!this.handleOnChanged) {
		var sourceCode = this.events["onChanged"];
		if(sourceCode) {
			sourceCode = "this.handleOnChanged = function(value) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnChanged) {
		try {
			this.handleOnChanged(value);
		}catch(e) {
			console.log("this.handleOnChanged:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnInitHandler = function() {
	if(!this.handleOnInit) {
		var sourceCode = this.events["onInit"];
		if(sourceCode) {
			sourceCode = "this.handleOnInit = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnInit) {
		try {
			this.handleOnInit();
		}catch(e) {
			console.log("this.handleOnInit:" + e.message + "\n" + e.stack);
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

	if(!this.handleOnFocusIn) {
		var sourceCode = this.events["onFocusIn"];
		if(sourceCode) {
			sourceCode = "this.handleOnFocusIn = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnFocusIn) {
		try {
			this.handleOnFocusIn();
		}catch(e) {
			console.log("this.handleOnFocusIn:" + e.message);
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
			console.log("onFocusOut: " + e.message);
		}
	}

	if(!this.handleOnFocusOut) {
		var sourceCode = this.events["onFocusOut"];
		if(sourceCode) {
			sourceCode = "this.handleOnFocusOut = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnFocusOut) {
		try {
			this.handleOnFocusOut();
		}catch(e) {
			console.log("this.handleOnFocusOut:" + e.message);
		}
	}

	return true;
}

/////////////////////////////////////////////////////////

UIElement.prototype.callOnUpdateDataHandler = function() {
	if(!this.handleOnUpdateData) {
		var sourceCode = this.events["onUpdateData"];
		if(sourceCode) {
			sourceCode = "this.handleOnUpdateData = function(value) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnUpdateData) {
		try {
			this.handleOnUpdateData();
		}catch(e) {
			console.log("this..handleOnUpdateData:" + e.message);
		}
	}

	return true;
}

///////////////////////////////////////////////////////////////////

UIElement.prototype.callOnGestureHandler = function(gesture) {
	if(!this.enable) {
		return false;
	}

	if(!this.handleOnGesture) {
		var sourceCode = this.events["onGesture"];
		if(sourceCode) {
			sourceCode = "this.handleOnGesture = function(gesture) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnGesture) {
		try {
			this.handleOnGesture(gesture);
		}catch(e) {
			console.log("this.callOnGestureHandler:" + e.message);
		}
	}
	
	console.log("callOnGestureHandler: scale=" + gesture.scale + " rotation=" + gesture.rotation);

	return true;
}

UIElement.prototype.callOnBeforeOpenHandler = function(initData) {
	if(!this.handleOnBeforeOpen) {
		var sourceCode = this.events["onBeforeOpen"];
		if(sourceCode) {
			sourceCode = "this.handleOnBeforeOpen = function(initData) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnBeforeOpen) {
		try {
			this.handleOnBeforeOpen(initData);
		}catch(e) {
			console.log("onBeforeOpen" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnOpenHandler = function(initData) {
	if(!this.handleOnOpen) {
		var sourceCode = this.events["onOpen"];
		if(sourceCode) {
			sourceCode = "this.handleOnOpen = function(initData) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnOpen) {
		try {
			this.handleOnOpen(initData);	
		}catch(e) {
			console.log("onOpen" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnCloseHandler = function(retInfo) {
	if(!this.handleOnClose) {
		var sourceCode = this.events["onClose"];
		if(sourceCode) {
			sourceCode = "this.handleOnClose = function(retInfo) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnClose) {
		try {
			this.handleOnClose(retInfo);
		}
		catch(e) {
			console.log("onClose: " + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnSwitchToBackHandler =function() {
	if(!this.handleOnSwitchToBack) {
		var sourceCode = this.events["onSwitchToBack"];
		if(sourceCode) {
			sourceCode = "this.handleOnSwitchToBack = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnSwitchToBack) {
		try {
			this.handleOnSwitchToBack();
		}
		catch(e) {
			console.log("OnSwitchToBack: " + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnSwitchToFrontHandler = function() {
	if(!this.handleOnSwitchToFront) {
		var sourceCode = this.events["onSwitchToFront"];
		if(sourceCode) {
			sourceCode = "this.handleOnSwitchToFront = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnSwitchToFront) {
		try {
			this.handleOnSwitchToFront();
		}
		catch(e) {
			console.log("OnSwitchToFront: " + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnLoadHandler =function() {
	if(!this.handleOnLoad) {
		var sourceCode = this.events["onLoad"];
		if(sourceCode) {
			sourceCode = "this.handleOnLoad = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnLoad) {
		try {
			this.handleOnLoad();
		}
		catch(e) {
			console.log("OnLoad: " + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnUnloadHandler =function() {
	if(!this.handleOnUnload) {
		var sourceCode = this.events["onUnload"];
		if(sourceCode) {
			sourceCode = "this.handleOnUnload = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnUnload) {
		try {
			this.handleOnUnload();
		}
		catch(e) {
			console.log("OnUnload: " + e.message);
		}
	}

	return true;
}

/////////////////////////////////////////////////////////////

UIElement.prototype.callOnMovedHandler = function() {
	if(!this.handleOnMoved) {
		var sourceCode = this.events["onMoved"];
		if(sourceCode) {
			sourceCode = "this.handleOnMoved = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnMoved) {
		try {
			this.handleOnMoved();
		}catch(e) {
			console.log("this.handleOnMoved:" + e.message);
		}
	}

	if(this.cameraFollowMe) {
		this.getWindow().cameraFollow(this);
	}

	return true;
}

UIElement.prototype.callOnBeginContactHandler = function(body, contact) {
	if(this.onBeginContact) {
		this.onBeginContact(body, contact);

		return;
	}

	if(!this.handleOnBeginContact) {
		var sourceCode = this.events["onBeginContact"];
		if(sourceCode) {
			sourceCode = "this.handleOnBeginContact = function(body, contact) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnBeginContact) {
		try {
			this.handleOnBeginContact(body, contact);
		}catch(e) {
			console.log("this.handleOnBeginContact:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnEndContactHandler = function(body, contact) {
	if(this.onEndContact) {
		this.onEndContact(body, contact);

		return;
	}

	if(!this.handleOnEndContact) {
		var sourceCode = this.events["onEndContact"];
		if(sourceCode) {
			sourceCode = "this.handleOnEndContact = function(body, contact) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnEndContact) {
		try {
			this.handleOnEndContact(body, contact);
		}catch(e) {
			console.log("this.handleOnEndContact:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnAnimateDoneHandler = function(name) {
	if(!this.handleOnAnimateDone) {
		var sourceCode = this.events["onAnimateDone"];
		if(sourceCode) {
			sourceCode = "this.handleOnAnimateDone = function(name) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnAnimateDone) {
		try {
			this.handleOnAnimateDone(name);
		}
		catch(e) {
			console.log("onAnimateDone: " + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnSwipeLeftHandler = function() {
	if(!this.handleOnSwipeLeft) {
		var sourceCode = this.events["onSwipeLeft"];
		if(sourceCode) {
			sourceCode = "this.handleOnSwipeLeft = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnSwipeLeft) {
		try {
			this.handleOnSwipeLeft();
		}catch(e) {
			console.log("this.handleOnSwipeLeft:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnSwipeRightHandler = function() {
	if(!this.handleOnSwipeRight) {
		var sourceCode = this.events["onSwipeRight"];
		if(sourceCode) {
			sourceCode = "this.handleOnSwipeRight = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnSwipeRight) {
		try {
			this.handleOnSwipeRight();
		}catch(e) {
			console.log("this.handleOnSwipeRight:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnSwipeUpHandler = function() {
	if(!this.handleOnSwipeUp) {
		var sourceCode = this.events["onSwipeUp"];
		if(sourceCode) {
			sourceCode = "this.handleOnSwipeUp = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnSwipeUp) {
		try {
			this.handleOnSwipeUp();
		}catch(e) {
			console.log("this.handleOnSwipeUp:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnSwipeDownHandler = function() {
	if(!this.handleOnSwipeDown) {
		var sourceCode = this.events["onSwipeDown"];
		if(sourceCode) {
			sourceCode = "this.handleOnSwipeDown = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnSwipeDown) {
		try {
			this.handleOnSwipeDown();
		}catch(e) {
			console.log("this.handleOnSwipeDown:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnBecomeZeroHandler = function() {
	if(!this.handleOnBecomeZero) {
		var sourceCode = this.events["onBecomeZero"];
		if(sourceCode) {
			sourceCode = "this.handleOnBecomeZero = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnBecomeZero) {
		try {
			this.handleOnBecomeZero();
		}catch(e) {
			console.log("this.handleOnBecomeZero:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnBecomeFullHandler = function() {
	if(!this.handleOnBecomeFull) {
		var sourceCode = this.events["onBecomeFull"];
		if(sourceCode) {
			sourceCode = "this.handleOnBecomeFull = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnBecomeFull) {
		try {
			this.handleOnBecomeFull();
		}catch(e) {
			console.log("this.handleOnBecomeFull:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnTimeoutHandler = function() {
	if(!this.handleOnTimeout) {
		var sourceCode = this.events["onTimeout"];
		if(sourceCode) {
			sourceCode = "this.handleOnTimeout = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnTimeout) {
		try {
			this.handleOnTimeout();
		}catch(e) {
			console.log("this.handleOnTimeout:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnSystemInitHandler = function() {
	if(!this.handleOnSystemInit) {
		var sourceCode = this.events["onSystemInit"];
		if(sourceCode) {
			sourceCode = "this.handleOnSystemInit = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnSystemInit) {
		try {
			this.handleOnSystemInit();
		}catch(e) {
			console.log("this.handleOnSystemInit:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnScrollOutOfRangeHandler = function(offset) {
	if(!this.enable) {
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
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnScrollOutOfRange) {
		try {
			this.handleOnScrollOutOfRange(offset);
		}catch(e) {
			console.log("this.handleOnScrollOutOfRange:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnBirthedHandler = function() {
	if(!this.handleOnBirthed) {
		var sourceCode = this.events["onBirthed"];
		if(sourceCode) {
			sourceCode = "this.handleOnBirthed = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnBirthed) {
		try {
			this.handleOnBirthed();
		}catch(e) {
			console.log("this.handleOnBirthed:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.dispatchCustomEvent = function(eventName, args) {
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
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
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
			console.log("handleCustomEvent " + eventName + ":" + e.message);
		}
	}

	return true;
}

