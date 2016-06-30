/*
 * File:   w_events_manager.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  manage all input events
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

function WEventsManager() {
	this.point = {};
	this.lastPoint = {};
	this.pointerDownPoint = {};
	this.longPressDuration = 600;
}

WEventsManager.prototype.setEventsConsumer = function(eventsConsumer, element) {
	if(!this.eventsConsumer) {
		this.eventsConsumer = eventsConsumer;
		this.addEventListeners(element);
	}
}

WEventsManager.prototype.cancelDefaultAction = function(event) {
	var e = event || window.event;
    
	if (e.preventDefault) {
		e.preventDefault();
	}
	else {
		e.returnValue = false;
	}

	return false;
}

WEventsManager.prototype.targetIsEditor = function(e) {
	var tag = e.srcElement ? e.srcElement : e.target; 
	var name = tag.localName ? tag.localName : tag.tagName;

	name = name.toLowerCase();
	if(name != "body" && name != "canvas") {
		return true;
	}
	
	return false;
}

WEventsManager.prototype.shouldIgnoreKey = function(event) {
	var e = event || window.event;
	var code = e.keyCode;
	
	if(code === KeyEvent.DOM_VK_F5 || code === KeyEvent.DOM_VK_F12 || code === KeyEvent.DOM_VK_F11) {
		return true;
	}
	
	if(this.targetIsEditor(e)) {
		return true;
	}

	return false;
}

WEventsManager.prototype.onKeyDownGlobal = function(event) {
	var e = event || window.event;
	var code = e.keyCode;

	if(this.shouldIgnoreKey(e)) {
		return true;
	}
	else {
		this.onKeyDown(code, e);
		return this.cancelDefaultAction(e);
	}
}

WEventsManager.prototype.onKeyUpGlobal = function(event) {
	var e = event || window.event;
	var code = e.keyCode;
	if(this.shouldIgnoreKey(e)) {
		return true;
	}
	else {
		this.onKeyUp(code, e);
		return this.cancelDefaultAction(e);
	}
}

WEventsManager.prototype.onWheelGlobal = function(event) {
	var e = window.event || event ;
	if(EditorElement.imeOpen) return true;

	if(e.target && e.target.localName !== "canvas"){
		return this.cancelDefaultAction(e);
	}

	var delta = e.wheelDelta || e.detail * -8;
	if(delta) {
		if(this.onWheel(delta, e)) {
			return this.cancelDefaultAction(e);
		}
	}

	return true;
}

WEventsManager.prototype.onTizenKeys = function(e) {
	if (e.keyName == "back") {
		this.onKeyDown(KeyEvent.DOM_VK_BACK_BUTTON, e);
		this.onKeyUp(KeyEvent.DOM_VK_BACK_BUTTON, e);
	}
	else if (e.keyName == "menu") {
		this.onKeyDown(KeyEvent.DOM_VK_MENU_BUTTON, e);
		this.onKeyUp(KeyEvent.DOM_VK_MENU_BUTTON, e);
	}
}

WEventsManager.prototype.onPhonegapBackButton = function() {
	this.onKeyDown(KeyEvent.DOM_VK_BACK_BUTTON);
	this.onKeyUp(KeyEvent.DOM_VK_BACK_BUTTON);
}

WEventsManager.prototype.onPhonegapMenuButton = function() {
	this.onKeyDown(KeyEvent.DOM_VK_MENU_BUTTON);
	this.onKeyUp(KeyEvent.DOM_VK_MENU_BUTTON);
}

WEventsManager.prototype.onPhonegapSearchButton = function() {
	this.onKeyDown(KeyEvent.DOM_VK_SEARCH_BUTTON);
	this.onKeyUp(KeyEvent.DOM_VK_SEARCH_BUTTON);
}

WEventsManager.prototype.addEventListeners = function(element) {
	if(!element) {
		element = window;
	}

	document.addEventListener('tizenhwkey', this.onTizenKeys.bind(this));
	document.addEventListener("backbutton", this.onPhonegapBackButton.bind(this));
	document.addEventListener("menubutton", this.onPhonegapMenuButton.bind(this));
	document.addEventListener("searchbutton", this.onPhonegapSearchButton.bind(this));
	if(this.isPointer()) {
		WEventsManager.pointerDeviceType = "pointer";
		element.addEventListener('pointerdown', this.onPointerDownGlobal.bind(this));
		element.addEventListener('pointermove', this.onPointerMoveGlobal.bind(this));
		element.addEventListener('pointerup', this.onPointerUpGlobal.bind(this));
		element.addEventListener('mousewheel', this.onWheelGlobal.bind(this));
	}
	else if(this.isMSPointer()) {
		WEventsManager.pointerDeviceType = "pointer";
		element.addEventListener('MSPointerDown', this.onPointerDownGlobal.bind(this));
		element.addEventListener('MSPointerMove', this.onPointerMoveGlobal.bind(this));
		element.addEventListener('MSPointerUp', this.onPointerUpGlobal.bind(this));
		element.addEventListener('mousewheel', this.onWheelGlobal.bind(this));
	}
	else if(isMobile()) {
		WEventsManager.pointerDeviceType = "touch";
		element.addEventListener('MSPointerDown', this.onPointerDownGlobal.bind(this));
		element.addEventListener('touchstart', this.onTouchStartGlobal.bind(this));
		element.addEventListener('touchmove', this.onTouchMoveGlobal.bind(this));
		element.addEventListener('touchend', this.onTouchEndGlobal.bind(this));
	}
	else {
		WEventsManager.pointerDeviceType = "mouse";
		element.addEventListener('dblclick', this.onDoubleClickGlobal.bind(this));
		element.addEventListener('mousewheel', this.onWheelGlobal.bind(this));
		element.addEventListener('DOMMouseScroll', this.onWheelGlobal.bind(this));
		element.addEventListener('mousedown', this.onMouseDownGlobal.bind(this));
		element.addEventListener('mousemove', this.onMouseMoveGlobal.bind(this));
		element.addEventListener('mouseup', this.onMouseUpGlobal.bind(this));
	}
	window.addEventListener('keyup', this.onKeyUpGlobal.bind(this));
	window.addEventListener('keydown', this.onKeyDownGlobal.bind(this));

	return;
}

WEventsManager.prototype.isMultiTouchEvent = function(e) {
	return e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length > 1;
}

WEventsManager.points = [{},{},{},{},{},{},{},{}];
WEventsManager.prototype.getAbsPoint = function(e, i) {
	var index = i || 0;
	var p = WEventsManager.points[index];

	if(e) {
		p.x = Math.max(e.pageX, e.x || e.clientX);
		p.y = Math.max(e.pageY, e.y || e.clientY);
		p.event = e;

		this.lastPoint.x = p.x;
		this.lastPoint.y = p.y;
		this.lastPointEvent = e;
	}
	else {
		p = this.lastPoint;
	}

	return p;
}
  
WEventsManager.prototype.getPointerList = function(e) {
    var pointers = [];
    var pointer;
    if (this.touchList) {
      for (var i = 0; i < this.touchList.length; i++) {
        var touch = this.touchList[i];
        // Add 2 to avoid clashing with the mouse identifier.
        pointer = new Pointer(touch.identifier + 2, PointerTypes.TOUCH, touch);
        pointers.push(pointer);
      }
    } else if (this.msPointerList) {
      for (var identifier in this.msPointerList) {
        if (!this.msPointerList.hasOwnProperty(identifier)) continue;
        pointer = this.msPointerList[identifier];
        pointer = new Pointer(identifier, pointer.textPointerType, pointer);
        pointers.push(pointer);
      }
    }
    if (this.mouseEvent) {
      pointers.push(new Pointer(MOUSE_ID, PointerTypes.MOUSE, this.mouseEvent));
    }
    return pointers;
  }

WEventsManager.prototype.isPointer = function() {
	return window.navigator.pointerEnabled;
}

WEventsManager.prototype.isMSPointer = function() {
    return window.navigator.msPointerEnabled;
}

WEventsManager.prototype.isRightMouseEvent = function(event) {
	var ret = false;
    if (event.which === null) {
       ret = (event.button > 2 && event.button !== 4);
	}
    else {
       ret = (event.which > 2 && event.which !== 2);
	}

	return ret;
}

WEventsManager.prototype.onDoubleClickGlobal = function(event) {
	var e = window.event || event ;
	if(this.targetIsEditor(e)) {
		return true;
	}

	if(!this.isRightMouseEvent(e)) {
		this.onDoubleClick(this.getAbsPoint(e), e);
	}

	return this.cancelDefaultAction(e);
}

WEventsManager.prototype.onMouseDownGlobal = function(event) {
	var e = window.event || event ;
	if(this.targetIsEditor(e)) {
		return true;
	}

	if(!this.isRightMouseEvent(e)) {
		this.onPointerDown(this.getAbsPoint(e), e);
	}

	return this.cancelDefaultAction(e);
}

WEventsManager.prototype.onMouseMoveGlobal = function(event) {
	var e = window.event || event ;
	if(this.targetIsEditor(e) && !this.pointerDown) {
		return true;
	}

	this.onPointerMove(this.getAbsPoint(e), e);

	return this.cancelDefaultAction(e);
}

WEventsManager.prototype.onMouseUpGlobal = function(event) {
	var e = window.event || event ;
	if(this.targetIsEditor(e) && !this.pointerDown) {
		return true;
	}

	if(this.isRightMouseEvent(e)) {
		this.onContextMenu(this.getAbsPoint(e), e);
	}
	else {
		this.onPointerUp(this.getAbsPoint(e), e);
	}

	return this.cancelDefaultAction(e);
}

WEventsManager.prototype.getTouchList = function(event) {
	return event.touches || event.changedTouches || event.touchList;
}

WEventsManager.prototype.getTouchPoints = function(e) {
	var points = [];
	var touchList = this.getTouchList(e);
	var n = touchList.length;

	for(var i = 0; i < n; i++) {
		var touch = touchList[i];
		var point = this.getAbsPoint(touch, i);
		
		point.event = e;
		point.id = touch.identifier;
		points.push(point);
	}

	return points;
}

WEventsManager.prototype.onTouchStartGlobal = function(event) {
	var e = window.event || event ;
	var points = this.getTouchPoints(e);
	
	if(points.length === 1) {
		this.point.x = points[0].x;
		this.point.y = points[0].y;

		this.onPointerDown(this.point, e);
	}
	this.onMultiTouch("touchstart", points, e);

	return this.cancelDefaultAction(e);
}

WEventsManager.prototype.onTouchMoveGlobal = function(event) {
	var e = window.event || event ;
	var points = this.getTouchPoints(e);
	
	if(points.length === 1) {
		this.point.x = points[0].x;
		this.point.y = points[0].y;

		this.onPointerMove(this.point, e);
	}
	this.onMultiTouch("touchmove", points, e);

	return this.cancelDefaultAction(e);
}

WEventsManager.prototype.onTouchEndGlobal = function(event) {
	var e = window.event || event ;
	var points = this.getTouchPoints(e);

	if(!points.length) {
        var last = this.lastPointerTime;
        var cur = new Date();
        this.lastPointerTime = cur; 
        var dbClick = false;
        if(last) {
            var diff = cur - last;
            if(diff < 200) {
                dbClick = true;
                this.lastPointerTime = 0;
            }
        }
		if(dbClick) {
            this.onDoubleClick(this.getAbsPoint(null), e);
        }
        this.onPointerUp(this.getAbsPoint(null), e);
	}

	this.onMultiTouch("touchend", points, e);

	return this.cancelDefaultAction(e);
}

WEventsManager.prototype.onPointerDownGlobal = function(event) {
	var e = window.event || event ;

	this.onPointerDown(this.getAbsPoint(e), e);

	return this.cancelDefaultAction(e);
}

WEventsManager.prototype.onPointerMoveGlobal = function(event) {
	var e = window.event || event ;

	this.onPointerMove(this.getAbsPoint(e), e);

	return this.cancelDefaultAction(e);
}

WEventsManager.prototype.onPointerUpGlobal = function(event) {
	var e = window.event || event ;

	this.onPointerUp(this.getAbsPoint(e), e);
	
	return this.cancelDefaultAction(e);
}

WEventsManager.prototype.onKeyDown = function(code, event) {
	if(this.eventsConsumer.preprocessEvent(0, event)) {
		this.eventsConsumer.onKeyDown(code);
	}
}

WEventsManager.prototype.onKeyUp = function(code, event) {
	if(this.eventsConsumer.preprocessEvent(0, event)) {
		this.eventsConsumer.onKeyUp(code);
	}
}

WEventsManager.prototype.onWheel = function(delta, event) {
	if(this.eventsConsumer.preprocessEvent(0, event)) {
		this.eventsConsumer.onWheel(delta);
	}
}

WEventsManager.prototype.onLongPress = function() {
	this.onContextMenu(this.lastPoint, this.lastPointEvent);
}

WEventsManager.prototype.onMultiTouch = function(action, points, event) {
	if(this.eventsConsumer.preprocessEvent(0, event)) {
		this.eventsConsumer.onMultiTouch(action, points, event);
	}
}

WEventsManager.prototype.onPointerDown = function(point, event) {
	this.pointerDown = true;

	if(this.eventsConsumer.preprocessEvent(0, event)) {
		this.eventsConsumer.onPointerDown(point);
		//console.log("onPointerDown:" + point.x + "x" + point.y);
	}
}

WEventsManager.prototype.onPointerMove = function(point, event) {
	if(this.eventsConsumer.preprocessEvent(0, event)) {
		this.eventsConsumer.onPointerMove(point);
	}
}

WEventsManager.prototype.onPointerUp = function(point, event) {
	if(this.eventsConsumer.preprocessEvent(0, event)) {
		this.eventsConsumer.onPointerUp(point);
		//console.log("onPointerUp:" + point.x + "x" + point.y);
	}

	this.pointerDown = false;
}

WEventsManager.prototype.onDoubleClick = function(point, event) {
	if(this.eventsConsumer.preprocessEvent(0, event)) {
		this.eventsConsumer.onDoubleClick(point);
	}
}

WEventsManager.prototype.onContextMenu = function(point, event) {
	if(this.eventsConsumer.preprocessEvent(0, event)) {
		this.eventsConsumer.onContextMenu(point);
	}
	//console.log("onContextMenu:" + point.x + "x" + point.y);
}

WEventsManager.targetIsCanvas = function(e) {
	var tag = e.srcElement ? e.srcElement : e.target; 
	var name = tag.localName ? tag.localName : tag.tagName;

	name = name.toLowerCase();
	if(name === "canvas") {
		return true;
	}
	
	return false;
}

WEventsManager.getInstance = function() {
	if(!WEventsManager.instance) {
		WEventsManager.instance = new WEventsManager();
	}

	return WEventsManager.instance;
}

WEventsManager.prototype.getPointerDeviceType = function() {
	return WEventsManager.pointerDeviceType;
}

WEventsManager.prototype.getInputScale = function() {
	return this.eventsConsumer.getInputScale();
}


WEventsManager.setEventsConsumer = function(eventsConsumer, element) {
	WEventsManager.getInstance().setEventsConsumer(eventsConsumer, element);
};

