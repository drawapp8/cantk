
/*
 * File:    browser.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief:   detect browser
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */
function browser() {
}

browser.init = function() {
	var u = navigator.userAgent, app = navigator.appVersion;

	browser.ie9 = u.indexOf('MSIE 9.0') >=0;
	browser.ie10 = u.indexOf('MSIE 10.0') >=0;
	browser.ie = u.indexOf('MSIE') >=0 || u.indexOf('Trident') >=0;
	browser.oldIE = u.indexOf('MSIE 8.0') >=0||u.indexOf('MSIE 7.0') >=0 || u.indexOf('MSIE 6.0') >=0;
	browser.android = u.indexOf('Android') >=0 && u.indexOf('Linux') >=0;
	browser.iPhone = u.indexOf('iPhone') >=0;
	browser.iPad = u.indexOf('iPad') >=0;
	browser.blackberry = u.indexOf('BlackBerry') >=0;
	browser.firefoxMobile = u.indexOf('Mobile') >=0 && u.indexOf('Firefox') >=0;
	browser.firefoxOS = u.indexOf('Mobile') >=0 && u.indexOf('Firefox') >=0 && u.indexOf('Android') < 0;
	browser.windowPhone = u.indexOf('Windows Phone') >=0;
	browser.webkit = u.indexOf("WebKit") >=0;
	browser.weixin = u.indexOf("MicroMessenger") >= 0;
	browser.weibo = u.indexOf("weibo") >= 0;
	browser.qq = u.indexOf("QQ") >= 0;
	browser.linux = u.indexOf("Linux") >= 0;
	browser.windows = u.indexOf("Windows") >= 0;
	browser.macosx = u.indexOf("Mac OS X") >= 0;

	if(browser.iPhone) {
		var a = u.match(/iPhone; CPU iPhone OS \d+/g);
		if(a && a.length) {
			browser.iOSVersion = parseInt(a[0].match(/\d+/g)[0]);
		}
	}

	function getBrowserVersionNumber() {
		var ua = navigator.userAgent;
		var keys = ["AppleWebKit/", "AppleWebKit ", "AppleWebKit", "MSIE ", "Firefox/", 
			"Safari/", "Opera ", "Opera/"];

		for(var i = 0; i < keys.length; i++) {
			var iter = keys[i];
			var offset = ua.indexOf(iter);
			if(offset >= 0) {
				var str = ua.substr(offset + iter.length);
				var version = parseFloat(str);

				return version;
			}
		}

		return 1.0;
	}

	browser.number = getBrowserVersionNumber();

	browser.isAudioSupportLoop = true;
	if(browser.isIPhone && browser.iOSVersion < 6) {
		browser.isAudioSupportLoop = false;
	}

	if(browser.oldIE || browser.ie9) {
		window.console = {};
		window.console.log = function(str) {};
	}
	
	browser.isMobile = browser.android || browser.iPhone || browser.blackberry
		|| browser.windowPhone || browser.firefoxMobile || browser.iPad;

	if(browser.isMobile) {
		window.console.logStr = "";
		window.console.logR = window.console.log;

		window.console.getLog = function() {
			return window.console.logStr;
		}

		window.console.log = function(str) {
			window.console.logStr += str + "\n";
			window.console.logR(str);

			return;
		}
	}

	console.log(navigator.userAgent); 
	window.isSpecialBrowser = browser.qq || browser.weibo || browser.weixin;

	return;
}

function isQQ() {
	return browser.qq;
}

function isWeiBo() {
	return browser.weibo;
}

function isWeiXin() {
	return browser.weixin;
}

function isWebkit() {
	return browser.webkit;
}

function isOldIE() {
	return browser.oldIE;
}

function isIE() {
	return browser.ie;
}

if(browser.oldIE) {
	console.log("oldIE "+browser.oldIE);
}

function isMobile() {
	return browser.isMobile;
}

browser.isWindows = function() {
	return !browser.isMobile && browser.windows;
}

browser.isLinux = function() {
	return !browser.isMobile && browser.linux;
}

browser.isMacOSX = function() {
	return !browser.isMobile && browser.macosx;
}

function isAndroid() {
	return browser.android;
}

function isIPhone() {
	return browser.iPhone;
}

function isIPad() {
	return browser.iPad;
}

function isWinPhone() {
	return browser.windowPhone;
}

function isBlackBerry() {
	return browser.blackberry;
}

function isFirefoxMobile() {
	return browser.firefoxMobile;
}

function isFirefoxOS () {
	return browser.firefoxOS;
}

function isHolaPlay() {
	return window.cantkRTV8;
}

function isPhoneGap() {
	return (window.cordova || window.Cordova || window.PhoneGap || window.phonegap) 
		&& /^file:\/{3}[^\/]/i.test(window.location.href) 
		&& /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
}

function isTizen() {
	return window.tizen;
}

function browserVersion() {
	return browser.number;
}

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

browser.init();

/*
 * File:    locales.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief:   functions to handle locale strings.
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */

Locales = {};

Locales.getLang = function() {
	var lang = navigator.language || navigator.userLanguage;

	return lang;
}

Locales.getLanguageName = Locales.getLang;

Locales.setTextTable = function(textTable) {
	Locales.textTable = textTable;

	return;
}

Locales.setLanguageSupportList = function(langList) {
    Locales.languageList = langList;
}

Locales.getLanguageSupportList = function() {
    return Locales.languageList;
}

Locales.getTextTable = function() {
	return Locales.textTable;
}

Locales.addTextTable = function(textTable) {
	if(!Locales.textTable) {
		Locales.textTable = {};
	}

	for(var key in textTable) {
		Locales.textTable[key] = textTable[key];
	}

	return;
}

Locales.getText = function(text) {
	var str = null;
	
	if(Locales.textTable) {
		str = Locales.textTable[text];
		if(!str) {
			Locales.textTable[text] = text;
		}
	}

	return str ? str : text;
}

window.dappGetText = function(text) {	
	return Locales.getText(text);
}

window.dappGetTitle = function(text) {	
	return dappGetText(text) + ":";
}

window.cantkGetLocale = function() {
	return Locales.getLang();
}
window.Locales = Locales;

/*
 * File:   cantk-rt.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  cantk runtime adapter
 * 
 * Copyright (c) 2015 - 2015 Tangram HD Inc.
 * 
 */
function CantkRT() {
}

CantkRT.init = function(onDeviceReady) {
	window.onload = onDeviceReady;
}

CantkRT.isNative = function() {
	return CantkRT.isCantkRTV8() || CantkRT.isCantkRTCordova();
}

CantkRT.isCantkRTV8 = function() {
	return !!window.cantkRTV8;
}

CantkRT.loadFont = function(name, url) {
	if(window.loadFont) {
		window.loadFont(name, url);
	}
	console.log("load font " + name + ":" + url);
}

CantkRT.isCantkRTCordova = function() {
	return !!window.cantkRTCordova;
}

CantkRT.getViewPort = function() {
	var width;
	var height;

	if(window.displayInfo) {
		width = window.displayInfo.width;
		height = window.displayInfo.height;
	}
	else if (typeof window.innerWidth != 'undefined'){
		width = window.innerWidth;
		height = window.innerHeight;
	}
	else if (typeof document.documentElement != 'undefined'
	&& typeof document.documentElement.clientWidth !=
	'undefined' && document.documentElement.clientWidth != 0)
	{
		width = document.documentElement.clientWidth;
		height = document.documentElement.clientHeight;
	}
	else{
		width = document.getElementsByTagName('body')[0].clientWidth;
		height = document.getElementsByTagName('body')[0].clientHeight;
	}
	
	return {width:width, height:height};
}

CantkRT.getMainCanvas = function() {
	var canvas = null;

	if(CantkRT.canvas) {
		return CantkRT.canvas;
	}

	canvas = document.getElementById('main_canvas');
	if(!canvas) {
		canvas = document.createElement("canvas");
		canvas.id = "main_canvas";
		canvas.style.zIndex = 0;
		document.body.appendChild(canvas);
	}

	if(canvas.setAsMainCanvas) {
		canvas.setAsMainCanvas();
	}

	if(!canvas.flush) {
		canvas.flush = function() {}
	}

	CantkRT.canvas = canvas;

	return canvas;
}

CantkRT.mainCanvasW = 0;
CantkRT.mainCanvasH = 0;
CantkRT.mainCanvasScale = {x:1, y:1};
CantkRT.mainCanvasPostion = {x:0, y:0};

CantkRT.moveMainCanvas = function(x, y) {
	var canvas = CantkRT.getMainCanvas();
	canvas.style.position = "absolute";
	canvas.style.top = y + "px";
	canvas.style.left = x + "px";
	CantkRT.mainCanvasPostion.x = x;
	CantkRT.mainCanvasPostion.y = y;
}

CantkRT.resizeMainCanvas = function(w, h, styleW, styleH) {
	var canvas = CantkRT.getMainCanvas();

	canvas.width = w;
	canvas.height = h;
	canvas.style.width = styleW + "px";
	canvas.style.height = styleH + "px";
	CantkRT.mainCanvasW = w;
	CantkRT.mainCanvasH = h;
	CantkRT.mainCanvasScale.x = w/styleW;
	CantkRT.mainCanvasScale.y = h/styleH;
}

CantkRT.getMainCanvasScale = function() {
	return CantkRT.mainCanvasScale;
}

CantkRT.getMainCanvasPosition = function() {
	return CantkRT.mainCanvasPostion;
}

CantkRT.isResSupportCrossOrgin = function(src) {
	if(src && src.indexOf("file://") < 0 
		&& src.indexOf("data:image") !== 0 
		&& src.indexOf("api.map.baidu.com") < 0 
		&& src.indexOf("maps.googleapis.com") < 0 
		&& src.indexOf(location.host) < 0) {
		return true;
	}
	else {
		return false;
	}
}

CantkRT.createImage = function(src, onLoad, onError) {
	var image = null;
	image = new Image();
	image.onload = function() {
		if(onLoad) {
			onLoad(image);
		}
	}
	
	image.onerror = function(e) {
		if(e) {
			console.log(this.src + " load error: " + e.message);
		}
		else {
			console.log(this.src + " load error");
		}

		if(image.crossOrigin) {
			var src = image.src;
			image.crossOrigin = null;
			image.src = null;
			image.src = src;
			console.log("try without image.crossOrigin:" + src);
			return;
		}

		if(onError) {
			onError(image);
		}

	}
	
	if(CantkRT.isResSupportCrossOrgin(src)) {
		image.crossOrigin = "Anonymous";
	}

	image.src = src;

	return image;
}

