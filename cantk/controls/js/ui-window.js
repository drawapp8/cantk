/*
 * File:   ui-window.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Window
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIWindow
 * @extends UIElement
 * 窗口是普通窗口和对话框的基类。
 *
 */
function UIWindow() {
	return;
}

/**
 * @event onLoad 
 * 此事件在第一批资源加载完成时触发。发生在onSystemInit事件之后，onBeforeOpen事件之前。
 *
 * 注意：由于窗口并未打开，请不要使用界面上的控件。
 */

/**
 * @event onSystemInit
 * 系统初始化事件，UI数据加载完成，但其它资源尚未加载。
 *
 * 注意：由于窗口并未打开，请不要使用界面上的控件。
 */

/**
 * @event onBeforeOpen
 * 窗口已经创建，但是还没有显示出来。
 *
 * 注意：请不要在onBeforeOpen事件再打开另外一个窗口，否则可能出现不可预料的错误。
 *
 * @param {Object} initData 初始化参数，此参数是从openWindow方法传过来的。
 *
 */

/**
 * @event onOpen
 * 窗口打开事件。
 * @param {Object} initData 初始化参数，此参数是从openWindow方法传过来的。
 *
 * 打开窗口：
 *
 *     @example small frame
 *     var initData = "abcd";
 *     this.openWindow("win-test", function (retCode) {console.log("window closed.");}, false, initData);
 *
 * onOpen事件处理代码：
 *
 *     @example small frame
 *     console.log(initData);
 *
 */

/**
 * @event onClose
 * 窗口关闭。
 * @param {Object} retInfo 由closeWindow函数传递过来。
 *
 */

/**
 * @event onSwitchToBack
 * 打开新窗口，当前窗口切换到后台时，当前窗口触发本事件。
 *
 */

/**
 * @event onSwitchToFront
 * 关闭当前窗口，前一个窗口切换到前台时，前一个窗口触发本事件。
 */

/**
 * @event onSwipeLeft
 * 手势向左滑动事件。
 * @param {Point} start 起始点。
 * @param {Point} end 结束点。
 */

/**
 * @event onSwipeRight
 * 手势向右滑动事件。
 * @param {Point} start 起始点。
 * @param {Point} end 结束点。
 */

/**
 * @event onSwipeUp
 * 手势向上滑动事件。
 * @param {Point} start 起始点。
 * @param {Point} end 结束点。
 */

/**
 * @event onSwipeDown
 * 手势向下滑动事件。
 * @param {Point} start 起始点。
 * @param {Point} end 结束点。
 */


