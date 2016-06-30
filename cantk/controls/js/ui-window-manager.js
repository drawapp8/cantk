/*
 * File:   ui-window-manager.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Window Manager
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIWindowManager
 * @extends UIFrames
 * 管理着所有窗口，并提供管理窗口的函数，如打开和关闭窗口。但通常您并不需要直接调用窗口管理器的函数，因为这些函数已经封装到UIElement了，在事件处理程序中，通过this直接去访问这些函数就行了。
 *
 */

function UIWindowManager() {
}

UIWindowManager.prototype = new UIFrames();
UIWindowManager.prototype.isUIWindowManager = true;

UIWindowManager.prototype.saveProps = ["current", "sceneIdIndex"];
UIWindowManager.prototype.initUIWindowManager = function(type) {
	this.settings = {};
	this.initUIFrames(type);
	this.history = new Array();

	this.showLoadingProgress = true;
	this.setImage("force-landscape-tips", null);
	this.setImage("force-portrait-tips", null);

	this.soundMusicAutoPlay = true;
	this.setSoundEffectsEnable(true);

	this.loadedAssets = {};
	UIWindowManager.instance = this;

	return this;
}

UIWindowManager.getInstance = function() {
	return UIWindowManager.instance;
}

UIWindowManager.prototype.fromJson = function(json) {
	this.jsonData = json;

	return RShape.prototype.fromJson.call(this, json);
}

UIWindowManager.prototype.onImageLoadDone = function(img, src) {
    if(!img) {
        return;
    }
//	console.log("onImageLoadDone:" + img.src.substr(0, 256));
}

UIWindowManager.prototype.onImageLoadErr = function(src) {
	console.log("onImageLoadErr:" + src);
}

UIWindowManager.prototype.onJsonLoadDone = function(obj, src) {
//	console.log("onJsonLoadDone:" + src);
}

UIWindowManager.prototype.onJsonLoadErr = function(src) {
	console.log("onJsonLoadErr:" + src);
}

UIWindowManager.prototype.loadElementAssets = function(el) {
	if(el.images) {
		for(var key in el.images) {
			var url = el.images[key];
			if(typeof url === "string") {
				WImage.create(url, this.onImageLoadDone.bind(this));
			}
		}
	}

	var jsonAssets = UIElement.jsonAssets;
	for(var i = 0; i < jsonAssets.length; i++) {
		var key = jsonAssets[i];
		var url = el[key];
		if(url) {
			if(url.endWith(".json")) {
				ResLoader.loadJson(url, this.onJsonLoadDone.bind(this), this.onJsonLoadErr.bind(this));
			}
			else {
				ResLoader.loadData(url, this.onJsonLoadDone.bind(this), this.onJsonLoadErr.bind(this));
			}
		}
	}
	
	var imagesAssets = UIElement.imagesAssets;
	for(var i = 0; i < imagesAssets.length; i++) {
		var key = imagesAssets[i];
		var url = el[key];
		if(url) {
			WImage.create(url, this.onImageLoadDone.bind(this));
		}
	}

	var children = el.children;
	for(var i = 0; i < children.length; i++) {
		var iter = children[i];
		this.loadElementAssets(iter);	
	}

	return this;
}

UIWindowManager.prototype.clearAssetsCache = function(check) {
	WImage.clearCache(check);
	ResLoader.clearCache(check);

	return this;
}

UIWindowManager.prototype.loadAssets = function(winList, onLoadProgress, onDownloadProgress) {
	var me = this;
	winList = winList || this.getWindowNames();

	if(AssetsDownloader.isAvailable()) {
		AssetsDownloader.downloadMulti(winList, onDownloadProgress, function() {
			me.doLoadAssets(winList, onLoadProgress);
		});
	}
	else {
		me.doLoadAssets(winList, onLoadProgress);
	}

	return this;
}

UIWindowManager.prototype.shouldShowAssetsLoadingProgress = function(name) {
	return !this.isAssetsLoaded(name) && this.assetsLoadingWin;
}

UIWindowManager.prototype.isAssetsLoaded = function(name) {
	return this.loadedAssets[name];
}

