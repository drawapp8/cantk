/*
 * File:   ui-window.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Window
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIWindow() {
	return;
}

UIWindow.serialNo = 0;
UIWindow.prototype = new UIElement();
UIWindow.prototype.isUIWindow = true;

UIWindow.prototype.callOnGesture = function(gesture) {
	if(!this.enable) {
		return false;
	}

	if(!this.handleOnGesture || this.mode === C_MODE_PREVIEW) {
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
			console.log("this.callOnGesture:" + e.message);
		}
	}
	
	console.log("callOnGesture: scale=" + gesture.scale + " rotation=" + gesture.rotation);

	return true;
}

UIWindow.prototype.onGesture = function(gesture) {
	if(this.mode != C_MODE_EDITING) {
		this.callOnGesture(gesture);
	}

	return;
}

UIWindow.prototype.isMainWindow = function() {
	var wm = this.getWindowManager();
	var index = wm.history[0];
	var firstWin = wm.children[index];

	return firstWin === this;
}

UIWindow.prototype.resize = function(w, h) {
	if(this.state === C_STAT_NORMAL) {
		this.realResize(w, h);
	}

	return;
}

UIWindow.prototype.initUIWindow = function(type, x, y, w, h, bg) {
	this.initUIElement(type);	

	this.move(x, y);
	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setImage(CANTK_IMAGE_DEFAULT, bg);
	this.setName("window-" + UIWindow.serialNo++);
	
	if(!bg) {
		this.style.setFillColor("White");
	}
	this.addEventNames(["onLoad"]);
	this.addEventNames(["onUnload"]);
	this.addEventNames(["onOpen"]);
	this.addEventNames(["onBeforeOpen"]);
	this.addEventNames(["onClose"]);
	this.addEventNames(["onSwitchToBack"]);
	this.addEventNames(["onSwitchToFront"]);
	this.addEventNames(["onGesture"]);
	this.addEventNames(["onKeyDown"]);
	this.addEventNames(["onKeyUp"]);

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
	if(this.mode === C_MODE_EDITING) {
		this.popupWindow = null;
	}

	return;
}

UIWindow.prototype.removePopupWindow = function(popup) {
	if(this.popupWindow) {
		if(this.popupWindow === popup) {
			this.popupWindow = null;
			this.targetShape = null;

			return true;
		}

		return this.popupWindow.removePopupWindow(popup);
	}

	return false;
}

UIWindow.prototype.setPopupWindow = function(popup) {
	if(this.popupWindow) {
		return this.popupWindow.setPopupWindow(popup);
	}
	else {
		this.popupWindow = popup;
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

	if(this.popupWindow) {
		this.popupWindow.onPointerDown(p)
		this.setTarget(this.popupWindow);

		return true;
	}

	return this.defaultDispatchPointerDownToChildren(p);
}

UIWindow.prototype.paintChildren = function(canvas) {
	canvas.save();	
	canvas.beginPath();
	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();
	canvas.beginPath();

	this.defaultPaintChildren(canvas);

	if(this.popupWindow) {
		this.popupWindow.paintSelf(canvas);
	}
	
	canvas.restore();

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

UIWindow.prototype.callOnBeforeOpen = function(initData) {
	if(!this.handleOnBeforeOpen || this.mode === C_MODE_PREVIEW) {
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

	this.show();
	this.init();

	if(this.handleOnBeforeOpen) {
		this.handleOnBeforeOpen(initData);
	}

	return true;
}

UIWindow.prototype.callOnOpen = function(initData) {
	delete this.openPending;

	if(this.onOpen) {
		try {
			this.onOpen(initData);
		}catch(e) {
			console.log("onOpen" + e.message);
		}
	}

	if(!this.handleOnOpen || this.mode === C_MODE_PREVIEW) {
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

	return true;
}

UIWindow.prototype.callOnClose = function(retInfo) {
	if(this.onClose) {
		try {
			this.onClose(retInfo);
		}
		catch(e) {
			console.log("onClose: " + e.message);
		}
	}
			
	if(!this.handleOnClose || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onClose"];
		if(sourceCode) {
			sourceCode = "this.handleOnClose = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnClose) {
		this.handleOnClose();
	}

	this.deinit();
	this.hide();

	return true;
}

UIWindow.prototype.callOnSwitchToBack =function() {
	if(!this.handleOnSwitchToBack || this.mode === C_MODE_PREVIEW) {
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
		this.handleOnSwitchToBack();
	}

	this.hide();

	return true;
}

UIWindow.prototype.callOnSwitchToFront =function() {
	if(this.isUINormalWindow && (this.w != this.parentShape.w || this.h != this.parentShape.h)) {
		this.relayout();
		console.log("WindowManager Size Changed, Relayout Current Window.");
	}

	this.show();

	if(!this.handleOnSwitchToFront || this.mode === C_MODE_PREVIEW) {
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
		this.handleOnSwitchToFront();
	}

	return true;
}

UIWindow.prototype.callOnLoad =function() {
	if(!this.handleOnLoad || this.mode === C_MODE_PREVIEW) {
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
		this.handleOnLoad();
	}

	return true;
}

UIWindow.prototype.callOnUnload =function() {
	if(!this.handleOnUnload || this.mode === C_MODE_PREVIEW) {
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
		this.handleOnUnload();
	}

	return true;
}

UIWindow.prototype.setCloseWhenPointerUpOutside = function(closeWhenPointerUpOutside) {
	if(closeWhenPointerUpOutside) {
		this.hitTest = function(point) {
			var ret = this.oldHitTest(point);
			if(!ret) {
				if(this.mode != C_MODE_EDITING) {
					ret = C_HIT_TEST_MM;
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
	return this.animHint !== "none";
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
	var animations = ["none", "default", "scale", "fade", "htranslate", "popup"];

	return animations;
}

UIWindow.prototype.paintSelfOnly =function(canvas) {
	var image = this.getHtmlImageByType(CANTK_IMAGE_DEFAULT);

	if(!image && this.style.fillColor != "rgba(0,0,0,0)") {
		canvas.beginPath();
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

//////////////////////////////////////////////////////////////////////}-{

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
		g.widthAttr = C_WIDTH_FILL_PARENT;
		g.heightAttr = C_HEIGHT_FILL_PARENT;

		return g;
	}
	
	return;
}