CantkRT.createImageFromCanvas = function(canvas, onLoad, onError) {
	if(!canvas) {
		if(onError) {
			onError();
		}

		return null;
	}

	if(onLoad) {
		onLoad(canvas);
	}

	return canvas;
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame 
	|| window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

CantkRT.requestAnimFrame = function(callback) {
	return window.requestAnimationFrame(callback);
}

CantkRT.createSound = function(src, soundEffect, onDone, onFail) {
	var audio = new Audio();

	audio.setAsSoundEffect(soundEffect);
	audio.onload = function() {
		if(onDone) {
			onDone(audio);
		}
	}
	audio.onerror = function(e) {
		if(onFail) {
			onFail(e);
		}
	}
	audio.src = src;

	return audio;
}

CantkRT.createSoundEffect = function(src, onDone, onFail) {
	return CantkRT.createSound(src, true, onDone, onFail);
}

CantkRT.createSoundMusic = function(src, onDone, onFail) {
	return CantkRT.createSound(src, false, onDone, onFail);
}
/*
 * File: utils.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: some tool functions.
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

Object.defineProperty(Array.prototype, 'remove', 
{
	enumerable: false,
	value: function(obj, all){
		for (var i=0; i < this.length; ++i ) {
			if ( this[i] === obj ) {
				this.splice(i, 1); 

				if(!all) 
				   break;
			}
		}
		
		return this;
	}
});

Object.defineProperty(Array.prototype, 'insert', 
{
	enumerable: false,
	value: function(index, obj){
		if(index >= 0 && index < this.length) {
			this.splice(index, 0, obj);
		}
		else {
			this.push(obj);
		}

		return this;
	}
});

Object.defineProperty(Array.prototype, 'indexOf', 
{
	enumerable: false,
	value: function(obj){
		var n = this.length;
		for (var i=0; i < n; ++i ) {
			if ( this[i] === obj ) {
				return i;
			}
		}
		
		return -1;
	}
});

Object.defineProperty(Array.prototype, 'find', 
{
	enumerable: false,
	value: function(checkIf){
		var n = this.length;
		for (var i=0; i < n; ++i ) {
			var  iter = this[i];
			if (checkIf(iter)) {
				return iter;
			}
		}

		return null;
	}
});


Object.defineProperty(Array.prototype, 'binarySearch', 
{
	enumerable: false,
	value: function(find, comparator){
		var i = 0;
		var low = 0;
		var comparison = 0; 
		var high = this.length - 1;

		while (low <= high) {
			i = (low + high) >> 1;
			comparison = comparator(this[i], find);
			if (comparison < 0) { low = i + 1; continue; };
			if (comparison > 0) { high = i - 1; continue; };

			return i;
		}

		return -1;
	}
});

Object.defineProperty(Array.prototype, 'has', 
{
	enumerable: false,
	value: function(obj){
    	return this.indexOf(obj) >= 0;
	}
});

Object.defineProperty(Array.prototype, 'destroyData', 
{
	enumerable: false,
	value: function(){
		for(var i = 0; i < this.length; i++) {
			var iter = this[i];

			if(!iter || typeof iter != "object") {
				continue;
			}

			if(iter.destroy && typeof iter.destroy == "function") {
				iter.destroy();
			}
		}

		this.length = 0;  

		return this;
	}
});

Object.defineProperty(Array.prototype, 'clear', 
{
	enumerable: false,
	value: function(destroyData){
		if(destroyData) {
			this.destroyData();
		}
		this.length = 0;  

		return this;
	}
});

Object.defineProperty(Array.prototype, 'copy', 
{
	enumerable: false,
	value: function(src){
		this.clear();

		for (var i= 0 ; i < src.length ; ++i ) {
			var obj = src[i];

			if(obj && obj.dup) {
				obj = obj.dup();
			}

			this.push(obj);	
		}

		return this;
	}
});

function makeUniqRandArray(start, end) {
	if(start >= end) {
		return null;
	}

	var arr = [];
	var range = end - start + 1;

	for(var i = 0; i < range; i++) {
		do {
			var num = start + Math.floor(Math.random() * range);
			if(!arr.has(num)) {
				arr.push(num);
				break;
			}
		}while(1);
	}
	
	return arr;
}

///////////////////////////////////////////////////////////////////

function fixRect(rect) {
	if(rect.w < 0) {
		rect.x = rect.x + rect.w;
		rect.w = -rect.w;
	}

	if(rect.h < 0) {
		rect.y = rect.y + rect.h;
		rect.h = -rect.h;
	}

	return rect;
}

function isPointInRect(point, rect) {
    return point.x >= rect.x
        && point.y >= rect.y
        && point.x < (rect.x + rect.w)
        && point.y < (rect.y + rect.h);
}


function cantkAddEventListener(name, handler) {
	if (window.attachEvent) {
		//IE and Opera
		window.attachEvent(name, handler);
	} else if (window.addEventListener) {
		// IE 6
		window.addEventListener(name, handler);
	} else {
		//FireFox
		document.addEventListener(name, handler, true);
	}

	return;
}

String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {   
	if (!RegExp.prototype.isPrototypeOf(reallyDo)) {   
		return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);   
	}
	 else {   
	 	return this.replace(reallyDo, replaceWith);   
	 }   
}   

/*WordPress convert " to “ ”, we need convert it back.*/
function fixJson(json) {
	var i = 0;
	var str = "";

	json = json.replaceAll("<br>", "");
	
	var n = json.length;
	for(i = 0; i < n; i++) {
		var c = json.charAt(i);

		if(c === '“' || c === '”') {
			c = '"';
		}

		str = str + c;
	}

	return str;
}

String.prototype.trim = function() 
{
	return String(this).replace(/^\s+|\s+$|^\n+|\n+$/g, '');
}

String.prototype.startWith = function(str){var t=this;return t.indexOf(str) == 0;};

String.prototype.endWith = function(str){var t = this;return t.substring(t.length-str.length,t.length) == str;};

String.prototype.isImageFileName = function(){
	var t = this.toLowerCase();

	return t.endWith(".png") || t.endWith(".jpg") || t.endWith("jpeg");
};

function drawDashedRect(canvas, x, y, w, h) {
	var f = 8;
	var e = 4;

	canvas.beginPath();
	drawDashedLine(canvas, {x:x, y:y}, {x:w+x, y:y}, f, e);
	drawDashedLine(canvas, {x:x, y:h+y}, {x:w+x, y:h+y}, f, e);
	drawDashedLine(canvas, {x:x, y:y}, {x:x, y:h+y}, f, e);
	drawDashedLine(canvas, {x:w+x, y:y}, {x:w+x, y:h+y}, f, e);

	return;
}

function drawDashedLine(canvas, start_p, end_p, f, e) {
	if(!canvas || !start_p || !end_p || !f) return;
	

	var x = start_p.x;
	var y = start_p.y;
	
	canvas.moveTo(x, y);
	if(!e) {
		canvas.lineTo(end_p.x, end_p.y);
		
		return;
	}
	
	var dx = end_p.x - start_p.x;
	var dy = end_p.y - start_p.y;
	var length = Math.sqrt(dx*dx + dy*dy);	
	var angle = Math.atan(dy/dx);

	canvas.save();
	canvas.translate(start_p.x, start_p.y);
	canvas.rotate(angle);
	if(end_p.x < start_p.x) {
		canvas.translate(-length, 0);
	}
	canvas.moveTo(0, 0);			
	x = 0;
	while(x < length) {
		x += f;
		if(x > length) {
			x = length;
		}
		canvas.lineTo(x, 0);

		if(x == length) {
			break;
		}

		x += e;
		if(x > length) {
			x = length;
		}
		canvas.moveTo(x, 0);			
	}
	canvas.restore();

	return;
}

var gCacheCanvas = null;
function CacheCanvasGet(width, height) {
	if(!gCacheCanvas) {
		gCacheCanvas = document.createElement("canvas");

		gCacheCanvas.type = "backend_canvas";
		gCacheCanvas.width = width;
		gCacheCanvas.height = height;
	}

	if(gCacheCanvas) {
		if(gCacheCanvas.width < width) {
			gCacheCanvas.width = width;
		}

		if(gCacheCanvas.height < height) {
			gCacheCanvas.height = height;
		}
	}

	return gCacheCanvas;
}

function drawNinePatchEx(context, image, s_x, s_y, s_w, s_h, x, y, w, h) {
	var dx = 0;
	var dy = 0;
	var tw = 0;
	var th = 0;
	var cw = 0;
	var ch = 0;
	var dcw = 0;
	var dch = 0;
	
	if(!image) {
		context.fillRect(x, y, w, h);
		return;
	}

	if(!s_w || s_w > image.width) {
		s_w = image.width;
	}

	if(!s_h || s_h > image.height) {
		s_h = image.height;
	}

	if(w < s_w && h < s_h && (s_w < 3 || s_h < 3)) {
		context.drawImage(image, s_x, s_y, s_w, s_h, x, y, w, h);

		return;
	}

	if(w < s_w) {
		tw = w/2;
		dcw = 0;
		cw = 0;
	}
	else {
		tw = Math.floor(s_w/3);
		dcw = w - tw - tw;
		cw = s_w - tw - tw;
	}

	if(h < s_h) {
		th = h/2;
		dch = 0;
		ch = 0;
	}
	else {
		th = Math.floor(s_h/3);
		dch = h - th - th;
		ch = s_h - th - th;
	}

	/*draw four corner*/
	context.drawImage(image, s_x, s_y, tw, th, x, y, tw, th);
	context.drawImage(image, s_x+s_w-tw, s_y, tw, th, x+w-tw, y, tw, th);
	context.drawImage(image, s_x, s_y+s_h-th, tw, th, x, y+h-th, tw, th);
	context.drawImage(image, s_x+s_w-tw, s_y+s_h-th, tw, th, x+w-tw, y+h-th, tw, th);

	//top/bottom center
	if(dcw > 0) {
		context.drawImage(image, s_x+tw, s_y, cw, th, x+tw, y, dcw, th);
		context.drawImage(image, s_x+tw, s_y+s_h-th, cw, th, x+tw, y+h-th, dcw, th);
	}

	//left/right middle 
	if(dch > 0) {
		context.drawImage(image, s_x, s_y+th, tw, ch, x, y+th, tw, dch);
		context.drawImage(image, s_x+s_w-tw, s_y+th, tw, ch, x+w-tw, y+th, tw, dch);
	}

	//center + middle
	if(dcw > 0 && dch > 0) {
		context.drawImage(image, s_x+tw, s_y+th, cw, ch, x+tw, y+th, dcw, dch);
	}

	return;
}

function drawNinePatch(context, image, x, y, w, h) {
	if(!image) {
		context.fillRect(x, y, w, h);
		return;
	}

	return drawNinePatchEx(context, image, 0, 0, image.width, image.height, x, y, w, h);
}

function drawNinePatchIcon(context, icon, x, y, w, h) {
	var image = icon.getImage();
	var s_x = icon.getX();
	var s_y = icon.getY();
	var s_w = icon.getWidth();
	var s_h = icon.getHeight();

	if(!image) {
		context.fillRect(x, y, w, h);
		return;
	}

	return drawNinePatchEx(context, image, s_x, s_y, s_w, s_h, x, y, w, h);
}

function RoundRect() {
}

RoundRect.TL = 1;
RoundRect.TR = 2;
RoundRect.BL = 4;
RoundRect.BR = 8;

function drawRoundRect(canvas, w, h, r, which) {
	var hw = w >> 1;
	var hh = h >> 1;

	if(w < 0 || h < 0) {
		return;
	}
	
	if(!which) {
		which = RoundRect.TL | RoundRect.TR | RoundRect.BL | RoundRect.BR;
	}

	if((r >= hw || r >= hh) && which === (RoundRect.TL | RoundRect.TR | RoundRect.BL | RoundRect.BR)) {
		canvas.arc(hw, hh, Math.min(hh, hw), 0, Math.PI * 2);
		return;
	}

	if(r) {
		if(which & RoundRect.TL) {
			canvas.arc(r, r, r, Math.PI, 1.5*Math.PI, false);
		}
		else {
			canvas.moveTo(0, 0);
		}

		if(which & RoundRect.TR) {
			canvas.lineTo(w - r, 0);
			canvas.arc(w-r, r, r, 1.5*Math.PI, 2*Math.PI,  false);
		}
		else {
			canvas.lineTo(w, 0);
		}
	
		if(which & RoundRect.BR) {
			canvas.lineTo(w, h-r);
			canvas.arc(w-r, h-r, r, 0, 0.5*Math.PI, false);
		}
		else {
			canvas.lineTo(w, h);
		}

		if(which & RoundRect.BL) {
			canvas.lineTo(r, h);
			canvas.arc(r, h-r, r, 0.5 * Math.PI, Math.PI, false);
		}
		else {
			canvas.lineTo(0, h);
		}
		
		if(which & RoundRect.TL) {
			canvas.lineTo(0, r);
		}
		else {
			canvas.lineTo(0, 0);
		}
	}
	else {
		canvas.rect(0, 0, w, h);
	}

	return;
}

function cantkGetViewPort() {
	return CantkRT.getViewPort();
}

if(!window.orgViewPort) {
	window.orgViewPort = cantkGetViewPort();
}

function layoutText(canvas, fontSize, str, width, flexibleWidth) {
	if(width <= 0 || !width || !str) {
		return [];
	}

	var i = 0;
	var j = 0;
	var wordW = 0;
	var lineW = 0;
	var logicLine = "";
	var logicLines = [];
	var phyLines = str.split("\n");
	var textLayout = new TextLayout(canvas);

	for(i = 0; i < phyLines.length; i++) {
		var line = phyLines[i];

		if(line) {
			textLayout.setText(line);
			while(textLayout.hasNext()) {
				var lineInfo = textLayout.nextLine(width, fontSize, flexibleWidth);
				logicLines.push(lineInfo.text);
			}
		}
		else {
			logicLines.push(" ");
		}
	}

	return logicLines;
}

function codeIsLetter(code) {
	return ((code >= 0x61 && code <= 0x7a) || (code >= 0x41 && code <= 0x5a));
}

function TextLayout(canvas) {
	this.canvas = canvas;

	this.setText = function(str) {
		this.str = str;
		this.startOffset = 0;
		this.lineInfo = {text:"", width:0};

		return;
	}
	
	this.canBreakBefore = function(chr) {
		if(chr === ' '
			|| chr === '\t'
			|| chr === '.'
			|| chr === ']'
			|| chr === ')'
			|| chr === '}'
			|| chr === ','
			|| chr === '?'
			|| chr === ';'
			|| chr === ':'
			|| chr === '!'
			|| chr === '\"'
			|| chr === '\''
			|| chr === '。'
			|| chr === '？'
			|| chr === '、'
			|| chr === '”'
			|| chr === '’'
			|| chr === '】'
			|| chr === '》'
			|| chr === '〉'
			|| chr === '〕'
			|| chr === '）'
			|| chr === '：'
			|| chr === '；'
			|| chr === '，') {
				return false;
		}

		return true;
	}

	this.hasNext = function() {
		return this.startOffset < this.str.length;
	}

	this.nextLine = function(width, fontSize, flexibleWidth) {
		var done = false;
		var lineText = "";
		var str = this.str;
		var i = this.startOffset;
		var length = str.length;
		var n = Math.floor((width/fontSize)*0.75);
		var availableLength = length - this.startOffset;

		if(availableLength < 1) {
			this.lineInfo.text = "";
			this.lineInfo.width = 0;

			return null;
		}
		
		if(availableLength < n) {
			lineText = str.substr(this.startOffset, availableLength);
			this.lineInfo.text = lineText;
			this.lineInfo.width = canvas.measureText(lineText).width;

			this.startOffset = this.startOffset + lineText.length;

			return this.lineInfo;
		}

		if(n > 3) {
			n = n - 3;
		}
	
		lineText = str.substr(this.startOffset, n);
	
		var code = 0;
		var chr = null;
		var chrWidth = 0;
		var nextChar = null;
		var lineWidth = canvas.measureText(lineText).width;

		var flexibleWidth = flexibleWidth ? flexibleWidth : Math.floor(width * 0.3);

		var fontSize2 = 2 * fontSize;
		var maxWidth = width + flexibleWidth;
		var minWidth = width - fontSize2;

		for(i = this.startOffset + n; i < length; i++) {
			chr = str.charAt(i);
			code = str.charCodeAt(i);
			if(chr === '\t') {
				chr = ' ';
			}

			lineText += chr;
			chrWidth  = canvas.measureText(chr).width;
			lineWidth = lineWidth + 1 + chrWidth;
		
			if(chr == "'") {
				continue;
			}

			if(lineWidth > maxWidth) {
				break;
			}
			
			if(lineWidth < minWidth) {
				continue;
			}

			if(codeIsLetter(code)) {
				continue;
			}
			
			if(code == 0x20) {
				if(lineWidth >= width) {
					break;
				}

				var nOfLetter = 0;
				for(var k = i+1; k < length; k++) {
					code = str.charCodeAt(k);

					if(codeIsLetter(code)) {
						nOfLetter++;
					}
					else {
						break;
					}
				}

				if(nOfLetter > 7) {
					break;
				}
				else {
					continue;
				}
			}

			if((i + 1) < length) {
				nextChar = str.charAt(i+1);
				if(lineWidth >= width && this.canBreakBefore(nextChar)) {
					break;
				}
			}
		}

		this.lineInfo.text = lineText;
		this.lineInfo.width = canvas.measureText(lineText).width;
		this.startOffset = this.startOffset + lineText.length;

		return this.lineInfo;
	}

	return this;
}

function getXMLHttpRequest() {
	if (typeof window === 'undefined') {
		throw new Error('no window object present');
	}
	else if (window.XMLHttpRequest) {
		return window.XMLHttpRequest;
	}
	else if (window.ActiveXObject) {
		var axs = [
			'Msxml2.XMLHTTP.6.0',
			'Msxml2.XMLHTTP.3.0',
			'Microsoft.XMLHTTP'
		];
		for (var i = 0; i < axs.length; i++) {
			try {
				var ax = new(window.ActiveXObject)(axs[i]);
				return function () {
					if (ax) {
						var ax_ = ax;
						ax = null;
						return ax_;
					}
					else {
						return new(window.ActiveXObject)(axs[i]);
					}
				};
			}
			catch (e) {}
		}
		throw new Error('ajax not supported in this browser')
	}
	else {
		throw new Error('ajax not supported in this browser');
	}
}

function createXMLHttpRequest() {
	if(!window.XMLHttpRequest) {
		window.XMLHttpRequest = getXMLHttpRequest();
	}

	return new XMLHttpRequest();
}


function httpDownloadFile(url, onDone, autoProxy) {
	var info = {};

	info.url = url;
	info.method = "GET";
	info.responseType = 'blob';
	info.autoProxy = autoProxy;

	info.onDone = function(result, xhr, content) {
		saveAs(content, url.basename());
		if(onDone) {
			onDone(result, xhr, content);
		}
	}

	httpDoRequest(info);

	return;
}

function httpDoRequest(info) {
	var	xhr = createXMLHttpRequest();

	if(!info || !info.url) {
		return false;
	}

	var url = info.url;
	var data = info.data;
	var method = info.method ? info.method : "GET";
	var isCrossDomain = url.indexOf("http") === 0 && url.indexOf(window.location.hostname) < 0;

	if(isCrossDomain) {
		if(info.autoProxy) {
			url = '/proxy.php?url=' + window.btoa(encodeURIComponent(url));
			console.log("use proxy:" + url);
		}
		else {
			xhr.crossOrigin = "Anonymous";
			if(info.withCredentials) {
				xhr.withCredentials = true;
				console.log("cross domain info.withCredentials=true");
			}
		}
	}

	if(info.responseType) {
		xhr.responseType = info.responseType;
	}
	
	if(info.dataType) {
		xhr.dataType = info.dataType;
	}

	xhr.open(method, url, true);

	if(info.noCache) {
		xhr.setRequestHeader('If-Modified-Since', '0');
	}

	if(info.headers) {
		for(var key in info.headers) {
			var value = info.headers[key];
			xhr.setRequestHeader(key, value);
		}
	}

	if(xhr) {
		if(!xhr.onprogress) {
			xhr.onreadystatechange = function() {
				if(info.onProgress) {
					info.onProgress(xhr);
				}
				if(xhr.readyState === 4) {
					if(info.onDone) {
						if(info.responseType && info.responseType.toLowerCase() === "blob") {
							info.onDone(true, xhr, xhr.response);
						}
						else {
							info.onDone(true, xhr, xhr.responseText);
						}
					}
				}
				//console.log("onreadystatechange:" + xhr.readyState);
				return;
			}
		}
		else {
			xhr.onprogress = function(e)  {
				var total = e.total;
				if(info.onProgress) {
					info.onProgress(xhr);
				}
				console.log("get:" + total);
			 }
			
			xhr.onload = function(e)  {
				if(info.onDone) {
					info.onDone(true, xhr, e.target.responseText);
				}
			}
			
			xhr.onerror = function(e)  {
				if(info.onDone) {
					info.onDone(false, xhr, xhr.responseText);
				}
			}
		}
		
		xhr.send(info.data ? info.data : null);
	}

	return true;
}

function httpGetURL(url, onDone, autoProxy, withCredentials) {
	var rInfo = {};
	rInfo.url = url;
	rInfo.onDone = onDone;
	rInfo.autoProxy = autoProxy;
	rInfo.withCredentials = withCredentials;

	httpDoRequest(rInfo);

	return;
}

function httpPostURL(url, data, onDone, autoProxy, withCredentials) {
	var rInfo = {};
	rInfo.url = url;
	rInfo.onDone = onDone;
	rInfo.method = "POST";
	rInfo.data = data;
	rInfo.autoProxy = autoProxy;
	rInfo.withCredentials = withCredentials;

	httpDoRequest(rInfo);

	return;
}

function httpGetJSON(url, onDone, autoProxy, withCredentials) {
	httpGetURL(url, function(result, xhr, data) {
		var json = null;
		if(result) {
			try {
				json = JSON.parse(data);
			}catch(e) {
				console.log("JSON.parse failed： url=" + url + " data:" + data);
			}
		}
		onDone(json);
	}, autoProxy, withCredentials);

	return;
}

window.jsonpIndex = 0;
function httpGetJSONP(url, onDone, options) {
	var jsonp = "callback";
	var name =  "jsonpCallBack" + window.jsonpIndex++;

	window[name] = function(data) {
		if(onDone) {
			try {
				onDone(data);
			}catch(e) {
				console.log(e.message);
			}
		}
		console.log("jsonp data:" + url + "\n" + JSON.stringify(data));
		delete window[name];
	}

	if(options && options.jsonp) {
		jsonp = options.jsonp;
	}

	if(url.indexOf("?") > 0) {
		url += "&"+jsonp+"="+name;
	}
	else {
		url += "?"+jsonp+"="+name;
	}

	var node = document.head ? document.head : document.body;
	var script = document.createElement("script");
	script.onload = function() { 
		console.log("jsonp success:" + url);
	}

	script.onerror = script.onabort = script.oncancel = function(e) {
		console.log("jsonp error:" + url);
	}

	script.src = url;
	node.appendChild(script);

	return;
}

function cantkRestoreViewPort() {
	cantkInitViewPort(1);

	return;
}

function cantkInitViewPort() {
	var value = "";
	var meta = document.createElement('meta');
	var head = document.getElementsByTagName('head')[0];
	var scale = 1/(window.devicePixelRatio||1);	
	var scale1Values = 'initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
	var scaleValues = "initial-scale="+scale+", minimum-scale="+scale+", maximum-scale="+scale+", user-scalable=0";

	var metaScale = 'width=device-width, ' + scaleValues;
	var metaDensity = 'target-densitydpi=device-dpi, width=device-width, ' + scale1Values;

	if(isIPhone()) {
		value = metaScale;
	}
	else if(isAndroid()) {
		var ver = browserVersion();
		if(ver < 537.00 || isWeiXin() || isWeiBo() || isQQ()) {
			value = metaDensity;
		}
		else { 
			value = metaScale;
		}
	}
	else if(isFirefoxMobile()) {
		var vp = cantkGetViewPort();
		value = 'width='+vp.width+', ' + scaleValues; 
	}
	else {
		value =  metaScale;;
	}

	meta.name = 'viewport';
	meta.content = value;
	head.appendChild(meta);
	console.log("viewport: " + value);

	return;
}

function cantkLog(str) {
	console.log(str);

	return;
}

////////////////////////////////////////////////


var gDelayScripts = new Array();

function cantkDelayLoadScript(url) {
	gDelayScripts.push(url);

	return;
}

function loadDelayScriptsNow() {
	var i = 0;
	var tag = null;
	var filename = null;
	var node = document.head ? document.head : document.body;

	for(i = 0; i < gDelayScripts.length; i++) {
		filename = gDelayScripts[i];
		tag = document.createElement("script"); 
		tag.src = filename; 
		node.appendChild(tag);
		console.log("Load: " + filename);
	}
	
	gDelayScripts.clear();

	return;
}

function loadScriptOnce(src) {
	var scripts = document.scripts;

	if(scripts) {
		for(var i = 0; i < scripts.length; i++) {
			var iter = scripts[i];
			if(iter.src && iter.src.indexOf(src) >= 0) {
				console.log("script is loaded: " + src);
				return;
			}
		}
	}
	
	var node = document.head ? document.head : document.body;
	var tag = document.createElement("script");
	tag.src = src; 
	node.appendChild(tag);
	
	console.log("load script: " + src);
	
	return;
	
}

setTimeout(function() {
	loadDelayScriptsNow();
	return;
}, 800);

function delayLoadScripts(hostName) {
	if(hostName) {
		dappSetResHostName(hostName);
	}
	
	return;
}

function getScriptByUrl(url) {
	var scripts = document.getElementsByTagName("script");

	if(scripts) {
		for(var i = 0; i < scripts.length; i++) {
			var iter = scripts[i];
			var src = iter.src;

			if(src.indexOf(url) >= 0) {
				return iter;
			}
		}
	}

	return null;
}

function isScriptLoaded(url) {
	return getScriptByUrl(url) != null;
}


/////////////////////////////////////////////////////////
var requestAnimFrame = CantkRT.requestAnimFrame;

function getQueryParameter(key) {
  var key = key + "=";
  var queryString = window.location.search.substring(1);

  if ( queryString.length > 0 ) {
    begin = queryString.indexOf ( key );
    if ( begin != -1 ) {
      begin += key.length;
      end = queryString.indexOf ( "&" , begin );
        if ( end == -1 ) {
        end = queryString.length
      }
      var value = queryString.substring ( begin, end );

      return decodeURI(value);
    }
  }

  return null; 
}

function cantkGetQueryParam(key) {
	return getQueryParameter(key);
}

function getFontSizeInFont(str) {
	var fontSize = 12;
	var px = str.match(/\d+px/g);

	if(px) {
		fontSize = parseInt(px[0]);
	}
	else {
		var pt = str.match(/\d+pt/g);
		if(pt) {
			fontSize = parseInt(pt[0]) * 1.5;
		}
	}

	return fontSize;
}

function basename(path) {
	return path.replace(/\\/g,'/').replace( /.*\//, '' );
}

function dirname(path) {
	var str = path.replace(/\\/g,'/').replace(/\/[^\/]*$/, '');

	return str ? str : "/";
}

String.prototype.basename = function(withoutExt) {
	var filename = this.replace(/\\/g,'/').replace( /.*\//, '' );

	if(withoutExt) {
		var index = filename.lastIndexOf('.');
		if(index >= 0) {
			filename = filename.substr(0, index);
		}
	}

	return filename;
}

String.prototype.toRelativeURL = function() {
	var str = this;
    var host;
    if(window.location.protocol === "file:") {
		host = dirname(window.location.href) + "/";
	}
	else {
		host = window.location.protocol + "//" + window.location.host + "/";
	}

    if(str.startWith(host)) {
        return str.substring(host.length, str.length);    
    }
    return str;
}

String.prototype.extname = function() {	
	var extName = "";
	var index = this.lastIndexOf('.');

	if(index >= 0) {
		extName = this.substr(index+1);	
	}

	return extName;
}

String.prototype.dirname = function() {
	return this.replace(/\\/g,'/').replace(/\/[^\/]*$/, '');
}

String.prototype.isLower = function() {
	return /^[a-z]+$/.test(this); 
}

String.prototype.isUpper = function() {
	return /^[A-Z]+$/.test(this); 
}

String.prototype.isDigit = function() {
	return /^[0-9]+$/.test(this); 
}

String.prototype.isValidName = function() {
	return /^[0-9]+$|^[A-Z]+$|^[a-z]+$|_/.test(this); 
}

function cantkIsFullscreen() {
	return document.fullscreenElement || document.mozFullScreen || document.webkitIsFullScreen;
}

function cantkRequestFullscreen(onDone) {
	function onFullscreenChanged(e) {
		if(onDone) {
			onDone(cantkIsFullscreen());
		}
		console.log("fullscreenchange:" + cantkIsFullscreen());

		return true;
	}

	if(cantkIsFullscreen()) {
		onFullscreenChanged();
		return true;
	}

	var element = document.documentElement;
	if (document.documentElement.requestFullscreen) {
		element.addEventListener('fullscreenchange', onFullscreenChanged, true);
		return element.requestFullscreen();
	} else if (document.documentElement.mozRequestFullScreen) {
		element.addEventListener('mozfullscreenchange', onFullscreenChanged, true);
		return element.mozRequestFullScreen();
	} else if (document.documentElement.webkitRequestFullScreen) {
		element.addEventListener('webkitfullscreenchange', onFullscreenChanged, true);
		return element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	}
	
	return false;
}

function cantkCancelFullscreen() {
	if(document.cancelFullScreen) {
		document.cancelFullScreen();
	}
	else if(document.webkitCancelFullScreen) {
		document.webkitCancelFullScreen();
	}
	else if(document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	}
}

function saveStrToFile(fileName, content) {
	function get_blob_builder() {
		return window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
	}

	try {
		var BB = get_blob_builder();
		var bb = new BB;
		bb.append(content);
		saveAs(bb.getBlob("text/plain;charset=" + document.characterSet), fileName);
	}catch(e) {
		var bb = new Blob([content], {type:"text/plain;charset=" + document.characterSet});
		saveAs(bb, fileName);
	}

	return;
}

function readLocalTextFile(onSuccess, onFail) {
	function onFileChoosed(file) {
		try {
			var reader = new FileReader();
			reader.onload = function (evt) {
				var result = evt.target.result;
				if(onSuccess) {
					onSuccess(result);
				}
				return;
			};
			
			reader.onerror = function(evt) {
				if(onFail) {
					onFail(evt);
				}
				return;
			};
			reader.readAsText(file);
			reader = null;
		}catch(e) {
			if(onFail) {
				onFail(null);
			}
		}
	}

	var input = document.createElement("input");
	input.type = "file";
	input.multiple = false;
	input.onchange = function(e) {
		if(this.files && this.files.length) {
			var file = this.files[0];
			if(file && (!file.type || file.type.indexOf("text") >= 0)) {
				onFileChoosed(file);
			}
			else {
				console.log("Not text file.");
			}
		}
	}
	input.click();

	input = null;

	return;
}

Math.distanceBetween = function(p1, p2) {
	var dx = p2.x - p1.x;
	var dy = p2.y - p1.y;

	var d = Math.sqrt(dx * dx + dy * dy);

	return d;
}

Math.lineAngle = function(from, to) {
	var dx = to.x - from.x;
	var dy = to.y - from.y;
	var d = Math.sqrt(dx * dx + dy * dy);

	if(dx == 0 && dy == 0) {
		return 0;
	}
	
	if(dx == 0) {
		if(dy < 0) {
			return 1.5 * Math.PI;
		}
		else {
			return 0.5 * Math.PI;
		}
	}

	if(dy == 0) {
		if(dx < 0) {
			return Math.PI;
		}
		else {
			return 0;
		}
	}

	if(dx > 0) {
		if(dy > 0) {
			return Math.asin(dy/d);
		}
		else {
			return 2 * Math.PI - Math.asin(Math.abs(dy)/d);
		}
	}
	else {
		if(dy > 0) {
			return Math.PI - Math.asin(Math.abs(dy)/d);
		}
		else {
			return Math.PI + Math.asin(Math.abs(dy)/d);
		}
	}
}

Math.translatePoint = function(point, angle, distance) {
	var x = point.x;
	var y = point.y;

	if(angle < 0.5 * Math.PI) {
		x = x + distance * Math.cos(angle);
		y = y + distance * Math.sin(angle);
	}
	else if(angle < Math.PI) {
		var a = Math.PI - angle;
		x = x - distance * Math.cos(a);
		y = y + distance * Math.sin(a);
	}
	else if(angle < 1.5 * Math.PI) {
		var a = angle - Math.PI;
		x = x - distance * Math.cos(a);
		y = y - distance * Math.sin(a);
	}
	else {
		var a = 2 * Math.PI - angle;
		x = x + distance * Math.cos(a);
		y = y - distance * Math.sin(a);
	}
	return {x:x, y:y};

}

Math.rotatePoint = function(point, angle) {
	var p = {};

	p.x = point.x * Math.cos(angle) + point.y * Math.sin(angle);
	p.y = point.y * Math.cos(angle) - point.x * Math.sin(angle);

	return p;
}

function dataURLToBlob(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = decodeURIComponent(parts[1]);

      return new Blob([raw], {type: contentType});
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
 }

window.makeUniqRandArray = makeUniqRandArray;
window.cantkGetQueryParam  = cantkGetQueryParam;

function isWebAudioSupported() {
	return typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined';
}

window.sendStatistics = function(str) {
	window.magicData = str;
	return;
}

window.setStatisticsData = function(data) {
	window.magicData = data;

	return;
}

function showFileDialog(accept, multiple, capture, onDone) {
	var input = document.createElement("input");
	var form = document.getElementById("defform");
	if(!form) {
		form = document.createElement("form");
		form.id = "defform";
		document.body.appendChild(form);
	}

	form.appendChild(input);

	input.type = "file";
	input.accept = accept;
	input.multiple = multiple;
	input.capture = capture;
	input.onchange = function(e) {
		if(onDone) {
			onDone(this.files)
		}

		form.removeChild(input);
	}

	input.click();
}

/////////////////////////////////////////////////////
//Promise
window.Promise = window.Promise || (function(root) {
	function Promise(func) {
		if(typeof func !== 'function') {
			throw new TypeError('func must a function');
		}

		this.state = Promise.STATE_UNFULFILLED;
		this.outcome = void 0;
		this.queue = [];

		if(func !== INTERNAL) {
			Promise.resolveThenable(this, func);
		}
	}

	Promise.STATE_RESOLVE = 'resolve';
	Promise.STATE_REJECT  = 'reject';
	Promise.STATE_UNFULFILLED = 'unfulfilled';

	function INTERNAL() {}

	Promise.resolveThenable = function(promise, thenable) {
		var called = false;

		function onSucceed(value) {
			if(!called) {
				called = true;
				Promise.doResolve(promise, value);
			}
		}

		function onError(error) {
			if(!called) {
				called = true;
				Promise.doReject(promise, error);
			}
		}

		function wrapTheanble() {
			thenable(onSucceed, onError);
		}

		var ret = Promise.safeCall(wrapTheanble);
		if(ret.state === 'error') {
			onError(ret.value);
		}
	};

	Promise.getThen = function(obj) {
		var then = obj && obj.then;
		return typeof obj === 'object' && typeof then  === 'function' && function() {
			then.apply(obj, arguments);
		};
	};

	Promise.safeCall = function(func, param) {
		var ret= {};

		try {
			ret.value = func(param);
			ret.state = 'success';
		}
		catch(err) {
			ret.value = err;
			ret.state = 'error';
		}

		return ret;
	};

	Promise.doResolve = function(promise, value) {
		var result = Promise.safeCall(Promise.getThen, value);

		if(result.state === 'error') {
			return Promise.doReject(promise, result.value);
		}

		if(result.value) {
			Promise.resolveThenable(promise, result.value);	
		}
		else {
			promise.state = Promise.STATE_RESOLVE;
			promise.outcome = value;
			promise.queue.forEach(function(iter) {
				if(typeof iter.onResolve === 'function') {
					Promise.callNextTick(iter.promise, iter.onResolve, value);
				}
				else {
					Promise.doResolve(iter.promise, value);
				}
			});
		}

		return promise;
	};

	Promise.doReject = function(promise, error) {
		promise.state = Promise.STATE_REJECT;
		promise.outcome = error;

		promise.queue.forEach(function(iter) {
			if(typeof iter.onReject === 'function') {
				Promise.callNextTick(iter.promise, iter.onReject, error);
			}
			else {
				Promise.doReject(iter.promise, error);
			}
		});

		return promise;
	};

	Promise.callNextTick = function(promise, hander, param) {
		setTimeout(function() {
			var ret;
			try {
				ret = hander(param);
			}
			catch(err) {
				return Promise.doReject(promise, err);
			}

			if(ret === promise) {
				Promise.doReject(promise, new TypeError('Cannot resolve promise with itself'));
			}
			else {
				Promise.doResolve(promise, ret);
			}
		}, 0);
	};

	Promise.prototype.then = function(onFulfilled, onReject) {
		if(typeof onFulfilled !== 'function' && this.state === Promise.STATE_RESOLVE
			|| typeof onReject !== 'function' && this.state === Promise.STATE_REJECT) {
			return this;
		}

		var newPromise = new this.constructor(INTERNAL);
		if(this.state !== Promise.STATE_UNFULFILLED) {
			var hander = this.state === Promise.STATE_REJECT ? onReject : onFulfilled;
			Promise.callNextTick(newPromise, hander, this.outcome);
		}
		else {
			this.queue.push({promise: newPromise, onResolve: onFulfilled, onReject: onReject});
		}

		return newPromise;
	};

	Promise.prototype.catch = function(onReject) {
		return this.then(null, onReject);
	};

	Promise.resolve = function(value) {
		if(value instanceof this) {
			return value;
		}
		var promise = new this(INTERNAL);
		return Promise.doResolve(promise, value);
	};

	Promise.reject = function(reason) {
		var promise = new this(INTERNAL);
		return Promise.doReject(promise, reason);
	};

	Promise.optimizeThumb = function(doit) {
		return function(iterable) {
			if(!Array.isArray(iterable)) {
				return Promise.reject(new TypeError('iterable must be array'));
			}
			if(!iterable.length) {
				return Promise.resolve([]);
			}
			var promise = new Promise(INTERNAL);
			doit(promise, iterable);

			return promise;
		};
	};

	Promise.all = Promise.optimizeThumb(function(promise, iterable) {
		var result = [],
			called = false,
			count = iterable.length;

		for(var i = 0; i < count; i++) {
			var iter = iterable[i];
			Promise.resolve(iter)
			.then(function(value) {
				result.push(value);
				if(!called && result.length === count) {
					called = true;
					Promise.doResolve(promise, result);
				}
			}, function(error) {
				if(!called) {
					called = true;
					Promise.doReject(promise, error);
				}
			});
		}
	});

	Promise.race = Promise.optimizeThumb(function(promise, iterable) {
		var called = false;

		for(var i = 0; i < iterable.length; i++) {
			var iter = iterable[i];
			Promise.resolve(iter)
			.then(function(value) {
				if(!called) {
					called = true;
					Promise.doResolve(promise, value);
				}
			}, function(error) {
				if(!called) {
					called = true;
					Promise.doReject(promise, error);
				}
			});
		}
	});
	return Promise;
})(this);

window.Deferred = window.Deferred || (function(root) {
	var Promise = root.Promise;

	function Deferred() {
		if(!(this instanceof Deferred)) {
			return new Deferred();
		}

		var self = this;
		this.promise = new Promise(function(resolve, reject) {
			self.reject = reject;
			self.resolve = resolve;
		});
	}

	Deferred.prototype.makeResolver = function() {
		var self = this;
		return function(err, data) {
			if(err) {
				self.reject(err);
			}
			else if(arguments.length > 2) {
				self.resolve(Array.prototype.slice.call(arguments, 1));
			}
			else {
				self.resolve(data);
			}
		};
	};
	return Deferred;
})(this);

void function(global) {
	var isBoolean = function(obj) {
		return obj === true || obj === false || Object.prototype.toString.call(obj) === '[Object Boolean]';
	}
	global.unique = function(array, isSorted, iteratee, context) {
		if(!isBoolean(isSorted)) {
			context = iteratee;
			iteratee = isSorted;
			isSorted = false;
		}
		var result = [],
			seen = [];
		for(var i = 0; i < array.length; i++) {
			var value = array[i],
				computed = iteratee ? iteratee.call(context, value, i, array) : value;
			if(isSorted) {
				if(!i || seen !== computed) {
					result.push(computed);
				}
				seen = computed;
			}
			else if(iteratee) {
				if(seen.indexOf(computed) === -1) {
					seen.push(computed);
					result.push(value);
				}
			}
			else if(result.indexOf(value) === -1) {
				result.push(value);
			}
		}

		return result;
	};
}(this);

function filterResults(n_win, n_docel, n_body) {
	var n_result = n_win ? n_win : 0;
	if (n_docel && (!n_result || (n_result > n_docel)))
		n_result = n_docel;
	return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
};

function getScrollLeft() {
	return filterResults (
		window.pageXOffset ? window.pageXOffset : 0,
		document.documentElement ? document.documentElement.scrollLeft : 0,
		document.body ? document.body.scrollLeft : 0
	);
};

function getScrollTop() {
	return filterResults (
		window.pageYOffset ? window.pageYOffset : 0,
		document.documentElement ? document.documentElement.scrollTop : 0,
		document.body ? document.body.scrollTop : 0
	);
};


/*
 * File: struct.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: common used structs
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */
function Rect(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	
	return this;
}

Rect.prototype.clone = Rect.prototype.dup = function() {
	return new Rect(this.x, this.y, this.w, this.h);
}

function Point(x, y) {
    this.x = x;
    this.y = y;
    
    return this;
}

Point.prototype.dup = function() {
	return new Point(this.x, this.y);
}

Point.prototype.copy = function(point) {
	this.x = point.x;
	this.y = point.y;

	return;
}

function pointEqual(p1, p2) {
	return p1.x === p2.x && p1.y === p2.y;
}

//intersection and difference is from https://github.com/google/closure-library/blob/master/closure/goog/math/rect.js
Rect.intersection = function(a, b) {
  var x0 = Math.max(a.x, b.x);
  var x1 = Math.min(a.x + a.w, b.x + b.w);

  if (x0 <= x1) {
    var y0 = Math.max(a.y, b.y);
    var y1 = Math.min(a.y + a.h, b.y + b.h);

    if (y0 <= y1) {
      return new Rect(x0, y0, x1 - x0, y1 - y0);
    }
  }
  return null;
};

Rect.hasIntersection = function(a, b) {
  var x0 = Math.max(a.x, b.x);
  var x1 = Math.min(a.x + a.w, b.x + b.w);

  if (x0 <= x1) {
    var y0 = Math.max(a.y, b.y);
    var y1 = Math.min(a.y + a.h, b.y + b.h);

    if (y0 <= y1) {
      return true;
    }
  }
  return false;
};

Rect.difference = function(a, b) {
  var intersection = Rect.intersection(a, b);
  if (!intersection || !intersection.h || !intersection.w) {
    return [a.clone()];
  }

  var result = [];

  var top = a.y;
  var height = a.h;

  var ar = a.x + a.w;
  var ab = a.y + a.h;

  var br = b.x + b.w;
  var bb = b.y + b.h;

  // Subtract off any area on top where A extends past B
  if (b.y > a.y) {
    result.push(new Rect(a.x, a.y, a.w, b.y - a.y));
    top = b.y;
    // If we're moving the top down, we also need to difference the height diff.
    height -= b.y - a.y;
  }
  // Subtract off any area on bottom where A extends past B
  if (bb < ab) {
    result.push(new Rect(a.x, bb, a.w, ab - bb));
    height = bb - top;
  }
  // Subtract any area on left where A extends past B
  if (b.x > a.x) {
    result.push(new Rect(a.x, top, b.x - a.x, height));
  }
  // Subtract any area on right where A extends past B
  if (br < ar) {
    result.push(new Rect(br, top, ar - br, height));
  }

  return result;
};

Rect.subtract2 = function(r1, r2, r3) {
	var all = [];
	var rects = Rect.difference(r1, r2);

	for(var i = 0; i < rects.length; i++) {
		var rs = Rect.difference(rects[i], r3);
		all = all.concat(rs);
	}

	return all;
};
/*!
 *  howler.js v2.0.0-beta8
 *  howlerjs.com
 *
 *  (c) 2013-2016, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

(function() {

  'use strict';

  // Setup our audio context.
  var ctx = null;
  var usingWebAudio = true;
  var noAudio = false;
  var masterGain = null;
  var canPlayEvent = 'canplaythrough';
  setupAudioContext();

  /** Global Methods **/
  /***************************************************************************/

  /**
   * Create the global controller. All contained methods and properties apply
   * to all sounds that are currently playing or will be in the future.
   */
  var HowlerGlobal = function() {
    this.init();
  };
  HowlerGlobal.prototype = {
    /**
     * Initialize the global Howler object.
     * @return {Howler}
     */
    init: function() {
      var self = this || Howler;

      // Internal properties.
      self._codecs = {};
      self._howls = [];
      self._muted = false;
      self._volume = 1;

      // Keeps track of the suspend/resume state of the AudioContext.
      self.state = ctx ? ctx.state || 'running' : 'running';
      self.autoSuspend = true;

      // Automatically begin the 30-second suspend process
      self._autoSuspend();

      // Set to false to disable the auto iOS enabler.
      self.mobileAutoEnable = true;

      // No audio is available on this system if this is set to true.
      self.noAudio = noAudio;

      // This will be true if the Web Audio API is available.
      self.usingWebAudio = usingWebAudio;

      // Expose the AudioContext when using Web Audio.
      self.ctx = ctx;

      // Expose the master GainNode when using Web Audio (useful for plugins or advanced usage).
      self.masterGain = masterGain;

      // Check for supported codecs.
      if (!noAudio) {
        self._setupCodecs();
      }

      return self;
    },

    /**
     * Get/set the global volume for all sounds.
     * @param  {Float} vol Volume from 0.0 to 1.0.
     * @return {Howler/Float}     Returns self or current volume.
     */
    volume: function(vol) {
      var self = this || Howler;
      vol = parseFloat(vol);

      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
        self._volume = vol;

        // When using Web Audio, we just need to adjust the master gain.
        if (usingWebAudio) {
          masterGain.gain.value = vol;
        }

        // Loop through and change volume for all HTML5 audio nodes.
        for (var i=0; i<self._howls.length; i++) {
          if (!self._howls[i]._webAudio) {
            // Get all of the sounds in this Howl group.
            var ids = self._howls[i]._getSoundIds();

            // Loop through all sounds and change the volumes.
            for (var j=0; j<ids.length; j++) {
              var sound = self._howls[i]._soundById(ids[j]);

              if (sound && sound._node) {
                sound._node.volume = sound._volume * vol;
              }
            }
          }
        }

        return self;
      }

      return self._volume;
    },

    /**
     * Handle muting and unmuting globally.
     * @param  {Boolean} muted Is muted or not.
     */
    mute: function(muted) {
      var self = this || Howler;

      self._muted = muted;

      // With Web Audio, we just need to mute the master gain.
      if (usingWebAudio) {
        masterGain.gain.value = muted ? 0 : self._volume;
      }

      // Loop through and mute all HTML5 Audio nodes.
      for (var i=0; i<self._howls.length; i++) {
        if (!self._howls[i]._webAudio) {
          // Get all of the sounds in this Howl group.
          var ids = self._howls[i]._getSoundIds();

          // Loop through all sounds and mark the audio node as muted.
          for (var j=0; j<ids.length; j++) {
            var sound = self._howls[i]._soundById(ids[j]);

            if (sound && sound._node) {
              sound._node.muted = (muted) ? true : sound._muted;
            }
          }
        }
      }

      return self;
    },

    /**
     * Unload and destroy all currently loaded Howl objects.
     * @return {Howler}
     */
    unload: function() {
      var self = this || Howler;

      for (var i=self._howls.length-1; i>=0; i--) {
        self._howls[i].unload();
      }

      // Create a new AudioContext to make sure it is fully reset.
      if (self.usingWebAudio && typeof ctx.close !== 'undefined') {
        self.ctx = null;
        ctx.close();
        setupAudioContext();
        self.ctx = ctx;
      }

      return self;
    },

    /**
     * Check for codec support of specific extension.
     * @param  {String} ext Audio file extention.
     * @return {Boolean}
     */
    codecs: function(ext) {
      return (this || Howler)._codecs[ext];
    },

    /**
     * Check for browser support for various codecs and cache the results.
     * @return {Howler}
     */
    _setupCodecs: function() {
      var self = this || Howler;
      var audioTest = new Audio();
      var mpegTest = audioTest.canPlayType('audio/mpeg;').replace(/^no$/, '');
      var isOpera = /OPR\//.test(navigator.userAgent);

      self._codecs = {
        mp3: !!(!isOpera && (mpegTest || audioTest.canPlayType('audio/mp3;').replace(/^no$/, ''))),
        mpeg: !!mpegTest,
        opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ''),
        ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
        oga: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
        wav: !!audioTest.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ''),
        aac: !!audioTest.canPlayType('audio/aac;').replace(/^no$/, ''),
        caf: !!audioTest.canPlayType('audio/x-caf;').replace(/^no$/, ''),
        m4a: !!(audioTest.canPlayType('audio/x-m4a;') || audioTest.canPlayType('audio/m4a;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
        mp4: !!(audioTest.canPlayType('audio/x-mp4;') || audioTest.canPlayType('audio/mp4;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
        weba: !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ''),
        webm: !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ''),
        dolby: !!audioTest.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, '')
      };

      return self;
    },

    /**
     * Mobile browsers will only allow audio to be played after a user interaction.
     * Attempt to automatically unlock audio on the first user interaction.
     * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
     * @return {Howler}
     */
    _enableMobileAudio: function() {
      var self = this || Howler;

      // Only run this on iOS if audio isn't already eanbled.
      var isMobile = /iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk/i.test(navigator.userAgent);
      var isTouch = !!(('ontouchend' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
      if (ctx && (self._mobileEnabled || !isMobile || !isTouch)) {
        return;
      }

      self._mobileEnabled = false;

      // Call this method on touch start to create and play a buffer,
      // then check if the audio actually played to determine if
      // audio has now been unlocked on iOS, Android, etc.
      var unlock = function() {
        // Create an empty buffer.
        var buffer = ctx.createBuffer(1, 1, 22050);
        var source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);

        // Play the empty buffer.
        if (typeof source.start === 'undefined') {
          source.noteOn(0);
        } else {
          source.start(0);
        }

        // Setup a timeout to check that we are unlocked on the next event loop.
        source.onended = function() {
          source.disconnect(0);

          // Update the unlocked state and prevent this check from happening again.
          self._mobileEnabled = true;
          self.mobileAutoEnable = false;

          // Remove the touch start listener.
          document.removeEventListener('touchend', unlock, true);
        };
      };

      // Setup a touch start listener to attempt an unlock in.
      document.addEventListener('touchend', unlock, true);

      return self;
    },

    /**
     * Automatically suspend the Web Audio AudioContext after no sound has played for 30 seconds.
     * This saves processing/energy and fixes various browser-specific bugs with audio getting stuck.
     * @return {Howler}
     */
    _autoSuspend: function() {
      var self = this;

      if (!self.autoSuspend || !ctx || typeof ctx.suspend === 'undefined' || !usingWebAudio) {
        return;
      }

      // Check if any sounds are playing.
      for (var i=0; i<self._howls.length; i++) {
        if (self._howls[i]._webAudio) {
          for (var j=0; j<self._howls[i]._sounds.length; j++) {
            if (!self._howls[i]._sounds[j]._paused) {
              return self;
            }
          }
        }
      }

      // If no sound has played after 30 seconds, suspend the context.
      self._suspendTimer = setTimeout(function() {
        if (!self.autoSuspend) {
          return;
        }

        self._suspendTimer = null;
        self.state = 'suspending';
        ctx.suspend().then(function() {
          self.state = 'suspended';

          if (self._resumeAfterSuspend) {
            delete self._resumeAfterSuspend;
            self._autoResume();
          }
        });
      }, 30000);

      return self;
    },

    /**
     * Automatically resume the Web Audio AudioContext when a new sound is played.
     * @return {Howler}
     */
    _autoResume: function() {
      var self = this;

      if (!ctx || typeof ctx.resume === 'undefined' || !usingWebAudio) {
        return;
      }

      if (self.state === 'running' && self._suspendTimer) {
        clearTimeout(self._suspendTimer);
        self._suspendTimer = null;
      } else if (self.state === 'suspended') {
        self.state = 'resuming';
        ctx.resume().then(function() {
          self.state = 'running';
        });

        if (self._suspendTimer) {
          clearTimeout(self._suspendTimer);
          self._suspendTimer = null;
        }
      } else if (self.state === 'suspending') {
        self._resumeAfterSuspend = true;
      }

      return self;
    }
  };

  // Setup the global audio controller.
  var Howler = new HowlerGlobal();

  /** Group Methods **/
  /***************************************************************************/

  /**
   * Create an audio group controller.
   * @param {Object} o Passed in properties for this group.
   */
  var Howl = function(o) {
    var self = this;

    // Throw an error if no source is provided.
    if (!o.src || o.src.length === 0) {
      console.error('An array of source files must be passed with any new Howl.');
      return;
    }

    self.init(o);
  };
  Howl.prototype = {
    /**
     * Initialize a new Howl group object.
     * @param  {Object} o Passed in properties for this group.
     * @return {Howl}
     */
    init: function(o) {
      var self = this;

      // Setup user-defined default properties.
      self._autoplay = o.autoplay || false;
      self._format = (typeof o.format !== 'string') ? o.format : [o.format];
      self._html5 = o.html5 || false;
      self._muted = o.mute || false;
      self._loop = o.loop || false;
      self._pool = o.pool || 5;
      self._preload = (typeof o.preload === 'boolean') ? o.preload : true;
      self._rate = o.rate || 1;
      self._sprite = o.sprite || {};
      self._src = (typeof o.src !== 'string') ? o.src : [o.src];
      self._volume = o.volume !== undefined ? o.volume : 1;

      // Setup all other default properties.
      self._duration = 0;
      self._state = 'unloaded';
      self._sounds = [];
      self._endTimers = {};
      self._queue = [];

      // Setup event listeners.
      self._onend = o.onend ? [{fn: o.onend}] : [];
      self._onfade = o.onfade ? [{fn: o.onfade}] : [];
      self._onload = o.onload ? [{fn: o.onload}] : [];
      self._onloaderror = o.onloaderror ? [{fn: o.onloaderror}] : [];
      self._onpause = o.onpause ? [{fn: o.onpause}] : [];
      self._onplay = o.onplay ? [{fn: o.onplay}] : [];
      self._onstop = o.onstop ? [{fn: o.onstop}] : [];
      self._onmute = o.onmute ? [{fn: o.onmute}] : [];
      self._onvolume = o.onvolume ? [{fn: o.onvolume}] : [];
      self._onrate = o.onrate ? [{fn: o.onrate}] : [];
      self._onseek = o.onseek ? [{fn: o.onseek}] : [];

      // Web Audio or HTML5 Audio?
      self._webAudio = usingWebAudio && !self._html5;

      // Automatically try to enable audio on iOS.
      if (typeof ctx !== 'undefined' && ctx && Howler.mobileAutoEnable) {
        Howler._enableMobileAudio();
      }

      // Keep track of this Howl group in the global controller.
      Howler._howls.push(self);

      // Load the source file unless otherwise specified.
      if (self._preload) {
        self.load();
      }

      return self;
    },

    /**
     * Load the audio file.
     * @return {Howler}
     */
    load: function() {
      var self = this;
      var url = null;

      // If no audio is available, quit immediately.
      if (noAudio) {
        self._emit('loaderror', null, 'No audio support.');
        return;
      }

      // Make sure our source is in an array.
      if (typeof self._src === 'string') {
        self._src = [self._src];
      }

      // Loop through the sources and pick the first one that is compatible.
      for (var i=0; i<self._src.length; i++) {
        var ext, str;

        if (self._format && self._format[i]) {
          // If an extension was specified, use that instead.
          ext = self._format[i];
        } else {
          // Extract the file extension from the URL or base64 data URI.
          str = self._src[i];
          ext = /^data:audio\/([^;,]+);/i.exec(str);
          if (!ext) {
            ext = /\.([^.]+)$/.exec(str.split('?', 1)[0]);
          }

          if (ext) {
            ext = ext[1].toLowerCase();
          }

          if(ext === "php") {
          	ext = str.extname();
          }
        }

        // Check if this extension is available.
        if (Howler.codecs(ext)) {
          url = self._src[i];
          break;
        }
      }

      if (!url) {
        self._emit('loaderror', null, 'No codec support for selected audio sources.');
        return;
      }

      self._src = url;
      self._state = 'loading';

      // If the hosting page is HTTPS and the source isn't,
      // drop down to HTML5 Audio to avoid Mixed Content errors.
      if (window.location.protocol === 'https:' && url.slice(0, 5) === 'http:') {
        self._html5 = true;
        self._webAudio = false;
      }

      // Create a new sound object and add it to the pool.
      new Sound(self);

      // Load and decode the audio data for playback.
      if (self._webAudio) {
        loadBuffer(self);
      }

      return self;
    },

    /**
     * Play a sound or resume previous playback.
     * @param  {String/Number} sprite Sprite name for sprite playback or sound id to continue previous.
     * @return {Number}        Sound ID.
     */
    play: function(sprite) {
      var self = this;
      var args = arguments;
      var id = null;

      // Determine if a sprite, sound id or nothing was passed
      if (typeof sprite === 'number') {
        id = sprite;
        sprite = null;
      } else if (typeof sprite === 'undefined') {
        // Use the default sound sprite (plays the full audio length).
        sprite = '__default';

        // Check if there is a single paused sound that isn't ended.
        // If there is, play that sound. If not, continue as usual.
        var num = 0;
        for (var i=0; i<self._sounds.length; i++) {
          if (self._sounds[i]._paused && !self._sounds[i]._ended) {
            num++;
            id = self._sounds[i]._id;
          }
        }

        if (num === 1) {
          sprite = null;
        } else {
          id = null;
        }
      }

      // Get the selected node, or get one from the pool.
      var sound = id ? self._soundById(id) : self._inactiveSound();

      // If the sound doesn't exist, do nothing.
      if (!sound) {
        return null;
      }

      // Select the sprite definition.
      if (id && !sprite) {
        sprite = sound._sprite || '__default';
      }

      // If we have no sprite and the sound hasn't loaded, we must wait
      // for the sound to load to get our audio's duration.
      if (self._state !== 'loaded' && !self._sprite[sprite]) {
        self._queue.push({
          event: 'play',
          action: function() {
            self.play(self._soundById(sound._id) ? sound._id : undefined);
          }
        });

        return sound._id;
      }

      // Don't play the sound if an id was passed and it is already playing.
      if (id && !sound._paused) {
        // Trigger the play event, in order to keep iterating through queue.
        if (!args[1]) {
          setTimeout(function() {
            self._emit('play', sound._id);
          }, 0);
        }

        return sound._id;
      }

      // Make sure the AudioContext isn't suspended, and resume it if it is.
      if (self._webAudio) {
        Howler._autoResume();
      }

      // Determine how long to play for and where to start playing.
      var seek = sound._seek > 0 ? sound._seek : self._sprite[sprite][0] / 1000;
      var duration = ((self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000) - seek;

      // Create a timer to fire at the end of playback or the start of a new loop.
      var timeout = (duration * 1000) / Math.abs(sound._rate);
      if (timeout !== Infinity) {
        self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
      }

      // Update the parameters of the sound
      sound._paused = false;
      sound._ended = false;
      sound._sprite = sprite;
      sound._seek = seek;
      sound._start = self._sprite[sprite][0] / 1000;
      sound._stop = (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000;
      sound._loop = !!(sound._loop || self._sprite[sprite][2]);

      // Begin the actual playback.
      var node = sound._node;
      if (self._webAudio) {
        // Fire this when the sound is ready to play to begin Web Audio playback.
        var playWebAudio = function() {
          self._refreshBuffer(sound);

          // Setup the playback params.
          var vol = (sound._muted || self._muted) ? 0 : sound._volume * Howler.volume();
          node.gain.setValueAtTime(vol, ctx.currentTime);
          sound._playStart = ctx.currentTime;

          // Play the sound using the supported method.
          if (typeof node.bufferSource.start === 'undefined') {
            sound._loop ? node.bufferSource.noteGrainOn(0, seek, 86400) : node.bufferSource.noteGrainOn(0, seek, duration);
          } else {
            sound._loop ? node.bufferSource.start(0, seek, 86400) : node.bufferSource.start(0, seek, duration);
          }

          // Start a new timer if none is present.
          if (!self._endTimers[sound._id] && timeout !== Infinity) {
            self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
          }

          if (!args[1]) {
            setTimeout(function() {
              self._emit('play', sound._id);
            }, 0);
          }
        };

        if (self._state === 'loaded') {
          playWebAudio();
        } else {
          // Wait for the audio to load and then begin playback.
          self.once('load', playWebAudio, sound._id);

          // Cancel the end timer.
          self._clearTimer(sound._id);
        }
      } else {
        // Fire this when the sound is ready to play to begin HTML5 Audio playback.
        var playHtml5 = function() {
          node.currentTime = seek;
          node.muted = sound._muted || self._muted || Howler._muted || node.muted;
          node.volume = sound._volume * Howler.volume();
          node.playbackRate = sound._rate;
          setTimeout(function() {
            node.play();
            if (!args[1]) {
              self._emit('play', sound._id);
            }
          }, 0);
        };

        // Play immediately if ready, or wait for the 'canplaythrough'e vent.
        if (self._state === 'loaded') {
          playHtml5();
        } else {
          var listener = function() {
            // Setup the new end timer.
            if (timeout !== Infinity) {
              self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
            }

            // Begin playback.
            playHtml5();

            // Clear this listener.
            node.removeEventListener(canPlayEvent, listener, false);
          };
          node.addEventListener(canPlayEvent, listener, false);

          // Cancel the end timer.
          self._clearTimer(sound._id);
        }
      }

      return sound._id;
    },

    /**
     * Pause playback and save current position.
     * @param  {Number} id The sound ID (empty to pause all in group).
     * @return {Howl}
     */
    pause: function(id) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to pause when capable.
      if (self._state !== 'loaded') {
        self._queue.push({
          event: 'pause',
          action: function() {
            self.pause(id);
          }
        });

        return self;
      }

      // If no id is passed, get all ID's to be paused.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Clear the end timer.
        self._clearTimer(ids[i]);

        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound && !sound._paused) {
          // Reset the seek position.
          sound._seek = self.seek(ids[i]);
          sound._paused = true;

          // Stop currently running fades.
          self._stopFade(ids[i]);

          if (sound._node) {
            if (self._webAudio) {
              // make sure the sound has been created
              if (!sound._node.bufferSource) {
                return self;
              }

              if (typeof sound._node.bufferSource.stop === 'undefined') {
                sound._node.bufferSource.noteOff(0);
              } else {
                sound._node.bufferSource.stop(0);
              }

              // Clean up the buffer source.
              sound._node.bufferSource = null;
            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
              sound._node.pause();
            }
          }

          // Fire the pause event, unless `true` is passed as the 2nd argument.
          if (!arguments[1]) {
            self._emit('pause', sound._id);
          }
        }
      }

      return self;
    },

    /**
     * Stop playback and reset to start.
     * @param  {Number} id The sound ID (empty to stop all in group).
     * @return {Howl}
     */
    stop: function(id) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to stop when capable.
      if (self._state !== 'loaded') {
        self._queue.push({
          event: 'stop',
          action: function() {
            self.stop(id);
          }
        });

        return self;
      }

      // If no id is passed, get all ID's to be stopped.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Clear the end timer.
        self._clearTimer(ids[i]);

        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound && !sound._paused) {
          // Reset the seek position.
          sound._seek = sound._start || 0;
          sound._paused = true;
          sound._ended = true;

          // Stop currently running fades.
          self._stopFade(ids[i]);

          if (sound._node) {
            if (self._webAudio) {
              // make sure the sound has been created
              if (!sound._node.bufferSource) {
                return self;
              }

              if (typeof sound._node.bufferSource.stop === 'undefined') {
                sound._node.bufferSource.noteOff(0);
              } else {
                sound._node.bufferSource.stop(0);
              }

              // Clean up the buffer source.
              sound._node.bufferSource = null;
            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
              sound._node.pause();
              sound._node.currentTime = sound._start || 0;
            }
          }
        }

        if (sound) {
          self._emit('stop', sound._id);
        }
      }

      return self;
    },

    /**
     * Mute/unmute a single sound or all sounds in this Howl group.
     * @param  {Boolean} muted Set to true to mute and false to unmute.
     * @param  {Number} id    The sound ID to update (omit to mute/unmute all).
     * @return {Howl}
     */
    mute: function(muted, id) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to mute when capable.
      if (self._state !== 'loaded') {
        self._queue.push({
          event: 'mute',
          action: function() {
            self.mute(muted, id);
          }
        });

        return self;
      }

      // If applying mute/unmute to all sounds, update the group's value.
      if (typeof id === 'undefined') {
        if (typeof muted === 'boolean') {
          self._muted = muted;
        } else {
          return self._muted;
        }
      }

      // If no id is passed, get all ID's to be muted.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound) {
          sound._muted = muted;

          if (self._webAudio && sound._node) {
            sound._node.gain.setValueAtTime(muted ? 0 : sound._volume * Howler.volume(), ctx.currentTime);
          } else if (sound._node) {
            sound._node.muted = Howler._muted ? true : muted;
          }

          self._emit('mute', sound._id);
        }
      }

      return self;
    },

    /**
     * Get/set the volume of this sound or of the Howl group. This method can optionally take 0, 1 or 2 arguments.
     *   volume() -> Returns the group's volume value.
     *   volume(id) -> Returns the sound id's current volume.
     *   volume(vol) -> Sets the volume of all sounds in this Howl group.
     *   volume(vol, id) -> Sets the volume of passed sound id.
     * @return {Howl/Number} Returns self or current volume.
     */
    volume: function() {
      var self = this;
      var args = arguments;
      var vol, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // Return the value of the groups' volume.
        return self._volume;
      } else if (args.length === 1) {
        // First check if this is an ID, and if not, assume it is a new volume.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else {
          vol = parseFloat(args[0]);
        }
      } else if (args.length >= 2) {
        vol = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // Update the volume or return the current volume.
      var sound;
      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
        // If the sound hasn't loaded, add it to the load queue to change volume when capable.
        if (self._state !== 'loaded') {
          self._queue.push({
            event: 'volume',
            action: function() {
              self.volume.apply(self, args);
            }
          });

          return self;
        }

        // Set the group volume.
        if (typeof id === 'undefined') {
          self._volume = vol;
        }

        // Update one or all volumes.
        id = self._getSoundIds(id);
        for (var i=0; i<id.length; i++) {
          // Get the sound.
          sound = self._soundById(id[i]);

          if (sound) {
            sound._volume = vol;

            // Stop currently running fades.
            if (!args[2]) {
              self._stopFade(id[i]);
            }

            if (self._webAudio && sound._node && !sound._muted) {
              sound._node.gain.setValueAtTime(vol * Howler.volume(), ctx.currentTime);
            } else if (sound._node && !sound._muted) {
              sound._node.volume = vol * Howler.volume();
            }

            self._emit('volume', sound._id);
          }
        }
      } else {
        sound = id ? self._soundById(id) : self._sounds[0];
        return sound ? sound._volume : 0;
      }

      return self;
    },

    /**
     * Fade a currently playing sound between two volumes (if no id is passsed, all sounds will fade).
     * @param  {Number} from The value to fade from (0.0 to 1.0).
     * @param  {Number} to   The volume to fade to (0.0 to 1.0).
     * @param  {Number} len  Time in milliseconds to fade.
     * @param  {Number} id   The sound id (omit to fade all sounds).
     * @return {Howl}
     */
    fade: function(from, to, len, id) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to fade when capable.
      if (self._state !== 'loaded') {
        self._queue.push({
          event: 'fade',
          action: function() {
            self.fade(from, to, len, id);
          }
        });

        return self;
      }

      // Set the volume to the start position.
      self.volume(from, id);

      // Fade the volume of one or all sounds.
      var ids = self._getSoundIds(id);
      for (var i=0; i<ids.length; i++) {
        // Get the sound.
        var sound = self._soundById(ids[i]);

        // Create a linear fade or fall back to timeouts with HTML5 Audio.
        if (sound) {
          // Stop the previous fade if no sprite is being used (otherwise, volume handles this).
          if (!id) {
            self._stopFade(ids[i]);
          }

          if (self._webAudio && !sound._muted) {
            var currentTime = ctx.currentTime;
            var end = currentTime + (len / 1000);
            sound._volume = from;
            sound._node.gain.setValueAtTime(from, currentTime);
            sound._node.gain.linearRampToValueAtTime(to, end);

            // Fire the event when complete.
            sound._timeout = setTimeout(function(id, sound) {
              delete sound._timeout;
              setTimeout(function() {
                sound._volume = to;
                self._emit('fade', id);
              }, end - ctx.currentTime > 0 ? Math.ceil((end - ctx.currentTime) * 1000) : 0);
            }.bind(self, ids[i], sound), len);
          } else {
            var diff = Math.abs(from - to);
            var dir = from > to ? 'out' : 'in';
            var steps = diff / 0.01;
            var stepLen = len / steps;

            (function() {
              var vol = from;
              sound._interval = setInterval(function(id, sound) {
                // Update the volume amount.
                vol += (dir === 'in' ? 0.01 : -0.01);

                // Make sure the volume is in the right bounds.
                vol = Math.max(0, vol);
                vol = Math.min(1, vol);

                // Round to within 2 decimal points.
                vol = Math.round(vol * 100) / 100;

                // Change the volume.
                self.volume(vol, id, true);

                // When the fade is complete, stop it and fire event.
                if (vol === to) {
                  clearInterval(sound._interval);
                  delete sound._interval;
                  self._emit('fade', id);
                }
              }.bind(self, ids[i], sound), stepLen);
            })();
          }
        }
      }

      return self;
    },

    /**
     * Internal method that stops the currently playing fade when
     * a new fade starts, volume is changed or the sound is stopped.
     * @param  {Number} id The sound id.
     * @return {Howl}
     */
    _stopFade: function(id) {
      var self = this;
      var sound = self._soundById(id);

      if (sound._interval) {
        clearInterval(sound._interval);
        delete sound._interval;
        self._emit('fade', id);
      } else if (sound._timeout) {
        clearTimeout(sound._timeout);
        delete sound._timeout;
        sound._node.gain.cancelScheduledValues(ctx.currentTime);
        self._emit('fade', id);
      }

      return self;
    },

    /**
     * Get/set the loop parameter on a sound. This method can optionally take 0, 1 or 2 arguments.
     *   loop() -> Returns the group's loop value.
     *   loop(id) -> Returns the sound id's loop value.
     *   loop(loop) -> Sets the loop value for all sounds in this Howl group.
     *   loop(loop, id) -> Sets the loop value of passed sound id.
     * @return {Howl/Boolean} Returns self or current loop value.
     */
    loop: function() {
      var self = this;
      var args = arguments;
      var loop, id, sound;

      // Determine the values for loop and id.
      if (args.length === 0) {
        // Return the grou's loop value.
        return self._loop;
      } else if (args.length === 1) {
        if (typeof args[0] === 'boolean') {
          loop = args[0];
          self._loop = loop;
        } else {
          // Return this sound's loop value.
          sound = self._soundById(parseInt(args[0], 10));
          return sound ? sound._loop : false;
        }
      } else if (args.length === 2) {
        loop = args[0];
        id = parseInt(args[1], 10);
      }

      // If no id is passed, get all ID's to be looped.
      var ids = self._getSoundIds(id);
      for (var i=0; i<ids.length; i++) {
        sound = self._soundById(ids[i]);

        if (sound) {
          sound._loop = loop;
          if (self._webAudio && sound._node && sound._node.bufferSource) {
            sound._node.bufferSource.loop = loop;
          }
        }
      }

      return self;
    },

    /**
     * Get/set the playback rate of a sound. This method can optionally take 0, 1 or 2 arguments.
     *   rate() -> Returns the first sound node's current playback rate.
     *   rate(id) -> Returns the sound id's current playback rate.
     *   rate(rate) -> Sets the playback rate of all sounds in this Howl group.
     *   rate(rate, id) -> Sets the playback rate of passed sound id.
     * @return {Howl/Number} Returns self or the current playback rate.
     */
    rate: function() {
      var self = this;
      var args = arguments;
      var rate, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // We will simply return the current rate of the first node.
        id = self._sounds[0]._id;
      } else if (args.length === 1) {
        // First check if this is an ID, and if not, assume it is a new rate value.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else {
          rate = parseFloat(args[0]);
        }
      } else if (args.length === 2) {
        rate = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // Update the playback rate or return the current value.
      var sound;
      if (typeof rate === 'number') {
        // If the sound hasn't loaded, add it to the load queue to change playback rate when capable.
        if (self._state !== 'loaded') {
          self._queue.push({
            event: 'rate',
            action: function() {
              self.rate.apply(self, args);
            }
          });

          return self;
        }

        // Set the group rate.
        if (typeof id === 'undefined') {
          self._rate = rate;
        }

        // Update one or all volumes.
        id = self._getSoundIds(id);
        for (var i=0; i<id.length; i++) {
          // Get the sound.
          sound = self._soundById(id[i]);

          if (sound) {
            sound._rate = rate;

            // Change the playback rate.
            if (self._webAudio && sound._node && sound._node.bufferSource) {
              sound._node.bufferSource.playbackRate.value = rate;
            } else if (sound._node) {
              sound._node.playbackRate = rate;
            }

            // Reset the timers.
            var seek = self.seek(id[i]);
            var duration = ((self._sprite[sound._sprite][0] + self._sprite[sound._sprite][1]) / 1000) - seek;
            var timeout = (duration * 1000) / Math.abs(sound._rate);

            self._clearTimer(id[i]);
            self._endTimers[id[i]] = setTimeout(self._ended.bind(self, sound), timeout);

            self._emit('rate', sound._id);
          }
        }
      } else {
        sound = self._soundById(id);
        return sound ? sound._rate : self._rate;
      }

      return self;
    },

    /**
     * Get/set the seek position of a sound. This method can optionally take 0, 1 or 2 arguments.
     *   seek() -> Returns the first sound node's current seek position.
     *   seek(id) -> Returns the sound id's current seek position.
     *   seek(seek) -> Sets the seek position of the first sound node.
     *   seek(seek, id) -> Sets the seek position of passed sound id.
     * @return {Howl/Number} Returns self or the current seek position.
     */
    seek: function() {
      var self = this;
      var args = arguments;
      var seek, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // We will simply return the current position of the first node.
        id = self._sounds[0]._id;
      } else if (args.length === 1) {
        // First check if this is an ID, and if not, assume it is a new seek position.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else {
          id = self._sounds[0]._id;
          seek = parseFloat(args[0]);
        }
      } else if (args.length === 2) {
        seek = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // If there is no ID, bail out.
      if (typeof id === 'undefined') {
        return self;
      }

      // If the sound hasn't loaded, add it to the load queue to seek when capable.
      if (self._state !== 'loaded') {
        self._queue.push({
          event: 'seek',
          action: function() {
            self.seek.apply(self, args);
          }
        });

        return self;
      }

      // Get the sound.
      var sound = self._soundById(id);

      if (sound) {
        if (seek >= 0) {
          // Pause the sound and update position for restarting playback.
          var playing = self.playing(id);
          if (playing) {
            self.pause(id, true);
          }

          // Move the position of the track and cancel timer.
          sound._seek = seek;
          self._clearTimer(id);

          // Restart the playback if the sound was playing.
          if (playing) {
            self.play(id, true);
          }

          self._emit('seek', id);
        } else {
          if (self._webAudio) {
            return (sound._seek + (self.playing(id) ? ctx.currentTime - sound._playStart : 0));
          } else {
            return sound._node.currentTime;
          }
        }
      }

      return self;
    },

    /**
     * Check if a specific sound is currently playing or not.
     * @param  {Number} id The sound id to check. If none is passed, first sound is used.
     * @return {Boolean}    True if playing and false if not.
     */
    playing: function(id) {
      var self = this;
      var sound = self._soundById(id) || self._sounds[0];

      return sound ? !sound._paused : false;
    },

    /**
     * Get the duration of this sound.
     * @param  {Number} id The sound id to check. If none is passed, first sound is used.
     * @return {Number} Audio duration.
     */
    duration: function(id) {
      var self = this;
      var sound = self._soundById(id) || self._sounds[0];

      return self._duration / sound._rate;
    },

    /**
     * Returns the current loaded state of this Howl.
     * @return {String} 'unloaded', 'loading', 'loaded'
     */
    state: function() {
      return this._state;
    },

    /**
     * Unload and destroy the current Howl object.
     * This will immediately stop all sound instances attached to this group.
     */
    unload: function() {
      var self = this;

      // Stop playing any active sounds.
      var sounds = self._sounds;
      for (var i=0; i<sounds.length; i++) {
        // Stop the sound if it is currently playing.
        if (!sounds[i]._paused) {
          self.stop(sounds[i]._id);
          self._emit('end', sounds[i]._id);
        }

        // Remove the source or disconnect.
        if (!self._webAudio) {
          // Set the source to an empty string to stop any downloading.
          sounds[i]._node.src = '';

          // Remove any event listeners.
          sounds[i]._node.removeEventListener('error', sounds[i]._errorFn, false);
          sounds[i]._node.removeEventListener(canPlayEvent, sounds[i]._loadFn, false);
        }

        // Empty out all of the nodes.
        delete sounds[i]._node;

        // Make sure all timers are cleared out.
        self._clearTimer(sounds[i]._id);

        // Remove the references in the global Howler object.
        var index = Howler._howls.indexOf(self);
        if (index >= 0) {
          Howler._howls.splice(index, 1);
        }
      }

      // Delete this sound from the cache.
      if (cache) {
        delete cache[self._src];
      }

      // Clear out `self`.
      self._state = 'unloaded';
      self._sounds = [];
      self = null;

      return null;
    },

    /**
     * Listen to a custom event.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to call.
     * @param  {Number}   id    (optional) Only listen to events for this sound.
     * @param  {Number}   once  (INTERNAL) Marks event to fire only once.
     * @return {Howl}
     */
    on: function(event, fn, id, once) {
      var self = this;
      var events = self['_on' + event];

      if (typeof fn === 'function') {
        events.push(once ? {id: id, fn: fn, once: once} : {id: id, fn: fn});
      }

      return self;
    },

    /**
     * Remove a custom event. Call without parameters to remove all events.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to remove. Leave empty to remove all.
     * @param  {Number}   id    (optional) Only remove events for this sound.
     * @return {Howl}
     */
    off: function(event, fn, id) {
      var self = this;
      var events = self['_on' + event];

      if (fn) {
        // Loop through event store and remove the passed function.
        for (var i=0; i<events.length; i++) {
          if (fn === events[i].fn && id === events[i].id) {
            events.splice(i, 1);
            break;
          }
        }
      } else if (event) {
        // Clear out all events of this type.
        self['_on' + event] = [];
      } else {
        // Clear out all events of every type.
        var keys = Object.keys(self);
        for (var i=0; i<keys.length; i++) {
          if ((keys[i].indexOf('_on') === 0) && Array.isArray(self[keys[i]])) {
            self[keys[i]] = [];
          }
        }
      }

      return self;
    },

    /**
     * Listen to a custom event and remove it once fired.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to call.
     * @param  {Number}   id    (optional) Only listen to events for this sound.
     * @return {Howl}
     */
    once: function(event, fn, id) {
      var self = this;

      // Setup the event listener.
      self.on(event, fn, id, 1);

      return self;
    },

    /**
     * Emit all events of a specific type and pass the sound id.
     * @param  {String} event Event name.
     * @param  {Number} id    Sound ID.
     * @param  {Number} msg   Message to go with event.
     * @return {Howl}
     */
    _emit: function(event, id, msg) {
      var self = this;
      var events = self['_on' + event];

      // Loop through event store and fire all functions.
      for (var i=events.length-1; i>=0; i--) {
        if (!events[i].id || events[i].id === id || event === 'load') {
          setTimeout(function(fn) {
            fn.call(this, id, msg);
          }.bind(self, events[i].fn), 0);

          // If this event was setup with `once`, remove it.
          if (events[i].once) {
            self.off(event, events[i].fn, events[i].id);
          }
        }
      }

      return self;
    },

    /**
     * Queue of actions initiated before the sound has loaded.
     * These will be called in sequence, with the next only firing
     * after the previous has finished executing (even if async like play).
     * @return {Howl}
     */
    _loadQueue: function() {
      var self = this;

      if (self._queue.length > 0) {
        var task = self._queue[0];

        // don't move onto the next task until this one is done
        self.once(task.event, function() {
          self._queue.shift();
          self._loadQueue();
        });

        task.action();
      }

      return self;
    },

    /**
     * Fired when playback ends at the end of the duration.
     * @param  {Sound} sound The sound object to work with.
     * @return {Howl}
     */
    _ended: function(sound) {
      var self = this;
      var sprite = sound._sprite;

      // Should this sound loop?
      var loop = !!(sound._loop || self._sprite[sprite][2]);

      // Fire the ended event.
      self._emit('end', sound._id);

      // Restart the playback for HTML5 Audio loop.
      if (!self._webAudio && loop) {
        self.stop(sound._id).play(sound._id);
      }

      // Restart this timer if on a Web Audio loop.
      if (self._webAudio && loop) {
        self._emit('play', sound._id);
        sound._seek = sound._start || 0;
        sound._playStart = ctx.currentTime;

        var timeout = ((sound._stop - sound._start) * 1000) / Math.abs(sound._rate);
        self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
      }

      // Mark the node as paused.
      if (self._webAudio && !loop) {
        sound._paused = true;
        sound._ended = true;
        sound._seek = sound._start || 0;
        self._clearTimer(sound._id);

        // Clean up the buffer source.
        sound._node.bufferSource = null;

        // Attempt to auto-suspend AudioContext if no sounds are still playing.
        Howler._autoSuspend();
      }

      // When using a sprite, end the track.
      if (!self._webAudio && !loop) {
        self.stop(sound._id);
      }

      return self;
    },

    /**
     * Clear the end timer for a sound playback.
     * @param  {Number} id The sound ID.
     * @return {Howl}
     */
    _clearTimer: function(id) {
      var self = this;

      if (self._endTimers[id]) {
        clearTimeout(self._endTimers[id]);
        delete self._endTimers[id];
      }

      return self;
    },

    /**
     * Return the sound identified by this ID, or return null.
     * @param  {Number} id Sound ID
     * @return {Object}    Sound object or null.
     */
    _soundById: function(id) {
      var self = this;

      // Loop through all sounds and find the one with this ID.
      for (var i=0; i<self._sounds.length; i++) {
        if (id === self._sounds[i]._id) {
          return self._sounds[i];
        }
      }

      return null;
    },

    /**
     * Return an inactive sound from the pool or create a new one.
     * @return {Sound} Sound playback object.
     */
    _inactiveSound: function() {
      var self = this;

      self._drain();

      // Find the first inactive node to recycle.
      for (var i=0; i<self._sounds.length; i++) {
        if (self._sounds[i]._ended) {
          return self._sounds[i].reset();
        }
      }

      // If no inactive node was found, create a new one.
      return new Sound(self);
    },

    /**
     * Drain excess inactive sounds from the pool.
     */
    _drain: function() {
      var self = this;
      var limit = self._pool;
      var cnt = 0;
      var i = 0;

      // If there are less sounds than the max pool size, we are done.
      if (self._sounds.length < limit) {
        return;
      }

      // Count the number of inactive sounds.
      for (i=0; i<self._sounds.length; i++) {
        if (self._sounds[i]._ended) {
          cnt++;
        }
      }

      // Remove excess inactive sounds, going in reverse order.
      for (i=self._sounds.length - 1; i>=0; i--) {
        if (cnt <= limit) {
          return;
        }

        if (self._sounds[i]._ended) {
          // Disconnect the audio source when using Web Audio.
          if (self._webAudio && self._sounds[i]._node) {
            self._sounds[i]._node.disconnect(0);
          }

          // Remove sounds until we have the pool size.
          self._sounds.splice(i, 1);
          cnt--;
        }
      }
    },

    /**
     * Get all ID's from the sounds pool.
     * @param  {Number} id Only return one ID if one is passed.
     * @return {Array}    Array of IDs.
     */
    _getSoundIds: function(id) {
      var self = this;

      if (typeof id === 'undefined') {
        var ids = [];
        for (var i=0; i<self._sounds.length; i++) {
          ids.push(self._sounds[i]._id);
        }

        return ids;
      } else {
        return [id];
      }
    },

    /**
     * Load the sound back into the buffer source.
     * @param  {Sound} sound The sound object to work with.
     * @return {Howl}
     */
    _refreshBuffer: function(sound) {
      var self = this;

      // Setup the buffer source for playback.
      sound._node.bufferSource = ctx.createBufferSource();
      sound._node.bufferSource.buffer = cache[self._src];

      // Connect to the correct node.
      if (sound._panner) {
        sound._node.bufferSource.connect(sound._panner);
      } else {
        sound._node.bufferSource.connect(sound._node);
      }

      // Setup looping and playback rate.
      sound._node.bufferSource.loop = sound._loop;
      if (sound._loop) {
        sound._node.bufferSource.loopStart = sound._start || 0;
        sound._node.bufferSource.loopEnd = sound._stop;
      }
      sound._node.bufferSource.playbackRate.value = self._rate;

      return self;
    }
  };

  /** Single Sound Methods **/
  /***************************************************************************/

  /**
   * Setup the sound object, which each node attached to a Howl group is contained in.
   * @param {Object} howl The Howl parent group.
   */
  var Sound = function(howl) {
    this._parent = howl;
    this.init();
  };
  Sound.prototype = {
    /**
     * Initialize a new Sound object.
     * @return {Sound}
     */
    init: function() {
      var self = this;
      var parent = self._parent;

      // Setup the default parameters.
      self._muted = parent._muted;
      self._loop = parent._loop;
      self._volume = parent._volume;
      self._muted = parent._muted;
      self._rate = parent._rate;
      self._seek = 0;
      self._paused = true;
      self._ended = true;
      self._sprite = '__default';

      // Generate a unique ID for this sound.
      self._id = Math.round(Date.now() * Math.random());

      // Add itself to the parent's pool.
      parent._sounds.push(self);

      // Create the new node.
      self.create();

      return self;
    },

    /**
     * Create and setup a new sound object, whether HTML5 Audio or Web Audio.
     * @return {Sound}
     */
    create: function() {
      var self = this;
      var parent = self._parent;
      var volume = (Howler._muted || self._muted || self._parent._muted) ? 0 : self._volume * Howler.volume();

      if (parent._webAudio) {
        // Create the gain node for controlling volume (the source will connect to this).
        self._node = (typeof ctx.createGain === 'undefined') ? ctx.createGainNode() : ctx.createGain();
        self._node.gain.setValueAtTime(volume, ctx.currentTime);
        self._node.paused = true;
        self._node.connect(masterGain);
      } else {
        self._node = new Audio();

        // Listen for errors (http://dev.w3.org/html5/spec-author-view/spec.html#mediaerror).
        self._errorFn = self._errorListener.bind(self);
        self._node.addEventListener('error', self._errorFn, false);

        // Listen for 'canplaythrough' event to let us know the sound is ready.
        self._loadFn = self._loadListener.bind(self);
        self._node.addEventListener(canPlayEvent, self._loadFn, false);

        // Setup the new audio node.
        self._node.src = parent._src;
        self._node.preload = 'auto';
        self._node.volume = volume;

        // Begin loading the source.
        self._node.load();
      }

      return self;
    },

    /**
     * Reset the parameters of this sound to the original state (for recycle).
     * @return {Sound}
     */
    reset: function() {
      var self = this;
      var parent = self._parent;

      // Reset all of the parameters of this sound.
      self._muted = parent._muted;
      self._loop = parent._loop;
      self._volume = parent._volume;
      self._muted = parent._muted;
      self._rate = parent._rate;
      self._seek = 0;
      self._paused = true;
      self._ended = true;
      self._sprite = '__default';

      // Generate a new ID so that it isn't confused with the previous sound.
      self._id = Math.round(Date.now() * Math.random());

      return self;
    },

    /**
     * HTML5 Audio error listener callback.
     */
    _errorListener: function() {
      var self = this;

      if (self._node.error && self._node.error.code === 4) {
        Howler.noAudio = true;
      }

      // Fire an error event and pass back the code.
      self._parent._emit('loaderror', self._id, self._node.error ? self._node.error.code : 0);

      // Clear the event listener.
      self._node.removeEventListener('error', self._errorListener, false);
    },

    /**
     * HTML5 Audio canplaythrough listener callback.
     */
    _loadListener: function() {
      var self = this;
      var parent = self._parent;

      // Round up the duration to account for the lower precision in HTML5 Audio.
      parent._duration = Math.ceil(self._node.duration * 10) / 10;

      // Setup a sprite if none is defined.
      if (Object.keys(parent._sprite).length === 0) {
        parent._sprite = {__default: [0, parent._duration * 1000]};
      }

      if (parent._state !== 'loaded') {
        parent._state = 'loaded';
        parent._emit('load');
        parent._loadQueue();
      }

      if (parent._autoplay) {
        parent.play();
      }

      // Clear the event listener.
      self._node.removeEventListener(canPlayEvent, self._loadFn, false);
    }
  };

  /** Helper Methods **/
  /***************************************************************************/

  // Only define these methods when using Web Audio.
  if (usingWebAudio) {

    var cache = {};

    /**
     * Buffer a sound from URL, Data URI or cache and decode to audio source (Web Audio API).
     * @param  {Howl} self
     */
    var loadBuffer = function(self) {
      var url = self._src;

      // Check if the buffer has already been cached and use it instead.
      if (cache[url]) {
        // Set the duration from the cache.
        self._duration = cache[url].duration;

        // Load the sound into this Howl.
        loadSound(self);

        return;
      }

      if (/^data:[^;]+;base64,/.test(url)) {
        // Setup polyfill for window.atob to support IE9.
        // Modified from: https://github.com/davidchambers/Base64.js
        window.atob = window.atob || function(input) {
          var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
          var str = String(input).replace(/=+$/, '');
          for (
            var bc = 0, bs, buffer, idx = 0, output = '';
            buffer = str.charAt(idx++);
            ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
          ) {
            buffer = chars.indexOf(buffer);
          }

          return output;
        };

        // Decode the base64 data URI without XHR, since some browsers don't support it.
        var data = atob(url.split(',')[1]);
        var dataView = new Uint8Array(data.length);
        for (var i=0; i<data.length; ++i) {
          dataView[i] = data.charCodeAt(i);
        }

        decodeAudioData(dataView.buffer, self);
      } else {
        // Load the buffer from the URL.
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
          // Make sure we get a successful response back.
          var code = (xhr.status + '')[0];
          if (code !== '0' && code !== '2' && code !== '3') {
            self._emit('loaderror', null, 'Failed loading audio file with status: ' + xhr.status + '.');
            return;
          }

          decodeAudioData(xhr.response, self);
        };
        xhr.onerror = function() {
          // If there is an error, switch to HTML5 Audio.
          if (self._webAudio) {
            self._html5 = true;
            self._webAudio = false;
            self._sounds = [];
            delete cache[url];
            self.load();
          }
        };
        safeXhrSend(xhr);
      }
    };

    /**
     * Send the XHR request wrapped in a try/catch.
     * @param  {Object} xhr XHR to send.
     */
    var safeXhrSend = function(xhr) {
      try {
        xhr.send();
      } catch (e) {
        xhr.onerror();
      }
    };

    /**
     * Decode audio data from an array buffer.
     * @param  {ArrayBuffer} arraybuffer The audio data.
     * @param  {Howl}        self
     */
    var decodeAudioData = function(arraybuffer, self) {
      // Decode the buffer into an audio source.
      ctx.decodeAudioData(arraybuffer, function(buffer) {
        if (buffer && self._sounds.length > 0) {
          cache[self._src] = buffer;
          loadSound(self, buffer);
        }
      }, function() {
        self._emit('loaderror', null, 'Decoding audio data failed.');
      });
    };

    /**
     * Sound is now loaded, so finish setting everything up and fire the loaded event.
     * @param  {Howl} self
     * @param  {Object} buffer The decoded buffer sound source.
     */
    var loadSound = function(self, buffer) {
      // Set the duration.
      if (buffer && !self._duration) {
        self._duration = buffer.duration;
      }

      // Setup a sprite if none is defined.
      if (Object.keys(self._sprite).length === 0) {
        self._sprite = {__default: [0, self._duration * 1000]};
      }

      // Fire the loaded event.
      if (self._state !== 'loaded') {
        self._state = 'loaded';
        self._emit('load');
        self._loadQueue();
      }

      // Begin playback if specified.
      if (self._autoplay) {
        self.play();
      }
    };

  }

  /**
   * Setup the audio context when available, or switch to HTML5 Audio mode.
   */
  function setupAudioContext() {
    try {
      if (typeof AudioContext !== 'undefined') {
        ctx = new AudioContext();
      } else if (typeof webkitAudioContext !== 'undefined') {
        ctx = new webkitAudioContext();
      } else {
        usingWebAudio = false;
      }
    } catch(e) {
      usingWebAudio = false;
    }

    if (!usingWebAudio) {
      if (typeof Audio !== 'undefined') {
        try {
          var test = new Audio();

          // Check if the canplaythrough event is available.
          if (typeof test.oncanplaythrough === 'undefined') {
            canPlayEvent = 'canplay';
          }
        } catch(e) {
          noAudio = true;
        }
      } else {
        noAudio = true;
      }
    }

    // Test to make sure audio isn't disabled in Internet Explorer
    try {
      var test = new Audio();
      if (test.muted) {
        noAudio = true;
      }
    } catch (e) {}

    // Check if a webview is being used on iOS8 or earlier (rather than the browser).
    // If it is, disable Web Audio as it causes crashing.
    var iOS = (/iP(hone|od|ad)/.test(navigator.platform));
    var appVersion = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
    var version = appVersion ? parseInt(appVersion[1], 10) : null;
    if (iOS && version && version < 9) {
      var safari = /safari/.test(window.navigator.userAgent.toLowerCase());
      if (window.navigator.standalone && !safari || !window.navigator.standalone && !safari) {
        usingWebAudio = false;
      }
    }

    // Create a master gain node.
    if (usingWebAudio) {
      masterGain = (typeof ctx.createGain === 'undefined') ? ctx.createGainNode() : ctx.createGain();
      masterGain.gain.value = 1;
      masterGain.connect(ctx.destination);
    }
  }

  // Add support for AMD (Asynchronous Module Definition) libraries such as require.js.
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return {
        Howler: Howler,
        Howl: Howl
      };
    });
  }

  // Add support for CommonJS libraries such as browserify.
  if (typeof exports !== 'undefined') {
    exports.Howler = Howler;
    exports.Howl = Howl;
  }

  // Define globally in case AMD is not available or unused.
  if (typeof window !== 'undefined') {
    window.HowlerGlobal = HowlerGlobal;
    window.Howler = Howler;
    window.Howl = Howl;
    window.Sound = Sound;
  } else if (typeof global !== 'undefined') { // Add to global in Node.js (for testing, etc).
    global.HowlerGlobal = HowlerGlobal;
    global.Howler = Howler;
    global.Howl = Howl;
    global.Sound = Sound;
  }
})();
/*
 * File: event_target.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: event target
 * 
 * Copyright (c) 2011 - 2015	Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016	Holaverse Inc.
 * 
 */