UIWindowManager.prototype.doLoadAssets = function(winList, onProgress) {
	var queue = [];
	var wm = this;

	function onAssetsLoadProgress(event) {
		if(onProgress) {
			onProgress(event.percent, event.finished, event.total);
		}

		if(event.finished >= event.total) {
			ResLoader.off(ResLoader.EVENT_ASSETS_LOAD_PROGRESS, onAssetsLoadProgress);
	
			for(var k = 0; k < queue.length; k++) {
				var iter = queue[k];
				wm.loadedAssets[iter] = true;
			}
			queue = null;
		}
	}

	var children = this.jsonData.children;
	for(var i = 0; i < children.length; i++) {
		var win = children[i];
		if(!winList || winList.indexOf(win.name) >= 0) {
			queue.push(win.name);
			this.loadElementAssets(win);	
		}
	}

	if(ResLoader.isLoadCompleted()) {
		setTimeout(function() {
			onAssetsLoadProgress({percent:100, finished:100, total:100});
		}, 10);
	}
	else {
		ResLoader.on(ResLoader.EVENT_ASSETS_LOAD_PROGRESS, onAssetsLoadProgress);
	}

	return this;
}

UIWindowManager.prototype.onFromJsonDone = function() {
	this.designWidth = this.w;
	this.designHeight = this.h;
	this.forcePortrait = false;
	this.forceLandscape = false;

	return;
}

UIWindowManager.prototype.beforeAddShapeIntoChildren = function(shape) {
	return !shape.isUIWindow;
}

UIWindowManager.prototype.getMainWindow = function() {
	var windows = this.children;
	var n = windows.length;

	for(var i = 0; i < n; i++) {
		var win = windows[i];
		if(win.isUILoadingWindow) continue;

		if(win.isUINormalWindow && win.windowType === "main") {
			return win;
		}
	}
	
	for(var i = 0; i < n; i++) {
		var win = windows[i];
		
		if(win.isUILoadingWindow) continue;

		if(win.isUINormalWindow) {
			return win;
		}
	}

	return null;
}

UIWindowManager.prototype.getWindowNames = function(excludeWin) {
	var names = [];
	var children = this.children;
	var n = children.length;

	for(var i = 0; i < n; i++) {
		var win = children[i];
		if(win !== excludeWin) {
			names.push(win.name);
		}
	}

	return names;
}

UIWindowManager.prototype.setInitWindow = function(initWindowIndex) {
	if(initWindowIndex === null || initWindowIndex === undefined) {
		this.initWindowIndex = null;
	}
	else {
		this.initWindowIndex = Math.max(0, Math.min(initWindowIndex, this.children.length-1));
	}

	return this;
}

UIWindowManager.prototype.getInitWindow = function() {
	var initWin = null;

    if(this.initWindowIndex || this.initWindowIndex === 0) {
        initWin = this.children[this.initWindowIndex];	
    }

    if(!initWin) {
        var initWinName = cantkGetQueryParam("initwin");
        if(initWinName) {	
            initWin = this.find(initWinName);
        }
    }

    if(!initWin) {
        var initWinName = this.preferInitWindow;
        if(initWinName) {	
            initWin = this.find(initWinName);
        }
    }

    if(!initWin) {
        initWin = this.getMainWindow();
    }

    if(!initWin || initWin.isUILoadingWindow) {
        return null;
    }

	return initWin;
}

UIWindowManager.prototype.waitDeviceRotate = function() {
	var wm = this;
	if(this.isDeviceDirectionOK()) {
		this.doShowInitWindow();
	}
	else {
		setTimeout(function() {
			wm.waitDeviceRotate();
		}, 100);
	}
}

UIWindowManager.prototype.showInitWindow = function(preferInitWindow) {
	this.preferInitWindow = preferInitWindow;

	this.waitDeviceRotate();
}

UIWindowManager.prototype.doShowInitWindow = function() {
	this.history.clear();
	var initWin = this.getInitWindow();

	if(initWin) {
		this.targetShape = initWin;
		initWin.prepareForOpen();
		index = this.getFrameIndex(initWin);
		this.showFrame(index);
		initWin.callOnBeforeOpen();
		initWin.callOnOpen();
		this.history.push(index);
		this.postRedraw();
		
		console.log("showInitWindow: set targetShape:" + this.targetShape.name);
	}
	else {
		console.log("Not Found Init Window.");
	}

	return true;
}