/**
 * @event onKeyDown
 * Key Down事件。
 * @param {Number} code 按键的代码。
 *
 * 代码影射表：
 *
 *     @example small frame
 *
 *     var KeyEvent = {
 *        DOM_VK_CANCEL: 3,
 *        DOM_VK_HELP: 6,
 *        DOM_VK_BACK_SPACE: 8,
 *        DOM_VK_TAB: 9,
 *        DOM_VK_CLEAR: 12,
 *        DOM_VK_RETURN: 13,
 *        DOM_VK_ENTER: 14,
 *        DOM_VK_SHIFT: 16,
 *        DOM_VK_CONTROL: 17,
 *        DOM_VK_ALT: 18,
 *        DOM_VK_PAUSE: 19,
 *        DOM_VK_CAPS_LOCK: 20,
 *        DOM_VK_ESCAPE: 27,
 *        DOM_VK_SPACE: 32,
 *        DOM_VK_PAGE_UP: 33,
 *        DOM_VK_PAGE_DOWN: 34,
 *        DOM_VK_END: 35,
 *        DOM_VK_HOME: 36,
 *        DOM_VK_LEFT: 37,
 *        DOM_VK_UP: 38,
 *        DOM_VK_RIGHT: 39,
 *        DOM_VK_DOWN: 40,
 *        DOM_VK_PRINTSCREEN: 44,
 *        DOM_VK_INSERT: 45,
 *        DOM_VK_DELETE: 46,
 *        DOM_VK_0: 48,
 *        DOM_VK_1: 49,
 *        DOM_VK_2: 50,
 *        DOM_VK_3: 51,
 *        DOM_VK_4: 52,
 *        DOM_VK_5: 53,
 *        DOM_VK_6: 54,
 *        DOM_VK_7: 55,
 *        DOM_VK_8: 56,
 *        DOM_VK_9: 57,
 *        DOM_VK_SEMICOLON: 59,
 *        DOM_VK_EQUALS: 61,
 *        DOM_VK_A: 65,
 *        DOM_VK_B: 66,
 *        DOM_VK_C: 67,
 *        DOM_VK_D: 68,
 *        DOM_VK_E: 69,
 *        DOM_VK_F: 70,
 *        DOM_VK_G: 71,
 *        DOM_VK_H: 72,
 *        DOM_VK_I: 73,
 *        DOM_VK_J: 74,
 *        DOM_VK_K: 75,
 *        DOM_VK_L: 76,
 *        DOM_VK_M: 77,
 *        DOM_VK_N: 78,
 *        DOM_VK_O: 79,
 *        DOM_VK_P: 80,
 *        DOM_VK_Q: 81,
 *        DOM_VK_R: 82,
 *        DOM_VK_S: 83,
 *        DOM_VK_T: 84,
 *        DOM_VK_U: 85,
 *        DOM_VK_V: 86,
 *        DOM_VK_W: 87,
 *        DOM_VK_X: 88,
 *        DOM_VK_Y: 89,
 *        DOM_VK_Z: 90,
 *        DOM_VK_CONTEXT_MENU: 93,
 *        DOM_VK_NUMPAD0: 96,
 *        DOM_VK_NUMPAD1: 97,
 *        DOM_VK_NUMPAD2: 98,
 *        DOM_VK_NUMPAD3: 99,
 *        DOM_VK_NUMPAD4: 100,
 *        DOM_VK_NUMPAD5: 101,
 *        DOM_VK_NUMPAD6: 102,
 *        DOM_VK_NUMPAD7: 103,
 *        DOM_VK_NUMPAD8: 104,
 *        DOM_VK_NUMPAD9: 105,
 *        DOM_VK_MULTIPLY: 106,
 *        DOM_VK_ADD: 107,
 *        DOM_VK_SEPARATOR: 108,
 *        DOM_VK_SUBTRACT: 109,
 *        DOM_VK_DECIMAL: 110,
 *        DOM_VK_DIVIDE: 111,
 *        DOM_VK_BACK_BUTTON: 115, 
 *        DOM_VK_MENU_BUTTON: 118, 
 *        DOM_VK_SEARCH_BUTTON: 120, 
 *        DOM_VK_F1: 112,
 *        DOM_VK_F2: 113,
 *        DOM_VK_F3: 114,
 *        DOM_VK_F4: 115,
 *        DOM_VK_F5: 116,
 *        DOM_VK_F6: 117,
 *        DOM_VK_F7: 118,
 *        DOM_VK_F8: 119,
 *        DOM_VK_F9: 120,
 *        DOM_VK_F10: 121,
 *        DOM_VK_F11: 122,
 *        DOM_VK_F12: 123,
 *        DOM_VK_F13: 124,
 *        DOM_VK_F14: 125,
 *        DOM_VK_F15: 126,
 *        DOM_VK_F16: 127,
 *        DOM_VK_F17: 128,
 *        DOM_VK_F18: 129,
 *        DOM_VK_F19: 130,
 *        DOM_VK_F20: 131,
 *        DOM_VK_F21: 132,
 *        DOM_VK_F22: 133,
 *        DOM_VK_F23: 134,
 *        DOM_VK_F24: 135,
 *        DOM_VK_NUM_LOCK: 144,
 *        DOM_VK_SCROLL_LOCK: 145,
 *        DOM_VK_COMMA: 188,
 *        DOM_VK_PERIOD: 190,
 *        DOM_VK_SLASH: 191,
 *        DOM_VK_BACK_QUOTE: 192,
 *        DOM_VK_OPEN_BRACKET: 219,
 *        DOM_VK_BACK_SLASH: 220,
 *        DOM_VK_CLOSE_BRACKET: 221,
 *        DOM_VK_QUOTE: 222,
 *        DOM_VK_META: 224,
 *        DOM_VK_BACK: 225
 *      }
 *
 * 用法示例：
 *
 *     @example small frame
 *     var win = this.getWindow();
 *     var image = win.find("image");
 *     switch (code) {
 *         case KeyEvent.DOM_VK_UP:
 *             image.y -= 5;
 *             break;
 *         case KeyEvent.DOM_VK_DOWN:
 *             image.y += 5;
 *             break;
 *         case KeyEvent.DOM_VK_LEFT:
 *             image.x -= 5;
 *             break;
 *         case KeyEvent.DOM_VK_RIGHT:
 *             image.x += 5;
 *             break;
 *         default:
 *             break;
 *     }
 */