function TEvent() {
}

TEvent.prototype.preventDefault = function() {
	this.defaultPrevented = true;

	return this;
}

TEvent.prototype.isDefaultPrevented = function() {
	return this.defaultPrevented;
}

TEvent.create = function(type) {
	var event = new TEvent();
	event.type = type;

	return event;
}

function TEventTarget() {
}

TEventTarget.apply = function(obj) {
	if (!obj) {
		return;
	}

	obj.createEvent = TEvent.create;
	obj.hasEventListener = TEventTarget.prototype.hasEventListener;
	obj.dispatchEvent = TEventTarget.prototype.dispatchEvent;
	obj.addEventListener = TEventTarget.prototype.addEventListener;
	obj.removeEventListener = TEventTarget.prototype.removeEventListener;
	obj.resetEvents = TEventTarget.prototype.resetEvents;
	obj.on = TEventTarget.prototype.on;
	obj.off = TEventTarget.prototype.off;

	return;
}

TEventTarget.prototype.resetEvents = function() {
	this.eventListeners = {};
}

TEventTarget.prototype.hasEventListener = function(type) {
	return this.eventListeners && this.eventListeners[type] && this.eventListeners[type].length > 0;
}

TEventTarget.prototype.on = TEventTarget.prototype.addEventListener = function(type, callback) {
	if(!callback || !type) {
		return;
	}

	if(!this.eventListeners) {
		this.eventListeners = {};
	}

	var callbacks = this.eventListeners[type];
	
	if(!callbacks) {
		callbacks = [];
		this.eventListeners[type] = callbacks;
	}

	if(callback) {
		callbacks.push({callback:callback});
	}

	return;
}