UIWindowManager.prototype.callOnLoad = function() {
	this.resLoadDone = true;

	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];

		try {
			win.callOnLoadHandler();
		}catch(e) {
			console.log("Call onLoad fail:" + e.message);
		}
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
	this.showInitWindow();

	return;
}

UIWindowManager.prototype.getStartLoadingWindow = function() {
	var windows = this.children;
	var n = windows.length;

	for(var i = 0; i < n; i++) {
		var win = windows[i];
		if(win.isUINormalWindow && (win.isUILoadingWindow || win.name === "win-loading")) {
			win.isUILoadingWindow = true;
			return win;
		}
	}

	return null;
}

UIWindowManager.prototype.loadAudios = function() {
	this.loadSoundEffects();
	this.loadSoundMusic();

	return this;
}

UIWindowManager.prototype.loadFonts = function() {
	var meta = this.view.getMeta();
	if(meta && meta.extfonts) {
		ResLoader.loadFonts(meta.extfonts);
	}

	return this;
}

UIWindowManager.prototype.setAssetsLoadingWindow = function(name) {
	this.assetsLoadingWin = this.find(name);

	return this;
}

UIWindowManager.prototype.getAssetsLoadingWindow = function() {
	return this.assetsLoadingWin;
}

UIWindowManager.prototype.showStartLoadingWindow = function() {
	this.resLoadDone = false;
	var resWin = this.getStartLoadingWindow();

	if(resWin) {
		if(!resWin.isUILoadingWindowV2) {
			this.loadAssets(null, null);
            this.loadAudios();
    		this.loadFonts();
			console.log("old version, load all assets.");
		}

		this.openWindow(resWin.name);	
	}
	else {
		this.loadAssets(null, null);
		this.showInitWindow();
		console.log("no loading window, load all assets.");
	}

	return;
}

UIWindowManager.prototype.systemInit = function() {
	UIWindowManager.soundEffects = {};
	UIWindowManager.soundMusic = {};
	
	UIElement.animTimerID = null;
	this.callOnSystemInitHandler();

	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];
		win.callOnSystemInitHandler();
	}

	var me = this;
	this.showStartLoadingWindow();
	ResLoader.setOnLoadFinishListener(function() {
		me.callOnLoad();
	});

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

UIWindowManager.prototype.hasOpenPendingWindow = function() {
   	var children = this.children;
	var n = children.length;

	for(var i = 0; i < n; i++) {
		var win = children[i];
		if(win.openPending) {
            return true;
        }
	}

    return false;
}

UIWindowManager.prototype.openWindow = function(name, onClose, closeCurrent, initData, options) {
	var newWin = null;
	if(name) {
		newWin = this.find(name);
	}
	else {
		newWin = this.getMainWindow();
	}

	if(!newWin || !newWin.isUIWindow) {
		alert("Can not find window: " + name);
		return;
	}
	
    if(newWin.openPending) {
		console.log("This window is already open:" + name);
		return;
	}

	if(closeCurrent) {
		this.closeCurrentWindow(0, true);
	}

	if(newWin.pendingLoadChildren) {
		newWin.loadChildren();
	}

	if(newWin.isOpen()) {
		options = options || {closeOldIfOpened:true};
		if(options.closeOldIfOpened) {
			newWin.callOnClose({});
			this.history.remove(newWin.getIndex());
		}
		else if(options.openNewIfOpened) {
			var newWin = this.dupChild(newWin.name);
			newWin.destroyWhenClose = true;
		}
		else {
			console.log(newWin.name + " is open already.");
			return false;
		}
	}

    /*
	if(newWin.openPending) {
		newWin.openPending = false;
		console.log("This window is already open:" + name);
		return false;
	}
    */
	
	if(!newWin.isUILoadingWindow && !newWin.isUILoadingWindowV2 && this.shouldShowAssetsLoadingProgress(newWin.name)) {
		this.downloadAssetsAndOpenWindow(newWin, initData, onClose);
	}else{
		this.doOpenWindow(newWin, initData, onClose);
	}
}

