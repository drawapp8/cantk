/*
 * File:   ui-window-manager.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Window Manager
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIWindowManager() {
}

UIWindowManager.prototype = new UIFrames();
UIWindowManager.prototype.isUIWindowManager = true;

UIWindowManager.prototype.initUIWindowManager = function(type) {
	this.initUIFrames(type);
	this.history = new Array();

	this.showLoadingProgress = true;
	this.progressBarBorderColor = "White";
	this.progressBarFillColor = "Gold";
	this.progressTextColor = "Green";
	this.loadingTextColor = "White";
	this.loadingBgColor = "Black";
	this.setImage("force-landscape-tips", null);
	this.setImage("force-portrait-tips", null);
	this.setImage("loading-bg", null);

	return this;
}

UIWindowManager.prototype.onFromJsonDone = function() {
	this.designWidth = this.w;
	this.designHeight = this.h;

	return;
}

UIWindowManager.prototype.beforeAddShapeIntoChildren = function(shape) {
	return !shape.isUIWindow;
}

UIWindowManager.prototype.initDefaultNameForChild = function(shape) {
	shape.name = "newwin";

	return;
}

UIWindowManager.prototype.getSplashWindow = function() {
	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];
		if(win.isUINormalWindow && win.windowType === "splash") {
			return win;
		}
	}

	return null;
}

UIWindowManager.prototype.getMainWindow = function() {
	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];
		if(win.isUINormalWindow && win.windowType === "main") {
			return win;
		}
	}
	
	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];
		if(win.isUINormalWindow) {
			return win;
		}
	}

	return null;
}

UIWindowManager.prototype.getWindowNames = function() {
	var names = [];
	
	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];
		names.push(win.name);
	}

	return names;
}

UIWindowManager.prototype.setInitWindow = function(initWindowIndex) {
	this.initWindowIndex = Math.max(0, Math.min(initWindowIndex, this.children.length-1));

	return this;
}

UIWindowManager.prototype.showInitWindow = function() {
	var initWin = null;
	if(this.children.length === 0) {
		return false;
	}

	this.history.clear();

	var startWinName = getQueryParameter("startwin");
	if(startWinName) {	
		initWin = this.findBestFitWindowByName(startWinName);
	}
	
	if(this.initWindowIndex || this.initWindowIndex === 0) {
		initWin = this.children[this.initWindowIndex];	
	}

	if(!initWin) {
		initWin = this.getSplashWindow();
		if(!initWin) {
			initWin = this.getMainWindow();
		}
	}

	if(initWin) {
		this.targetShape = initWin;
		console.log("showInitWindow: set targetShape:" + this.targetShape.name);

		initWin.relayout();
		index = this.getFrameIndex(initWin);
		this.showFrame(index);
		initWin.callOnBeforeOpen();
		initWin.callOnOpen();
		this.history.push(index);
		this.postRedraw();
	}

	return true;
}

UIWindowManager.prototype.callOnLoad = function() {
	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];

		win.callOnLoadHandler();
	}

	return true;
}

UIWindowManager.prototype.callOnUnload = function() {
	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];

		win.callOnUnloadHandler();
	}

	return true;
}

UIWindowManager.prototype.onResLoadDone = function() {
	this.callOnLoad();
	this.resLoadDone = true;
	this.showInitWindow();

	return;
}

UIWindowManager.prototype.systemInit = function() {
	this.loadSoundEffects();
	this.loadSoundMusic();
	this.resLoadDone = false;
	UIElement.animTimerID = null;

	console.log("systemInit");

	return;
}

UIWindowManager.prototype.systemExit = function() {
	console.log("systemExit: ");
	var n = this.history.length;
	
	for(var i = 0; i < n; i++) {
		this.closeCurrentWindow(0, true);
	}

	this.history.length = 0;

	this.stopSoundMusic();
	this.callOnUnload();

	return;
}

UIWindowManager.prototype.findBestFitWindowByName = function(name) {
	var win = null;
	var bestWin1 = null;
	var bestWin2 = null;
	var bestWin3 = null;
	var bestWin4 = null;
	var deviceConfig = this.getDeviceConfig();
	var bestWinName1 = name;
	var bestWinName2 = name + "-" + deviceConfig.platform;
	var bestWinName3 = bestWinName2 + "-" + deviceConfig.lcdDensity;
	var bestWinName4 = bestWinName3 + "-" + deviceConfig.screenW + "x" + deviceConfig.screenH;

	for(var i = 0; i < this.children.length; i++) {
		win = this.children[i];

		switch(win.name) {
			case bestWinName1: {
				if(deviceConfig.lcdDensity === win.lcddensity) {
					bestWin3 = win;
				}
				else if(!win.lcddensity || win.lcddensity === "all") {
					bestWin1 = win;
				}
				else {
					if(!bestWin1) {
						bestWin1 = win;
					}
				}

				break;
			}
			case bestWinName2: {
				bestWin2 = win;
				break;
			}
			case bestWinName3: {
				bestWin3 = win;
				break;
			}
			case bestWinName4: {
				bestWin4 = win;
				break;
			}
			default:break;
		}
	}

	if(bestWin4) {
		console.log("Find " + bestWin4.name);
		return bestWin4;
	}
	
	if(bestWin3) {
		console.log("Find " + bestWin3.name);
		return bestWin3;
	}
	
	if(bestWin2) {
		console.log("Find " + bestWin2.name);
		return bestWin2;
	}
	
	if(bestWin1) {
		console.log("Find " + bestWin1.name);
		return bestWin1;
	}

	return null;
}

UIWindowManager.prototype.openWindow = function(name, onClose, closeCurrent, initData) {
	var newWin = null;
	if(name) {
		newWin = this.findBestFitWindowByName(name);
	}
	else {
		newWin = this.getMainWindow();
	}

	if(!newWin) {
		alert("Can not find window: " + name);
		return;
	}

	if(newWin.pendingLoadChildren) {
		newWin.loadChildren();
	}

	if(this.isWindowOpen(newWin)) {
		console.log(newWin.name + " is open already.");
		return false;
	}

	if(!newWin) {
		console.log("Not findBestFitWindowByName window " + name);
		return false;
	}
	
	if(newWin.openPending) {
		newWin.openPending = false;
		console.log("This window is already open:" + name);
		return false;
	}

	if(!newWin.isUIWindow) {
		console.log("It is not a window: " + name);
		return false;
	}
	
	newWin.relayout();	
	newWin.openPending = true;
	newWin.initData = initData;
	newWin.onClose = onClose;
	newWin.callOnBeforeOpen(initData);

	this.targetShape = newWin;
	console.log("openWindow: set targetShape:" + this.targetShape.name);

	if(newWin.isUINormalWindow) {
		return this.openNormalWindow(newWin, closeCurrent);
	}
	else {
		return this.openPopupWindow(newWin, closeCurrent);
	}
}

UIWindowManager.prototype.openPopupWindow = function(newWin, closeCurrent) {
	if(closeCurrent) {
		this.closeCurrentWindow(0, true);
	}

	var wm = this;
	var curWin = this.getCurrentFrame();

	newWin.relayout();
	function openPopupWindow() {
		newWin.show();
		curWin.setPopupWindow(newWin);
		wm.postRedraw();
		newWin.callOnOpen(newWin.initData);
	}

	if(curWin) {
		curWin.callOnSwitchToBack();
		if(newWin.isAnimationEnabled()) {
			var p = this.getPositionInScreen();
			var animation = AnimationFactory.create(newWin.getAnimationName(true), newWin.getAnimationDuration(true)); 
			var backendCanvas = UIFrames.preparseBackendCanvas(curWin, newWin);
			animation.setScale(this.getRealScale());
			animation.prepare(p.x, p.y, this.w, this.h, backendCanvas, openPopupWindow);
			animation.setRectOfFront(newWin.x, newWin.y, newWin.w, newWin.h);
			animation.run();
		}
		else {
			openPopupWindow();
		}
	}

	return true;
}

UIWindowManager.prototype.openNormalWindow = function(newWin, closeCurrent) {
	if(closeCurrent) {
		this.closeCurrentWindow(0, true);
	}

	var wm = this;
	var index = 0;

	newWin.relayout();	
	var curWin = this.getCurrentFrame();
	function closeAndOpenWindow() {

		index = wm.getFrameIndex(newWin);
		wm.showFrame(index);
		wm.history.push(index);
		curWin = wm.getCurrentFrame();
		wm.postRedraw();
		newWin.callOnOpen(newWin.initData);

		return;
	}

	if(curWin) {
		curWin.callOnSwitchToBack();
		if(newWin.isAnimationEnabled()) {
			var p = this.getPositionInScreen();
			var animation = AnimationFactory.create(newWin.getAnimationName(true), newWin.getAnimationDuration(true)); 
			var backendCanvas = UIFrames.preparseBackendCanvas(curWin, newWin);
			animation.setScale(this.getRealScale());
			animation.prepare(p.x, p.y, this.w, this.h, backendCanvas, closeAndOpenWindow);
			animation.run();
		}
		else {
			setTimeout(closeAndOpenWindow, 10);
		}
	}
	else {
		closeAndOpenWindow();
	}
	
	return true;
}

UIWindowManager.prototype.getCurrentWindow = function() {
	var curWin = this.getCurrentFrame();
	var childWin = curWin.getPopupWindow();

	return childWin ? childWin : curWin; 
}

UIWindowManager.prototype.backToHomeWin = function() {
	var history = this.history;
	var n = history.length - 1;
	var curWin = this.getCurrentWindow();

	if(!n) {
		if(curWin.isUIPopupWindow) {
			this.closeCurrentWindow(0);
		}

		return;
	}

	if(n === 1) {
		if(curWin.isUIPopupWindow) {
			this.closeCurrentWindow(0, true);
			this.closeCurrentWindow(0);
		}
		else {
			this.closeCurrentWindow(0);
		}

		return;
	}
	
	var mainWinIndex = history[0];
	var lastWin = this.getFrame(mainWinIndex);
	
	if(curWin.isAnimationEnabled()) {
		var p = this.getPositionInScreen();
		var animation = AnimationFactory.create(curWin.getAnimationName(false), curWin.getAnimationDuration(false)); 
		var backendCanvas = UIFrames.preparseBackendCanvas(lastWin, curWin);
		animation.setScale(this.getRealScale());
		animation.prepare(p.x, p.y, this.w, this.h, backendCanvas, function() {});
		animation.run();
	}

	for(var i = 0; i < n; i++) {
		this.closeCurrentWindow(0, true);
	}

	return;
}

UIWindowManager.prototype.closeCurrentWindow = function(retInfo, syncClose) {
	var curWin = this.getCurrentWindow();

	if(!curWin || curWin.mode === Shape.MODE_EDITING) {
		return  false;
	}
	
	if(curWin.isUINormalWindow) {
		return this.closeCurrentNormalWindow(curWin, retInfo, syncClose);
	} 
	else {
		return this.closeCurrentPopupWindow(curWin, retInfo, syncClose);
	}
}

UIWindowManager.prototype.closeCurrentPopupWindow = function(popupWin, retInfo, syncClose) {
	var wm = this;
	var curWin = this.getCurrentFrame();

	if(curWin) {
		function closePopupWindow() {
			curWin.removePopupWindow(popupWin);
			curWin.callOnSwitchToFront();
			wm.postRedraw();

			popupWin.callOnClose(retInfo);
		}

		if(popupWin.isAnimationEnabled() && !syncClose) {
			var p = this.getPositionInScreen();
			var animation = AnimationFactory.create(popupWin.getAnimationName(false), popupWin.getAnimationDuration(false)); 

			curWin.removePopupWindow(popupWin);
			var backendCanvas = UIFrames.preparseBackendCanvas(curWin, popupWin);
			curWin.setPopupWindow(popupWin);
		
			animation.setScale(this.getRealScale());
			animation.prepare(p.x, p.y, this.w, this.h, backendCanvas, closePopupWindow);
			animation.setRectOfFront(popupWin.x, popupWin.y, popupWin.w, popupWin.h);
			animation.run();
		}
		else {
			closePopupWindow();
		}
	}

	return true;
}

UIWindowManager.prototype.closeCurrentNormalWindow = function(curWin, retInfo, syncClose) {
	var wm = this;
	var lastWin = null;

	if(this.history.length < 2) {
		if(syncClose && this.history.length) {
			wm.history.remove(wm.current);
			curWin.callOnClose(retInfo);
		}

		return false;
	}

	lastWinIndex = this.history[this.history.length-2];
	lastWin = this.getFrame(lastWinIndex);

	function showLastWindow() {
		wm.showFrame(lastWinIndex);
		lastWin.callOnSwitchToFront();
		
		wm.postRedraw();
		curWin.callOnClose(retInfo);

		return;
	}
	
	wm.history.remove(wm.current);
	if(syncClose) {
		showLastWindow();
	}
	else if(curWin.isAnimationEnabled()) {
		var p = this.getPositionInScreen();
		var animation = AnimationFactory.create(curWin.getAnimationName(false), curWin.getAnimationDuration(false)); 
		var backendCanvas = UIFrames.preparseBackendCanvas(lastWin, curWin);
		animation.setScale(this.getRealScale());
		animation.prepare(p.x, p.y, this.w, this.h, backendCanvas, showLastWindow);
		animation.run();
	}
	else {
		setTimeout(showLastWindow, 10);
	}

	return;
}

UIWindowManager.prototype.isWindowOpen = function(win) {
	for(var i = 0; i < this.history.length; i++) {
		var index = this.history[i];
		var iter = this.children[index];
		for(var w = iter; w != null; w = w.popupWindow) {
			if(w === win) return true;
		}
	}

	return false;
}

UIWindowManager.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIWindow) {
		if(this.mode == Shape.MODE_EDITING) {
			var win = this.findChildByName(shape.name);
			if(win) {
				shape.name = shape.name + this.children.length;
			}
		}

		return true;
	}

	return false;
}

UIWindowManager.prototype.onChildrenChanged = function() {
}

UIWindowManager.prototype.afterChildAppended = function(shape) {
	if(this.mode !== Shape.MODE_RUNNING && !this.isUnpacking) {
		var index = this.getFrameIndex(shape);
		this.showFrame(index);
	}

	this.onChildrenChanged();

	return;
}

UIWindowManager.prototype.onChildRemoved = function(shape) {
	this.onChildrenChanged();

	return;
}

UIWindowManager.prototype.scaleForDensity = function(sizeScale, lcdDensity, recuresive) {
	if(!sizeScale || sizeScale === 1) {
		return;
	}

	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];

		if(!iter.lcddensity || iter.lcddensity === "all") {
			if(iter.pendingLoadChildren) {
				iter.scaleInfo = {};
				iter.scaleInfo.sizeScale = sizeScale;
				iter.scaleInfo.lcdDensity = lcdDensity;
			}
			else {
				iter.scaleForDensity(sizeScale, lcdDensity, recuresive);
			}
		}
	}

	return;
}

UIWindowManager.prototype.resize = function(w, h) {
	var x = 0;
	var y = 0;
	var fixWidth = this.screenScaleMode === "fix-width";
	var fixHeight = this.screenScaleMode === "fix-height";
	var fixResolution = this.screenScaleMode === "fix-resolution";
	var isInDevice = this.parentShape != null;

	if(this.mode === Shape.MODE_RUNNING && (fixWidth || fixHeight || fixResolution) && !isInDevice) {
		var canvas = this.view.getCanvas();

		var screenWidth = canvas.width;
		var screenHeight = canvas.height;
		var designWidth = this.designWidth;
		var designHeight = this.designHeight;
		var canvasStyleSizeSupported = !(isWeiBo() || isPhoneGap());
		var sizeIsRight = (screenWidth > screenHeight && designWidth > designHeight) 
			|| (screenWidth < screenHeight && designWidth < designHeight);

		canvas.style.width = screenWidth + "px";
		canvas.style.height = screenHeight + "px";
		if(canvasStyleSizeSupported && sizeIsRight) {

			if(fixWidth) {
				var scale = designWidth/screenWidth;
				canvas.width = designWidth;
				canvas.height = screenHeight * scale;
				w = canvas.width;
				h = canvas.height;
			}
			else if(fixHeight) {
				var scale = designHeight/screenHeight;
				canvas.height = designHeight;
				canvas.width = screenWidth * scale;
				w = canvas.width;
				h = canvas.height;
			}
			else {
				var scaleW = designWidth/screenWidth;
				var scaleH = designHeight/screenHeight;
				var scale = Math.max(scaleW, scaleH);
				if(Math.abs(scaleW - scaleH) < 0.10) {
					canvas.width = designWidth;
					canvas.height = designHeight;
					
					x = 0;
					y = 0;
					w = canvas.width;
					h = canvas.height;
				}
				else {
					canvas.width = screenWidth * scale;
					canvas.height = screenHeight * scale;
					
					x = (canvas.width - designWidth)>>1; 
					y = (canvas.height - designHeight)>>1;
					w = designWidth;
					h = designHeight;
				}
			}
			var xInputScale = canvas.width/screenWidth;
			var yInputScale = canvas.height/screenHeight;
			WWindowManager.setInputScale(xInputScale, yInputScale);
		}
		else {
			canvas.width = screenWidth;
			canvas.height = screenHeight;
			WWindowManager.setInputScale(1, 1);
			w = canvas.width;
			h = canvas.height;
		}

		var vp = cantkGetViewPort();	
		this.app.onCanvasSized(canvas.width, canvas.height);

		console.log("Canvas Size: w =" + canvas.width + " h=" + canvas.height);
		console.log("ViewPort Size: w =" + vp.width + " h=" + vp.height);
		console.log("Canvas Style Size: w =" + canvas.style.width + " h=" + canvas.style.height);
	}

	this.lastWin = null;
	this.setPosition(x, y);
	this.setSizeLimit(w, h, w, h);
	UIElement.prototype.resize.call(this, w, h);

	return;
}

UIWindowManager.prototype.setDeviceConfig = function(deviceConfig) {
	var screenScaleMode = this.screenScaleMode;
	if(screenScaleMode === "fix-resolution" || screenScaleMode === "fix-width" || screenScaleMode === "fix-height") {
		this.oldConfig = this.deviceConfig;

		return;
	}

	var oldConfig = this.deviceConfig;
	
	this.oldConfig = this.deviceConfig;
	this.deviceConfig = deviceConfig;

	if(oldConfig && deviceConfig) {
		if(oldConfig.lcdDensity != deviceConfig.lcdDensity) {
			var sizeScale = this.getSizeScale(oldConfig.lcdDensity, deviceConfig.lcdDensity);
			this.scaleForDensity(sizeScale, deviceConfig.lcdDensity, true);
		}
		this.notifyDeviceConfigChanged(oldConfig, deviceConfig);
		console.log("call this.notifyDeviceConfigChanged: " + this.type);
	}

	console.log("setDeviceConfig platform:" + deviceConfig.platform);
	return;
}

UIWindowManager.prototype.getDeviceConfig = function() {
	if(this.deviceConfig) {
		return this.deviceConfig;
	}
	else {
		var device = this.getDevice();
		if(device) {
			return device.config;
		}
	}

	return null;
}

UIWindowManager.prototype.paintLoadingStatus = function(canvas, percent, text) {
	var percent = ResLoader.getPercent();
	var image = this.getImageByType("loading-bg");

	var w = this.w;
	var h = this.h;
	var barW = w * 0.8;
	var barH = 40;
	var fillBarW = percent * barW/100;

	var x = (w - barW) >> 1;
	var y = (h - barH) >> 1;
	
	canvas.fillStyle = this.loadingBgColor;
	canvas.fillRect(0, 0, w, h);
	if(image && image.getImage()) {
		var rect = image.getImageRect();
		var htmlImage = image.getImage();
		this.drawImageAt(canvas, htmlImage, this.images.display, 0, 0, this.w, this.h, rect);
	}

	canvas.lineWidth = 4;
	canvas.strokeStyle = this.progressBarBorderColor;
	canvas.rect(x, y, barW, barH);
	canvas.stroke();

	if(fillBarW > 8) {
		canvas.fillStyle = this.progressBarFillColor;
		canvas.fillRect(x+4, y+4, fillBarW-8, barH-8);
	}

	canvas.fillStyle = this.loadingTextColor;
	canvas.font = "24px serif";
	canvas.textBaseline = "middle";
	canvas.textAlign = "center";
	canvas.fillText(text, w >> 1, (h >> 1) - barH);

	canvas.fillStyle = this.progressTextColor;

	text = percent.toString().substr(0, 4) + "%";
	canvas.fillText(text, w >> 1, h >> 1);

	return;
}

UIWindowManager.prototype.paintChildren = function(canvas) {
	if(this.mode != Shape.MODE_EDITING) {
		if(this.forcePortrait && this.w > this.h) {
			var image = this.getHtmlImageByType("force-portrait-tips");	

			canvas.fillStyle = this.style.fillColor;
			canvas.fillRect(0, 0, this.w, this.h);	
			this.drawImageAt(canvas, image, UIElement.IMAGE_DISPLAY_CENTER, 0, 0, this.w, this.h);

			return;
		}
		else if(this.forceLandscape && this.w < this.h) {
			var image = this.getHtmlImageByType("force-landscape-tips");	
			
			canvas.fillStyle = this.style.fillColor;
			canvas.fillRect(0, 0, this.w, this.h);	
			this.drawImageAt(canvas, image, UIElement.IMAGE_DISPLAY_CENTER, 0, 0, this.w, this.h);

			return;
		}

		if(!this.resLoadDone) {
			var me = this;
			var percent = ResLoader.getPercent();

			if(percent < 100) {
				if(this.showLoadingProgress) {
					setTimeout(function() { me.postRedraw();}, 100);
					var loadingText = this.loadingText ? this.loadingText : webappGetText("Loading...");
					this.paintLoadingStatus(canvas, percent, loadingText);
				}
			}
			else {
				this.onResLoadDone();
			}

			return;
		}
	}

	var child = this.getCurrentFrame();
	if(child) {
		canvas.save();
		canvas.beginPath();
		child.paintSelf(canvas);
		canvas.restore();
	}

	return;
}
UIWindowManager.prototype.afterPaintChildren = function(canvas) {
	var creatingShape = this.getCreatingShape();

	if(creatingShape && creatingShape.isUIElement && this.showHignlight) {

		if(!creatingShape.isUIDevice) {
			canvas.beginPath();
			canvas.rect(0, 0, this.w, this.h);
			canvas.lineWidth = 5;
			canvas.strokeStyle = "Orange";
			canvas.stroke();
		}

		if(creatingShape.isUIWindow) {
			canvas.textBaseline = "middle";
			canvas.textAlign = "center";
			canvas.fillStyle = "Gray";
			canvas.font = "24pt Sans";
			canvas.fillText(dappGetText("Please Drag Window To Here."), this.w/2, this.h*0.2);
		}
	}

	this.showHignlight = !this.showHignlight;

	return;
}

UIWindowManager.prototype.paintSelf = function(canvas) {
	var child = this.getCurrentFrame();
	if(child) {
		if(!this.lastWin || this.lastWin !== child) {
			if(!this.parentShape) {
				this.view.clearBg(canvas, child.style.lineColor);
			}
			this.lastWin = child;
		}
	}

	UIElement.prototype.paintSelf.call(this, canvas);
}

UIWindowManager.prototype.paintSelfOnly =function(canvas) {
	this.setThisAsCurrentWindowManager();

	if(this.mode === Shape.MODE_EDITING) {
		canvas.fillStyle = "white";
		canvas.fillRect(0, 0, this.w, this.h);

		UIWindowManager.updateWindowThumbView(this.current);
	}

	return;
}

UIWindowManager.prototype.isDeviceDirectionOK = function() {
	if((this.forcePortrait && this.w > this.h)
		|| (this.forceLandscape && this.w < this.h)) {
		console.log("Device Direction Incorrect.");
		return false;
	}

	return true;
}

UIWindowManager.prototype.relayout = function() {
	if(this.isDeviceDirectionOK()) {
		UIElement.prototype.relayout.call(this);
	}
	else {
		console.log("isDeviceDirectionNotOK ignore relayout");
	}

	return this;
}

UIWindowManager.prototype.relayoutChildren = function() {
	if(!this.isDeviceDirectionOK()) {
		console.log("isDeviceDirectionNotOK ignore relayout");

		return;
	}

	var curWin = this.getCurrentFrame();

	if(this.mode === Shape.MODE_EDITING) {
		for(var i = 0; i < this.children.length; i++) {
			var iter = this.children[i];
			iter.relayout();
		}
	}
	else {
		if(curWin) {
			curWin.relayout();
			
			var childWin = curWin.getPopupWindow();
			if(childWin) {
				childWin.relayout();
			}
		}
	}

	return;
}

UIWindowManager.prototype.onKeyDown= function(code) {
	var win = this.getCurrentWindow();

	return win.onKeyDown(code);
}

UIWindowManager.prototype.onKeyUp= function(code) {
	var win = this.getCurrentWindow();

	return win.onKeyUp(code);
}

UIWindowManager.prototype.setSoundEffectURLs = function(soundEffectURLs) {
	this.soundEffectURLs = soundEffectURLs;

	return this;
}

UIWindowManager.prototype.getSoundEffectURLs = function() {
	return this.soundEffectURLs;
}

UIWindowManager.prototype.getSoundEffectNames = function() {
	if(!this.soundEffectURLs) {
		return [];
	}

	var names = this.soundEffectURLs.split("\n");
	for(var i = 0; i < names.length; i++) {
		names[i] = decodeURI(basename(names[i]));
	}

	return names;
}

UIWindowManager.soundEffectEnalbe = true;
UIWindowManager.prototype.setSoundEffectsEnable = function(enable) {
	UIWindowManager.soundEffectEnalbe = enable;

	return this;
}

UIWindowManager.prototype.loadSoundEffects = function() {
	if(!this.soundEffectURLs) {
		return;
	}

	UIWindowManager.soundEffects = {};
	
	var urlArr = this.soundEffectURLs.split("\n");
	for(var i = 0; i < urlArr.length; i++) {
		var iter = urlArr[i];
		var config = {urls: [iter], autoplay: false, loop: false, volume: 0.8};
		var name = decodeURI(basename(iter));
		var info = {audio:new Howl(config), playing: false};

		UIWindowManager.soundEffects[name] = info;
/*		
		ResLoader.loadAudio(iter, function(audio) {
			var config = {urls: [audio.src], autoplay: false, loop: false, volume: 0.8};
			var name = decodeURI(basename(audio.src));
			var info = {audio:new Howl(config), playing: false};

			UIWindowManager.soundEffects[name] = info;
        });
*/
	}

	return this;
}

