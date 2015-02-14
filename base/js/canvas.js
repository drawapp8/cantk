/*
 * File: canvas.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: functions to wrap html5 canvas.
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

if (typeof KeyEvent === "undefined") {
    var KeyEvent = {
        DOM_VK_CANCEL: 3,
        DOM_VK_HELP: 6,
        DOM_VK_BACK_SPACE: 8,
        DOM_VK_TAB: 9,
        DOM_VK_CLEAR: 12,
        DOM_VK_RETURN: 13,
        DOM_VK_ENTER: 14,
        DOM_VK_SHIFT: 16,
        DOM_VK_CONTROL: 17,
        DOM_VK_ALT: 18,
        DOM_VK_PAUSE: 19,
        DOM_VK_CAPS_LOCK: 20,
        DOM_VK_ESCAPE: 27,
        DOM_VK_SPACE: 32,
        DOM_VK_PAGE_UP: 33,
        DOM_VK_PAGE_DOWN: 34,
        DOM_VK_END: 35,
        DOM_VK_HOME: 36,
        DOM_VK_LEFT: 37,
        DOM_VK_UP: 38,
        DOM_VK_RIGHT: 39,
        DOM_VK_DOWN: 40,
        DOM_VK_PRINTSCREEN: 44,
        DOM_VK_INSERT: 45,
        DOM_VK_DELETE: 46,
        DOM_VK_0: 48,
        DOM_VK_1: 49,
        DOM_VK_2: 50,
        DOM_VK_3: 51,
        DOM_VK_4: 52,
        DOM_VK_5: 53,
        DOM_VK_6: 54,
        DOM_VK_7: 55,
        DOM_VK_8: 56,
        DOM_VK_9: 57,
        DOM_VK_SEMICOLON: 59,
        DOM_VK_EQUALS: 61,
        DOM_VK_A: 65,
        DOM_VK_B: 66,
        DOM_VK_C: 67,
        DOM_VK_D: 68,
        DOM_VK_E: 69,
        DOM_VK_F: 70,
        DOM_VK_G: 71,
        DOM_VK_H: 72,
        DOM_VK_I: 73,
        DOM_VK_J: 74,
        DOM_VK_K: 75,
        DOM_VK_L: 76,
        DOM_VK_M: 77,
        DOM_VK_N: 78,
        DOM_VK_O: 79,
        DOM_VK_P: 80,
        DOM_VK_Q: 81,
        DOM_VK_R: 82,
        DOM_VK_S: 83,
        DOM_VK_T: 84,
        DOM_VK_U: 85,
        DOM_VK_V: 86,
        DOM_VK_W: 87,
        DOM_VK_X: 88,
        DOM_VK_Y: 89,
        DOM_VK_Z: 90,
        DOM_VK_CONTEXT_MENU: 93,
        DOM_VK_NUMPAD0: 96,
        DOM_VK_NUMPAD1: 97,
        DOM_VK_NUMPAD2: 98,
        DOM_VK_NUMPAD3: 99,
        DOM_VK_NUMPAD4: 100,
        DOM_VK_NUMPAD5: 101,
        DOM_VK_NUMPAD6: 102,
        DOM_VK_NUMPAD7: 103,
        DOM_VK_NUMPAD8: 104,
        DOM_VK_NUMPAD9: 105,
        DOM_VK_MULTIPLY: 106,
        DOM_VK_ADD: 107,
        DOM_VK_SEPARATOR: 108,
        DOM_VK_SUBTRACT: 109,
        DOM_VK_DECIMAL: 110,
        DOM_VK_DIVIDE: 111,
        DOM_VK_BACK_BUTTON: 115, /*F4*/
        DOM_VK_MENU_BUTTON: 118, /*F7*/
        DOM_VK_SEARCH_BUTTON: 120, /*F9*/
        DOM_VK_F1: 112,
        DOM_VK_F2: 113,
        DOM_VK_F3: 114,
        DOM_VK_F4: 115,
        DOM_VK_F5: 116,
        DOM_VK_F6: 117,
        DOM_VK_F7: 118,
        DOM_VK_F8: 119,
        DOM_VK_F9: 120,
        DOM_VK_F10: 121,
        DOM_VK_F11: 122,
        DOM_VK_F12: 123,
        DOM_VK_F13: 124,
        DOM_VK_F14: 125,
        DOM_VK_F15: 126,
        DOM_VK_F16: 127,
        DOM_VK_F17: 128,
        DOM_VK_F18: 129,
        DOM_VK_F19: 130,
        DOM_VK_F20: 131,
        DOM_VK_F21: 132,
        DOM_VK_F22: 133,
        DOM_VK_F23: 134,
        DOM_VK_F24: 135,
        DOM_VK_NUM_LOCK: 144,
        DOM_VK_SCROLL_LOCK: 145,
        DOM_VK_COMMA: 188,
        DOM_VK_PERIOD: 190,
        DOM_VK_SLASH: 191,
        DOM_VK_BACK_QUOTE: 192,
        DOM_VK_OPEN_BRACKET: 219,
        DOM_VK_BACK_SLASH: 220,
        DOM_VK_CLOSE_BRACKET: 221,
        DOM_VK_QUOTE: 222,
        DOM_VK_META: 224
    };
}
KeyEvent.DOM_VK_BACK = 225;