UIWindowManager.prototype.doOpenWindow = function(newWin, initData, onClose) {
	newWin.prepareForOpen();
	newWin.openPending = true;
	newWin.initData = initData;
	newWin.onClose = onClose;
	newWin.callOnBeforeOpen(initData);

	this.targetShape = newWin;
	this.setPointerEventTarget(newWin);
	if(newWin.isUINormalWindow) {
		return this.openNormalWindow(newWin);
	}
	else {
		return this.openPopupWindow(newWin);
	}
}


UIWindowManager.prototype.downloadAssetsAndOpenWindow = function(newWin, initData, onClose) {
	var loadingWin = this.getAssetsLoadingWindow(); 
	if(loadingWin === newWin) {
		console.log("UIWindowManager.prototype.downloadAssetsAndOpenWindow failed.");
		return;
	}

	this.doOpenWindow(loadingWin);

	var wm = this;
	var bar = loadingWin.findChildByType("ui-progressbar");
	var label = loadingWin.findChildByType("ui-label");
	
	if(bar) {
		bar.setPercent(0);
	}

	if(label) {
		label.setText("Downloading...");
	}

	function onLoadProgress(percent, loadedNr, totalNr) {
		if(label) {
			label.setText("Loading...");
		}

		if(bar) {
			bar.setPercent(percent, true);
		}
		
		if(loadedNr >= totalNr) {
			wm.closeCurrentWindow(0, true);
			wm.doOpenWindow(newWin, initData, onClose);
		}
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
				bar.setPercent(0, true);
			}else {
				bar.setPercent(percent, true);
			}
		}
	}
	
	this.loadAssets([newWin.name], onLoadProgress, onDownloadProgress);
}

UIWindowManager.prototype.openPopupWindow = function(newWin ) {
	var wm = this;
	var curWin = this.getCurrentFrame();

	function openPopupWindow() {
		if(!newWin.app)  {
			console.log("may be exited preview mode");
			return;
		}
        var index = wm.getFrameIndex(curWin);
        if(wm.history.indexOf(index) < 0) {
            return;
        }
		newWin.show();
		curWin.setPopupWindow(newWin);
		wm.postRedraw();
		newWin.callOnOpen(newWin.initData);
	}

	if(curWin) {
		curWin.callOnSwitchToBack(true);
		if(newWin.isAnimationEnabled()) {
			var p = this.getPositionInScreen();
			var animation = AnimationFactory.create(newWin.getAnimationName(true), newWin.getAnimationDuration(true)); 
            animation.setWins(curWin, newWin);
			animation.setScale(this.getRealScale());
			animation.prepare(p.x, p.y, this.w, this.h, openPopupWindow);
			animation.setRectOfFront(newWin.x, newWin.y, newWin.w, newWin.h);
			animation.run();
		}
		else {
			openPopupWindow();
		}
	}

	return true;
}

UIWindowManager.prototype.openNormalWindow = function(newWin) {
	var wm = this;
	var index = 0;

	var curWin = this.getCurrentFrame();
	function closeAndOpenWindow() {
		if(!newWin.app)  {
			console.log("may be exited preview mode");
			return;
		}

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
            animation.setWins(curWin, newWin);
			animation.setScale(this.getRealScale());
			animation.prepare(p.x, p.y, this.w, this.h, closeAndOpenWindow);
			animation.run();
		}
		else {
			closeAndOpenWindow();
		}
	}
	else {
		closeAndOpenWindow();
	}
	
	return true;
}

UIWindowManager.prototype.getCurrentWindow = function() {
	var curWin = this.getCurrentFrame();
	if(!curWin) {
		return null;
	}

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
        animation.setWins(curWin, lastWin);
		animation.setScale(this.getRealScale());
		animation.prepare(p.x, p.y, this.w, this.h, function() {});
		animation.run();
	}

	for(var i = 0; i < n; i++) {
		this.closeCurrentWindow(0, true);
	}

	return;
}

UIWindowManager.prototype.closeCurrentWindow = function(retInfo, syncClose) {
	var curWin = this.getCurrentWindow();

	if(!curWin || curWin.isInDesignMode()) {
		return  false;
	}

	return this.closeWindow(curWin, retInfo, syncClose);
}