UIWindowManager.prototype.playSoundEffect = function(name) {
	if(!UIWindowManager.soundEffectEnalbe) {
		console.log("UIWindowManager.soundEffectEnalbe disable ");
		return this;
	}

	var info = UIWindowManager.soundEffects[name];
	if(!info || !info.audio) {
		console.log("not found: " + name);
		return this;
	}

	info.audio.play();

	return this;
}

//////////////////////////////////////////////////////////////////////

UIWindowManager.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(this.autoPlayPending) {
		this.playSoundMusic();
		this.autoPlayPending = false;
	}

	if(!beforeChild || this.popupWindow || !this.pointerDown) {
		return;
	}

	return this.callOnPointerDownHandler(point);
}

UIWindowManager.prototype.setSoundMusicURLs = function(soundMusicURLs) {
	this.soundMusicURLs = soundMusicURLs;

	return this;
}

UIWindowManager.prototype.getSoundMusicURLs = function() {
	return this.soundMusicURLs;
}

UIWindowManager.prototype.loadSoundMusic = function() {
	if(!this.soundMusicURLs) {
		return;
	}

	UIWindowManager.soundMusic = {};

	var me = this;
	var loop = this.soundMusicLoop;
	var autoPlay = this.soundMusicAutoPlay;

	var urlArr = this.soundMusicURLs.split("\n");
	for(var i = 0; i < urlArr.length; i++) {
		var iter = urlArr[i];
		ResLoader.loadAudio(iter, function(audio) {
			var name = decodeURI(basename(audio.src));
			var info = {audio:audio};

			audio.volume = 0.8;
			if(autoPlay) {
				audio.addEventListener('canplaythrough', function (e) {
					console.log("canplaythrough:" + audio.src);
					audio.play();
				});

				audio.addEventListener('canplay', function (e) {
					console.log("canplay:" + audio.src);
					audio.play();
				});

				audio.play();
				autoPlay = false;
				me.autoPlayPending = true;
				console.log("load start:" + audio.src);
			}

			UIWindowManager.soundMusic[name] = info;
        });
	}

	return this;
}