/**
 * @event onKeyUp
 * Key Up事件。
 * @param {Number} code 按键的代码。
 */

/**
 * @event onMultiTouch
 * 多点触摸事件。
 * @param {String} action "touchstart", "touchmove", "touchend"
 * @param {Array} points 点的数组。坐标是根据Canvas的缩放比例转换过的，相对当前窗口的坐标。
 * @param {Object} event 原始Touch事件。
 */

UIWindow.serialNo = 0;
UIWindow.prototype = new UIElement();
UIWindow.prototype.isUIWindow = true;
UIWindow.prototype.saveProps = ["openAnimationDuration", "closeAnimationDuration", "animHint", "windowType",
"closeWhenPointerUpOutside", "refLinesV", "refLinesH", "windowNameToBeOpen", "preloadWindows", "isUILoadingWindowV2", "isUILoadingWindow", "sceneId"];

UIWindow.prototype.fromJson = function(json) {
	this.jsonData = json;
	this.name = json.name;

	if(json.isUILoadingWindow) {
		RShape.prototype.fromJson.call(this, json);
	}
	else {
        Object.keys(json.events).forEach(function(ev) {
            this.events[ev] = json.events[ev];
        }, this);
	}

	return this;
}

UIWindow.prototype.fromJsonNow = function(json) {
	RShape.prototype.fromJson.call(this, json);
	this.relayout();

	return this;
}

UIWindow.prototype.onGesture = function(gesture) {
	if(!this.isInDesignMode()) {
		this.callOnGestureHandler(gesture);
	}

	return;
}

UIWindow.prototype.onMultiTouch = function(action, points, event) {
	this.callOnMultiTouchHandler(action, points, event);
}

UIWindow.prototype.isMainWindow = function() {
	var wm = this.getWindowManager();
	var index = wm.history[0];
	var firstWin = wm.children[index];

	return firstWin === this;
}

UIWindow.prototype.getTimeScale = function() {
	return this.timeScale;
}

UIWindow.prototype.setTimeScale = function(timeScale) {
	this.timeScale = timeScale;

	return this;
}

UIWindow.prototype.initUIWindow = function(type, x, y, w, h, bg) {
	this.initUIElement(type);	

	this.timeScale = 1;
	this.setLeftTop(x, y);
	this.settings = {};
	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.setName("window-" + UIWindow.serialNo++);

	if(!bg) {
		this.style.setFillColor("White");
	}

	this.addEventNames(["onSystemInit", "onLoad", "onOpen", "onBeforeOpen",
			"onClose", "onSwitchToBack", "onSwitchToFront", "onGesture", "onKeyDown", "onKeyUp"]);

	this.setAnimHint("htranslate");
	this.oldHitTest = this.hitTest;

	this.setImage("option_image_0", null);
	this.setImage("option_image_1", null);
	this.setImage("option_image_2", null);
	this.setImage("option_image_3", null);
	this.setImage("option_image_4", null);
	this.setImage("option_image_5", null);
	this.setImage("option_image_6", null);
	this.setImage("option_image_7", null);
	this.setImage("option_image_8", null);
	this.setImage("option_image_9", null);
	this.setImage("option_image_10", null);
	this.setImage("option_image_11", null);
	this.setImage("option_image_12", null);
	this.setImage("option_image_13", null);
	this.setImage("option_image_14", null);
	this.intervals = [];
	this.timeouts = [];

	return this;
}