UIWindowManager.prototype.closeWindow = function(win, retInfo, syncClose) {
    win.closePending = true;
	if(win.isUINormalWindow) {
		return this.closeNormalWindow(win, retInfo, syncClose);
	} 
	else {
		return this.closePopupWindow(win, retInfo, syncClose);
	}
}

UIWindowManager.prototype.closePopupWindow = function(popupWin, retInfo, syncClose) {
	var wm = this;
	var curWin = this.getCurrentFrame();

	if(curWin) {
		function closePopupWindow() {
			if(!popupWin.app)  {
				console.log("may be exited preview mode");
				return;
			}
			curWin.removePopupWindow(popupWin);
			curWin.callOnSwitchToFront(true);
			wm.postRedraw();

			popupWin.callOnClose(retInfo);
		}

        if(!popupWin.isTopWindow()) {
            console.log("close background dialog");
            if(popupWin.parentWindow) {
                popupWin.parentWindow.removePopupWindow(popupWin);
            }
            popupWin.callOnClose(retInfo); 
            
            return;
        }

		if(curWin === popupWin) {
			syncClose = true;
		}

		if(popupWin.isAnimationEnabled() && !syncClose && !wm.hasOpenPendingWindow()) {
			var p = this.getPositionInScreen();
			var animation = AnimationFactory.create(popupWin.getAnimationName(false), popupWin.getAnimationDuration(false)); 

			curWin.removePopupWindow(popupWin);
            animation.setWins(popupWin, curWin);
			curWin.setPopupWindow(popupWin);
		
			animation.setScale(this.getRealScale());
			animation.prepare(p.x, p.y, this.w, this.h, closePopupWindow);
			animation.setRectOfFront(popupWin.x, popupWin.y, popupWin.w, popupWin.h);
			animation.run();
		}
		else {
			closePopupWindow();
		}
	}

	return true;
}

UIWindowManager.prototype.closeAll = function() {
	var wins = [];

	for(var i = 0; i < this.history.length; i++) {
		var index = this.history[i];
		var win = this.getFrame(index);
		for(var iter = win; iter; iter = iter.popupWindow) {
			wins.push(iter);
		}
	}

	for(var i = wins.length-1; i >= 0; i--) {
		var win = wins[i];
		win.callOnClose({});
		win.targetShape = null;
	}

	this.history = [];

	return;
}