var C_EVT_POINTER_DOWN = 1;
var C_EVT_POINTER_MOVE = 0;
var C_EVT_POINTER_UP = -1;

var C_EVT_KEY_DOWN = 2;
var C_EVT_KEY_UP = 3;
var C_EVT_DOUBLE_CLICK = 4;
var C_EVT_CONTEXT_MENU = 5;
var C_EVT_LONG_PRESS = 6;
var C_EVT_SCALE = 7;

var gCancelDefaultAction = false;

function canvasMaxizeIt(canvas, inlineEdit) {
	var view = cantkGetViewPort();
	
	canvas.style.position = "absolute";
	canvas.style.top = 0;
	canvas.style.left = 0;
	canvas.style.zIndex = 0;

	if(inlineEdit || isMobile()) {
		canvas.width  = view.width;
		canvas.height = view.height;
	}
	else {
		canvas.width  = view.width - 20;
		canvas.height = Math.max(view.height * 1.8, 600);
	}

	console.log("canvas size:" + canvas.width + "x" + canvas.height);

	if(canvas.height < 200) {
		canvas.height = 600;
	}

	if(canvas.width < 300) {
		canvas.width = 600;
	}
	
	return;
}

function canvasCreate(id) {
	var canvas = null;
	
	if("string" === typeof id) {
		canvas = document.getElementById(id);
		if(!canvas) {
			canvas = document.createElement("canvas"); 
			canvas.style.zIndex = 0;
			canvas.id = id;

			document.body.appendChild(canvas); 
		}
	}
	else {
		canvas = id;
	}

	return canvas;
}