UIWindow.prototype.setAnimHint = function(animHint) {
	this.animHint = animHint;

	return true;
}

UIWindow.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIDevice || shape.isUIScreen || shape.isUIStatusBar || shape.isUIWindow) {
		return false;
	}

	return true;
}

UIWindow.prototype.onModeChanged = function() {
	if(this.isInDesignMode()) {
		this.popupWindow = null;
	}

	return;
}

UIWindow.prototype.removePopupWindow = function(popup) {
	if(this.popupWindow) {
		if(this.popupWindow === popup) {
			this.popupWindow = popup.popupWindow;
			if(this.popupWindow) {
				this.popupWindow.parentWindow = this;
			}

			popup.parentWindow = null;
			popup.popupWindow = null;

			return true;
		}

		return this.popupWindow.removePopupWindow(popup);
	}

	return false;
}

UIWindow.prototype.setPopupWindow = function(popup) {
	if(this === popup) {
		return false;
	}

	if(this.popupWindow) {
		return this.popupWindow.setPopupWindow(popup);
	}
	else {
		this.popupWindow = popup;
		if(popup) {
			popup.parentWindow = this;
		}
	}

	return true;
}

UIWindow.prototype.getPopupWindow =function() {
	if(this.popupWindow) {
		return this.popupWindow.getPopupWindow();
	}

	return this.isUIPopupWindow ? this : null;
}

UIWindow.prototype.isGrabElement = function(el) {
	return this.grabElement === el;
}

UIWindow.prototype.grab = function(el) {
	this.grabElement = el;

	return;
}

UIWindow.prototype.ungrab = function(el) {
	this.grabElement = null;

	return;
}

UIWindow.prototype.dispatchPointerDownToChildren = function(p) {
	if(this.grabElement) {
		this.grabElement.onPointerDown(p)
		this.setTarget(this.grabElement);
		return true;
	}
	
	return this.defaultDispatchPointerDownToChildren(p);
}

UIWindow.prototype.onPointerDownNormal = function(point) {
	this.pointerDownPosition.x = point.x;
	this.pointerDownPosition.y = point.y;

	if(this.popupWindow) {
		this.popupWindow.onPointerDownNormal(point)
		this.setTarget(this.popupWindow);
		this.pointerDown = false;

		if(!this.popupWindow || !this.popupWindow.shouldPropagatePointerEvent()) {
			return true;
		}
	}

	return UIElement.prototype.onPointerDownNormal.call(this, point);
}

UIWindow.prototype.onDoubleClick = function(point) {
	if(this.popupWindow) {
		this.popupWindow.onDoubleClick(point)
		if(!this.popupWindow || !this.popupWindow.shouldPropagatePointerEvent()) {
			return true;
		}
	}

	return UIElement.prototype.onDoubleClick.call(this, point);
}

UIWindow.prototype.onPointerMoveNormal = function(point) {
	if(this.popupWindow) {
		this.popupWindow.onPointerMoveNormal(point)
		if(!this.popupWindow || !this.popupWindow.shouldPropagatePointerEvent()) {
			return true;
		}
	}

	return UIElement.prototype.onPointerMoveNormal.call(this, point);
}

UIWindow.prototype.onPointerUpNormal = function(point) {
	if(this.popupWindow) {
		this.popupWindow.onPointerUpNormal(point)
		if(!this.popupWindow || !this.popupWindow.shouldPropagatePointerEvent()) {
			return true;
		}
	}

	if(!this.pointerDown) {
		return true;
	}

	if(!this.isInDesignMode() && this.enable) {
		var dx = this.lastPosition.x - this.pointerDownPosition.x;
		var dy = this.lastPosition.y - this.pointerDownPosition.y;
		var adx = Math.abs(dx);
		var ady = Math.abs(dy);
		var end = this.lastPosition;
		var start = this.pointerDownPosition;

		if(adx > 20 || ady > 20) {
			if((adx >> 1) > ady) {
				if(dx < 0) {
					this.callOnSwipeLeftHandler(start, end);
				}
				else {
					this.callOnSwipeRightHandler(start, end);
				}
			}
			if((ady >> 1) > adx) {
				if(dy < 0) {
					this.callOnSwipeUpHandler(start, end);
				}
				else {
					this.callOnSwipeDownHandler(start, end);
				}
			}
		}
	}

	return UIElement.prototype.onPointerUpNormal.call(this, point);
}