UIWindowManager.prototype.closeNormalWindow = function(curWin, retInfo, syncClose) {
	var wm = this;
	var lastWin = null;

	if(this.history.length < 2) {
		if(syncClose || this.history.length) {
			wm.history.remove(wm.current);
			curWin.callOnClose(retInfo);
		}

		return false;
	}

    if(!curWin.isTopWindow()) {
        var curIndex = wm.getFrameIndex(curWin);
        console.log("closing background window " + curWin.name);
        wm.history.remove(curIndex);
        curWin.callOnClose();

        if(curIndex === wm.current && wm.history.length > 0) {
            wm.showFrame(wm.history[wm.history.length - 1]);
        }
        return;
    }

	lastWinIndex = this.history[this.history.length-2];
	lastWin = this.getFrame(lastWinIndex);

	function showLastWindow() {
		if(!lastWin.app)  {
			console.log("may be exited preview mode");
			return;
		}
        if(lastWinIndex != wm.history[wm.history.length - 1] || wm.hasOpenPendingWindow()) {
            //new win was appended and shown?
            return;
        }
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
	else if(curWin.isAnimationEnabled() && !wm.hasOpenPendingWindow()) {
		var p = this.getPositionInScreen();
		var animation = AnimationFactory.create(curWin.getAnimationName(false), curWin.getAnimationDuration(false)); 
        animation.setWins(curWin, lastWin);
		animation.setScale(this.getRealScale());
		animation.prepare(p.x, p.y, this.w, this.h, showLastWindow);
		animation.run();
	}
	else {
		setTimeout(showLastWindow, 10);
	}

	return;
}

UIWindowManager.prototype.isWindowOpen = function(win) {
	return win && win.isOpen();
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
		var canvasStyleSizeSupported = true;//!(isWeiBo() || isPhoneGap());
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
	this.setLeftTop(x, y);
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
	}

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

UIWindowManager.prototype.paintChildren = function(canvas) {
	if(!this.isInDesignMode()) {
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
	}

	var child = this.getCurrentFrame();
	if(child.closePending) {
        return;
    }
    if(!this.isInDesignMode() && this.history.length === 0) { 
        UIElement.logWarning("All Windows Are Closed!");
    } else {
		if(child.isUIDialog) {
			canvas.fillStyle = "white";
			canvas.fillRect(0, 0, this.w, this.h);
		}

		canvas.save();
		canvas.beginPath();
		child.paintSelf(canvas);
		canvas.restore();
	}

	return;
}

UIWindowManager.prototype.paintSelf = function(canvas) {
	var x = this.x;
	var y = this.y;
	var translate = x || y;

	if(translate) {
		canvas.save();
		canvas.translate(x, y);
	}

	this.paintChildren(canvas);

	if(translate) {
		canvas.restore();
	}
}

UIWindowManager.prototype.isDeviceDirectionOK = function() {
	if(this.isInDesignMode()) {
		return true;
	}

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

	if(this.isInDesignMode()) {
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

	return win && win.onKeyDown(code);
}

UIWindowManager.prototype.onKeyUp= function(code) {
	var win = this.getCurrentWindow();

	return win && win.onKeyUp(code);
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

UIWindowManager.prototype.getSoundEnable = function() {
	return this.soundMusicsEnalbe || this.soundEffectsEnalbe;
}

UIWindowManager.prototype.setSoundEnable = function(enable) {
	this.setSoundEffectsEnable(enable);
	this.setSoundMusicsEnable(enable);

	return this;
}

UIWindowManager.prototype.setSoundEffectsEnable = function(enable) {
	this.soundEffectsEnalbe = enable;

	return this;
}

UIWindowManager.prototype.setSoundMusicsEnable = function(enable) {
	if(this.soundMusicsEnalbe !== enable) {
		this.soundMusicsEnalbe = enable;
		if(enable) {
			this.playSoundMusic();
		}
		else {
			this.stopSoundMusic();
		}
	}

	return this;
}

UIWindowManager.prototype.loadSoundEffects = function() {
	if(!this.soundEffectURLs) {
		return;
	}

	if(CantkRT.isCantkRTCordova()) {
		console.log("Native Audio supported: load native Audio")
		this.loadSoundEffectsNative();
	}
	else if(isWebAudioSupported()) {
		console.log("WebAudio supported: load Web Audio")
		this.loadSoundEffectsWebAudio();
	}
	else {
		console.log("WebAudio not supported: load HTML5 Audio")
		this.loadSoundEffectsHtml5Audio();
	}

	return this;
}

UIWindowManager.prototype.loadSoundEffectsHtml5Audio = function() {
	var urlArr = this.soundEffectURLs.split("\n");
	for(var i = 0; i < urlArr.length; i++) {
		var iter = urlArr[i];

		ResLoader.loadAudio(iter, function(audio) {
			var info = {audio:audio};
            UIWindowManager.setVolumeOfAudio(info.audio, UIWindowManager.soundEffectVolume);
			var name = decodeURI(basename(audio.src));
			UIWindowManager.soundEffects[name] = info;
        });
	}

	return this;
}

UIWindowManager.prototype.loadSoundEffectsNative = function() {
	var urlArr = this.soundEffectURLs.split("\n");
	for(var i = 0; i < urlArr.length; i++) {
		var iter = urlArr[i];

		CantkRT.createSoundEffect(iter, function(audio) {
			var info = {audio:audio};
            UIWindowManager.setVolumeOfAudio(info.audio, UIWindowManager.soundEffectVolume);
			var name = decodeURI(basename(audio.src));
			UIWindowManager.soundEffects[name] = info;
			console.log("loadSoundEffectsNative success.");
		}, function() {
			console.log("loadSoundEffectsNative fail.");
		});
	}

	return this;
}

UIWindowManager.prototype.loadSoundEffectsWebAudio = function() {
	var urlArr = this.soundEffectURLs.split("\n");
	for(var i = 0; i < urlArr.length; i++) {
		var iter = urlArr[i];
		var config = {src: [iter], autoplay: false, loop: false, volume: 0.8};
		var name = decodeURI(basename(iter));
		var info = {audio:new Howl(config), playing: false};

        UIWindowManager.setVolumeOfAudio(info.audio, UIWindowManager.soundEffectVolume);
		UIWindowManager.soundEffects[name] = info;
	}

	return this;
}

UIWindowManager.prototype.stopSoundEffect = function(name) {
	for(var key in UIWindowManager.soundEffects) {
		if(name === key || !name) {
			var info = UIWindowManager.soundEffects[key];
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

UIWindowManager.prototype.stopAllSound = function() {
	try {
		this.stopSoundMusic().stopSoundEffect();
	}catch(e) {
		console.log(e.message);
	}

	return this;
}

UIWindowManager.soundMusicVolume = 0.8
UIWindowManager.soundEffectVolume = 0.8;

UIWindowManager.prototype.setSoundEffectVolume = function(volume) {
	UIWindowManager.soundEffectVolume = volume;

	return this;
}

UIWindowManager.prototype.setSoundMusicVolume = function(volume) {
	UIWindowManager.soundMusicVolume = volume;
	
	var info = this.lastAudioInfo;
	if(info && info.audio) {
		UIWindowManager.setVolumeOfAudio(info.audio, UIWindowManager.soundMusicVolume);
	}


	return this;
}

UIWindowManager.setVolumeOfAudio = function(audio, volume) {
	if(typeof(audio.volume) === "function") {
		audio.volume(volume);
	}
	else {
		audio.volume = volume;
	}
}

UIWindowManager.prototype.playSoundEffect = function(name, onDone) {
	if(!this.soundEffectsEnalbe) {
		console.log("this.soundEffectsEnalbe is disable ");
		return this;
	}

	var info = UIWindowManager.soundEffects[name];
	if(!info || !info.audio) {
		console.log("not found: " + name);
		return this;
	}

	if(onDone) {
		if(info.audio.once) {
			info.audio.once("end", onDone);
		}
		else {
			info.audio.addEventListener('ended', function (e) {
				onDone();
			});
		}
	}

	UIWindowManager.setVolumeOfAudio(info.audio, UIWindowManager.soundEffectVolume);
	info.audio.play();
	console.log("playSoundEffect:" + name);

	return this;
}

//////////////////////////////////////////////////////////////////////

UIWindowManager.prototype.onMultiTouch = function(action, points, event) {
	var win = this.getCurrentWindow();
	if(win) {
		var ox = this.left + win.left;
		var oy = this.top + win.top;

		for(var i = 0; i < points.length; i++) {
			var p = points[i];
			p.x -= ox;
			p.y -= oy;
		}

		win.onMultiTouch(action, points, event);
	}
}

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

UIWindowManager.prototype.loadSoundMusicHTML5 = function() {
	var me = this;
	var loop = this.soundMusicLoop;
	var autoPlay = this.soundMusicAutoPlay;
	var urlArr = this.soundMusicURLs.split("\n");

	for(var i = 0; i < urlArr.length; i++) {
		var iter = urlArr[i];
		ResLoader.loadAudio(iter, function(audio) {
			var info = {audio:audio};
			var name = decodeURI(basename(audio.src));
            UIWindowManager.setVolumeOfAudio(info.audio, UIWindowManager.soundMusicVolume);
			
			if(loop) {	
				audio.loop = "loop";
			}
			if(autoPlay) {
				audio.play();
				autoPlay = false;
			}
			me.autoPlayPending = true;
			UIWindowManager.soundMusic[name] = info;
        });
	}

	return;
}

UIWindowManager.prototype.loadSoundMusicWebAudio = function() {
	var me = this;
	var loop = this.soundMusicLoop;
	var autoPlay = this.soundMusicAutoPlay;
	var urlArr = this.soundMusicURLs.split("\n");
	
	for(var i = 0; i < urlArr.length; i++) {
		var iter = urlArr[i];
		var config = {src: [iter], autoplay: autoPlay, loop:loop, volume: 0.8};
		var name = decodeURI(basename(iter));
		var info = {audio:new Howl(config), playing: autoPlay};

        UIWindowManager.setVolumeOfAudio(info.audio, UIWindowManager.soundMusicVolume);
		if(autoPlay) {
			this.lastAudioInfo = info;
		}
		autoPlay = false;
		UIWindowManager.soundMusic[name] = info;
	}

	return;
}

UIWindowManager.prototype.loadSoundMusicNative = function() {
	var me = this;
	var loop = this.soundMusicLoop;
	var autoPlay = this.soundMusicAutoPlay;
	var urlArr = this.soundMusicURLs.split("\n");
	
	for(var i = 0; i < urlArr.length; i++) {
		var iter = urlArr[i];
		CantkRT.createSoundMusic(iter, function(audio) {
			var info = {audio:audio};
			var name = decodeURI(basename(audio.src));
            UIWindowManager.setVolumeOfAudio(info.audio, UIWindowManager.soundMusicVolume);
			if(loop) {	
				audio.loop = "loop";
			}
			if(autoPlay) {
				audio.play();
				this.lastAudioInfo = info;
				autoPlay = false;
			}
			UIWindowManager.soundMusic[name] = info;
        });
	}

	return;
}

UIWindowManager.prototype.loadSoundMusic = function() {
    if(!this.soundMusicURLs) {
		return;
	}

    this.soundMusicsEnalbe = true;
	if(CantkRT.isCantkRTCordova()) {
		console.log("Native Audio supported: load native Audio")
		this.loadSoundMusicNative();
	}
	else if(isWebAudioSupported()) {
		console.log("WebAudio supported: load Web Audio")
		this.loadSoundMusicWebAudio();
	}
	else {
		this.loadSoundMusicHTML5();
	}
	this.soundMusicsPlaying = this.soundMusicAutoPlay;

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

/*
UIWindowManager.prototype.getSceneIds = function() {
    var ids = [];
    this.children.forEach(function(scene) {
        ids.push(scene.Id);
    });
    
    return ids;
}

UIWindowManager.prototype.getSceneJsonById = function(id) {
    var scenes = this.children;
    for(var i = 0; i < scenes.length; i++) {
        var scene = scenes[i];
        if(id === scene.id) {
            return scene.toJson();
        }  
    }
    return null;
}
*/

UIWindowManager.prototype.stopSoundMusic = function(name) {
	for(var key in UIWindowManager.soundMusic) {
		if(name === key || !name) {
			var info = UIWindowManager.soundMusic[key];
			if(info && info.audio) {
				info.audio.pause();
				info.playing = false;
				this.soundMusicsPlaying = false;
			}
		}
	}

	return this;
}

UIWindowManager.prototype.playSoundMusic = function(name, onDone) {
	if(this.soundMusicsPlaying) {
		this.stopSoundMusic();
	}

	if(!this.soundMusicsEnalbe) {
        if(name) {
            this.lastAudioInfo = UIWindowManager.soundMusic[name];
        }
		console.log("this.soundMusicsEnalbe is disable ");
		return this;
	}

	if(!name && this.lastAudioInfo && this.lastAudioInfo.audio) {
		var info = this.lastAudioInfo;

		UIWindowManager.setVolumeOfAudio(info.audio, UIWindowManager.soundMusicVolume);
		info.audio.play();
		info.playing = true;
		this.soundMusicsPlaying = true;

		return this;
	}

	for(var key in UIWindowManager.soundMusic) {
		if(name === key || !name) {
			var info = UIWindowManager.soundMusic[key];
			if(info && info.audio) {
				if(onDone) {
				    if(info.audio.once) {
                    	info.audio.once("end", onDone);
                    } else {
                        info.audio.addEventListener("ended", function(e) {
                            onDone();
                        });
                    }
				}
				UIWindowManager.setVolumeOfAudio(info.audio, UIWindowManager.soundMusicVolume);
				info.audio.play();
				info.playing = true;
				this.lastAudioInfo = info;
				this.soundMusicsPlaying = true;

				console.log("UIWindowManager.prototype.playSoundMusic");
				break;
			}
		}
	}

	console.log("playSoundMusic:" + name);

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

UIWindowManager.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIWindow;
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
	
ShapeFactoryGet().addShapeCreator(new UIWindowManagerCreator());