TEventTarget.prototype.off = TEventTarget.prototype.removeEventListener = function(type, callback) {
	if(!this.eventListeners || !callback || !type) {
		return;
	}

	var callbacks = this.eventListeners[type];
	if(callbacks) {
		for(var i = 0; i < callbacks.length; i++) {
			var iter = callbacks[i];
			if(iter && iter.callback === callback) {
				callbacks.splice(i, 1);
			}
		}
	}

	return;
}

TEventTarget.prototype.dispatchEvent = function(event) {
	if(!this.eventListeners || !event || !event.type) {
		return false;
	}
	
	var type = event.type;
	var callbacks = this.eventListeners[type];
	
	event.target = this;
	if(callbacks) {
		var n = callbacks.length;
		callbacks = callbacks.slice();

		for(var i = 0; i < n; i++) {
			var iter = callbacks[i];
			var callback = iter.callback;
			try {
				if(callback.call(this, event)) {
					return true;
				}
			}catch(e){
				console.log("%cWarning: dispatchEvent " + type + "(" + e.message + ")\n" + e.stack, "color: red; font-weight: bold");
			}
		}
	}

	return false;
}
/*
 * File: resloader.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: res loader
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function ResLoader() {
}

ResLoader.total = 0;
ResLoader.finished = 0;

ResLoader.reset = function() {
	ResLoader.total = 0;
	ResLoader.finished = 0;

	return;
}

ResLoader.toLoadInc = function(src) {
	ResLoader.total++;
	return;
}

ResLoader.loadedInc = function(src) {
	setTimeout(function() {
		ResLoader.finished++;
		ResLoader.notifyLoadProgress();
	}, 1);

	return;
}

ResLoader.setAssetsConfig = function(assetsConfig) {
	ResLoader.assetsConfig = assetsConfig;
}

ResLoader.mapImageURL = function(url, assetsConfig) {
		return url;
}

ResLoader.setOnChangedListener = function(onChanged) {
	ResLoader.onChanged = onChanged;
}

ResLoader.setOnLoadFinishListener = function(onLoadFinished) {
	ResLoader.onLoadFinished = onLoadFinished;

	return;
}

ResLoader.isLoadCompleted = function() {
	return ResLoader.finished >= ResLoader.total;
}

ResLoader.notifyLoadDone = function() {
	if(ResLoader.onLoadFinished) {
		ResLoader.onLoadFinished();
	}
	console.log("All resource loaded:" + ResLoader.total);
}

ResLoader.notifyLoadProgress = function() {
	var percent = ResLoader.getPercent();
	if(ResLoader.onChanged) {
		ResLoader.onChanged(percent, ResLoader.finished, ResLoader.total);
	}
	
	if(ResLoader.finished >= ResLoader.total) {
		ResLoader.notifyLoadDone();
	}

	var event = {type:ResLoader.EVENT_ASSETS_LOAD_PROGRESS, percent:percent, finished:ResLoader.finished, total:ResLoader.total};
	ResLoader.dispatchEvent(event);

	return;
}

ResLoader.getTotal = function() {
	return ResLoader.total;
}

ResLoader.getFinished = function() {
	return ResLoader.finished;
}

ResLoader.getPercent = function() {
	if(!ResLoader.total) {
		return 100;
	}

	return (ResLoader.finished/ResLoader.total) * 100;
}

ResLoader.cache = {};

ResLoader.addToCache = function(src, obj) {
	ResLoader.cache[src] = obj;
}

ResLoader.dump = function() {
	var i = 0;
	for(var key in ResLoader.cache) {
		var iter = ResLoader.cache[key];
		var str = i + " : " + key.substr(0, 255) + " status=" + (iter.pending ? "pending" : "loaded");
		console.log(str);
		i++;
	}
}

ResLoader.clearCache = function(check) {
	var newCache = {};
	for(var key in ResLoader.cache) {
		var asset = ResLoader.cache[key];

		if(check && check(key)) {
			newCache[key] =  asset;
		}
		else {
			console.log("clear asset:" + key);
		}
	}
	ResLoader.cache = newCache;

	return;
}

ResLoader.getFromCache = function(src) {
	return ResLoader.cache[src];
}

ResLoader.resRoot = null;
ResLoader.setResRoot = function(resRoot) {
	ResLoader.resRoot = resRoot;

	return;
}

ResLoader.toAbsURL = function(url) {
	if(!url || url.indexOf("://") > 0 || url.indexOf("data:") === 0) {
		return url;
	}

	var absURL = url;
	if(ResLoader.resRoot) {
		absURL = ResLoader.resRoot + url;
	}
	else if(url[0] === '/') {
		absURL = location.protocol + "//" + location.host + url;
	}
	else {
		var str = location.protocol + "//" + location.host + location.pathname;
		var path = dirname(str);
		absURL = path + "/" + url;
	}

	return absURL;
}

function ResProxy(src, onSuccess, onFail) {
	this.src = src;
	this.obj = null;
	this.pending = true;
	this.onSuccessList = [onSuccess];
	this.onFailList = [onFail];

	if(src) {
		ResLoader.toLoadInc(src);
		ResLoader.addToCache(src, this);
	}
	else {
		console.log("WARNNING: load null url.");
	}

	return;
}

ResProxy.prototype.onDone = function(obj) {
	this.obj = obj;
	delete this.pending;
	ResLoader.loadedInc(this.src);

	try {
		if(obj) {
			this.callOnSuccess();
		}
		else {
			this.callOnFail();
		}
	}catch(e) {
		console.log("ResProxy.prototype.onDone:" + e.message);
	}

	return;
}

ResProxy.prototype.callOnSuccess = function() {
	var obj = this.obj;
	var src = this.src;

	for(var i = 0; i < this.onSuccessList.length; i++) {
		var onSuccess = this.onSuccessList[i];
		if(!onSuccess) continue;

		if(onSuccess.dataType === "json") {
			ResLoader.callFunc(onSuccess, this.getJsonObj());
		}
		else {
			ResLoader.callFunc(onSuccess, this.obj);
		}
	}

	this.onFailList = [];
	this.onSuccessList = [];

	return;
}

ResProxy.prototype.callOnFail = function() {
	var src = this.src;

	for(var i = 0; i < this.onFailList.length; i++) {
		var onFail = this.onFailList[i];
		if(!onFail) continue;
		ResLoader.callFunc(onFail, null);

	}
	this.onFailList = [];
	this.onSuccessList = [];

	return;
}

ResProxy.prototype.getJsonObj = function() {
	if(this.jsonObj) {
		return this.jsonObj;
	}

	try {
		this.jsonObj = JSON.parse(this.obj);
	}catch(e) {
		console.log("ensureJson:" + e.message);
	}

	return this.jsonObj;
}

ResProxy.prototype.onHitCache = function(onSuccess, onFail) {
	if(this.pending) {
		this.onSuccessList.push(onSuccess);
		this.onFailList.push(onFail);
	}
	else if(this.obj) {
		if(onSuccess.dataType === "json") {
			ResLoader.callFunc(onSuccess, this.getJsonObj());
		}
		else {
			ResLoader.callFunc(onSuccess, this.obj);
		}
	}
	else {
		ResLoader.callFunc(onFail, null);
	}

	return this.obj;
}

ResLoader.callFunc = function(func, data) {
	if(func) {
		try {
			func(data);
		}catch(e) {
			console.log("ResLoader.callFunc:" + e.message);
		}
	}

	return;
}

ResLoader.loadImage = function(url, onSuccess, onFail) {
	var src = ResLoader.mapImageURL(ResLoader.toAbsURL(url), ResLoader.assetsConfig);

	var proxy = ResLoader.getFromCache(src);
	if(proxy) {
		return proxy.onHitCache(onSuccess, onFail);
	}
	else {
		var proxy = new ResProxy(src, onSuccess, onFail);

		return CantkRT.createImage(src, proxy.onDone.bind(proxy), proxy.onDone.bind(proxy));
	}
}

ResLoader.loadAudio = function(url, onSuccess, onFail) {
	var src = ResLoader.toAbsURL(url);
	var proxy = ResLoader.getFromCache(src);
	if(proxy) {
		return proxy.onHitCache(onSuccess, onFail);
	}

	var audio = new Audio();

	proxy = new ResProxy(src, onSuccess, onFail);

	audio.volume = 0.8;
	audio.addEventListener('loadstart', function (e) {
		console.log("load start:" + url);
	});
	
	audio.addEventListener('canplay', function (e) {
		console.log("canplay:" + url);
	});

	audio.addEventListener('canplaythrough', function (e) {
		console.log("canplaythrough:" + url);
		proxy.onDone(audio);
	});

	audio.addEventListener('error', function (e) {
		console.log("error:" + url);
		proxy.onDone(null);
	});

	audio.src = src;
	audio.load();

	return audio;
}

ResLoader.loadJson = function(url, onSuccess, onFail) {
	var src = ResLoader.toAbsURL(url);
	var proxy = ResLoader.getFromCache(src);
	onSuccess.dataType = "json";
	if(proxy) {
		return proxy.onHitCache(onSuccess, onFail);
	}

	proxy = new ResProxy(src, onSuccess, onFail);
	httpGetURL(src, function(result, xhr, data) {
		proxy.onDone(data);
	});

	return;
}

ResLoader.loadData = function(url, onSuccess, onFail) {
	var src = ResLoader.toAbsURL(url);
	var proxy = ResLoader.getFromCache(src);
	
	onSuccess.dataType = "string";
	if(proxy) {
		return proxy.onHitCache(onSuccess, onFail);
	}

	proxy = new ResProxy(src, onSuccess, onFail);
	httpGetURL(src, function(result, xhr, data) {
		proxy.onDone(data);
	});

	return;
}

ResLoader.loadScriptsSync = function(srcs, onCompleted) {
	var i = 0;
	var n = srcs.length;

	ResLoader.toLoadInc("scripts begin");
	function loadNext() {
		if(i < n) {
			var iter = srcs[i];
			
			i++;
			console.log("load script("+i+"/"+n+"):" + iter);
			ResLoader.loadScript(iter, window.studioDevMode, loadNext, loadNext);
		}
		else {
			if(onCompleted) {
				onCompleted();
			}
			ResLoader.loadedInc("scripts done");
			console.log("load scripts done.");
		}
	}

	loadNext();
}

ResLoader.loadScript = function(src, force, onSuccess, onFail) {
	var script = null;
	var scripts = document.scripts;
	var node = document.head ? document.head : document.body;
	var timestamp = "timestamp=" + Date.now();
	if(src.indexOf("?") < 0) {
		timestamp = "?" + timestamp;
	}
	else {
		timestamp = "&" + timestamp;
	}

	if(scripts) {
		for(var i = 0; i < scripts.length; i++) {
			var iter = scripts[i];
			if(iter.src && iter.src.indexOf(src) >= 0) {
				script = iter;
				if(onSuccess) {
					onSuccess();
				}

				if(force) {
					document.head.removeChild(script);
					break;
				}
				else {
					return;
				}
			}
		}
	}

	ResLoader.toLoadInc(src);
	script = document.createElement("script");
	script.onload = function() { 
		if(onSuccess) {
			onSuccess();
		}
		ResLoader.loadedInc(src);
	}

	script.onerror = script.onabort = script.oncancel = function(e) {
		if(onFail) {
			onFail();
		}
		ResLoader.loadedInc(src);
	}

	if(!force) {
		script.src = src;
	}
	else {
		script.src = src + timestamp;
	}
	node.appendChild(script);

	return;
}

ResLoader.loadFonts = function(fonts) {
	if(CantkRT.isCantkRTV8()) {
		return ResLoader.loadFontsRT(fonts);
	}
	else {
		return ResLoader.loadFontsWeb(fonts);
	}
}

ResLoader.loadFontsRT = function(fonts) {
	for(var i = 0; i < fonts.length; i++) {
		var iter = fonts[i];
		var name = iter.basename(true);
		CantkRT.loadFont(name, iter);
	}	

	return;
}

ResLoader.loadFontsWeb = function(fonts) {
	var styleStr = "";
	for(var i = 0; i < fonts.length; i++) {
		var iter = fonts[i];
		var name = iter.basename(true);
		var str = "font-family:'"+name+"';\n";
			str += "src: url('"+iter+"') ";
			if(iter.indexOf(".ttf") > 0 || iter.indexOf("TTF") > 0) {
				str += "format('truetype');\n";
			}
			else if(iter.indexOf(".woff") > 0) {
				str += "format('woff');\n";
			}
			else if(iter.indexOf(".otf") > 0) {
				str += "format('opentype');\n";
			}
			else {
				console.log("not supported:" + iter);
			}

			var fontFaceStr = "@font-face {\n";
			fontFaceStr += str;
			fontFaceStr += "}\n";
			styleStr += fontFaceStr;
	}

	var style = document.createElement("style");
	style.onload = function() {
		console.log("font style loaded.");
	}

	style.innerHTML = styleStr;
	document.head.appendChild(style);
	console.log(styleStr);

	return;
}

TEventTarget.apply(ResLoader);
ResLoader.EVENT_ASSETS_LOAD_PROGRESS = "assets-load-progress";


/*
 * File:    plist.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief:   plist parser
 * 
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */
function PList() {
	this.options = {};
}