UIWindow.prototype.paintSelfOnly =function(canvas) {
	var opacity = this.opacity;
	if(opacity !== 1) {
		canvas.globalAlpha *= opacity;
	}

	this.clearBackground(canvas);
	this.drawBgImage(canvas);

	return;
}

UIWindow.prototype.beforePaintChildren = function(canvas) {
	canvas.globalAlpha = 1;
}

UIWindow.prototype.paintSelf = function(canvas) {
	var timeStep = canvas.timeStep;

	canvas.timeStep = this.scaleTime(timeStep);
	if(this.isInDesignMode()) {
		UIElement.prototype.paintSelf.call(this, canvas);
	}
	else {
		canvas.save();
		this.translate(canvas);
        this.updateTransform(canvas);
		this.paintSelfOnly(canvas);
		
		this.beforePaintChildren(canvas);
		this.paintChildren(canvas);
		this.afterPaintChildren(canvas);
		canvas.restore();
	}

	if(this.popupWindow && !this.popupWindow.closePending) {
		canvas.timeStep = this.popupWindow.scaleTime(timeStep);
		this.popupWindow.paintSelf(canvas);
	}
	canvas.timeStep = timeStep;

	return;
}

UIWindow.prototype.show = function() {
	this.setVisible(true);
	this.showHTML();

	return;
}

UIWindow.prototype.hide = function() {
	this.setVisible(false);
	this.hideHTML();
	cantkHideAllInput();

	return;
}

UIWindow.prototype.setCloseWhenPointerUpOutside = function(closeWhenPointerUpOutside) {
	if(closeWhenPointerUpOutside) {
		this.hitTest = function(point) {
			var ret = this.oldHitTest(point);
			if(!ret) {
				if(!this.isInDesignMode()) {
					ret = Shape.HIT_TEST_MM;
				}
			}

			return ret;
		}
	}
	else {
		this.hitTest = this.oldHitTest;
	}
	this.closeWhenPointerUpOutside = closeWhenPointerUpOutside;

	return;
}

UIWindow.prototype.isAnimationEnabled = function() {
	//if(CantkRT.isNative()) return false;

	return this.animHint && this.animHint !== "none";
}

UIWindow.prototype.getAnimationDuration = function(toShow) {
	return toShow ? this.openAnimationDuration : this.closeAnimationDuration;
}

UIWindow.prototype.getAnimationName = function(toShow) {
	var anim = "";
	switch(this.animHint) {
		case "fade": {
			anim = toShow ? "anim-fade-in" : "anim-fade-out";
			break;
		}
		case "scale": {
			if(this.isUIDialog) {
				anim = toShow ? "anim-scale-show-dialog" : "anim-scale-hide-dialog";
			}
			else {
				anim = toShow ? "anim-scale-show-win" : "anim-scale-hide-win";
			}
			break;
		}
		case "popup": {
			anim = toShow ? "anim-move-up" : "anim-move-down";
			break;
		}
		case "htranslate": {
			anim = toShow ? "anim-forward" : "anim-backward";
			break;
		}
		case "vtranslate": {
			anim = toShow ? "anim-upward" : "anim-downward";
			break;
		}
		default: {
			if(this.isUIDialog) {
				anim = toShow ? "anim-scale-show-dialog" : "anim-scale-hide-dialog";
			}
			else {
				if(isAndroid() || isFirefoxMobile()) {
					anim = toShow ? "anim-scale-show-win" : "anim-scale-hide-win";
				}
				else {
					anim = toShow ? "anim-forward" : "anim-backward";
				}
			}
			break;
		}
	}

	return anim;
}

UIWindow.prototype.isSplashWindow = function() {
	return this.isUINormalWindow && this.windowType === "splash";
}

UIWindow.prototype.getSupportedAnimations = function() {
	var animations = ["none", "default", "scale", "fade", "popup"];
	if(!this.isUIDialog) {
        animations = animations.concat(["htranslate", "vtranslate"]);
    }

	return animations;
}