UIWindowManager.prototype.loadSoundMusicOld = function() {
	if(!this.soundMusicURLs) {
		return;
	}

	UIWindowManager.soundMusic = {};

	var loop = this.soundMusicLoop;
	var autoPlay = this.soundMusicAutoPlay;

	var urlArr = this.soundMusicURLs.split("\n");
	for(var i = 0; i < urlArr.length; i++) {
		var iter = urlArr[i];
		var config = {urls: [iter], autoplay: autoPlay, loop: loop, volume: 0.8};
		var name = decodeURI(basename(iter));
		var info = {audio:new Howl(config), playing: autoPlay};

		UIWindowManager.soundMusic[name] = info;
/*		
		ResLoader.loadAudio(iter, function(audio) {
			var config = {urls: [audio.src], autoplay: autoPlay, loop: loop, volume: 0.8};
			var name = decodeURI(basename(audio.src));
			var info = {audio:new Howl(config), playing: autoPlay};

			UIWindowManager.soundMusic[name] = info;
			autoPlay = false;
        });
*/        
	}

	return this;
}

UIWindowManager.prototype.isSoundMusicPlaying = function(name) {
	var playing = false;
	for(var key in UIWindowManager.soundMusic) {
		if(name === key || !name) {
			var info = UIWindowManager.soundMusic[key];
			if(info && info.audio) {
				if(info.playing) {
					playing = true;
					break;
				}
			}
		}
	}

	return playing;
}