function canvasAttachManager(canvas, manager, app) {
	window.pointer.emitPointers(canvas);

	function getEvent(e) {
		return e ? e: window.event;
	}
	
	function onKeyDown(e) {
		e = getEvent(e);
		var code = e.keyCode;
		
		if(code === KeyEvent.DOM_VK_F5 || code === KeyEvent.DOM_VK_F12 || code === KeyEvent.DOM_VK_F11) {
			return true;
		}
		
		if(targetIsEditor(e)) {
			return true;
		}

		if(!manager.preprocessEvent(C_EVT_KEY_DOWN, e, code)) {
			return true;
		}
		
		manager.onKeyDown(code);
	
		if(code === KeyEvent.DOM_VK_F8) {
			//test code
			var gesture = {scale:1, rotation:0};
			
			gesture.isStart = true;
			manager.onGesture(gesture);

			gesture.isStart = false;
			gesture.isChange = true;
			manager.onGesture(gesture);
			
			gesture.isChange = false;
			gesture.isEnd = true;
			manager.onGesture(gesture);
		}

		return returnDefaultAction(e);
	}

	function onKeyUp(e) {
		e = getEvent(e);
		var code = e.keyCode;
		if(code === KeyEvent.DOM_VK_F5 || code === KeyEvent.DOM_VK_F12 || code === KeyEvent.DOM_VK_F11) {
			return true;
		}
		
		if(targetIsEditor(e)) {
			return true;
		}

		if(!manager.preprocessEvent(C_EVT_KEY_UP, e, code)) {
			return true;
		}

		manager.onKeyUp(code);

		return returnDefaultAction(e);
	}

	if(isTizen()) {
		document.addEventListener('tizenhwkey', function(e) {
			if (e.keyName == "back") {
				manager.onKeyDown(KeyEvent.DOM_VK_BACK_BUTTON);
				manager.onKeyUp(KeyEvent.DOM_VK_BACK_BUTTON);
				console.log("tizenhwkey back button.");
			}
			else if (e.keyName == "menu") {
				manager.onKeyDown(KeyEvent.DOM_VK_MENU_BUTTON);
				manager.onKeyUp(KeyEvent.DOM_VK_MENU_BUTTON);
				console.log("tizenhwkey menu button.");
			}
		});
	}
	else if(isPhoneGap()) {
		function onBackKeyDown() {
			manager.onKeyDown(KeyEvent.DOM_VK_BACK_BUTTON);
			manager.onKeyUp(KeyEvent.DOM_VK_BACK_BUTTON);

			return true;
     	}

		function onMenuKeyDown() {
			manager.onKeyDown(KeyEvent.DOM_VK_MENU_BUTTON);
			manager.onKeyUp(KeyEvent.DOM_VK_MENU_BUTTON);

			return true;
		}

  		function onSearchKeyDown() {
			manager.onKeyDown(KeyEvent.DOM_VK_SEARCH_BUTTON);
			manager.onKeyUp(KeyEvent.DOM_VK_SEARCH_BUTTON);

			return true;
		}

		document.addEventListener("backbutton", onBackKeyDown, false);
		document.addEventListener("menubutton", onMenuKeyDown, false);
  		document.addEventListener("searchbutton", onSearchKeyDown, false);
    }
	else if(!isMobile()) {
		cantkAddEventListener('keyup', onKeyUp);
		cantkAddEventListener('keydown', onKeyDown);
		
		function onWheelEvent(event) {
			if(EditorElement.imeOpen) return true;

			event = window.event || event ;
			var delta = event.wheelDelta ? event.wheelDelta : 0;
			if(delta) {
				if(manager.onWheel(delta)) {
					return cancelDefaultAction(event);
				}
			}
			return true;
		}

		cantkAddEventListener('mousewheel', onWheelEvent);
		cantkAddEventListener('DOMMouseScroll', onWheelEvent);
	}

///////////////////////////////////////////////////////////////

	function getAbsPoint (pointer) {
		var x = Math.max(pointer.pageX, pointer.x);
		var y = Math.max(pointer.pageY, pointer.y);

		return {x:x, y:y};
	}

	function isMultiTouchEvent(e) {
		return e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length > 1;
	}
		
	function getLastPointerPoint() {
		var point = {};
		point.x = manager.lastPointerPoint.x;
		point.y = manager.lastPointerPoint.y;

		return point;
	}

	function onPointerDown(e) {
		var pointers = e.getPointerList();
		
		if(isMultiTouchEvent(e)) {
			console.log("onPointerDown Multi touch.");
			return cancelDefaultAction(e);
		}

		if(isRightMouseEvent(e.originalEvent)) {
			console.log("Right button.");
			return cancelDefaultAction(e);
		}

		var pointer = pointers[0];
		var point = getAbsPoint(pointer);
		var id      = pointer.identifier || 0;
		if(manager.preprocessEvent(C_EVT_POINTER_DOWN, e, point)) {
			manager.onPointerDown(point);
		}
	
		console.log("onPointerDown.");
		return cancelDefaultAction(e);
	}

	function onPointerMove(e) {
		var pointers = e.getPointerList();
		
		if(isMultiTouchEvent(e)) {
			console.log("onPointerMove Multi touch.");
			return cancelDefaultAction(e);
		}

		if(isRightMouseEvent(e.originalEvent)) {
			console.log("Right button.");
			return cancelDefaultAction(e);
		}

		var pointer = pointers[0];
		var point = getAbsPoint(pointer);
		if(manager.preprocessEvent(C_EVT_POINTER_MOVE, e, point)) {
			manager.onPointerMove(point);
		}

		return cancelDefaultAction(e);
	}

	function onPointerUp(e) {
		if(isMultiTouchEvent(e)) {
			console.log("onPointerUp Multi touch.");
			return cancelDefaultAction(e);
		}

		var point = getLastPointerPoint();
		if(isRightMouseEvent(e.originalEvent)) {
			console.log("Right mouse up");
			if(manager.preprocessEvent(C_EVT_CONTEXT_MENU, e, point)) {
				manager.onContextMenu(point);
			}
			return true;
		}
		else {
			if(manager.preprocessEvent(C_EVT_POINTER_UP, e, point)) {
				manager.onPointerUp(point);
			}
		}
		
		console.log("onPointerUp.");
		return cancelDefaultAction(e);
	}

	canvas.addEventListener('pointerdown', onPointerDown, false);
	canvas.addEventListener('pointermove', onPointerMove, false);
	canvas.addEventListener('pointerup',   onPointerUp, false);
///////////////////////////////////////////////////////////////	
	function onGestureScale(e) {
		var scale = e.scale;
		var gesture = {scale:scale, rotation:0};
		
		gesture.isChange = false;
		gesture.isStart = e.scaleStart;
		gesture.isEnd = e.scaleEnd;

		if(gesture.isStart) {
			console.log("scaleStart");
		}
		
		if(gesture.isEnd) {
			console.log("scaleEnd");
		}

		manager.onGesture(gesture);
		console.log("onGestureScale:" + scale);

		return;
	}
	
	function onGestureLongPress(e) {
		var point = {};
		point.x = manager.lastPointerPoint.x;
		point.y = manager.lastPointerPoint.y;

		manager.onLongPress(point);

		//test
		//e.scale = 0.5;
		//onGestureScale(e);
		console.log("onGestureLongPress");
		return cancelDefaultAction(e);
	}
	
	function onGestureDoubleTap(e) {
		var point = getLastPointerPoint();

		manager.onDoubleClick(point);
		console.log("onGestureDoubleTap");
		return cancelDefaultAction(e);
	}

	if(app.type == AppBase.TYPE_WEBAPP || app.type == AppBase.TYPE_PREVIEW ) {
		document.oncontextmenu = function(e) {
			var point = {};
			point.x = e.x + getScrollLeft();
			point.y = e.y + getScrollTop();

			manager.onPointerDown(point);
			manager.onLongPress(point);
			manager.onPointerUp(point);

			console.log("onGestureLongPress");
			return cancelDefaultAction(e);
		}
	}

	canvas.addEventListener('gesturedoubletap', onGestureDoubleTap);
	canvas.addEventListener('gesturelongpress', onGestureLongPress);
	canvas.addEventListener('gesturescale', onGestureScale);
///////////////////////////////////////////////////////////////	
	var gViewPort = cantkGetViewPort();
	var gScreenHeight = screen.height;

	function handleInputMethodShow() {
		console.log("input method show");
	}

	function handleInputMethodHide() {
		console.log("input method hide");
	}

	function handleScreenSizeChanged() {
		var vp = cantkGetViewPort();
	   if(gViewPort.width != vp.width || gViewPort.height != vp.height) {
	   		if(gViewPort.width === vp.width) {
	   			if(gViewPort.height < vp.height) {
	   				handleInputMethodHide();
	   			}
	   			else {
	   				handleInputMethodShow();
	   			}

	   			return;
	   		}

			app.onSizeChanged();
			gViewPort = vp;
	   }
	}

	window.onresize = function(e) {
		setTimeout(handleScreenSizeChanged, 50);	
		return;
	}

	var gWindowOrientation = window.orientation;
	function handleOrientationChanged() {
	   if(gWindowOrientation !== window.orientation) {
			app.onSizeChanged();
			gWindowOrientation = window.orientation;
	   }
	}

	window.onorientationchange = function(e) {
		setTimeout(handleOrientationChanged, 50);	
		return;
	}
	
	document.ontouchend = function(e){
		return true;
	}

	return;
}