UIWindow.prototype.clearBackground =function(canvas) {
	var display = this.images.display;
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);

	if(image) {
		switch(display) {
			case UIElement.IMAGE_DISPLAY_TILE:
			case UIElement.IMAGE_DISPLAY_TILE_V:
			case UIElement.IMAGE_DISPLAY_TILE_H:
			case UIElement.IMAGE_DISPLAY_SCALE:
			case UIElement.IMAGE_DISPLAY_9PATCH:
			case UIElement.IMAGE_DISPLAY_SCALE_KEEP_RATIO: return;
			default:break;
		}

		if(image.width >= this.w && image.height >= this.h) {
			return;
		}
	}

	if(!this.isFillColorTransparent()) {
		canvas.beginPath();
        canvas.fillStyle = this.style.fillColor;
		canvas.fillRect(0, 0, this.w, this.h);
	}

	return;
}

UIWindow.prototype.defaultChildrenFromJson = UIElement.prototype.childrenFromJson;

UIWindow.prototype.loadChildren = function() {
	if(this.childrenJson) {
		this.defaultChildrenFromJson(this.childrenJson);
		delete this.childrenJson;
		delete this.pendingLoadChildren;
		console.log("Now To Load Children Of " + this.name);

		if(this.scaleInfo) {
			this.scaleForDensity(this.scaleInfo.sizeScale, this.scaleInfo.lcdDensity, true);
		}

		var wm = this.getWindowManager();
		var oldConfig = wm.oldConfig;
		var deviceConfig = wm.deviceConfig;

		if(oldConfig && deviceConfig) {
			this.notifyDeviceConfigChanged(oldConfig, deviceConfig);
		}

	}

	return;
}

UIWindow.prototype.childrenFromJson = function(js) {
	if(js.lazyLoad && !dappIsEditorApp()) {
		this.childrenJson = js;
		this.pendingLoadChildren = true;
		console.log("Delay To Load Children Of " + this.name);
	}
	else {
		delete this.pendingLoadChildren;
		this.defaultChildrenFromJson(js);	
	}

	return;
}

UIWindow.prototype.initStageOne = function() {
	this.callOnInitHandler();
	this.clearAllTimeouts();
	this.clearAllIntervals();
	this.enablePhysics = false;

	var win = this;
	this.forEach(function(iter) {
		if(iter.offset) {
			iter.offset = 0;
		}
		iter.visible = iter.runtimeVisible;

		if(iter.animatingInfo) {
			iter.animatingInfo = null;
			iter.animating = false;
		}

		if(iter.animations && iter.animations[iter.defaultAnimationName]) {
			console.log(iter.name + " has default animation, set it invisible initially.");
			iter.visible = false;
		}

		if(iter.isUIBody || iter.isUIEdge) {
			win.enablePhysics = true;
		}
	});

	return;
}

UIWindow.prototype.onInit = function() {
	this.initStageOne();

	return;
}

UIWindow.prototype.prepareForOpen = function() {
	if((!this.isUILoadingWindow || this.children.length < 1) && this.jsonData) {
		this.fromJsonNow(this.jsonData);
	}

	this.setMode(Shape.MODE_RUNNING, true);
	this.relayout();

	return this;
}

UIWindow.prototype.callOnBeforeOpen = function(initData) {
	this._open = true;
	var wm = this.getParent();
	if(wm && wm.hasEventListener("windowopen")) {
		var event = wm.createEvent("windowopen");
		event.win = this;
		wm.dispatchEvent(event);
	}

	this.show();
	this.init();
	return this.callOnBeforeOpenHandler(initData);
}

UIWindow.prototype.callOnOpen = function(initData) {
	delete this.openPending;
	this.getParent().pointerEventTarget = this;

	if(this.onOpen) {
		try {
			this.onOpen(initData);
		}catch(e) {
			console.log("onOpen" + e.message);
		}
	}

	this.callOnOpenHandler(initData);

	if(this.isSplashWindow()) {
		var win = this;
		var duration = win.duration ? win.duration : 3000;

		if(window.splashWinTimeID) {
			clearTimeout(window.splashWinTimeID);
			delete window.splashWinTimeID;
		}

		window.splashWinTimeID = setTimeout(function() {
			if(win.visible) {
				win.openWindow(null, null, true);
			}
		}, duration);
	}

	this.forEach(function(el) {
		el.onWindowOpen();
	});

	return true;
}