UIWindowManager.prototype.stopSoundMusic = function(name) {
	for(var key in UIWindowManager.soundMusic) {
		if(name === key || !name) {
			var info = UIWindowManager.soundMusic[key];
			if(info && info.audio) {
				if(info.audio.stop) {
					info.audio.stop();
				}
				else {
					info.audio.pause();
				}
				info.playing = false;
			}
		}
	}

	return this;
}

UIWindowManager.prototype.playSoundMusic = function(name) {
	for(var key in UIWindowManager.soundMusic) {
		if(name === key || !name) {
			var info = UIWindowManager.soundMusic[key];
			if(info && info.audio) {
				info.audio.play();
				info.playing = true;
				console.log("UIWindowManager.prototype.playSoundMusic");
				break;
			}
		}
	}

	return this;
}

UIWindowManager.prototype.getSoundMusicNames = function() {
	if(!this.soundMusicURLs) {
		return [];
	}

	var names = this.soundMusicURLs.split("\n");
	for(var i = 0; i < names.length; i++) {
		names[i] = basename(names[i]);
	}

	return names;
}

function UIWindowManagerCreator() {
	var args = ["ui-window-manager", "ui-window-manager", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIWindowManager();

		return g.initUIWindowManager(this.type);
	}
	
	return;
}