function cancelDefaultAction(e) {
	var evt = e ? e: window.event;
	if (evt.preventDefault) {
		evt.preventDefault();
	}
	else {
		evt.returnValue = false;
	}

	return false;
}

function filterResults(n_win, n_docel, n_body) {
	var n_result = n_win ? n_win : 0;
	if (n_docel && (!n_result || (n_result > n_docel)))
		n_result = n_docel;
	return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
}

function getScrollLeft() {
	return filterResults (
		window.pageXOffset ? window.pageXOffset : 0,
		document.documentElement ? document.documentElement.scrollLeft : 0,
		document.body ? document.body.scrollLeft : 0
	);
}

function getScrollTop() {
	return filterResults (
		window.pageYOffset ? window.pageYOffset : 0,
		document.documentElement ? document.documentElement.scrollTop : 0,
		document.body ? document.body.scrollTop : 0
	);
}

function isRightMouseEvent(event) {
	var ret = false;
    if (event.which === null) {
       /* IE case */
       ret = (event.button > 2 && event.button !== 4);
	}
    else {
       /* All others */
       ret = (event.which > 2 && event.which !== 2);
	}

	return ret;
}

function setCancelDefaultAction(value) {
	gCancelDefaultAction = value;

	return;
}

function returnDefaultAction(e) {
	return (gCancelDefaultAction) ? cancelDefaultAction(e) : true;
}

function targetIsEditor(e) {
	var tag = e.srcElement ? e.srcElement : e.target; 
	var name = tag.localName ? tag.localName : tag.tagName;

	name = name.toLowerCase();
	if(name != "body" && name != "canvas") {
		return true;
	}
	
	return false;
}

function targetIsCanvas(e) {
	var tag = e.srcElement ? e.srcElement : e.target; 
	var name = tag.localName ? tag.localName : tag.tagName;

	name = name.toLowerCase();
	if(name === "canvas") {
		return true;
	}
	
	return false;
}