UIWindow.prototype.callOnClose = function(retInfo) {
	this._open = false;
    delete this.closePending;

	var wm = this.getParent();
	if(wm && wm.hasEventListener("windowclose")) {
		var event = wm.createEvent("windowclose");
		event.win = this;
		wm.dispatchEvent(event);
	}

	if(this.onClose) {
		try {
			this.onClose(retInfo);
		}
		catch(e) {
			console.log("onClose: " + e.message);
		}
	}
			
	this.callOnCloseHandler(retInfo);

	this.deinit();
	this.hide();

	if(this.destroyWhenClose) {
		this.getWindowManager().removeChild(this, true);
	}
	
	this.resetEvents();
	this.clearAllTimeouts();
	this.clearAllIntervals();

	var arr = this.children;
	for(var i = 0; i < arr.length; i++) {
		var iter = arr[i];
		iter.detachNameFromParent();
	}

	this.children = [];

	if(this.parentWindow) {
		this.parentWindow.popupWindow = this.popupWindow;
	}
	if(this.popupWindow) {
		this.popupWindow.parentWindow = this.parentWindow;
	}

	this.popupWindow = null;
	this.parentWindow = null;

	setTimeout(function() {
		arr.clear(true);
	}, 100);

	return true;
}

UIWindow.prototype.callOnSwitchToBack = function(topIsPopup) {
	this.callOnSwitchToBackHandler();
	if(!topIsPopup) {
		this.hide();
	}

	return true;
}

UIWindow.prototype.callOnSwitchToFront = function(topIsPopup) {
	if(this.isUINormalWindow && (this.w != this.parentShape.w || this.h != this.parentShape.h)) {
		this.relayout();
		console.log("WindowManager Size Changed, Relayout Current Window.");
	}

	this.show();
	this.callOnSwitchToFrontHandler();

	return true;
}

UIWindow.prototype.isOpen = function() {
	return !!this._open;
}

/**
 * @method setTimeout
 * 是对系统setTimeout的包装，保证窗口关闭时，定时器被销毁。
 * @param {Function} func 定时器回调函数。 
 * @param {Number} dt 时长(毫秒) 
 * @return {Number} 返回timerID
 *
 */
UIWindow.prototype.setTimeout = function(func, dt) {
	if(this.isInDesignMode()) {
		console.log("Can not UIWindow.prototype.setTimeout in edit mode.");
		return;
	}

	if(typeof(func) !== "function") {
		console.log("invalid func for UIWindow.prototype.setTimeout");
		return;
	}

	function callback() {
		this.timeouts.remove(id);
		func();
	}

	var id = window.setTimeout(callback.bind(this), dt);
	this.timeouts.push(id);

	return id;
}

/**
 * @method clearTimeout
 * 清除定时器。
 * @param {Number} id timerID
 *
 */
UIWindow.prototype.clearTimeout = function(id) {
	window.clearTimeout(id);
	this.timeouts.remove(id);
}

/**
 * @method setInterval
 * 是对系统setInterval的包装，保证窗口关闭时，定时器被销毁。
 * @param {Function} func 定时器回调函数。 
 * @param {Number} dt 时长(毫秒) 
 * @return {Number} 返回timerID
 *
 */
UIWindow.prototype.setInterval = function(func, dt) {
	if(this.isInDesignMode()) {
		console.log("Can not UIWindow.prototype.setInterval in edit mode.");
		return;
	}
	
	if(typeof(func) !== "function") {
		console.log("invalid func for UIWindow.prototype.setInterval");
		return;
	}

	function callback() {
		func();
	}

	var id = window.setInterval(callback.bind(this), dt);
	this.intervals.push(id);

	return id;
}

/**
 * @method clearInterval
 * 清除定时器。
 * @param {Number} id timerID
 *
 */
UIWindow.prototype.clearInterval = function(id) {
	window.clearInterval(id);
	this.intervals.remove(id);
}