PList.ST_NONE = 0;
PList.ST_TEXT = 1;
PList.ST_END_TAG = 2;
PList.ST_START_TAG = 3;

PList.prototype.onStateChanged = function(state, str) {
	switch(this._parseState) {
		case PList.ST_START_TAG: {
			this.tagName = str;
			break;
		}
		case PList.ST_END_TAG: {
			this.tagName = null;
			break;
		}
		case PList.ST_TEXT: {
			if(this.tagName === "key") {
				this._propName = str;
			}
			else if(this.tagName === "real") {
				this.options[this._propName] = parseFloat(str);
			}
			else if(this.tagName === "integer") {
				this.options[this._propName] = parseInt(str);
			}
			else if(this.tagName === "string") {
				this.options[this._propName] = str;
			}

			break;
		}
	}

	this._parseState = state;
}

PList.prototype.dump = function() {
	console.log(JSON.stringify(this.options, null, "\t"))
}

PList.prototype.get = function(name) {
	if(name) {
		return this.options[name];
	}
	else {
		return this.options;
	}
}

PList.prototype.parse = function(buff) {
	var str = "";
	var n = buff.length;
	this.options = {};

	this._parseState = PList.ST_NONE;
	for(var i = 0; i < n; i++) {
		var c = buff[i];
		if(c === "<") {
			if(buff[i+1] === "/") {
				i++;
				this.onStateChanged(PList.ST_END_TAG, str);
			}
			else {
				this.onStateChanged(PList.ST_START_TAG, str);
			}
			str = "";
		}
		else if(c === ">") {
			this.onStateChanged(PList.ST_TEXT, str);
			str = "";
		}
		else {
			str += c;
		}
	}

	return this.options;
}

/*
 * File:    bitmap_font.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief:   fnt file parser
 * 
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */

function BitmapFont() {
}

//http://www.angelcode.com/products/bmfont/doc/file_format.html
BitmapFont.prototype.parseFontLine = function(fontInfo, line) {
	var words = line.split(" ");

	var lineInfo = {};
	var name = words[0];
	var n = words.length;

	for(var i = 1; i < n; i++) {
		var kevValue = words[i].split('=');
		var key = kevValue[0];
		var value = kevValue[1];
		lineInfo[key] = value;
	}

	switch(name) {
		case "page": {
			var pageDesc = {};
			pageDesc.id = lineInfo.id;
			pageDesc.file = lineInfo.file.replace(/"/g,"").replace(/\r/, "");

			fontInfo.pagesDesc[pageDesc.id] = pageDesc;

			break;
		}
		case "char": {
			var charDesc = {};
			var c = String.fromCharCode(lineInfo.id);

			charDesc.c = c;
			charDesc.id = lineInfo.id;
			charDesc.x = parseInt(lineInfo.x);
			charDesc.y = parseInt(lineInfo.y);
			charDesc.w = parseInt(lineInfo.width);
			charDesc.h = parseInt(lineInfo.height);
			charDesc.ox = parseInt(lineInfo.xoffset);
			charDesc.oy = parseInt(lineInfo.yoffset);
			charDesc.rw = parseInt(lineInfo.xadvance);
			charDesc.page = lineInfo.page;

			fontInfo.charsDesc[c] = charDesc;

			break;
		}
	}

	return;
}

BitmapFont.prototype.parse = function(data) {
	var fontInfo = {};
	fontInfo.charsDesc = {};
	fontInfo.pagesDesc = {};

	var lines = data.split("\n");
	for(var i = 0; i < lines.length; i++) {
		this.parseFontLine(fontInfo, lines[i]);
	}

	this.fontInfo = fontInfo;

	return fontInfo;
}

BitmapFont.prototype.getCharDesc = function(c) {
	return this.fontInfo ? this.fontInfo.charsDesc[c] : null;
}

BitmapFont.prototype.getCharsDesc = function(c) {
	return this.fontInfo ? this.fontInfo.charsDesc : null;
}

BitmapFont.prototype.getPagesDesc = function() {
	return this.fontInfo ? this.fontInfo.pagesDesc : null;
}

BitmapFont.prototype.getFontInfo  = function() {
	return this.fontInfo;
}

/*
 * File: w_image.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: image adapter
 *
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 *
 */

function WImage(src, onLoad) {
	this.src = src;
   	this.onLoadCallback = [];
	this.image = WImage.nullImage;
   	this.setSizeInfo(0, 0, 0, 0, false, false, 0, 0, 0, 0);
	this.setImageSrc(src, onLoad);

	return;
}

WImage.prototype.setSizeInfo = function(x, y, w, h, rotated, trimmed, ox, oy, rw, rh) {
	this.rect = {x:x >> 0, y:y >> 0, w:w >> 0, h:h >> 0, rotated:rotated, trimmed:trimmed, ox:ox >> 0, oy:oy >> 0, rw:rw >> 0, rh:rh >> 0};
}

WImage.prototype.appendOnLoadCallback = function(onLoad) {
    if(onLoad){
        this.onLoadCallback.push(onLoad);
    }
}

WImage.prototype.notifyLoadDone = function(img) {
	this.image = img;
	var callbacks = this.onLoadCallback;

	for(var i = 0, j = callbacks.length; i < j; i++){
		callbacks[i](img);
	}
	this.onLoadCallback.length = 0;
}

WImage.prototype.initFromJson = function(src, json) {
	var sharpOffset = src.indexOf("#");
	var jsonURL = src.substr(0, sharpOffset);
	var name = src.substr(sharpOffset+1);
	var path = dirname(jsonURL);
	var filename = json.file ? json.file : json.meta.image;
	var imageSrc = path + "/" + filename;
	var info = json.frames[name];

	if(!info) {
		console.log("not found src: " + src);
		return;
	}

	var rect = info.frame || info;

	if(!rect) {
		alert("Invalid src: " + src);
		return;
	}

	if(info.trimmed) {
		this.setSizeInfo(rect.x, rect.y, rect.w, rect.h, info.rotated,
			true, info.spriteSourceSize.x, info.spriteSourceSize.y, info.sourceSize.w, info.sourceSize.h);;
	}
	else {
		this.setSizeInfo(rect.x, rect.y, rect.w, rect.h, info.rotated,
			false, 0, 0, rect.w, rect.h);
	}

	var me = this;
	ResLoader.loadImage(imageSrc, function(img) {
		me.notifyLoadDone(img);
	});

	return;
}

WImage.prototype.initFromRowColIndex = function(src, rowcolIndex) {
	var me = this;
	var rows = parseInt(rowcolIndex[1]);
	var cols = parseInt(rowcolIndex[2]);
	var index = parseInt(rowcolIndex[3]);

	ResLoader.loadImage(src, function(img) {
		var tileW = Math.round(img.width/cols);
		var tileH = Math.round(img.height/rows);
		var w = Math.floor(img.width/cols);
		var h = Math.floor(img.height/rows);
		var col = index%cols;
		var row = Math.floor(index/cols);

		var x = col * tileW;
		var y = row * tileH;
		me.setSizeInfo(x, y, w, h, false, false, 0, 0, w, h);
		me.notifyLoadDone(img);
	});

	rowcolIndex = null;

	return;
}

WImage.prototype.initFromXYWH = function(src, xywh) {
	var me = this;
	var x = parseInt(xywh[1]);
	var y = parseInt(xywh[2]);
	var w = parseInt(xywh[3]);
	var h = parseInt(xywh[4]);

	this.image = ResLoader.loadImage(src, function(img) {
		me.setSizeInfo(x, y, w, h, false, false, 0, 0, w, h);
		me.notifyLoadDone(img);
	});
	xywh = null;

	return;
}

WImage.prototype.setImage = function(image) {
	this.image = image;

	return this;
}

WImage.prototype.initFromDataURL = function(src, onLoad) {
	var me = this;
	this.src = src;
	this.image = CantkRT.createImage(src, function(img) {
		me.setSizeInfo(0, 0, img.width, img.height, false, false, 0, 0, img.width, img.height);
		me.notifyLoadDone(img);
	});
}

WImage.prototype.setImageSrc = function(src, onLoad) {
	this.appendOnLoadCallback(onLoad);

	if(!src) {
		this.notifyLoadDone(WImage.nullImage);
		return;
	}

	if(src.indexOf("data:") === 0) {
		this.initFromDataURL(src, onLoad);
		return;
	}

	var me = this;
	var url = ResLoader.toAbsURL(src);

	this.src = url;
	var sharpOffset = url.indexOf("#");
	if(sharpOffset > 0) {
		var meta = url.substr(sharpOffset+1);
		var rowcolIndex = meta.match(/r([0-9]+)c([0-9]+)i([0-9]+)/i);
		var xywh = meta.match(/x([0-9]+)y([0-9]+)w([0-9]+)h([0-9]+)/i);

		if(!rowcolIndex && !xywh) {
			var jsonURL = url.substr(0, sharpOffset);
			ResLoader.loadJson(jsonURL, function(json) {
                if(Array.isArray(json)) {
                    var find = false;
                    var target = null;
                    for(var i = 0; i < json.length; i++) {
                        var frames = Object.keys(json[i].frames);
                        find = frames.some(function(imagename) {
                            if(imagename === meta) {
                                target = json[i];
                                return true;
                            }
                        });
                        if(find) {
                            break;
                        }
                    }
                    return me.initFromJson(url, target || json, onLoad);
                }
				me.initFromJson(url, json, onLoad);
			});
		}
		else {
			url = url.substr(0, sharpOffset);
			if(rowcolIndex) {
				this.initFromRowColIndex(url, rowcolIndex, onLoad);
			}
			if(xywh){
				this.initFromXYWH(url, xywh, onLoad);
			}

			rowcolIndex = null;
			xywh = null;
		}
	}
	else {
		this.image = ResLoader.loadImage(url, function(img) {
			var w = img.width;
			var h = img.height;
			me.setSizeInfo(0, 0, w, h, false, false, 0, 0, w, h);
			me.notifyLoadDone(img);
		});
	}

	return;
}

WImage.prototype.getImageRect = function() {
	return this.rect;
}

WImage.prototype.getImageSrc = function() {
	return this.src;
}

WImage.prototype.getRealImageSrc = function() {
	if(this.image) {
		return this.image.src;
	}
	else {
		var src = this.src;
		var offset = src.indexOf("#");

		if(offset > 0) {
			src = src.substr(0, offset);
			src = src.replace(".json", ".png");
			console.log("Warning: image is not loaded yet.");
		}

		return src;
	}
}

WImage.prototype.isLoaded = function() {
	return this.image && this.image.complete;
}

WImage.prototype.getImage = function() {
	return this.image;
}

WImage.isValid = function(image) {
	return image && image.image && image.image.width && image.image.height;
}

WImage.cache = {};
WImage.nullImage = new Image();
WImage.nullWImage = new WImage();
WImage.nullWImage.image = null;

WImage.clearCache = function(check) {
	var newCache = {};
	for(var key in WImage.cache) {
		var asset = WImage.cache[key];

		if(check && check(key)) {
			newCache[key] =  asset;
		}
		else {
			console.log("clear image:" + key);
		}
	}
	WImage.cache = newCache;

	return;
}

WImage.create = function(src, onLoad) {
	if(!src) {
		return WImage.nullWImage;
	}

	var url = ResLoader.toAbsURL(src);
	var image = WImage.cache[url];

	if(image) {
		if(onLoad) {
			var img = image.image;
			if(img.complete) {
				onLoad(img);
			}else{
                image.appendOnLoadCallback(onLoad)
            }
		}
	}
	else {
		image = new WImage(url, onLoad);
		WImage.cache[url] = image;
	}

	return image;
}

WImage.createWithImage = function(img) {
	var image = WImage.nullWImage;

	if(img) {
		if(img.src) {
			return WImage.create(img.src);
		}

		image = new WImage();
		image.setImage(img);
		image.setSizeInfo(0, 0, img.width, img.height, false, false, 0, 0, img.width, img.height);
	}

	return image;
}

//////////////////////////////////////////////////////////////////

WImage.DISPLAY_CENTER = 0;
WImage.DISPLAY_TILE   = 1;
WImage.DISPLAY_9PATCH = 2;
WImage.DISPLAY_SCALE  = 3;
WImage.DISPLAY_AUTO = 4;
WImage.DISPLAY_DEFAULT = 5;
WImage.DISPLAY_SCALE_KEEP_RATIO  = 6;
WImage.DISPLAY_TILE_V = 7;
WImage.DISPLAY_TILE_H = 8;
WImage.DISPLAY_AUTO_SIZE_DOWN = 9;
WImage.DISPLAY_FIT_WIDTH = 10;
WImage.DISPLAY_FIT_HEIGHT = 11;
WImage.DISPLAY_3PATCH_V = 12;
WImage.DISPLAY_3PATCH_H = 13;

WImage.prototype.draw = function(canvas, display, x, y, dw, dh) {
	var image = this.getImage();
	var srcRect = this.getImageRect();

	return WImage.draw(canvas, image, display, x, y, dw, dh, srcRect);
}

WImage.getImageRectDefault = function(image) {
	return {x:0, y:0, w:image.width, h:image.height, trimmed:false};
}

WImage.draw = function(canvas, image, display, x, y, dw, dh, srcRect) {
	if(!image || !image.width) return;

	var dx = 0;
	var dy = 0;
	var sr = srcRect || WImage.getImageRectDefault(image);
	var sw = sr.w;
	var sh = sr.h;
	var sx = sr.x;
	var sy = sr.y;
	var ox = sr.ox || 0;
	var oy = sr.oy || 0;
	var imageWidth  = sr.rw || sr.w;
	var imageHeight = sr.rh || sr.h;

    if(imageHeight === 0 || imageWidth === 0) {
        return;
    }

	switch(display) {
		case WImage.DISPLAY_CENTER: {
			dx = (x + ((dw - imageWidth) >> 1)) + ox;
			dy = (y + ((dh - imageHeight) >> 1)) + oy;

			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, sw, sh);
			break;
		}
		case WImage.DISPLAY_AUTO_SIZE_DOWN: {
			var scale = Math.min(Math.min(dw/imageWidth, dh/imageHeight), 1);
			var iw = imageWidth*scale;
			var ih = imageHeight*scale;

			dx = x + ((dw - iw) >> 1);
			dy = y + ((dh - ih) >> 1);
			dx += (ox*scale);
			dy += (oy*scale);
			dw = (sw*scale);
			dh = (sh*scale);

			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
			break;
		}
		case WImage.DISPLAY_SCALE: {
			var xScale = dw/imageWidth;
			var yScale = dh/imageHeight;

			dx = (x + ox*xScale);
			dy = (y + oy*yScale);
			dw = (sw*xScale);
			dh = (sh*yScale);

			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
			break;
		}
		case WImage.DISPLAY_AUTO: {
			var scale = Math.min(dw/imageWidth, dh/imageHeight);
			var iw = (imageWidth*scale);
			var ih = (imageHeight*scale);

			dx = x + ((dw - iw) >> 1);
			dy = y + ((dh - ih) >> 1);
			dx += (ox*scale);
			dy += (oy*scale);

			dw = (sw*scale);
			dh = (sh*scale);

			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
			break;
		}
		case WImage.DISPLAY_9PATCH: {
			dx = x + ox;
			dy = y + oy;
			dw -= (imageWidth - sw);
			dh -= (imageHeight - sh);
			drawNinePatchEx(canvas, image, sx, sy, sw, sh, dx, dy, dw, dh);

			break;
		}
        case WImage.DISPLAY_3PATCH_V:
            dx = x + ox;
            dy = y + oy;
            dw -= (imageWidth - sw);
			dh -= (imageHeight - sh);

            dw = Math.max(dw, 0);
            dh = Math.max(dh, 0);
            var sstep = sh / 3;
            var dstep = dh / 3;
            var hc = Math.min(sstep, dstep);
            canvas.drawImage(image, sx, sy, sw, sstep, dx, dy, dw, hc);
            canvas.drawImage(image, sx, sy + sstep, sw, sstep, dx, dy + hc, dw, Math.max(dh - 2*sstep, dstep));
            hc = hc + Math.max(dh - 2*sstep, dstep);
            canvas.drawImage(image, sx, sy + 2*sstep, sw, sstep, dx, dy + hc, dw, Math.min(sstep, dstep));
            break;
        case WImage.DISPLAY_3PATCH_H:
            dx = x + ox;
            dy = y + oy;
            dw -= (imageWidth - sw);
			dh -= (imageHeight - sh);

            dw = Math.max(dw, 0);
            dh = Math.max(dh, 0);
            var sstep = sw / 3;
            var dstep = dw / 3;
            var wc = Math.min(sstep, dstep);
            canvas.drawImage(image, sx, sy, sstep, sh, dx, dy, wc, dh);
            canvas.drawImage(image, sx + sstep, sy, sstep, sh, dx + wc, dy, Math.max(dw - 2*sstep, dstep), dh);
            wc = wc + Math.max(dw - 2*sstep, dw / 3);
            canvas.drawImage(image, sx + 2*sstep, sy, sstep, sh, dx + wc, dy, Math.min(sstep, dstep), dh);
            break;
		case WImage.DISPLAY_SCALE_KEEP_RATIO: {
			var scale = Math.max(dw/imageWidth, dh/imageHeight);

			dx = (x + ox*scale);
			dy = (y + oy*scale);
			dw = (sw*scale);
			dh = (sh*scale);

			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);

			break;
		}
		case WImage.DISPLAY_TILE: {
			dx = x;
			dy = y;

			imageWidth = sw;
			imageHeight = sh;
			var maxDx = x + dw;
			var maxDy = y + dh;
			while(dy < maxDy) {
				dx = x;
				sh = Math.min(maxDy-dy, imageHeight);
				while(dx < maxDx) {
					sw = Math.min(maxDx-dx, imageWidth);
					canvas.drawImage(image, sx, sy, sw, sh, dx, dy, sw, sh);
					dx = dx + sw;
				}
				dy = dy + sh;
			}
			break;
		}
		case WImage.DISPLAY_TILE_H: {
			var maxDx = x + dw;
			dx = x;
			imageWidth = sw;
			imageHeight = sh;
			sh = Math.min(dh, imageHeight);
			while(dx < maxDx) {
				sw = Math.min(maxDx-dx, imageWidth);
				canvas.drawImage(image, sx, sy, sw, sh, dx, y, sw, dh);
				dx = dx + sw;
			}
			break;
		}
		case WImage.DISPLAY_TILE_V: {
			var maxDy = y + dh;
			dy = y;
			imageWidth = sw;
			imageHeight = sh;
			sw = Math.min(dw, imageWidth);
			while(dy < maxDy) {
				sh = Math.min(maxDy-dy, imageHeight);
				canvas.drawImage(image, sx, sy, sw, sh, x, dy, dw, sh);
				dy = dy + sh;
			}
			break;
		}
		case WImage.DISPLAY_FIT_WIDTH: {
			var scale = dw/imageWidth;

			dx = (x + ox*scale);
			dy = (y + oy*scale);
			dw = (sw*scale);
			dh = (sh*scale);

			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);

			break;
		}
		case WImage.DISPLAY_FIT_HEIGHT: {
			var scale = dh/imageHeight;

			dx = (x + ox*scale);
			dy = (y + oy*scale);
			dw = (sw*scale);
			dh = (sh*scale);

			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);

			break;
		}
		default: {
			dx = x + ox;
			dy = y + oy;
			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, sw, sh);
			break;
		}
	}

	return;
}

window.WImage = WImage;


/*
 * File: widget.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: widget is base class of all ui element.
 * 
 * Copyright (c) 2011 - 2015	Li XianJing <xianjimli@hotmail.com>
 * 
 */
 
function WWidget() {
}

WWidget.STATE_NORMAL	  = "state-normal";
WWidget.STATE_ACTIVE	  = "state-active";
WWidget.STATE_OVER		  = "state-over";
WWidget.STATE_DISABLE     = "state-disable";
WWidget.STATE_DISABLE_SELECTED = "state-disable-selected";
WWidget.STATE_SELECTED         = "state-selected";
WWidget.STATE_NORMAL_CURRENT   = "state-normal-current";

WWidget.TYPE_NONE = 0;
WWidget.TYPE_USER = 13;
WWidget.TYPE_FRAME = "frame";
WWidget.TYPE_FRAMES = "frames";
WWidget.TYPE_TOOLBAR = "toolbar";
WWidget.TYPE_TITLEBAR= "titlebar";
WWidget.TYPE_MINIMIZE_BUTTON = "button.minimize";
WWidget.TYPE_FLOAT_MENU_BAR = "float-menubar";

WWidget.TYPE_POPUP = "popup";
WWidget.TYPE_DIALOG = "dialog";
WWidget.TYPE_DRAGGABLE_DIALOG = "draggable-dialog";
WWidget.TYPE_WINDOW = "window";
WWidget.TYPE_VBOX = "vbox";
WWidget.TYPE_HBOX = "hbox";
WWidget.TYPE_MENU = "menu";
WWidget.TYPE_MENU_BAR = "menu-bar";
WWidget.TYPE_MENU_BUTTON = "menubar.button";
WWidget.TYPE_GRID_ITEM = "grid-item";
WWidget.TYPE_MENU_ITEM = "menu.item";
WWidget.TYPE_MENU_BAR_ITEM = "menubar.item";
WWidget.TYPE_CONTEXT_MENU_ITEM = "contextmenu.item";
WWidget.TYPE_CONTEXT_MENU_BAR = "contextmenu-bar";
WWidget.TYPE_VSCROLL_BAR = "vscroll-bar";
WWidget.TYPE_HSCROLL_BAR = "hscroll-bar";
WWidget.TYPE_SCROLL_VIEW = "scroll-view";
WWidget.TYPE_GRID_VIEW = "grid-view";
WWidget.TYPE_LIST_VIEW = "list-view";
WWidget.TYPE_LIST_ITEM = "list-item";
WWidget.TYPE_LIST_ITEM_RADIO = "list-item-radio";
WWidget.TYPE_IMAGE_VIEW = "image-view";
WWidget.TYPE_TREE_VIEW = "tree-view";
WWidget.TYPE_TREE_ITEM = "tree-item";
WWidget.TYPE_ACCORDION = "accordion";
WWidget.TYPE_ACCORDION_ITEM = "accordion-item";
WWidget.TYPE_ACCORDION_TITLE = "accordion-title";
WWidget.TYPE_PROPERTY_TITLE = "property-title";
WWidget.TYPE_PROPERTY_SHEET = "property-sheet";
WWidget.TYPE_PROPERTY_SHEETS = "property-sheets";
WWidget.TYPE_VIEW_BASE = "view-base";
WWidget.TYPE_COMPONENT_MENU_ITEM = "menuitem.component";
WWidget.TYPE_WINDOW_MENU_ITEM = "menuitem.window";
WWidget.TYPE_MESSAGE_BOX = "messagebox";
WWidget.TYPE_IMAGE_TEXT = "icon-text";
WWidget.TYPE_BUTTON = "button";
WWidget.TYPE_KEY_VALUE = "key-value";
WWidget.TYPE_LABEL = "label";
WWidget.TYPE_LINK = "link";
WWidget.TYPE_EDIT = "edit";
WWidget.TYPE_TEXT_AREA = "text-area";
WWidget.TYPE_COMBOBOX = "combobox";
WWidget.TYPE_SLIDER = "slider";
WWidget.TYPE_PROGRESSBAR = "progressbar";
WWidget.TYPE_RADIO_BUTTON = "radio-button";
WWidget.TYPE_CHECK_BUTTON = "check-button";
WWidget.TYPE_COLOR_BUTTON = "color-button";
WWidget.TYPE_COLOR_TILE = "color-tile";
WWidget.TYPE_TAB_BUTTON = "tab-button";
WWidget.TYPE_TAB_CONTROL = "tab-control";
WWidget.TYPE_TAB_BUTTON_GROUP = "tab-button-group";
WWidget.TYPE_TIPS = "tips";
WWidget.TYPE_HLAYOUT = "h-layout";
WWidget.TYPE_VLAYOUT = "v-layout";
WWidget.TYPE_BUTTON_GROUP = "button-group";
WWidget.TYPE_COMBOBOX_POPUP = "combobox-popup";
WWidget.TYPE_COMBOBOX_POPUP_ITEM = "combobox-popup-item";
WWidget.TYPE_COLOR_EDIT = "color-edit";
WWidget.TYPE_RANGE_EDIT = "range-edit";
WWidget.TYPE_FILENAME_EDIT = "filename-edit";
WWidget.TYPE_FILENAMES_EDIT = "filenames-edit";
WWidget.TYPE_CANVAS_IMAGE = "canvas-image";
WWidget.TYPE_ICON_BUTTON = "icon-button";

WWidget.BORDER_STYLE_NONE   = 0;
WWidget.BORDER_STYLE_LEFT   = 1;
WWidget.BORDER_STYLE_RIGHT  = 2;
WWidget.BORDER_STYLE_TOP    = 4;
WWidget.BORDER_STYLE_BOTTOM = 8;
WWidget.BORDER_STYLE_ALL    = 0xffff;

WWidget.prototype = {};
WWidget.prototype.init = function(parent, x, y, w, h) {
	this.text = "";
	this.tag = null;
	this.tips = null;
	this.enable = true;
	this.visible = true; 
	this.parent = parent;
	this.checkEnable = null;

	this.children = [];
	this.point = {x:0, y:0};
	this.rect  = {x:x, y:y, w:w, h:h};
	this.setState(WWidget.STATE_NORMAL);
	this.imageDisplay = WImage.DISPLAY_9PATCH;
	this.borderStyle = WWidget.BORDER_STYLE_ALL;
	this.cursor = "default";

	if(this.parent) {
		var border = parent.border ? parent.border : 0;
		var pw = parent.rect.w - 2 * border;
		var ph = parent.rect.h - 2 * border;

		if(x > 0 && x < 1) {
			this.rect.x = pw * x + border;
		}
		if(w > 0 && w <= 1) {
			this.rect.w = pw * w;
		}
		if(y > 0 && y < 1) {
			this.rect.y = ph * y + border;
		}
		if(h > 0 && h <= 1) {
			this.rect.h = ph * h;
		}
		
		parent.appendChild(this);
	}

	return this;
}

WWidget.prototype.useTheme = function(type) {
	this.themeType = type;

	return this;
}

WWidget.prototype.isSelected = function() {
	return this.selected;
}

WWidget.prototype.setSelected = function(value) {
	this.selected = value;

	return this;
}

WWidget.prototype.setSelectable = function(selectable) {
	this.selectable = selectable;

	return true;
}

WWidget.prototype.setNeedRelayout = function(value) {
	this.needRelayout = value;

	return;
}

WWidget.prototype.onAppendChild = function(child) {
}

WWidget.prototype.appendChild = function(child) {
	child.parent = this;
	this.children.push(child);
	this.onAppendChild(child);
	this.needRelayout = true;

	return;
}

WWidget.prototype.getWindowManager = function() {
	return WWindowManager.getInstance();
}

WWidget.prototype.getFrameRate = function() {
	return WWindowManager.getInstance().getFrameRate();
}

WWidget.prototype.showFPS = function(maxFpsMode) {
	return WWindowManager.getInstance().showFPS(maxFpsMode);
}

WWidget.prototype.isPointerDown = function() {
	return WWindowManager.getInstance().isPointerDown();
}

WWidget.prototype.isClicked = function() {
	var win = this.getWindow();
	if(win) {
		return win.isClicked();
	}
	else {
		return WWindowManager.getInstance().isClicked();
	}
}

WWidget.prototype.isAltDown = function() {
	return WWindowManager.getInstance().isAltDown();
}

WWidget.prototype.isCtrlDown = function() {
	return WWindowManager.getInstance().isCtrlDown();
}

WWidget.prototype.getApp = function() {
	return WWindowManager.getInstance().getApp();
}

WWidget.prototype.getCanvas2D = function() {
	return this.getWindow().getCanvas2D();
}

WWidget.prototype.getCanvas = function() {
	return this.getWindow().getCanvas();
}

WWidget.prototype.getLastPointerPoint = function() {
	return WWindowManager.getInstance().getLastPointerPoint();
}

WWidget.prototype.getTopWindow = function() {
	 return this.getWindow();
}

WWidget.prototype.getWindow = function() {
	if(!this.parent) {
		return this;
	}

	var p = this.parent;
	while(p.parent) {
		p = p.parent;
	}

	return p;
}

WWidget.prototype.getParent = function() {
	return this.parent;
}

WWidget.prototype.getX = function() {
	return this.rect.x;
}

WWidget.prototype.getY = function() {
	return this.rect.y;
}

WWidget.prototype.getWidth = function() {
	return this.rect.w;
}

WWidget.prototype.getHeight = function() {
	return this.rect.h;
}

WWidget.prototype.getPositionInView = function() {
	var x = this.getX();
	var y = this.getY();
	var point = {x:0, y:0};
	var iter = this.getParent();

	while(iter != null) {
		x += iter.getX();
		y += iter.getY();
		if(iter.isScrollView) {
			x = x - iter.xOffset;
			y = y - iter.yOffset;
		}
		iter = iter.getParent();
	}

	point.x = x;
	point.y = y;

	return point;
}

WWidget.prototype.getAbsPosition =  function() {
	var x = this.rect.x;
	var y = this.rect.y;

	for(var parent = this.parent; parent; parent = parent.parent) {
		x = x + parent.rect.x;
		y = y + parent.rect.y;
	}
	
	return {x: x, y: y};
}

WWidget.prototype.getPositionInWindow =  function() {
	var x = 0;
	var y = 0;

	if(this.parent) {
		for(var iter = this; iter !== null; iter = iter.parent) {
			if(!iter.parent) {
				break;
			}

			x = x + iter.rect.x;
			y = y + iter.rect.y;
		}
	}

	return {x: x, y: y};
}

WWidget.prototype.translatePoint = function(point) {
	var p = this.getAbsPosition();

	return {x:point.x - p.x, y: point.y - p.y};
}

