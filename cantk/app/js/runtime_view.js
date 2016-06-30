/*
 * File: runtime_view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  runtime view 
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

function TRuntimeView() {
}

TRuntimeView.prototype = new TView();
TRuntimeView.prototype.init = function(parent, x, y, w, h, app) {
	this.app = app;
	this.type = "app-view";
	TView.prototype.init.call(this, parent, x, y, w, h);
	
	this.preview = app.preview;
	this.setDoc(new TRuntimeDocument());

	this.doc.onLoad = this.onLoad.bind(this);
	WWindowManager.onMultiTouch = this.onMultiTouch.bind(this);
	WWindowManager.instance.drawWindows = this.paintSelf.bind(this);

	return this;
}

TRuntimeView.prototype.onMultiTouch = function(action, points, event) {
	var wm = this.getWindowManager();
	if(wm) {
		wm.onMultiTouch(action, points, event);
	}
}

TRuntimeView.prototype.resizeForFixWidth = function(wm) {
	var vp = cantkGetViewPort();
	var scale = wm.w/vp.width;
	var w = wm.w;
	var h = vp.height * scale;

	var styleW = vp.width;
	var styleH = vp.height;

	this.app.resizeWin(w,  h);
	this.app.resizeCanvas(w, h, 0, 0, styleW, styleH);
	WWindowManager.setInputScale(scale, scale);
	wm.setSize(w, h);
	wm.relayout();
}

TRuntimeView.prototype.resizeForFixHeight = function(wm) {
	var vp = cantkGetViewPort();
	var scale = wm.h/vp.height;
	var h = wm.h;
	var w = vp.width * scale;

	var styleW = vp.width;
	var styleH = vp.height;

	this.app.resizeWin(w,  h);
	this.app.resizeCanvas(w, h, 0, 0, styleW, styleH);
	WWindowManager.setInputScale(scale, scale);
	wm.setSize(w, h);
	wm.relayout();
}

TRuntimeView.prototype.resizeForFixResolution = function(wm) {
	var vp = cantkGetViewPort();
	var scalex = wm.w/vp.width;
	var scaley = wm.h/vp.height;
	var scale = Math.max(scalex, scaley);
	var w = scale * vp.width;
	var h = scale * vp.height;
	var styleW = vp.width;
	var styleH = vp.height;
	var x = (w - wm.w) >> 1;
	var y = (h - wm.h) >> 1;

	wm.setLeftTop(x, y);
	this.app.resizeWin(w,  h);
	this.app.resizeCanvas(w, h, 0, 0, styleW, styleH);
	WWindowManager.setInputScale(scale, scale);
	wm.relayout();
}

TRuntimeView.prototype.translatePointToWm = function(point) {
	return point;
}

TRuntimeView.prototype.resizeForAuto = function(wm) {
	var vp = cantkGetViewPort();
	wm.setSize(vp.width, vp.height);
	wm.relayout();
}

TRuntimeView.prototype.adjustWMSizePositionPreview = function(wm) {
	var vp = cantkGetViewPort();
	var w = wm.w;
	var h = wm.h;
	var scale = Math.min(1, Math.min(vp.width/w, vp.height/h));
	var styleW = w * scale;
	var styleH = h * scale;

	var x = (vp.width - styleW) >> 1;
	var y = (vp.height - styleH) >> 1;

	wm.setLeftTop(0, 0);
	this.app.resizeWin(w, h);
	this.app.resizeCanvas(w, h, x, y, styleW, styleH);
	WWindowManager.setInputOffset(x, y);
	WWindowManager.setInputScale(1/scale, 1/scale);

	wm.relayout();
}

TRuntimeView.prototype.adjustWMSizePositionRun = function(wm) {
	var meta = this.getMeta();
	var general = meta.general;
	var orientation = general.orientation;

	wm.forcePortrait = false;
	wm.forceLandscape = false;
	var designWidth = this.designWidth;
	var designHeight = this.designHeight;

	if(orientation === "landscape" && designWidth > designHeight) {
		wm.forceLandscape = true;
	}
	else if(orientation === "portrait" && designHeight > designWidth) {
		wm.forcePortrait = true;
	}
	wm.screenScaleMode = general.screenscale; 
	
	wm.setLeftTop(0, 0);
	switch(wm.screenScaleMode) {
		case "fix-width": {
			this.resizeForFixWidth(wm);
			break;
		}
		case "fix-height": {
			this.resizeForFixHeight(wm);
			break;
		}
		case "fix-resolution": {
			this.resizeForFixResolution(wm);
			break;
		}
		default: {
			this.resizeForAuto(wm);
			break;
		}
	}

	return;
}

TRuntimeView.prototype.adjustWMSizePosition = function() {
	var wm = this.getWindowManager();

	if(this.preview) {
		return this.adjustWMSizePositionPreview(wm);
	}
	else {
		return this.adjustWMSizePositionRun(wm);
	}
}

TRuntimeView.prototype.onLoad = function() {
	var wm = this.getWindowManager();
	var meta = this.getMeta();

	if(meta.general.useWebGL) {
		WWindowManager.setCanvasContextName("2d-webgl");
	}

	//for preview current window
	if(window.cantkInitWindow !== undefined) {
		wm.setInitWindow(window.cantkInitWindow);
		console.log("window.cantkInitWindow:" + window.cantkInitWindow);
	}

    wm.setView(this);
    wm.setApp(this.app);
	wm.setMode(Shape.MODE_RUNNING, true);

	this.designWidth = wm.w;
	this.designHeight = wm.h;
	this.adjustWMSizePosition();
	this.run();
}

TRuntimeView.prototype.paintLoading = function(canvas) {
}

TRuntimeView.prototype.getViewScale = function() {
	return 1;
}

TRuntimeView.prototype.paintSelf = function(canvas) {
	var wm = this.getWindowManager();
	if(!wm) {
		this.paintLoading(canvas);

		return;
	}

	canvas.save();
	wm.paint(canvas);
	canvas.restore();

	var sx = wm.x;
	var sy = wm.y;
	var sw = wm.w;
	var sh = wm.h;
	var w = this.rect.w;
	var h = this.rect.h;

	canvas.beginPath();
	if(sy > 0) {
		canvas.rect(0, 0, w, sy);
	}
	if(sx > 0) {
		canvas.rect(0, 0, sx, h);
	}
	var r = sx + sw;
	var rw = w - r;
	if(rw > 0) {
		canvas.rect(r, 0, rw, h);
	}
	var b = sy + sh;
	var bh = h - b;
	if(bh > 0) {
		canvas.rect(0, b, w, bh);
	}

	if(sy > 0 || sx > 0 || rw > 0 || bh > 0) {
		canvas.fillStyle = wm.style.fillColor;
		canvas.fill();
	}

	return;
}

TRuntimeView.prototype.onGesture = function(gesture) {
	var curWin = wm.getCurrentWindow();

	curWin.onGesture(gesture);

	return;
}

TRuntimeView.prototype.getAppInfo = function() {
	var metaInfo = this.getMetaInfo();

	return metaInfo.general;
}

TRuntimeView.prototype.onLoadUserScriptsDone = function() {
	var appInfo = this.getAppInfo();
	HolaSDK.init(appInfo.appid, false);
	console.log("TRuntimeView.prototype.onLoadUserScriptsDone.");
}

TRuntimeView.prototype.loadUserScripts = function(meta) {
	if(meta) {
		var scripts = meta.extlibs;
		var force = window.location.href.indexOf("appid=preview") > 0;
		
		if(!scripts) {
			scripts = [];
		}

//		scripts.push(HolaSDK.getSDKURL());

        if(scripts.length > 0) {
            //make a sort
            var userLibs = [];
            var extLibs = [];
            scripts.forEach(function(script) {
                if(script.indexOf("read.php?") > 0 && script.indexOf("/libs/") > 0) {
                    var t = meta.docSavedTime ? meta.docSavedTime : Date.now();
                    userLibs.push(script + "&timestamp=" + t);
                } else {
                    extLibs.push(script);
                }
            });
            userLibs.sort();
            scripts = extLibs.concat(userLibs);
        }
		
        if(scripts) {
			var arr = [];
			for(var i = 0; i < scripts.length; i++) {
				var iter = scripts[i];
				if(iter.indexOf("res.wx.qq.com") >= 0 && !isWeiXin()) {
					console.log("not weixin browser skip weixin jssdk");
					continue;
				}
				arr.push(iter);
			}

			if(arr.length) {
				ResLoader.loadScriptsSync(arr, this.onLoadUserScriptsDone.bind(this));
			}
		}
	}

	return;
}

TRuntimeView.prototype.paintBackground = function(canvas) {
}

TRuntimeView.prototype.startRedrawTimer = function(fps) {
	var fps = fps || 60;
	var dt = 1000/fps;
	var wm = WWindowManager.getInstance();

	setInterval(wm.postRedraw.bind(wm), dt);

	return;
}

TRuntimeView.prototype.run = function() {
	var meta = this.getMeta();
	var wm = this.getWindowManager();
	var runtimeConfig = this.detectDeviceConfig();

	if(this.preview) {
		runtimeConfig.lcdDensity = wm.deviceConfig.lcdDensity;
	}

	wm.setDeviceConfig(runtimeConfig);

	this.modifyTitle(meta);
	this.loadUserScripts(meta);
	this.startRedrawTimer(meta.general.fps);

	wm.systemInit();
	wm.postRedraw();

	return;
}

TRuntimeView.prototype.modifyTitle = function(meta) {
	if(meta && meta.general) {
		var appname = meta.general.appname;

		document.title = appname;
		if(isIPhone() || isIPad()) {
			var tags = document.getElementsByTagName("title");
			if(tags && tags.length) {
				var title = tags[0];
				title.innerHTML = appname;
            }
		}
	}
}

TRuntimeView.create = function(parent, x, y, w, h, app) {
	var view = new TRuntimeView();
	return view.init(parent, x, y, w, h, app);
}

function dappGetText(text) {
	return text;
}

function dappIsEditorApp() {
	return false;
}