UIWindow.prototype.clearAllIntervals = function() {
	var arr = this.intervals;
	for(var i = 0; i < arr.length; i++) {
		var id = arr[i];
		window.clearInterval(id);
	}
	this.intervals.length = 0;
}

UIWindow.prototype.clearAllTimeouts = function() {
	var arr = this.timeouts;
	for(var i = 0; i < arr.length; i++) {
		var id = arr[i];
		window.clearTimeout(id);
	}
	this.timeouts.length = 0;
}

UIWindow.prototype.loadInitAssets = function(bar, preloadWindows, label) {
	var win = this;

	function doLoadInitAssets(evt) {
		if(evt.percent > 99.9) {
			win.doLoadInitAssets(bar, preloadWindows, label);
			ResLoader.off(ResLoader.EVENT_ASSETS_LOAD_PROGRESS, doLoadInitAssets);
		}
	}

	if(ResLoader.isLoadCompleted()) {
		win.doLoadInitAssets(bar, preloadWindows, label);
	}else{
		ResLoader.on(ResLoader.EVENT_ASSETS_LOAD_PROGRESS, doLoadInitAssets);
	}
}

UIWindow.prototype.doLoadInitAssets = function(bar, preloadWindows, label) {
	var win = this;
	var wm = win.getParent();
	
	if(!bar) {
		bar = win.findChildByType("ui-progressbar");
	}
	
	if(!label) {
		label = win.findChildByType("ui-label");
	}
	
	if(!preloadWindows) {
		preloadWindows = win.preloadWindows;
	}
	
	function onLoadProgress(percent, loadedNr, totalNr) {
		if(label) {
			label.setText("Loading...");
		}

		if(bar) {
			bar.setPercent(percent, true);
		}
		
        var initWin = wm.getInitWindow();
		if(loadedNr >= totalNr && initWin != win) {
			wm.showInitWindow(win.windowNameToBeOpen);	
		}
		
		win.postRedraw();
	}

	function onDownloadProgress(percent, loadedNr, totalNr) {
		if(label) {
			if(percent >= 100) {
				label.setText("Loading...");
			}else{
				label.setText("Downloading...");
			}
		}

		if(bar) {
			if(percent >= 100) {
				if(AssetsDownloader.isAvailable()) {
					wm.loadAudios();
					wm.loadFonts();
				}

				bar.setPercent(0, true);
			}else {
				bar.setPercent(percent, true);
			}
		}
	}

	var winNamesArr = preloadWindows ? preloadWindows.split(",") : wm.getWindowNames(this);
	if(AssetsDownloader.isAvailable()) {
		winNamesArr.push("__audios__");
		winNamesArr.push("__fonts__");
	}else{
		wm.loadAudios();
		wm.loadFonts();
	}

	wm.loadAssets(winNamesArr, onLoadProgress, onDownloadProgress);

	this.loadInitAssets = function() {}

	return this;
}

UIWindow.prototype.relayout = function() {
	if(!this.getWindowManager().isDeviceDirectionOK()) {
		console.log("UIWindow.prototype.relayout Reject Relayout");
		return;
	}

	UIElement.prototype.relayout.call(this);

	return this;
}

ShapeFactoryGet().addShapeCreator(new UINormalWindowCreator(null));

//////////////////////////////////////////////////////////////////////}-{

/**
 * @class UINormalWindow
 * @extends UIWindow
 * 普通窗口是全屏的窗口。
 *
 */
function UINormalWindow() {
	return;
}

UINormalWindow.prototype = new UIWindow();
UINormalWindow.prototype.isUINormalWindow = true;

function UINormalWindowCreator(bg) {
	var args = ["ui-window", "ui-window", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UINormalWindow();
		
		g.initUIWindow(this.type, 0, 0, 100, 100, bg);
		g.widthAttr = UIElement.WIDTH_FILL_PARENT;
		g.heightAttr = UIElement.HEIGHT_FILL_PARENT;
		g.addEventNames(["onSwipeLeft", "onSwipeRight", "onSwipeUp", "onSwipeDown"]);

		return g;
	}
	
	return;
}