WWidget.prototype.postRedrawAll = function() {
	WWindowManager.getInstance().postRedraw(null);

	return;
}

WWidget.prototype.postRedraw = function(rect) {
	WWindowManager.getInstance().postRedraw(null);
	
	return;
}

WWidget.prototype.redraw = function(rect) {
	var p = this.getAbsPosition();
	
	if(!rect) {
		rect = {x:0, y:0, w:this.rect.w, h:this.rect.h};
	}

	rect.x = p.x + rect.x;
	rect.y = p.y + rect.y;
	
	WWindowManager.getInstance().redraw(rect);
	
	return;
}

WWidget.prototype.isPointIn = function(point) {
	return isPointInRect(point, this.rect);
}

WWidget.prototype.findTargetWidgetEx = function(point, recursive) {
	 if(!this.visible || !this.isPointIn(point)) {
		return null;
	 }

	 if(recursive && this.children.length > 0) {
		  var n = this.children.length - 1;
		  var p = this.point;
		  p.x = point.x - this.rect.x;
		  p.y = point.y - this.rect.y;
		  
		  for(var i = n; i >= 0; i--) {
				var iter = this.children[i];
				var ret = iter.findTargetWidget(p);
				
				if(ret !== null) {
					 return ret;
				}
		  }
	 }
	 
	 return this;
}
	
WWidget.prototype.findTargetWidget = function(point) {
	 return this.findTargetWidgetEx(point, true);
}

WWidget.widgetsPool = {};

WWidget.getWidget = function(type) {
	var widgets = WWidget.widgetsPool[type];
	if(widgets && widgets.length) {
		return widgets.pop();
	}

	return null;
}

WWidget.putWidget = function(widget) {
	if(widget) {
		var type = widget.type;
		var widgets = WWidget.widgetsPool[type];
		if(!widgets) {
			WWidget.widgetsPool[type] = [];
			widgets = WWidget.widgetsPool[type];
		}
		delete widget.selectable;

		widget.themeType = null;
		widget.userData = null;
		widget.handleGesture = null;
		widget.handleClicked = null;
		widget.handleLongPressed = null;
		widget.handleDoubleClicked = null;
		widget.handleContextMenu = null;
		widget.handleKeyUp = null;
		widget.handleKeyDown = null;
		widget.handleWheel = null;
		widget.onChanged = null;
		widget.onChange = null;
		widget.onMoved = null;
		widget.onSized = null;
		widget.clickedHandler = null;
		widget.removedHandler = null;
		widget.stateChangedHandler = null;

		if(widget.onBeforePaint) {
			widget.onBeforePaint = null;
		}
		if(widget.onAfterPaint) {
			widget.onAfterPaint = null;
		}
		if(widget.onGetText) {
			widget.onGetText = null;
		}
		widgets.push(widget);
	}

	return;
}

WWidget.prototype.setRemovedHandler = function(removedHandler) {
	this.removedHandler = removedHandler;
	
	return this;
}


WWidget.prototype.onRemoved = function() {
	if(this.removedHandler) {
		this.removedHandler();
	}

	return;
}

WWidget.prototype.removeChild = function(child) {
	child.remove();

	return this;
}

WWidget.prototype.remove = function() {
	var parent = this.parent;
	if(parent) {
		parent.children.remove(this);
		if(parent.target === this) {
			parent.target = null;
		}

		this.parent = null;
		this.onRemoved();
		parent.setNeedRelayout(true);
	}

	return this;
}

WWidget.prototype.cleanUp = function() {
}

WWidget.prototype.destroy = function() {
	if(this.children.length) {
		this.destroyChildren();
	}

	this.remove();
	this.cleanUp();

	WWidget.putWidget(this);

	return;
}

WWidget.prototype.destroyChildren = function() {
	var n = this.children.length;
	for(var i = 0; i < n; i++) {
		var iter = this.children[0];
		iter.destroy();
	}
	this.target = null;
	this.children.length = [];
	this.setNeedRelayout(true);

	return;
}

WWidget.prototype.forEachChild = function(onVisit) {
	var n = this.children.length;
	for(var i = 0; i < n; i++) {
		var iter = this.children[i];
		onVisit(iter);
	}

	return;
}

WWidget.prototype.setTextOf = function(name, text, notify) {
	var child = this.lookup(name, true);

	if(child) {
		child.setText(text, notify);
	}
	else {
		console.log("not found " + name);
	}

	return child;
}

WWidget.prototype.setValueOf = function(name, value, notify) {
	var child = this.lookup(name, true);

	if(child) {
		child.setValue(value, notify);
	}
	else {
		console.log("not found " + name);
	}

	return child;
}

WWidget.prototype.setVisibleOf = function(name, value) {
	var child = this.lookup(name, true);

	if(child) {
		child.setVisible(value);
	}
	else {
		console.log("not found " + name);
	}

	return child;
}

WWidget.prototype.setValue = function(value) {
	return this.setText(value);
}

WWidget.prototype.getValue = function() {
	return this.getText();
}

WWidget.prototype.setText = function(text) {
	this.text = (text || text === 0) ? text.toString() : "";
	this.setNeedRelayout(true);

	return this;
}

WWidget.prototype.getText = function() {
	if(this.onGetText) {
		return this.onGetText();
	}

	return this.text;
}

WWidget.prototype.setTips = function(tips) {
	this.tips = tips;

	return this;
}

WWidget.prototype.getTips = function() {
	return this.tips;
}

WWidget.prototype.setInputTips = function(tips) {
	this.inputTips = tips;

	return this;
}

WWidget.prototype.getInputTips = function() {
	return this.inputTips;
}

WWidget.prototype.drawInputTips = function(canvas) {
	var h = this.rect.h;
	var w = this.rect.w;
	var y = this.rect.h >> 1;
	var x = this.leftMargin || 2;
	var text = this.getText();
	var inputTips = this.getInputTips();
	
	if(text || !inputTips || this.type !== WWidget.TYPE_EDIT || this.editing) {
		return;	
	}

	var style = this.getStyle();
	canvas.save();
	canvas.font = style.font;
	canvas.fillStyle = "#E0E0E0";

	canvas.beginPath();
	canvas.rect(0, 0, w - x, h);
	canvas.clip();

	canvas.textAlign = 'left';
	canvas.textBaseline = 'middle';
	canvas.fillText(inputTips, x, y);

	canvas.restore();

	return;
}

WWidget.prototype.drawTips = function(canvas) {
	var tips = this.getTips();
	if(tips) {
		var style = this.getStyle();
		var x = this.rect.w >> 1;
		var y = this.rect.h >> 1;
		var font = style.tipsFont || style.font;
		var textColor = style.tipsTextColor || style.textColor;

		if(font && textColor) {
			canvas.textAlign = "center";
			canvas.textBaseline = "middle";
			canvas.font = font;
			canvas.fillStyle = textColor;
			canvas.fillText(tips, x, y);
		}
	}

	return this;
}

WWidget.prototype.setID = function(id) {
	 this.id = id;
	 
	 return this;
}

WWidget.prototype.getID = function() {
	return this.id;
}

WWidget.prototype.setName = function(name) {
	 this.name = name;
	 
	 return this;
}

WWidget.prototype.getName = function() {
	return this.name;
}

WWidget.prototype.setTag = function(tag) {
	 this.tag = tag;
	 
	 return this;
}

WWidget.prototype.getTag = function() {
	return this.tag;
}

WWidget.prototype.setUserData = function(userData) {
	 this.userData = userData;
	 
	 return this;
}

WWidget.prototype.getUserData = function() {
	return this.userData;
}

WWidget.prototype.setEnable = function(value) {
	this.enable = value;

	return this;
}

WWidget.prototype.changeCursor = function() {
	var canvas = this.getCanvas();
	if(canvas.style.cursor !== this.cursor) {
		canvas.style.cursor = this.cursor;
	}

	return this;
}

WWidget.prototype.onStateChanged = function(state) {
	if(this.stateChangedHandler) {
		this.stateChangedHandler(state);
	}

	if(state === WWidget.STATE_OVER || state === WWidget.STATE_ACTIVE) {
		this.changeCursor();
	}

	return this;
}

WWidget.prototype.setState = function(state, recursive) {
	if(this.state !== state) {
		this.state = state;
		this.onStateChanged(state);
		if(state === WWidget.STATE_OVER) {
			WWindowManager.getInstance().setTipsWidget(this);
		}
	}

	if(recursive && this.target) {
		this.target.setState(state, recursive);
	}

	return this;
}

WWidget.prototype.measure = function(canvas) {
	 return;
}

WWidget.prototype.move = function(x, y) {
	this.rect.x = x;
	this.rect.y = y;
	if(this.onMoved) {
		this.onMoved();
	}

	return this;
}

WWidget.prototype.moveToCenter = function(moveX, moveY) {
	var pw = this.parent.rect.w;
	var ph = this.parent.rect.h;

	if(moveX) {
		this.rect.x = (pw - this.rect.w) >> 1;
	}

	if(moveY) {
		this.rect.y = (ph - this.rect.h) >> 1;
	}

	return this;
}

WWidget.prototype.moveToBottom = function(border) {
	var ph = this.parent.rect.h;

	this.rect.y = ph - this.rect.h - border;

	return this;
}

WWidget.prototype.moveDelta = function(dx, dy) {
	this.rect.x = this.rect.x + dx;
	this.rect.y = this.rect.y + dy;
	if(this.onMoved) {
		this.onMoved();
	}

	return this;
}

WWidget.prototype.resize = function(w, h) {
	this.rect.w = w;
	this.rect.h = h;
	if(this.onSized) {
		this.onSized();
	}
	this.setNeedRelayout(true);

	return this;
}

WWidget.prototype.setStateChangedHandler = function(stateChangedHandler) {
	 this.stateChangedHandler = stateChangedHandler;
	 
	 return this;
}

WWidget.prototype.setContextMenuHandler = function(contextMenuHandler) {
	this.handleContextMenu = contextMenuHandler;

	return this;
}

WWidget.prototype.setClickedHandler = function(clickedHandler) {
	 this.clickedHandler = clickedHandler;
	 
	 return this;
}

WWidget.prototype.setKeyDoneHandler = function(handleKeyDown) {
	this.handleKeyDown = handleKeyDown;

	return this;
}

WWidget.prototype.setKeyUpHandler = function(handleKeyUp) {
	this.handleKeyUp = handleKeyUp;

	return this;
}

WWidget.prototype.onClicked = function(point) {
	if(this.handleClicked) {
		this.handleClicked(point);
	}

	if(this.clickedHandler) {
		this.clickedHandler(this, point);
	}

	this.postRedraw();

	return this.clickedHandler != null;
}

WWidget.prototype.lookup = function(id, recursive) {
	var n = this.children.length;
	for(var i = 0; i < n; i++) {
		var iter = this.children[i];	
		if(iter.id === id) {
			return iter;
		}
	}

	if(recursive) {
		for(var i = 0; i < n; i++) {
			var iter = this.children[i];	
			var ret = iter.lookup(id, recursive);
			if(ret) {
				return ret;
			}
		}
	}

	return null;
}

WWidget.prototype.onRelayout = function(canvas, force) {
}

WWidget.prototype.relayout = function(canvas, force) {
	if((!this.needRelayout && !force) || !this.children.length) {
		return this;
	}
	
	this.onRelayout(canvas, force);
	this.needRelayout = false;

	return this;
}

WWidget.prototype.setLineWidth = function(lineWidth) {
	this.lineWidth = lineWidth;

	return this;
}

WWidget.prototype.getLineWidth = function(style) {
	return this.lineWidth ? this.lineWidth : style.lineWidth;
}

WWidget.prototype.setRoundRadius = function(roundRadius) {
	this.roundRadius = roundRadius;

	return this;
}

WWidget.prototype.ensureTheme = function() {
	if(this.themeType) {
		this.theme = WThemeManager.get(this.themeType);
	}
	else {
		this.theme = WThemeManager.get(this.type);
	}

	return this;
}

WWidget.prototype.getStyle = function(_state) {
	var style = null;
	this.ensureTheme();
	var state = _state ? _state : this.state;

	if(!this.enable) {
		if(this.selectable && this.isSelected()) {
			style = this.theme[WWidget.STATE_DISABLE_SELECTED];
		}
		else {
			style = this.theme[WWidget.STATE_DISABLE];
		}
	}
	else {
		if(this.selectable && this.selected) {
			style = this.theme[WWidget.STATE_SELECTED];
		}
		else if(state === WWidget.STATE_OVER) {
			style = this.theme[WWidget.STATE_OVER];
		}
		else if(state === WWidget.STATE_ACTIVE) {
			style = this.theme[WWidget.STATE_ACTIVE];
		}
		else {
			style = this.theme[WWidget.STATE_NORMAL];
		}
	}
	
	if(!style) {
		style = this.theme[WWidget.STATE_NORMAL];
	}

	return style;
}

WWidget.prototype.setImageDisplay = function(imageDisplay) { 
	this.imageDisplay = imageDisplay;

	return this;
}

WWidget.prototype.setBorderStyle = function(borderStyle) {
	this.borderStyle = borderStyle;

	return this;;
}

WWidget.prototype.paintBackground = function(canvas) {
	var style =  this.getStyle();
	if(style) {
		if(style.bgImage) {
			this.paintBackgroundImage(canvas, style);
		}
		else {
			this.paintBackgroundColor(canvas, style);
		}
	}
}

WWidget.prototype.paintBackgroundImage = function(canvas, style) {
	var dst  = this.rect;
	var image = style.bgImage.getImage();
	var src = style.bgImage.getImageRect();
	var imageDisplay = style.imageDisplay ? style.imageDisplay : this.imageDisplay;

	if(image) {
		var topOut = style.topOut ? style.topOut : 0;
		var leftOut = style.leftOut ? style.leftOut : 0;
		var rightOut = style.rightOut ? style.rightOut : 0;
		var bottomOut = style.bottomOut ? style.bottomOut : 0;

		var x = -leftOut;
		var y = -topOut;
		var w = dst.w + rightOut + leftOut;
		var h = dst.h + bottomOut + topOut;

		style.bgImage.draw(canvas, imageDisplay, x, y, w, h, src);
	}
}

WWidget.prototype.paintLeftBorder = function(canvas, w, h) {
	canvas.beginPath();
	canvas.moveTo(0, 0);
	canvas.lineTo(0, h);
	canvas.stroke();
}

WWidget.prototype.paintRightBorder = function(canvas, w, h) {
	canvas.beginPath();
	canvas.moveTo(w, 0);
	canvas.lineTo(w, h);
	canvas.stroke();
}

WWidget.prototype.paintTopBorder = function(canvas, w, h) {
	canvas.beginPath();
	canvas.moveTo(0, 0);
	canvas.lineTo(w, 0);
	canvas.stroke();
}

WWidget.prototype.paintBottomBorder = function(canvas, w, h) {
	canvas.beginPath();
	canvas.moveTo(0, h);
	canvas.lineTo(w, h);
	canvas.stroke();
}

WWidget.prototype.paintBackgroundColor = function(canvas, style) {
	var dst  = this.rect;

	canvas.beginPath();
	if(this.roundRadius || style.roundRadius) {
		var roundRadius = Math.min((dst.h >> 1) - 1, style.roundRadius || this.roundRadius);
		drawRoundRect(canvas, dst.w, dst.h, roundRadius);	
	}
	else {
		canvas.rect(0, 0, dst.w, dst.h);
	}
	
	if(style.fillColor) {
		canvas.fillStyle = style.fillColor;
		canvas.fill();
	}

	var lineWidth = this.getLineWidth(style);
	if(!lineWidth || !style.lineColor || this.borderStyle === WWidget.BORDER_STYLE_NONE) {
		return;
	}

	var w = this.getWidth();
	var h = this.getHeight();
	canvas.lineWidth = lineWidth;
	canvas.strokeStyle = style.lineColor;
	if(this.borderStyle === WWidget.BORDER_STYLE_ALL) {
		canvas.stroke();
		canvas.beginPath();
		return;
	}
	
	if(this.borderStyle & WWidget.BORDER_STYLE_LEFT) {
		this.paintLeftBorder(canvas, w, h);
	}

	if(this.borderStyle & WWidget.BORDER_STYLE_RIGHT) {
		this.paintRightBorder(canvas, w, h);
	}
	
	if(this.borderStyle & WWidget.BORDER_STYLE_TOP) {
		this.paintTopBorder(canvas, w, h);
	}
	
	if(this.borderStyle & WWidget.BORDER_STYLE_BOTTOM) {
		this.paintBottomBorder(canvas, w, h);
	}
	canvas.beginPath();
	
	return;
}

WWidget.prototype.paintSelf = function(canvas) {
	 return this;
}

WWidget.prototype.beforePaint = function(canvas) {
	if(this.onBeforePaint) {
		this.onBeforePaint(canvas);
	}
	return this;
}

WWidget.prototype.afterPaint = function(canvas) {
	if(this.onAfterPaint) {
		this.onAfterPaint(canvas);
	}
	return this;
}

WWidget.prototype.setPaintFocusLater = function(paintFocusLater) {
	this.paintFocusLater = paintFocusLater;

	return this;
}

WWidget.prototype.paintChildren = function(canvas) {
	if(this.paintFocusLater) {
		this.paintChildrenFocusLater(canvas);
	}
	else {
		this.paintChildrenDefault(canvas);
	}

	return this;
}

WWidget.prototype.paintChildrenDefault = function(canvas) {
	var n = this.children.length;
	for(var i = 0; i < n; i++) {
		var iter = this.children[i];
		iter.draw(canvas);
	}

	return;
}

WWidget.prototype.paintChildrenFocusLater = function(canvas) {
	var focusChild = null;
	var n = this.children.length;
	for(var i = 0; i < n; i++) {
		var iter = this.children[i];
		var iterFocused = (iter.state === WWidget.STATE_OVER || iter.state === WWidget.STATE_ACTIVE);

		if(iterFocused) {
			focusChild = iter;
		}
		else {
			iter.draw(canvas);
		}
	}

	if(focusChild) {
		focusChild.draw(canvas);
	}

	return;
}

WWidget.prototype.ensureImages = function() {
	return;
}

WWidget.prototype.draw = function(canvas) {
	 if(!this.visible) {
		  return;
	 }

	if(this.checkEnable) {
		this.setEnable(this.checkEnable());
	}

	this.ensureImages();

	canvas.save();
	this.relayout(canvas, false);

	canvas.translate(this.rect.x, this.rect.y);
	this.beforePaint(canvas);
	this.paintBackground(canvas);
	this.paintSelf(canvas);
	this.paintChildren(canvas);	
	this.drawInputTips(canvas);
	this.afterPaint(canvas);
	canvas.closePath();
	canvas.restore();

	return;
}

WWidget.prototype.setVisible = function(visible) {
	this.visible = visible;

	return this;
}

WWidget.prototype.isVisible = function() {
	return this.visible;
}

WWidget.prototype.onShow = function(visible) {
	return true;
}

WWidget.prototype.show = function(visible) {
	var visible = !!visible;
	if(visible != this.visible) {
		this.visible = visible;
		this.onShow(visible);
	}

	return this;
}

WWidget.prototype.showAll = function(visible) {
	var n = this.children.length;
	
	this.show(visible);
	for(var i = 0; i < n; i++) {
		var iter = this.children[i];
		iter.showAll(visible);
	}
	
	if(!this.parent) {
		this.postRedraw();
	}
	
	return this;
}

WWidget.prototype.selectAllChildren = function(selected) {
	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		if(iter.checkable) {
			iter.setChecked(selected);
		}
	}

	return this;
}

WWidget.prototype.closeWindow = function(retInfo) {
	this.getWindow().close(retInfo);

	return this;
}
	
WWidget.prototype.findTarget = function(point) {
	var p = this.getAbsPosition();
	this.point.x = point.x - p.x;
	this.point.y = point.y - p.y;
	var n = this.children.length;	
	if(n > 0) {
		for(var i = n - 1; i >= 0; i--) {
			var iter = this.children[i];

			if(!iter.visible) {
				continue;
			}

			if(isPointInRect(this.point, iter.rect)) {
				return iter;
			}
		}
	}

	return null;
}

////////////////////////////////////////////
WWidget.prototype.onPointerDown = function(point) {
	if(!this.enable) return false;
	
	var target = this.findTarget(point);
	if(this.target !== target) {
		if(this.target) {
			this.target.setState(WWidget.STATE_NORMAL);
		}
	}

	if(target) {
		target.setState(WWidget.STATE_ACTIVE);
		target.onPointerDown(point);
	}
	else {
		this.changeCursor();
	}

	this.target = target;
	this.postRedraw();

	return true;
}

WWidget.prototype.onPointerMove = function(point) {
	if(!this.enable) return false;

	this.pointerOverr = isPointInRect(point, this.rect);
	var target = this.isPointerDown() ? this.target : this.findTarget(point);

	if(this.target !== target) {
		if(this.target) {
			this.target.setState(WWidget.STATE_NORMAL, true);
		}
	}

	if(target) {
		if(this.isPointerDown()) {
			target.setState(WWidget.STATE_ACTIVE);
		}
		else {
			target.setState(WWidget.STATE_OVER);
		}
		target.onPointerMove(point);
	}
	else {
		this.changeCursor();
	}
	
	this.target = target;
	this.postRedraw();

	return true;
}

WWidget.prototype.onPointerUp = function(point) {
	if(!this.enable) return false;
	
	var target = this.findTarget(point);
	if(this.target !== target) {
		if(this.target) {
			this.target.setState(WWidget.STATE_NORMAL);
			this.target.onPointerUp(point);
		}
	}
	
	if(target) {
		target.setState(WWidget.STATE_OVER);
		target.onPointerUp(point);
	}
	else {
		this.changeCursor();
	}
		
	if(this.isClicked()) {
		try {
			this.onClicked(point);
		}catch(e) {
			console.debug('stack:', e.stack);
			console.debug("this.onClicked:" + e.message);
		}
	}

	this.target = target;
	this.postRedraw();

	return true;
}

WWidget.prototype.onKeyDown = function(code) {
	if(this.target) {
		this.target.onKeyDown(code);
	}

	if(this.handleKeyDown) {
		this.handleKeyDown(code);
	}

	console.log("onKeyDown WWidget:" + this.type + " code=" + code)
	return;
}

WWidget.prototype.onKeyUp = function(code) {
	if(this.target) {
		this.target.onKeyUp(code);
	}
	
	if(this.handleKeyUp) {
		this.handleKeyUp(code);
	}
	console.log("onKeyUp WWidget:" + this.type + " code=" + code)
	return;
}	

WWidget.prototype.onWheel = function(delta) {
	if(this.target) {
		return this.target.onWheel(delta);
	}

	if(this.handleWheel) {
		return this.handleWheel(delta);
	}

	return false;
}


WWidget.prototype.onDoubleClick = function(point) {
	var target = null;

	if(this.grabWidget) {
		target = this.grabWidget;
	}
	else {
		target = this.findTarget(point);
	}
	 
	if(target) {
		target.onDoubleClick(point);
		this.target = target;
	}

	if(this.state !== WWidget.STATE_DISABLE && this.handleDoubleClicked) {
		this.handleDoubleClicked(point);
	}
	
	return;
}

WWidget.prototype.onContextMenu = function(point) {
	var target = this.findTarget(point);

	if(target) {
		target.onContextMenu(point);
		this.target = target;
	}

	if(this.state !== WWidget.STATE_DISABLE && this.handleContextMenu) {
		this.handleContextMenu(point);
	}

	return;
}

WWidget.prototype.onLongPress = function(point) {
	var target = this.findTarget(point);
	 
	 if(target) {
		  target.onLongPress(point);
		  this.target = target;
	 }
	
	if(this.state !== WWidget.STATE_DISABLE && this.handleLongPressed) {
		this.handleLongPressed(point);
	}

	return;
}

WWidget.prototype.onGesture = function(gesture) {
	var target = this.findTarget(point);

	if(target) {
		 target.onGesture(gesture);
	}

	if(this.state !== WWidget.STATE_DISABLE && this.handleGesture) {
		this.handleGesture(gesture);
	}

	return;
}

WWidget.prototype.setCursor = function(cursor) {
	this.cursor = cursor;

	return this;
}

WWidget.canvasPool = [];
WWidget.resizeCanvas = function(canvas, w, h) {
    canvas.width = w;
    canvas.height = h;
}

WWidget.getCanvas = function(x, y, w, h, zIndex) {
	var canvas = null;
	if(WWidget.canvasPool.length) {
		canvas = WWidget.canvasPool.pop();
	}
	else {
		canvas = document.createElement('canvas');
	}
    
    WWidget.resizeCanvas(canvas, w, h);
	canvas.style.position = "absolute";
	canvas.style.opacity = 1;
	canvas.style.left = x + "px";
	canvas.style.top = y + "px";
	canvas.style.width = w + "px";
	canvas.style.height = h + "px";
	canvas.style.zIndex = zIndex;

	return canvas;
}

WWidget.putCanvas = function(canvas) {
	canvas.style.zIndex = -1;
	canvas.style.opacity = 0;
	WWidget.canvasPool.push(canvas);
}

WWidget.tipsCanvas = null;
WWidget.getTipsCanvas = function(x, y, w, h, zIndex) {
	if(!WWidget.tipsCanvas) {
		WWidget.tipsCanvas = WWidget.getCanvas(x, y, w, h, zIndex);
		document.body.appendChild(WWidget.tipsCanvas);
	}

	var canvas = WWidget.tipsCanvas;

	canvas.width = w;
	canvas.height = h;
	canvas.style.position = "absolute";
	canvas.style.opacity = 1;
	canvas.style.left = x + "px";
	canvas.style.top = y + "px";
	canvas.style.width = w + "px";
	canvas.style.height = h + "px";
	canvas.style.zIndex = zIndex;

	return canvas;
}

WWidget.hideTipsCanvas = function() {
	var canvas = WWidget.tipsCanvas;
	if(canvas) {
		canvas.style.zIndex = -1;
	}
}
/*
 * File: theme.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: cantk theme.
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function WThemeManager() {
}

WThemeManager.newStyle = function(font, fillColor, textColor, lineColor, bgImage) {
	var style = {};

	if(font) {
		style.font = font;
	}

	if(bgImage) {
		style.bgImage = bgImage;
	}

	if(fillColor) {
		style.fillColor = fillColor;
	}

	if(textColor) {
		style.textColor = textColor;
	}

	if(lineColor) {
		style.lineColor = lineColor;
	}

	return style;
}

WThemeManager.newTheme = function() {
	var theme = {};

	theme[WWidget.STATE_NORMAL]  = WThemeManager.newStyle("13pt bold sans-serif ", null, "#000000", "#000000");
	theme[WWidget.STATE_ACTIVE]  = WThemeManager.newStyle("13pt bold sans-serif ", null, "#000000");
	theme[WWidget.STATE_OVER]    = WThemeManager.newStyle("13pt bold sans-serif ", null, "#000000");
	theme[WWidget.STATE_DISABLE] = WThemeManager.newStyle("13pt bold sans-serif ", null, "Gray");
	theme[WWidget.STATE_SELECTED]= WThemeManager.newStyle("13pt bold sans-serif ", null, "Gray");

	return theme;
}

WThemeManager.themes = {};
WThemeManager.imagesURL = null;
WThemeManager.defaultTheme = WThemeManager.newTheme();
WThemeManager.themeURL = "/ide/theme/default/theme.json";

WThemeManager.setImagesURL = function(imagesURL) {
	WThemeManager.imagesURL = imagesURL;

	return;
}

WThemeManager.getIconImageURL = function() {
	return WThemeManager.imagesURL;
}

WThemeManager.getImageURL = function() {
	return WThemeManager.imagesURL;
}

WThemeManager.imagesCache = {};
WThemeManager.createImage = function(url) {
	var image = WThemeManager.imagesCache[url];
	if(!image) {
		image = WImage.create(url);
	}

	return image;
}

WThemeManager.getIconImage = function(name) {
	if(name.endWith(".png")) {
		return WThemeManager.getImage(name);
	}
	else {
		return WThemeManager.getImage(name + ".png");
	}
}

WThemeManager.getBgImage = function(name) {
	return this.getImage(name);
}

WThemeManager.getImage = function(name) {
	if(!WThemeManager.imagesURL) {
		return null;
	}
	
	var url = WThemeManager.imagesURL + "#" + name;
	return this.createImage(url);
}

WThemeManager.setTheme = function(theme) {
	WebStorage.set("wtkTheme", theme);
	location.href = location.href;

	return;
}

WThemeManager.getThemeURL = function() {
	var themeURL = getQueryParameter("theme-url");
	if(themeURL) {
		return themeURL;
	}
	
	var theme = getQueryParameter("theme");
	if(theme) {
		return "/ide/images/"+theme+"/theme.json";
	}

	var wtkTheme = WebStorage.get("wtkTheme");
	if(wtkTheme) {
		return "/ide/images/"+wtkTheme+"/theme.json";
	}

	return WThemeManager.themeURL;
}

WThemeManager.getDefaultFont = function(themeJson) {
	var font = null;
	var global = themeJson.global;
	if(global && global.font) {
		if(browser.isWindows()) {
			font = global.font.windows;
		}
		else if(browser.isLinux()) {
			font = global.font.linux;
		}
		else if(browser.isMacOSX()) {
			font = global.font.macosx;
		}
	}

	return font;
}

WThemeManager.applyDefaultFont = function(style, defaultFont) {
	var font = style.font || {};
	
	if(defaultFont) {
		if(!font.family) {
			font.family = defaultFont.family || "sans";
		}

		if(!font.size) {
			font.size = defaultFont.size || 10;
		}

		if(!font.weight) {
			font.weight = "normal";
		}
	}

	style.fontInfo = font;
	style.fontSize = font.size;
	style.font =font.weight + " " + font.size + "px " + font.family;
	
	return;
}

WThemeManager.loadTheme = function(themeURL, themeJson) {
	var path = dirname(themeURL);
	var imagesURL = path + "/" + (themeJson.imagesURL ? themeJson.imagesURL : "images.json");
	WThemeManager.setImagesURL(imagesURL);

	var font = WThemeManager.getDefaultFont(themeJson);
	var widgetsTheme = themeJson.widgets;

	for(var name in widgetsTheme) {
		var widgetTheme = widgetsTheme[name];
		for(var state in widgetTheme) {
			var style = widgetTheme[state];
			if(typeof style !== "object") continue;

			if(style.bgImage) {
				style.bgImage = WThemeManager.getImage(style.bgImage);
			}
			if(style.fgImage) {
				style.fgImage = WThemeManager.getImage(style.fgImage);
			}
			if(style.bgImageTips) {
				style.bgImageTips = WThemeManager.getImage(style.bgImageTips);
			}
			if(style.checkedImage) {
				style.checkedImage = WThemeManager.getImage(style.checkedImage);
			}
			if(style.uncheckedImage) {
				style.uncheckedImage = WThemeManager.getImage(style.uncheckedImage);
			}
			WThemeManager.applyDefaultFont(style, font);
		}
	}

	WThemeManager.themes = widgetsTheme;
	WThemeManager.themesLoaded = true;
	WThemeManager.jqueryTheme = themeJson.jqueryTheme;
	WThemeManager.codeEditorTheme = themeJson.codeEditorTheme;

	if(WThemeManager.overrideThemeData) {
		WThemeManager.mergeTheme(WThemeManager.overrideThemeData);
	}

	return;
}

WThemeManager.setOverrideThemeData = function(widgetsTheme) {
	if(WThemeManager.themesLoaded) {
		WThemeManager.mergeTheme(widgetsTheme);
	}else {
		WThemeManager.overrideThemeData = widgetsTheme;
	}

	return;
}

WThemeManager.mergeTheme = function(widgetsTheme) {
	for(var name in widgetsTheme) {
		var widgetTheme = widgetsTheme[name];
		for(var state in widgetTheme) {
			var style = widgetTheme[state];
			if(typeof style !== "object") continue;

			if(style.bgImage) {
				style.bgImage = WThemeManager.createImage(style.bgImage);
			}
			if(style.fgImage) {
				style.fgImage = WThemeManager.createImage(style.fgImage);
			}
			if(style.bgImageTips) {
				style.bgImageTips = WThemeManager.createImage(style.bgImageTips);
			}
			if(style.checkedImage) {
				style.checkedImage = WThemeManager.createImage(style.checkedImage);
			}
			if(style.uncheckedImage) {
				style.uncheckedImage = WThemeManager.createImage(style.uncheckedImage);
			}
			if(style.font) {
				style.fontSize = getFontSizeInFont(style.font);
				if(style.fontSize) {
					style.fontSize = 12;
				}
			}
		}
	
		WThemeManager.themes[name] = widgetsTheme[name]
	}

	return;
}

WThemeManager.getCodeEditorTheme = function() {
	return WThemeManager.codeEditorTheme;
}

WThemeManager.getJQueryTheme = function() {
	return WThemeManager.jqueryTheme;
}

WThemeManager.loadThemeURL = function(url) {
	if(!url) {
		url = WThemeManager.getThemeURL();
	}

	httpGetJSON(url, function onThemeData(themeJson) {
		WThemeManager.loadTheme(url, themeJson);
		var wm = WWindowManager.getInstance();
		if(wm) {
			wm.postRedraw();
		}
	});

	return;
}

WThemeManager.exist = function(name) {
	return WThemeManager.themes[name] != null;
}

WThemeManager.dump = function() {
	var str = JSON.stringify(WThemeManager.themes, null, "\t");
	console.log(str);

	return;
}

WThemeManager.get = function(name, noDefault) {
	name = name.toString();

	var theme = WThemeManager.themes[name];

	if(!theme) {
		if(noDefault) {
			WThemeManager.themes[name] = WThemeManager.newTheme();
			theme = WThemeManager.themes[name];
		}
		else {
			theme = WThemeManager.defaultTheme;
		}
	}

	return theme;
}

WThemeManager.set = function(name, state, font, textColor, fillColor, lineColor, bgImage) {
	if(state === null) {
		WThemeManager.setOneState(name, WWidget.STATE_NORMAL, font, textColor, fillColor, lineColor, bgImage);
		WThemeManager.setOneState(name, WWidget.STATE_ACTIVE, font, textColor, fillColor, lineColor, bgImage);
		WThemeManager.setOneState(name, WWidget.STATE_OVER, font, textColor, fillColor, lineColor, bgImage);
		WThemeManager.setOneState(name, WWidget.STATE_SELECTED, font, textColor, fillColor, lineColor, bgImage);
		WThemeManager.setOneState(name, WWidget.STATE_DISABLE, font, textColor, fillColor, lineColor, bgImage);
	}
	else {
		WThemeManager.setOneState(name, state, font, textColor, fillColor, lineColor, bgImage);
	}

	return;
}

WThemeManager.setOneState = function(name, state, font, textColor, fillColor, lineColor, bgImage) {
	name = name.toString();

	var theme = WThemeManager.themes[name];

	if(!theme) {
		theme = WThemeManager.newTheme();
		WThemeManager.themes[name] = theme;
	}

	if(font) {
		theme[state].font = font;
	}
	
	if(textColor) {
		theme[state].textColor = textColor;
	}

	if(bgColor) {
		theme[state].fillColor = bgColor;
	}

	if(lineColor) {
		theme[state].lineColor = lineColor;
	}

	if(bgImage) {
		theme[state].bgImage = bgImage;
	}

	return;
}

/*
 * File: window.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: window
 * 
 * Copyright (c) 2011 - 2015	Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016	Holaverse Inc.
 * 
 */
 
function WWindow() {
}

WWindow.prototype = new WWidget();
WWindow.prototype.init = function(manager, x, y, w, h) {
	this.type = this.type ? this.type : WWidget.TYPE_WINDOW;
	WWidget.prototype.init.call(this, null, x, y, w, h);
	
	this.grabWidget = null;
	this.manager = manager ? manager : WWindowManager.getInstance();

	var me = this;
	setTimeout(function() {
		me.manager.addWindow(me);
	}, 0);

	this.onClosed = null;
	this.closeHandler = null;
	this.pointerDownPosition = {x:0, y:0};
	this.pointerUpPosition = {x:0, y:0};
	this.pointerLastPosition = {x:0, y:0};

	return this;
}

WWindow.prototype.grab = function(widget) {
	this.grabWidget = widget;
	this.manager.grab(this);
	
	return this;
}

WWindow.prototype.ungrab = function() {
	this.grabWidget = null;
	this.manager.ungrab(this);
	
	return this;
}

WWindow.prototype.moveToCenter = function() {
	var view = cantkGetViewPort();
	var sw = Math.min(this.manager.w, view.width);
	var sh = Math.min(this.manager.h, view.height);
	
	var x = (sw - this.rect.w)/2;
	var y = (sh - this.rect.h)/2 + getScrollTop();

	this.rect.x = x;
	this.rect.y = y;
	
	return this;
}

WWindow.prototype.onPointerDown = function(point) {
	this.pointerDown = true;
	this.pointerDownPosition.x = point.x;
	this.pointerDownPosition.y = point.y;
	this.pointerLastPosition.x = point.x;
	this.pointerLastPosition.y = point.y;

	if(this.grabWidget) {
		this.grabWidget.onPointerDown(point);
	}
	else {
		WWidget.prototype.onPointerDown.call(this, point);
	}
	
	this.postRedraw();

	return;
}

WWindow.prototype.onPointerMove = function(point) {
	this.pointerLastPosition.x = point.x;
	this.pointerLastPosition.y = point.y;

	if(this.grabWidget) {
		this.grabWidget.onPointerMove(point);
	}
	else {
		WWidget.prototype.onPointerMove.call(this, point);
	}
	
	this.postRedraw();

	return;
}

WWindow.prototype.onPointerUp = function(point) {
	if(!this.pointerDown) {
//		return;
	}

	this.pointerUpPosition.x = point.x;
	this.pointerUpPosition.y = point.y;
	if(this.grabWidget) {
		this.grabWidget.onPointerUp(point);
	}
	else {
		WWidget.prototype.onPointerUp.call(this, point);
	}
	this.pointerDown = false;
	
	this.postRedraw();

	return;
}

WWindow.prototype.isClicked = function() {
	var dx = this.pointerLastPosition.x - this.pointerDownPosition.x;
	var dy = this.pointerLastPosition.y - this.pointerDownPosition.y;

	return Math.abs(dx) < 5 && Math.abs(dy) < 5;
}

WWindow.prototype.onContextMenu = function(point) {
	if(this.grabWidget) {
		this.grabWidget.onContextMenu(point);
	}
	else {
		WWidget.prototype.onContextMenu.call(this, point);
	}

	return;
}

WWindow.prototype.onKeyDown = function(code) {
	if(this.grabWidget) {
		 this.grabWidget.onKeyDown(code);
	}
	else {
		WWidget.prototype.onKeyDown.call(this, code);
	}

	return;
}

WWindow.prototype.onKeyUp = function(code) {
	if(this.grabWidget) {
		 this.grabWidget.onKeyUp(code);
	}
	else {
		WWidget.prototype.onKeyUp.call(this, code);
	}

	return;
}

WWindow.prototype.beforePaint = function(canvas) {
	canvas.beginPath();
	canvas.rect(0, 0, this.rect.w, this.rect.h);
	canvas.clip();
	canvas.beginPath();

	return;
}

WWindow.prototype.show = function(visible) {
	WWidget.prototype.show.call(this, visible);
	this.manager.setTopWindowAsTarget();
	
	return this;
}

WWindow.prototype.close = function(retInfo) {
	var me = this;
	setTimeout(function() {
		me.closeSync(retInfo);
	},10);

	return this;
}

WWindow.prototype.setCloseHandler = function(closeHandler) {
	this.closeHandler = closeHandler;

	return this;
}

WWindow.prototype.closeSync = function(retInfo) {
	if(this.onClosed) {
		this.onClosed(retInfo);
	}

	if(this.closeHandler) {
		this.closeHandler();
	}

	this.manager.ungrab(this);
	this.manager.removeWindow(this);
	this.destroy();

	return;
}

WWindow.prototype.getCanvas2D = function() {
	return WWindowManager.getInstance().getCanvas2D();
}

WWindow.prototype.getCanvas = function() {
	return WWindowManager.getInstance().getCanvas();
}

WWindow.create =  function(manager, x, y, w, h) {
	var win = new WWindow();

	return win.init(manager, x, y, w, h);
}
/*
 * File: web_storage.js 
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Web Storage
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */


function WebStorage()  {
}

WebStorage.nameSpace = "";
WebStorage.setNameSapce = function(nameSpace) {
	WebStorage.nameSpace = nameSpace;

	return;
}

WebStorage.getNameSapceKey = function(key) {	
	if(WebStorage.nameSpace) {
		return WebStorage.nameSpace +"-"+ key;
	}
	else {
		return key;
	}
}

WebStorage.getStorage = function() {
	if(window.localStorage) {
		return window.localStorage;
	}

	return {};
}

WebStorage.set = function(key, value, compress) {
	var storage = WebStorage.getStorage();
	
	key = WebStorage.getNameSapceKey(key);
	if(compress && !isIE()) {
		storage.setItem(key, strCompress(value));
	}
	else {
		storage.setItem(key, value);
	}

	return;
}

WebStorage.get = function(key, decompress) {
	var storage = WebStorage.getStorage();

	key = WebStorage.getNameSapceKey(key);
	if(decompress && !isIE()) {
		return strDecompress(storage.getItem(key));
	}
	else {
		return storage.getItem(key);
	}
}

WebStorage.remove = function(key) {
	var storage = WebStorage.getStorage();

	key = WebStorage.getNameSapceKey(key);
	storage.removeItem(key);

	return;
}

WebStorage.getInt = function(key) {
	var n = 0;
	var value = WebStorage.get(key);

	if(value) {
		n = parseInt(value);
	}
	
	return n;
}

//////////////////////////////////////////////////////

WebStorage.getSessionStorage = function() {
	if(window.sessionStorage) {
		return window.sessionStorage;
	}

	return {};
}

WebStorage.setSession = function(key, value, compress) {
	var storage = WebStorage.getSessionStorage();
	
	key = WebStorage.getNameSapceKey(key);
	if(compress && !isIE()) {
		storage.setItem(key, strCompress(value));
	}
	else {
		storage.setItem(key, value);
	}

	return;
}

WebStorage.getSession = function(key, decompress) {
	var storage = WebStorage.getSessionStorage();

	key = WebStorage.getNameSapceKey(key);
	if(decompress && !isIE()) {
		return strDecompress(storage.getItem(key));
	}
	else {
		return storage.getItem(key);
	}
}

WebStorage.removeSession = function(key) {
	var storage = WebStorage.getSessionStorage();

	key = WebStorage.getNameSapceKey(key);
	storage.removeItem(key);

	return;
}

WebStorage.reset = function() {
	for(var key in localStorage) {
		localStorage.removeItem(key);
	}
}

WebStorage.dump = function() {
	for(var key in localStorage) {
		console.log(key + ":" + localStorage[key]);
	}
}

/*
 * File: window_manager.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: window manager
 * 
 * Copyright (c) 2011 - 2015	Li XianJing <xianjimli@hotmail.com>
 * 
 */
  
function WWindowManager() {
	return;
}

WWindowManager.create = function(app, canvas, eventElement) {
	WWindowManager.instance = new WWindowManager();
	WEventsManager.setEventsConsumer(WWindowManager.instance, eventElement);

	return WWindowManager.instance.init(app, canvas);
}

WWindowManager.getInstance = function() {
	return WWindowManager.instance;
}

WWindowManager.prototype.init = function(app, canvas) {
	this.app = app;
	this.canvas = canvas;
	
	this.w = canvas.width;
	this.h = canvas.height;
	
	this.last_point = 0;
	this.pointerDown = 0;
	this.target = null;
	this.drawCount = 0;
	this.requestCount = 0;
	this.startTime = Date.now();
	this.windows = new Array();
	this.grabWindows = new Array();
	this.eventLogging = false;
	this.pointerDownPoint = {x:0, y:0};
	this.lastPointerPoint = {x:0, y:0};
	this.enablePaint = true;
	this.beforeDrawHandlers = [];

	return this;
}

WWindowManager.prototype.getApp = function() {
	return this.app;
}

WWindowManager.onMultiTouch = function(action, points, event) {
}

WWindowManager.prototype.onMultiTouch = function(action, points, event) {
	for(var i = 0; i < points.length; i++) {
		this.translatePoint(points[i]);
	}

	WWindowManager.onMultiTouch(action, points, event);
}

WWindowManager.prototype.preprocessEvent = function(type, e, arg) {
	this.currentEvent = e.originalEvent ? e.originalEvent : e;
	return true;
}

WWindowManager.prototype.getCanvas = function() {
	return this.canvas;
}

WWindowManager.prototype.getWidth = function() {
	return this.w;
}

WWindowManager.prototype.getHeight = function() {
	return this.h;
}

WWindowManager.prototype.findTargetWin = function(point) {
	 var target = null;
	 var nr = this.grabWindows.length;
	 
	 if(nr > 0) {
	  	for(var i = nr-1; i >= 0; i--) {
		  target = this.grabWindows[i];
		  if(!target.visible) {
		  	continue;
		  }

		  return target;
	 	}
	 }
	  
	  nr = this.windows.length;
	  for(var i = nr-1; i >= 0; i--) {
			var win = this.windows[i];
			if(!win.visible) {
				 continue;
			}
			
			if(isPointInRect(point, win.rect)) {
				 target = win;
				 break;
			 }
	  }
		  
	 return target;
}
		
WWindowManager.prototype.resize = function(w, h) {
	this.w = w;
	this.h = h;
	this.postRedraw();

	return;
}

WWindowManager.prototype.grab = function(win) {
	 this.grabWindows.push(win);
	 
	 return;
}

WWindowManager.prototype.ungrab = function(win) {
	 this.grabWindows.remove(win);
	 
	 return;
}

WWindowManager.prototype.onDoubleClick = function(point) {	
    this.translatePoint(point);
	 this.target = this.findTargetWin(point);
	 
	if(this.target) {
		 this.target.onDoubleClick(point);
	 }
	 else {
		 console.log("Window Manager: no target for x=" + point.x + " y=" + point.y);
	 }
	 
	return;
}

WWindowManager.prototype.onLongPress = function(point) {	
	 this.target = this.findTargetWin(point);
	 
	if(this.target) {
		 this.target.onLongPress(point);
	 }
	 else {
		 console.log("Window Manager: no target for x=" + point.x + " y=" + point.y);
	 }
	 
	return;
}

WWindowManager.prototype.onGesture = function(gesture) {	
	cantkHideAllInput();

	var point = {x:this.w/2, y:this.h/2};
	this.target = this.findTargetWin(point);

	if(this.target) {
		this.target.onGesture(gesture);
		console.log("WWindowManager.prototype.onGesture: scale=" + gesture.scale + " rotation=" + gesture.rotation);
	}
	else {
		 console.log("Window Manager: no target for x=" + point.x + " y=" + point.y);
	}
	 
	return;
}

WWindowManager.setInputScale = function(xInputScale, yInputScale) {	
	WWindowManager.xInputScale = xInputScale;
	WWindowManager.yInputScale = yInputScale;

	return;
}

WWindowManager.setInputOffset = function(xInputOffset, yInputOffset) {	
	WWindowManager.xInputOffset = xInputOffset;
	WWindowManager.yInputOffset = yInputOffset;

	return;
}


WWindowManager.prototype.getInputScale = function() {	
	return {x:WWindowManager.xInputScale, y:WWindowManager.yInputScale};
}

WWindowManager.prototype.translatePoint = function(point) {	
	if(WWindowManager.xInputOffset) {
		point.x -= WWindowManager.xInputOffset;
	}
	
	if(WWindowManager.yInputOffset) {
		point.y -= WWindowManager.yInputOffset;
	}

	if(WWindowManager.xInputScale) {
		point.x = Math.round(point.x * WWindowManager.xInputScale);
	}

	if(WWindowManager.yInputScale) {
		point.y = Math.round(point.y * WWindowManager.yInputScale);
	}

	return point;
}

WWindowManager.prototype.onPointerDown = function(point) {	
	cantkHideAllInput();

	this.translatePoint(point);
	this.target = this.findTargetWin(point);

	for(var i = 0; i < this.windows.length; i++) {
		var win = this.windows[i];
		if(win.state === WWidget.STATE_SELECTED && win !== this.target) {
			win.setState(WWidget.STATE_NORMAL);
		}
	}

	this.pointerDown = true;
	this.pointerDownPoint.x = point.x;
	this.pointerDownPoint.y = point.y;
	this.lastPointerPoint.x = point.x;
	this.lastPointerPoint.y = point.y;

	if(this.target) {
		point.time = Date.now();
		 this.target.onPointerDown(point);
	 }
	 else {
		 console.log("Window Manager: no target for x=" + point.x + " y=" + point.y);
	 }
	 
	return;
}

WWindowManager.prototype.onPointerMove = function(point) {
	this.translatePoint(point);
	var target = this.findTargetWin(point);
	  
	this.lastPointerPoint.x = point.x;
	this.lastPointerPoint.y = point.y;

	if(this.target && target != this.target) {
		 this.target.onPointerMove(point);
	}
	this.target = target;
	if(this.target) {
		point.time = Date.now();
		this.target.onPointerMove(point);
	}
	
	return;
}

WWindowManager.prototype.onPointerUp = function(point) {
	this.translatePoint(point);
	point = this.lastPointerPoint;
	this.target = this.findTargetWin(point);
	 
	if(this.target) {
		point.time = Date.now();
		this.target.onPointerUp(point);
	 }
	 else {
		  console.log("Window Manager: no target for x=" + point.x + " y=" + point.y);
	 }
	this.pointerDown = false;
	
	return;
}

WWindowManager.prototype.getLastPointerPoint = function() {
	return this.lastPointerPoint;
}

WWindowManager.prototype.isPointerDown= function() {
	return this.pointerDown;
}

WWindowManager.prototype.isClicked = function() {
	var dx = Math.abs(this.lastPointerPoint.x - this.pointerDownPoint.x);
	var dy = Math.abs(this.lastPointerPoint.y - this.pointerDownPoint.y);

	return (dx < 10 && dy < 10);
}

WWindowManager.prototype.isCtrlDown = function() {
	return this.currentEvent && this.currentEvent.ctrlKey;
}

WWindowManager.prototype.isAltDown = function() {
	return this.currentEvent && this.currentEvent.altKey;
}

WWindowManager.prototype.onContextMenu = function(point) {
	 this.target = this.findTargetWin(point);
	 
	if(this.target) {
		 this.target.onContextMenu(point);
	 }
	 else {
		  console.log("Window Manager: no target for x=" + point.x + " y=" + point.y);
	 }
	
	return;
}

WWindowManager.prototype.onKeyDown = function(code) {
	if(!this.target) {
		this.target = this.findTargetWin({x:50, y:50});
		console.log("onKeyDown: findTargetWin=" + this.target);
	}

	if(this.target !== null) {
		 this.target.onKeyDown(code);
	}
			
	return;
}

WWindowManager.prototype.onKeyUp = function(code) {
	if(this.target !== null) {
		this.target.onKeyUp(code);
	}
	
	return;
}

WWindowManager.prototype.onWheel = function(delta) {
	this.postRedraw();

	if(!this.target) {
		this.target = this.findTargetWin({x:50, y:50});
		console.log("onWheel : findTargetWin=" + this.target);
	}

	if(this.target !== null) {
		 return this.target.onWheel(delta);
	}
			
	return false;
}

WWindowManager.prototype.dispatchPointerMoveOut = function() {
	this.onPointerMove({x:-1, y:-1});
	this.target = null;

	return this;
}

WWindowManager.prototype.setTopWindowAsTarget = function() {
	var windows = this.windows;
	var n = windows.length;

	this.target = null;
	for(var i = n - 1; i >= 0; i--) {
		var iter = windows[i];
		if(iter.visible) {
			this.target = iter;
			break;
		}
	}

	return this;
}

WWindowManager.prototype.addWindow = function(win) {
	this.dispatchPointerMoveOut();
	this.target = win;
	this.windows.push(win);
	this.postRedraw();

	return;
}

WWindowManager.prototype.removeWindow = function(win) {
	this.ungrab(win);
	if(this.target === win) {
		this.target = null;
	}
	this.windows.remove(win);
	this.postRedraw();
	
	return;
}

WWindowManager.prototype.getFrameRate = function() {
	var duration = Date.now() - this.startTime;
	var fps = Math.round(1000  * this.drawCount / duration);

	if(duration > 1000) {
		this.drawCount = 0;
		this.startTime = Date.now();
	}

	return fps;
}

WWindowManager.prototype.setMaxFPSMode = function(maxFpsMode) {
	this.maxFpsMode = maxFpsMode;

	return this;
}

WWindowManager.prototype.showFPS = function(shouldShowFPS) {
	this.drawCount = 1;
	this.startTime = Date.now();
	this.shouldShowFPS = shouldShowFPS;

	return this;
}

WWindowManager.prototype.getPaintEnable = function() {
	return this.enablePaint;
}

WWindowManager.prototype.setPaintEnable = function(enablePaint) {
	this.enablePaint = enablePaint;
	console.log("setPaintEnable:" + enablePaint);

	if(enablePaint) {
		this.postRedraw();
	}

	return this;
}

WWindowManager.prototype.onDrawFrame = function() {
	this.drawCount++;
	this.requestCount = 0;
	this.draw();

	return;
}

WWindowManager.prototype.postRedraw = function(rect) {
	if(!this.enablePaint) {
		return;
	}
	
	this.requestCount++;
	if(this.requestCount < 2) {
		requestAnimationFrame(this.onDrawFrame.bind(this));
	}

	return;
}

WWindowManager.prototype.setTipsWidget = function(widget) {
	this.tipsWidget = widget;

	return;
}

WWindowManager.prototype.drawTips = function(canvas) {
	var tipsWidget = this.tipsWidget;
	if(!tipsWidget || !tipsWidget.parent) return;

	WWidget.hideTipsCanvas();
	var p = tipsWidget.getPositionInView();

	var win = tipsWidget.getWindow();
	if(win.canvas) {
		canvas = win.canvas.getContext("2d");
		var p = tipsWidget.getPositionInWindow();
		canvas.save();
		canvas.translate(p.x, p.y);
		canvas.beginPath();
		tipsWidget.drawTips(canvas);
		canvas.restore();
	}
	else {
		canvas.save();
		canvas.translate(p.x, p.y);
		canvas.beginPath();
		tipsWidget.drawTips(canvas);
		canvas.restore();
	}

	return;
}

WWindowManager.prototype.beforeDrawWindows = function(canvas) {}

WWindowManager.prototype.afterDrawWindows = function(canvas) {}

WWindowManager.prototype.drawWindows = function(canvas) {
    var nr = this.windows.length;
    this.beforeDrawWindows(canvas);
    for (var i = 0; i < nr; i++) {
        var win = this.windows[i];
        win.draw(canvas);
    }
    this.drawTips(canvas);
    this.afterDrawWindows(canvas);

    return;
}

WWindowManager.prototype.redrawRect = function(rect) {
	var canvas = this.getCanvas2D();
	canvas.save();
	if(rect) {
		canvas.beginPath();
		canvas.rect(rect.x, rect.y, rect.w, rect.h);
		canvas.clip();
	}
	this.drawWindows(canvas);
	canvas.restore();

	return;
}

//overwrite checkNeedRedraw to limit fps 
WWindowManager.prototype.checkNeedRedraw = function(timeStep) {
	return true;
}

WWindowManager.canvasContextName = "2d";
WWindowManager.setCanvasContextName = function(name) {
	WWindowManager.canvasContextName = name;
}

WWindowManager.prototype.getCanvas2D = function() {
	if(!this.ctx) {
		var ctx = this.canvas.getContext(WWindowManager.canvasContextName);

		if(!ctx) {
			ctx = this.canvas.getContext("2d");
			ctx["imageSmoothingEnabled"] = true;
		}

		if(!ctx.beginFrame) {
			ctx.beginFrame = function() {}
		}
		if(!ctx.endFrame) {
			ctx.endFrame = function() {}
		}
		if(!ctx.clipRect) {
			ctx.clipRect = function(x, y, w, h) {
				ctx.beginPath();
				ctx.rect(x, y, w, h);
				ctx.clip();
				ctx.beginPath();
			}
		}
		this.ctx = ctx;
	}

	return this.ctx;
}

WWindowManager.prototype.doDraw = function(ctx) {
	var now = Date.now();
	var timeStep = now - (this.lastUpdateTime || 0);

	if(!this.checkNeedRedraw(timeStep)) {
		return;
	}

	ctx.now = now;
	ctx.animating = 0;
	ctx.needRedraw = 0;
	ctx.timeStep = timeStep;
	ctx.lastUpdateTime = this.lastUpdateTime;
	WWindowManager.dispatchTimers(ctx.now);

	ctx.save();
	this.drawWindows(ctx);
	ctx.restore();

	if(this.shouldShowFPS) {
		var str = this.getFrameRate();
		var w = 100;
		var h = 30;
		ctx.beginPath();
		ctx.rect(0, 0, w, h);
		ctx.fillStyle = "Black";
		ctx.fill();
		
		ctx.save();
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = "20px Sans";
		ctx.fillStyle = "White";
		ctx.fillText(str, w >> 1, h >> 1);
		ctx.restore();
	}

	if(window.cantkRTV8 || this.maxFpsMode || ctx.needRedraw > 0) {
		this.postRedraw();
	}

	this.lastUpdateTime = ctx.now;
}

WWindowManager.prototype.draw = function() {
	var ctx = this.getCanvas2D();

	ctx.beginFrame();
	this.doDraw(ctx);
	ctx.endFrame();

	return;
}

WWindowManager.timerID = 1000;
WWindowManager.timerFuncs = [];
WWindowManager.intervalFuncs = [];

WWindowManager.dispatchTimers = function(t) {
	var arr = WWindowManager.timerFuncs;
	var n = arr.length;
	if(n > 0) {
		WWindowManager.timerFuncs = [];
		for(var i = 0; i < n; i++) {
			var info = arr[id];
			if(info.removed) continue;

			if(info.timeout <= t) {
				callback.call(window);
			}
			else {
				WWindowManager.timerFuncs.push(info);
			}
		}
	}

	arr = WWindowManager.intervalFuncs;
	n = arr.length;
	if(n > 0) {
		WWindowManager.intervalFuncs = [];
		for(var i = 0; i < n; i++) {
			var info = arr[id];
			if(info.removed) continue;

			if(info.timeout <= t) {
				callback.call(window);
				info.timeout = t + info.duration;
			}
			WWindowManager.timerFuncs.push(info);
		}
	}

	return;
}

WWindowManager.setTimeout = function(callback, duration) {
	if(!callback) return;

	var id = WWindowManager.timerID++;
	var info = {id:id, callback:callback};
	info.timeout = Date.now() + duration/1000;

	WWindowManager.timerFuncs.push(info);

	return id;
}

WWindowManager.setInterval = function(callback, duration) {
	if(!callback) return;

	var id = WWindowManager.timerID++;
	var info = {id:id, callback:callback};

	info.duration = duration/1000;
	info.timeout = Date.now() + info.duration;

	WWindowManager.intervalFuncs.push(info);

	return id;
}

WWindowManager.removeTimerInArr = function(arr, id) {
	var n = arr.length;
	for(var i = 0; i < n; i++) {
		var iter = arr[i];
		if(iter.id === id) {
			iter.removed = true;
			break;
		}
	}

	return;
}

WWindowManager.clearTimeout = function(id) {
	WWindowManager.removeTimerInArr(WWindowManager.timerFuncs, id);
}

WWindowManager.clearInterval = function(id) {
	WWindowManager.removeTimerInArr(WWindowManager.intervalFuncs, id);
}

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

/*
 * File: edit.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: wrap input/textarea
 * 
 * Copyright (c) 2011 - 2015	Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016	Holaverse Inc.
 * 
 */

function EditorElement() {
	this.element = null;
}

EditorElement.prototype.setElement = function(element) {
	this.element = element;

	return;
}

EditorElement.prototype.setWrap = function(wrap) {
	this.element.wrap = wrap;
	
	return;
}

EditorElement.prototype.setMaxLength = function(maxLength) {
	this.element.maxLength = maxLength;

	return this;
}

EditorElement.prototype.showBorder = function(show) {
	if(show) {
		this.element.style.background = 'white';
		this.element.style.border ='1px solid';
		this.element.style.outline = '1px';
	}
	else {
		this.element.style.background = 'transparent';
		this.element.style.border ='0px solid';
		this.element.style.outline = 'none';
	}

	return;
}

EditorElement.prototype.setOnChangedHandler = function(onChanged) {
	var me = this;
	this.onChanged = onChanged;

	this.element.onblur = function() {
		if(me.onChanged) {
			me.onChanged(this.value);
		}
	}

	if(isMobile()) {
		this.element.onchange = function() {
			if(me.onChanged) {
				me.onChanged(this.value);
			}
		}
	}

	return this;
}

EditorElement.prototype.setOnChangeHandler = function(onChange) {
	var me = this;
	this.onChange = onChange;

	this.element.onkeypress = function(e) {
		if(me.onChange) {
			me.onChange(this.value);
		}
	}

	if(this.isInput) {
		this.element.onkeydown = function(e) {
			if(e.keyCode === 13) {
				this.blur();
			}
		}
	}

	this.element.oninput = function(e) {
		if(me.onChange) {
			me.onChange(this.value);
		}
	}
	
	if(!isMobile()) {
		this.element.onchange = function() {
			if(me.onChange) {
				me.onChange(this.value);
			}
		}
	}

	return this;
}

EditorElement.prototype.selectText = function() {
	if(this.element) {
		this.element.select();
	}

	return this;
}

EditorElement.prototype.setZIndex = function(zIndex) {
	this.element.style['z-index'] = zIndex;

	return;
}

EditorElement.prototype.setFontSize = function(fontSize) {
	this.element.style['font-size'] = fontSize + "pt";

	return;
}

EditorElement.prototype.setScrollType = function(scrollType) {
	this.element.style['overflow-y'] = scrollType;
	this.element.style['overflow-x'] = scrollType;

	return;
}

EditorElement.prototype.show = function() {
	this.isVisibile = true;
	this.element.style.visibility = 'visible';
	this.element.style.zIndex = 8;
	this.element.style.opacity = 1;

	if(!isMobile()) {
		this.showBorder(false);
	}

	this.element.focus();
	EditorElement.imeOpen = true;

	return;
}

EditorElement.prototype.hide = function() {
	this.isVisibile = false;
	this.element.style.opacity = 0;
	this.element.style.zIndex = 0;
	this.element.style.visibility = 'hidden';  
	this.element.blur();
	this.element.onchange = null;
	EditorElement.imeOpen = false;
	if(isMobile()) {
		CantkRT.moveMainCanvas(0, 0);
	}

	if(this.onHide) {
		this.onHide();
	}

	if(this.shape) {
		this.shape.editing = false;
	}

	return;
}

EditorElement.prototype.setInputType = function(type) {
	this.element.type = type;

	return;
}

EditorElement.getMainCanvas = function() {
	if(typeof UIElement !== 'undefined') {
		return UIElement.getMainCanvas();	
	}
	else {
		return CantkRT.getMainCanvas();	
	}

	return;
}

EditorElement.getMainCanvasScale = function(force) {
	if(typeof UIElement !== 'undefined') {
		return UIElement.getMainCanvasScale();
	}
	else {
		if(!EditorElement.canvasScale || force) {
			var xScale = 1;
			var yScale = 1;
			EditorElement.canvasScale = {};
			var mainCanvas = EditorElement.getMainCanvas();
			
			if(mainCanvas.style.width && mainCanvas.style.height) {
				xScale = mainCanvas.width/parseFloat(mainCanvas.style.width);
				yScale = mainCanvas.height/parseFloat(mainCanvas.style.height);
			}

			EditorElement.canvasScale.x = xScale;
			EditorElement.canvasScale.y = yScale;
		}

		return EditorElement.canvasScale;	
	}

	return;
}

function setElementPosition(element, x, y) {
	var scale = EditorElement.getMainCanvasScale();

	x = x/scale.x;
	y = y/scale.y;
	element.style.position = "absolute";
	element.style.left = Math.round(x) + "px";
	element.style.top = Math.round(y) + "px";
	element.style["opacity"] = 1.0;

	return;
}

EditorElement.prototype.blur = function() {
	this.element.blur();
}

EditorElement.prototype.move = function(x, y) {
	this.element.style.position = "absolute";
	this.element.style.left = x + "px";
	this.element.style.top = y + "px";

	return;
}

EditorElement.prototype.setTextColor = function(color) {
	this.element.style.color = color;
}

EditorElement.prototype.setBgColor = function(color) {
	this.element.style.background = color;
}

EditorElement.prototype.setFontSize = function(fontSize) {
	this.element.style.fontSize = fontSize + "px";

	return;
}

EditorElement.prototype.resize = function(w, h) {
	this.element.style.width = w + "px";
	this.element.style.height = (h-4) + "px";

	return;
}

EditorElement.prototype.getText = function() {
	return this.element.value;
}

EditorElement.prototype.setText = function(text) {
	this.element.value = text;

	return;
}

EditorElement.prototype.setShape = function(shape) {
	if(this.shape) {
		this.hide();
	}

	this.shape = shape;
	
	if(this.shape) {
		this.shape.editing = true;
		this.show();
	}

	return;
}

EditorElement.create = function(element, id) {
	var edit = new EditorElement();

	element.id = id;
	edit.setElement(element);
	edit.setFontSize(14);
	edit.isInput = element.tagName === "INPUT" || element.localName === "input";

	return edit;
}

var gCanTkInput = null;
function cantkShowInput(inputType, fontSize, text, x, y, w, h) {
	x = Math.round(x);
	y = Math.round(y);
	w = Math.round(w);
	h = Math.round(h);

	if(!gCanTkInput) {
		gCanTkInput = EditorElement.createSingleLineEdit();
	}

	gCanTkInput.setInputType(inputType);
	gCanTkInput.setFontSize(fontSize);
	gCanTkInput.setText(text);
	gCanTkInput.move(x, y);
	gCanTkInput.resize(w, h);
	gCanTkInput.show();

	return gCanTkInput;
}

var gCanTkTextArea = null;
function cantkShowTextArea(text, fontSize, x, y, w, h) {
	x = Math.round(x);
	y = Math.round(y);
	w = Math.round(w);
	h = Math.round(h);

	if(!gCanTkTextArea) {
		gCanTkTextArea = EditorElement.createMultiLineEdit();
	}
	
	gCanTkTextArea.move(x, y);
	gCanTkTextArea.resize(w, h);
	gCanTkTextArea.setFontSize(fontSize);
	gCanTkTextArea.setText(text);
	gCanTkTextArea.show();

	return gCanTkTextArea;
}

function cantkMoveEditorWhenResize() {
	if(gCanTkInput && gCanTkInput.isVisibile && gCanTkInput.shape && gCanTkInput.shape.isUIElement) {
		var shape = gCanTkInput.shape;
		var rect = shape.getEditorRect();
		var x = rect.x;
		var y = rect.y;
		var w = rect.w;
		var h = rect.h;

		gCanTkInput.move(x, y);
		gCanTkInput.resize(w, h);

		console.log("Move Input To: (" + x + ", " + y + ")");
	}
	
	if(gCanTkTextArea && gCanTkTextArea.isVisibile && gCanTkTextArea.shape && gCanTkTextArea.shape.isUIElement) {
		var shape = gCanTkTextArea.shape;
		var rect = shape.getEditorRect();
		var x = rect.x;
		var y = rect.y;
		var w = rect.w;
		var h = rect.h;

		gCanTkTextArea.move(x, y);
		gCanTkTextArea.resize(w, h);
		
		console.log("Move TextArea To: (" + x + ", " + y + ")");
	}

	return;
}

function cantkIsEditorActive() {
	if(gCanTkInput && gCanTkInput.isVisibile) {
		return true;
	}

	if(gCanTkTextArea && gCanTkTextArea.isVisibile) {
		return true;
	}

	return false;
}

function cantkHideAllInput() {
	if(gCanTkInput && gCanTkInput.isVisibile) {
		if(gCanTkInput.element.onchange) {
			gCanTkInput.element.onchange();
		}
		gCanTkInput.hide();
	}

	if(gCanTkTextArea && gCanTkTextArea.isVisibile) {
		if(gCanTkTextArea.element.onchange) {
			gCanTkTextArea.element.onchange();
		}
		gCanTkTextArea.hide();
	}

	return;
}

EditorElement.createSingleLineEdit = function() {
	var id = "singlelineedit";
	var element = document.createElement("input");
	document.body.appendChild(element);

	return EditorElement.create(element, id);
}

EditorElement.createMultiLineEdit = function() {
	var id = "multilineedit";
	var element = document.createElement("textarea");
    element.style.resize = "none";
	document.body.appendChild(element);

	return EditorElement.create(element, id);
};

/*
 * File:    path-animation.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief:   path animation
 * 
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */
function BasePath() {
	return;
}

BasePath.prototype.getPosition = function(t) {
	return {x:0, y:0};
}

BasePath.prototype.getDirection = function(t) {
	var p1 = this.getPosition(t);
	var p2 = this.getPosition(t+0.1);

	return BasePath.angleOf(p1, p2);
}

BasePath.prototype.getStartPoint = function() {
	return this.startPoint ? this.startPoint : this.getPosition(0);
}

BasePath.prototype.getEndPoint = function() {
	return this.endPoint ? this.endPoint : this.getPosition(this.duration);
}

BasePath.prototype.getSamples = function() {
	return this.samples;
}

BasePath.prototype.draw = function(ctx) {
	var n = this.getSamples();
	var p = this.getStartPoint();	

	ctx.moveTo(p.x, p.y);
	for(var i = 0; i <= n; i++) {
		var t = this.duration*i/n;
		var p = this.getPosition(t);
		ctx.lineTo(p.x, p.y);
	}

	return this;
}

BasePath.angleOf = function(from, to) {
	var dx = to.x - from.x;
	var dy = to.y - from.y;
	var d = Math.sqrt(dx * dx + dy * dy);

	if(dx == 0 && dy == 0) {
		return 0;
	}
	
	if(dx == 0) {
		if(dy < 0) {
			return 1.5 * Math.PI;
		}
		else {
			return 0.5 * Math.PI;
		}
	}

	if(dy == 0) {
		if(dx < 0) {
			return Math.PI;
		}
		else {
			return 0;
		}
	}

	var angle = Math.asin(Math.abs(dy)/d);
	if(dx > 0) {
		if(dy > 0) {
			return angle;
		}
		else {
			return 2 * Math.PI - angle;
		}
	}
	else {
		if(dy > 0) {
			return Math.PI - angle;
		}
		else {
			return Math.PI + angle;
		}
	}
}

/////////////////////////////////////////////////////

function LinePath(duration, interpolator, x1, y1, x2, y2) {
	this.dx = x2 - x1;
	this.dy = y2 - y1;
	this.x1 = x1;
	this.x2 = x2;
	this.y1 = y1;
	this.y2 = y2;
	this.duration = duration;
	this.interpolator = interpolator;
	this.angle = BasePath.angleOf({x:x1,y:y1}, {x:x2, y:y2});
	this.startPoint = {x:this.x1, y:this.y1};
	this.endPoint = {x:this.x2, y:this.y2};
	
	return;
}

LinePath.prototype = new BasePath();
LinePath.prototype.getPosition = function(time) {
	var t = time;
	var timePercent = Math.min(t/this.duration, 1);
	var percent = this.interpolator ? this.interpolator.get(timePercent) : timePercent;

	var x = this.x1 + this.dx * percent;
	var y = this.y1 + this.dy * percent;

	return {x:x, y:y};
}

LinePath.prototype.getDirection = function(t) {
	return this.angle;
}

LinePath.prototype.draw = function(ctx) {
	ctx.moveTo(this.x1, this.y1);
	ctx.lineTo(this.x2, this.y2);

	return this;
}

LinePath.create = function(duration, interpolator, x1, y1, x2, y2) {
	return new LinePath(duration, interpolator, x1, y1, x2, y2);
}

/////////////////////////////////////////////////////

function ArcPath(duration, interpolator, xo, yo, r, sAngle, eAngle) {
	this.xo = xo;
	this.yo = yo;
	this.r = r;
	this.sAngle = sAngle;
	this.eAngle = eAngle;
	this.duration = duration;
	this.interpolator = interpolator;
	this.angleRange = eAngle - sAngle;
	
	this.startPoint = this.getPosition(0);	
	this.endPoint = this.getPosition(duration);	

	return;
}

ArcPath.prototype = new BasePath();
ArcPath.prototype.getPosition = function(time) {
	var t = time;
	var timePercent = Math.min(t/this.duration, 1);
	var percent = this.interpolator ? this.interpolator.get(timePercent) : timePercent;
	var angle = this.sAngle + percent * this.angleRange;
	
	var x = this.xo + this.r * Math.cos(angle);
	var y = this.yo + this.r * Math.sin(angle);

	return {x:x, y:y};
}

ArcPath.prototype.getDirection = function(t) {
	var timePercent = Math.min(t/this.duration, 1);
	var percent = this.interpolator ? this.interpolator.get(timePercent) : timePercent;
	var angle = this.sAngle + percent * this.angleRange + Math.PI * 0.5;

	return angle;
}

ArcPath.prototype.draw = function(ctx) {
	ctx.arc(this.xo, this.yo, this.r, this.sAngle, this.eAngle, this.sAngle > this.eAngle);

	return this;
}

ArcPath.create = function(duration, interpolator, xo, yo, r, sAngle, eAngle) {
	return new ArcPath(duration, interpolator, xo, yo, r, sAngle, eAngle);
}

/////////////////////////////////////////////////////

function ParaPath(duration, interpolator, x1, y1, ax, ay, vx, vy) {
	this.x1 = x1;
	this.y1 = y1;
	this.ax = ax;
	this.ay = ay;
	this.vx = vx;
	this.vy = vy;
	this.duration = duration;
	this.interpolator = interpolator;

	this.startPoint = this.getPosition(0);	
	this.endPoint = this.getPosition(duration);	
	var dx = Math.abs(this.endPoint.x-this.startPoint.x);
	var dy = Math.abs(this.endPoint.y-this.startPoint.y);
	this.samples = Math.max(dx, dy);

	return;
}

ParaPath.prototype = new BasePath();
ParaPath.prototype.getPosition = function(time) {
	var t = time;
	var timePercent = Math.min(t/this.duration, 1);
	var percent = this.interpolator ? this.interpolator.get(timePercent) : timePercent;
	
	t = (percent * this.duration)/1000;
	var x = 0.5 * this.ax * t * t + this.vx * t + this.x1;
	var y = 0.5 * this.ay * t * t + this.vy * t + this.y1;

	return {x:x, y:y};
}

ParaPath.create = function(duration, interpolator, x1, y1, ax, ay, vx, vy) {
	return new ParaPath(duration, interpolator, x1, y1, ax, ay, vx, vy);
}

/////////////////////////////////////////////////////

function SinPath(duration, interpolator, x1, y1, waveLenth, v, amplitude, phaseOffset) {
	this.x1 = x1;
	this.y1 = y1;
	this.v = v;
	this.amplitude = amplitude;
	this.waveLenth = waveLenth;
	this.duration = duration;
	this.phaseOffset = phaseOffset ? phaseOffset : 0;
	this.interpolator = interpolator;
	this.range = 2 * Math.PI * (v * duration * 0.001)/waveLenth;

	this.startPoint = this.getPosition(0);	
	this.endPoint = this.getPosition(duration);	
	var dx = Math.abs(this.endPoint.x-this.startPoint.x);
	var dy = Math.abs(this.endPoint.y-this.startPoint.y);
	this.samples = Math.max(dx, dy);

	return;
}

SinPath.prototype = new BasePath();
SinPath.prototype.getPosition = function(time) {
	var t = time;
	var timePercent = Math.min(t/this.duration, 1);
	var percent = this.interpolator ? this.interpolator.get(timePercent) : timePercent;
	t = percent * this.duration;

	var x = (t * this.v)/1000 + this.x1;
	var y = this.amplitude * Math.sin(percent * this.range + this.phaseOffset) + this.y1;

	return {x:x, y:y};
}

SinPath.create = function(duration, interpolator, x1, y1, waveLenth, v, amplitude, phaseOffset) {
	return new SinPath(duration, interpolator, x1, y1, waveLenth, v, amplitude, phaseOffset);
}

/////////////////////////////////////////////////////

function Bezier3Path(duration, interpolator, x1, y1, x2, y2, x3, y3, x4, y4) {
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.x3 = x3;
	this.y3 = y3;
	this.x4 = x4;
	this.y4 = y4;
	
	this.duration = duration;
	this.interpolator = interpolator;
	this.startPoint = this.getPosition(0);	
	this.endPoint = this.getPosition(duration);	

	return;
}

Bezier3Path.prototype = new BasePath();
Bezier3Path.prototype.getPosition = function(time) {
	var t = time;
	var timePercent = Math.min(t/this.duration, 1);
	var percent = this.interpolator ? this.interpolator.get(timePercent) : timePercent;
	
	t = percent;
	var t2 = t * t;
	var t3 = t2 * t;

	var t1 = 1 - percent;
	var t12 = t1 * t1;
	var t13 = t12 * t1;

	//http://wenku.baidu.com/link?url=HeH8EMcwvOjp-G8Hc-JIY-RXAvjRMPl_l4ImunXSlje-027d01NP8SkNmXGlbPVBioZdc_aCJ19TU6t3wWXW5jqK95eiTu-rd7LHhTwvATa
	//P = P0*(1-t)^3 + 3*P1*(1-t)^2*t + 3*P2*(1-t)*t^2 + P3*t^3;

	var x = (this.x1*t13) + (3*t*this.x2*t12) + (3*this.x3*t1*t2) + this.x4*t3;
	var y = (this.y1*t13) + (3*t*this.y2*t12) + (3*this.y3*t1*t2) + this.y4*t3;

	return {x:x, y:y};
}

Bezier3Path.prototype.draw = function(ctx) {
	ctx.moveTo(this.x1, this.y1);
	ctx.bezierCurveTo(this.x2, this.y2, this.x3, this.y3, this.x4, this.y4);
}

Bezier3Path.create = function(duration, interpolator, x1, y1, x2, y2, x3, y3, x4, y4) {
	return new Bezier3Path(duration, interpolator, x1, y1, x2, y2, x3, y3, x4, y4);
}

/////////////////////////////////////////////////////

function Bezier2Path(duration, interpolator, x1, y1, x2, y2, x3, y3) {
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.x3 = x3;
	this.y3 = y3;
	
	this.duration = duration;
	this.interpolator = interpolator;
	this.startPoint = this.getPosition(0);	
	this.endPoint = this.getPosition(duration);	

	return;
}

Bezier2Path.prototype = new BasePath();
Bezier2Path.prototype.getPosition = function(time) {
	var t = time;
	var timePercent = Math.min(t/this.duration, 1);
	var percent = this.interpolator ? this.interpolator.get(timePercent) : timePercent;
	
	t = percent;
	var t2 = t * t;

	var t1 = 1 - percent;
	var t12 = t1 * t1;

	//P = (1-t)^2 * P0 + 2 * t * (1-t) * P1 + t^2*P2;
	var x = (this.x1*t12) + 2 * this.x2 * t * t1 + this.x3 * t2;
	var y = (this.y1*t12) + 2 * this.y2 * t * t1 + this.y3 * t2;

	return {x:x, y:y};
}

Bezier2Path.prototype.draw = function(ctx) {
	ctx.moveTo(this.x1, this.y1);
	ctx.quadraticCurveTo(this.x2, this.y2, this.x3, this.y3);
}

Bezier2Path.create = function(duration, interpolator, x1, y1, x2, y2, x3, y3) {
	return new Bezier2Path(duration, interpolator, x1, y1, x2, y2, x3, y3);
}

function PathAnimation(x, y) {
	this.startPoint = {x:x, y:y};
	this.reset();

	return;
}

PathAnimation.prototype.getStartPoint = function() {
	return this.startPoint;
}

PathAnimation.prototype.getEndPoint = function() {
	return this.endPoint;
}

PathAnimation.prototype.reset = function() {
	this.endPoint = {x:this.startPoint.x, y:this.startPoint.y};
	this.duration = 0;
	this.paths = [];

	return this;
}

PathAnimation.prototype.addPath = function(path) {
	this.paths.push({path:path, startTime:this.duration});
	this.endPoint = path.getEndPoint();
	this.duration += path.duration;

	return this;
}

PathAnimation.prototype.addLine = function(duration, interpolator, p1, p2) {
	return this.addPath(LinePath.create(duration, interpolator, p1.x, p1.y, p2.x, p2.y));
}

PathAnimation.prototype.addArc = function(duration, interpolator, origin, r, sAngle, eAngle) {
	return this.addPath(ArcPath.create(duration, interpolator, origin.x, origin.y, r, sAngle, eAngle));
}

PathAnimation.prototype.addPara = function(duration, interpolator, p, a, v) {
	return this.addPath(ParaPath.create(duration, interpolator, p.x, p.y, a.x, a.y, v.x, v.y));
}

PathAnimation.prototype.addSin = function(duration, interpolator, p, waveLenth, v, amplitude, phaseOffset) {
	return this.addPath(SinPath.create(duration, interpolator, p.x, p.y, waveLenth, v, amplitude, phaseOffset));
}

PathAnimation.prototype.addBezier = function(duration, interpolator, p1, p2, p3, p4) {
	return this.addPath(Bezier3Path.create(duration, interpolator, p1.x,p1.y, p2.x,p2.y, p3.x,p3.y, p4.x,p4.y));
}

PathAnimation.prototype.addQuad = function(duration, interpolator, p1, p2, p3) {
	return this.addPath(Bezier2Path.create(duration, interpolator, p1.x,p1.y, p2.x,p2.y, p3.x,p3.y));
}

PathAnimation.prototype.getDuration = function() {
	return this.duration;
}

PathAnimation.prototype.getPathInfoByTime = function(elapsedTime) {
	var t = 0;	
	var paths = this.paths;
	var n = paths.length;

	for(var i = 0; i < n; i++) {
		var iter = paths[i];
		var path = iter.path;
		var startTime = iter.startTime;
		if(elapsedTime >= startTime && elapsedTime < (startTime + path.duration)) {
			return iter;
		}
	}

	return null;
}

PathAnimation.prototype.getPosition = function(elapsedTime) {
	var info = this.getPathInfoByTime(elapsedTime);

	return info ? info.path.getPosition(elapsedTime - info.startTime) : this.endPoint;
}

PathAnimation.prototype.getDirection = function(elapsedTime) {
	var info = this.getPathInfoByTime(elapsedTime);

	return info ? info.path.getDirection(elapsedTime - info.startTime) : 0;
}

PathAnimation.prototype.draw = function(ctx) {
	var paths = this.paths;
	var n = paths.length;
	
	for(var i = 0; i < n; i++) {
		var iter = paths[i];
		ctx.beginPath();
		iter.path.draw(ctx);
		ctx.stroke();
	}

	return this;
}

PathAnimation.prototype.forEach = function(visit) {
	var paths = this.paths;
	var n = paths.length;
	
	for(var i = 0; i < n; i++) {
		visit(paths[i]);
	}

	return this;
};

//! stable.js 0.1.5, https://github.com/Two-Screen/stable
//! © 2014 Angry Bytes and contributors. MIT licensed.

(function() {

// A stable array sort, because `Array#sort()` is not guaranteed stable.
// This is an implementation of merge sort, without recursion.

var stable = function(arr, comp) {
    return exec(arr.slice(), comp);
};

stable.inplace = function(arr, comp) {
    var result = exec(arr, comp);

    // This simply copies back if the result isn't in the original array,
    // which happens on an odd number of passes.
    if (result !== arr) {
        pass(result, null, arr.length, arr);
    }

    return arr;
};

// Execute the sort using the input array and a second buffer as work space.
// Returns one of those two, containing the final result.
function exec(arr, comp) {
    if (typeof(comp) !== 'function') {
        comp = function(a, b) {
            return String(a).localeCompare(b);
        };
    }

    // Short-circuit when there's nothing to sort.
    var len = arr.length;
    if (len <= 1) {
        return arr;
    }

    // Rather than dividing input, simply iterate chunks of 1, 2, 4, 8, etc.
    // Chunks are the size of the left or right hand in merge sort.
    // Stop when the left-hand covers all of the array.
    var buffer = new Array(len);
    for (var chk = 1; chk < len; chk *= 2) {
        pass(arr, comp, chk, buffer);

        var tmp = arr;
        arr = buffer;
        buffer = tmp;
    }

    return arr;
}

// Run a single pass with the given chunk size.
var pass = function(arr, comp, chk, result) {
    var len = arr.length;
    var i = 0;
    // Step size / double chunk size.
    var dbl = chk * 2;
    // Bounds of the left and right chunks.
    var l, r, e;
    // Iterators over the left and right chunk.
    var li, ri;

    // Iterate over pairs of chunks.
    for (l = 0; l < len; l += dbl) {
        r = l + chk;
        e = r + chk;
        if (r > len) r = len;
        if (e > len) e = len;

        // Iterate both chunks in parallel.
        li = l;
        ri = r;
        while (true) {
            // Compare the chunks.
            if (li < r && ri < e) {
                // This works for a regular `sort()` compatible comparator,
                // but also for a simple comparator like: `a > b`
                if (comp(arr[li], arr[ri]) <= 0) {
                    result[i++] = arr[li++];
                }
                else {
                    result[i++] = arr[ri++];
                }
            }
            // Nothing to compare, just flush what's left.
            else if (li < r) {
                result[i++] = arr[li++];
            }
            else if (ri < e) {
                result[i++] = arr[ri++];
            }
            // Both iterators are at the chunk ends.
            else {
                break;
            }
        }
    }
};

Object.defineProperty(Array.prototype, 'stableSort', 
{
	enumerable: false,
	value: function(comp) {
		var newArr = stable(this, comp);

		for(var i = 0; i < newArr.length; i++) {
			this[i] = newArr[i];
		}

		return this;
	}
});

})();
/*
 * File: assets_downloader.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: assets downloader for Runtime.
 * 
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */
function AssetsDownloader() {
}

AssetsDownloader.requests = {};
AssetsDownloader.createFontsRequest = function() {
	return AssetsDownloader.createRequest("__fonts__");
}

AssetsDownloader.createAudiosRequest = function() {
	return AssetsDownloader.createRequest("__audios__");
}

AssetsDownloader.createRequest = function(name) {
	var req = AssetsDownloader.requests[name];

	if(!req) {
		req = new AssetsDownloader.Request(name);
		AssetsDownloader.requests[name] = req;
	}

	return req;
}

AssetsDownloader.isDownloaded = function(name) {
	var req = AssetsDownloader.requests[name];

	return req && req.loaded;
}

AssetsDownloader.isAvailable = function() {
	return (!!window.downloadAssets) || AssetsDownloader.simulateDownload;
}

AssetsDownloader.simulateDownload = false;
AssetsDownloader.download = function(req) {
	if(window.downloadAssets && !req.loaded) {
		window.downloadAssets(req.name, req.onEvent.bind(req));
	}
	else if(AssetsDownloader.simulateDownload) {
		function stepIt() {
			req.percent += 20;
			req.onEvent({type:"progress", value:req.percent});
			if(req.percent < 100) {
				setTimeout(stepIt.bind(req), 500);
			}
		}

		req.percent = 0;
		setTimeout(stepIt.bind(req), 1000);
	}else{
		req.onEvent({type:"progress", value:100});
	}

	return req;
}

AssetsDownloader.downloadMulti = function(names, onProgress, onDone) {
	var queue = [];
	var totalSize = 0;
	var finishSize = 0;

	function downloadNext() {
		if(queue.length < 1) {
			if(onDone) {
				onDone();	
			}
		}else{
			var req = queue.pop();
			req.on("progress", onOneProgress);
			AssetsDownloader.download(req);
			console.log("Download : " + req.name)
		}
	}

	function onOneProgress(event) {
		var reqFinishSize = finishSize + this.size * (event.value/100);

		var percent = 100 * reqFinishSize/totalSize;
		if(onProgress) {
			onProgress(percent, reqFinishSize, totalSize);
		}
		
		console.log("percent=" + percent);
		if(event.value >= 100) {
			console.log("Download done: " + this.name)
			this.off("progress", onOneProgress);
			finishSize += this.size;
			downloadNext();
		}
	}
	
	for(var i = 0; i < names.length; i++) {
		var r = AssetsDownloader.createRequest(names[i]);
		queue.push(r);
		totalSize += r.size;
	}

	downloadNext();

	return;
}

AssetsDownloader.Request = function(name) {
	this.name = name;
	if(window.getAssetsSize) {
		this.size = window.getAssetsSize(name);
	}else{
		this.size = 1024;
	}
	
	if(window.getAssetsDownloadedSize) {
		this.donwloadedSize = window.getAssetsDownloadedSize(name);
	}else{
		this.donwloadedSize = 0;
	}

	this.loaded = this.donwloadedSize >= this.size;

	return this;
}

AssetsDownloader.Request.prototype.onEvent = function(event) {
	if(event.type === "progress" && event.value >= 100) {
		this.loaded = true;	
	}

	if(event.type === "error") {
		this.error = event.value;
	}

	var me = this;
	setTimeout(function() {
		me.dispatchEvent(event);
	}, 0);
}

TEventTarget.apply(AssetsDownloader.Request.prototype); 

/**
 * @method downloadAssets
 *
 * 加载指定场景的资源。
 *
 * @param {String} sceneName 要加载的场景的名称。
 * @param {Function} onEvent 回调函数。原型为onEvent(event)。
 *
 * event的成员有：
 *
 * type: "progress"表示进度, "error"表示错误。
 * value: type为"progress"时，value表示进度的百分比，取值0-100。type为"error"时，value表示具体的错误信息。
 */
//function downloadAssets(sceneName, onEvent) 

/**
 * @method getAssetsSize
 *
 * 获取指定场景的资源大小(字节)。
 * @return {Number} 资源的大小。
 * 
 */
//function getAssetsSize(sceneName)

/**
 * @method getAssetsDownloadedSize
 *
 * 获取指定场景的资源已经下载的大小(字节)。
 * @return {Number} 获取指定场景的资源已经下载的大小。
 * 
 */
//function getAssetsDownloadedSize(sceneName)

