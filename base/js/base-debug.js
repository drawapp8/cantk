function browser() {
}

browser.init = function() {
	var u = navigator.userAgent, app = navigator.appVersion;

	browser = {};
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
		|| browser.windowPhone || browser.firefoxMobile;

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

function isAndroid() {
	return browser.android;
}

function isIPhone() {
	return browser.iPhone;
}

function isIPad() {
	return browser.ipad;
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

browser.init();

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

CantkRT.isNative = function() {
	return !!CantkRT.rt;
}

CantkRT.init = function(onReady) {
	function onDeviceReady() {
		try {
			CantkRT.rt = cordova.require("com.tangide.cantk.CantkRuntime");	
		}catch(e) {
			console.log("com.tangide.cantk.CantkRuntime not found.");
		}

		if(CantkRT.rt) {
			CantkRT.rt.init();
			CantkRT.setShowFPS(true);
		}

		onReady();
	}

	if(window.cordova) {
		document.addEventListener('deviceready', onDeviceReady, false);
	}
	else {
		window.addEventListener('load', onReady, false);
	}

	return;
}

CantkRT.getViewPort = function() {
	var width;
	var height;

	if(CantkRT.rt) {
		return CantkRT.rt.getViewPort();
	}
	else {
		if (typeof window.innerWidth != 'undefined'){
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

	}
	
	return {width:width, height:height};
}

CantkRT.getMainCanvas = function() {
	var canvas = null;

	if(CantkRT.canvas) {
		return CantkRT.canvas;
	}

	if(CantkRT.rt) {
		canvas = CantkRT.rt.createCanvas();
		console.log("CantkRT.rt.createCanvas");
	}
	else {
		canvas = document.createElement("canvas");
		
		canvas.id = "main-canvas";
		canvas.style.zIndex = 0;
		document.body.appendChild(canvas);
	
		canvas.flush = function() {}
	}

	CantkRT.canvas = canvas;

	return canvas;
}

CantkRT.isResSupportCrossOrgin = function(src) {
	return src && (src.indexOf("upaiyun.com") > 0 || src.indexOf("bcs.duapp.com") > 0);
}

CantkRT.createImage = function(src, onLoad, onError) {
	var image = null;
	if(CantkRT.rt) {
		image = CantkRT.rt.createImage(src, onLoad, onError);
	}
	else {
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
	}

	return image;
}

CantkRT.createImageFromCanvas = function(canvas, onLoad, onError) {
	if(!canvas) {
		if(onError) {
			onError();
		}

		return null;
	}

	if(CantkRT.rt) {
		return CantkRT.rt.createImage(canvas.toDataURL(), onLoad, onError);
	}
	else {
		if(onLoad) {
			onLoad(canvas);
		}
		return canvas;
	}
}

CantkRT.setShowFPS = function(value) {
	console.log("CantkRT.setShowFPS");
	if(CantkRT.rt) {
		return CantkRT.rt.setShowFPS(value);
	}
	else {
		return;
	}
}

CantkRT.createSoundEffect = function(url, onLoad, onError) {
	if(CantkRT.rt) {
		return CantkRT.rt.createSoundEffect(url, onLoad, onError);
	}

	return null;
}

CantkRT.createSoundMusic = function(url, onLoad, onError) {
	if(CantkRT.rt) {
		return CantkRT.rt.createSoundMusic(url, onLoad, onError);
	}

	return null;
}

CantkRT.createSingleLineTextEditor = function() {
	if(CantkRT.rt) {
		return CantkRT.rt.createSingleLineTextEditor();
	}

	return null;
}

CantkRT.createMultiLineTextEditor= function() {
	if(CantkRT.rt) {
		return CantkRT.rt.createMultiLineTextEditor();
	}

	return null;
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame 
	|| window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

CantkRT.requestAnimFrame = function(callback) {
	return window.requestAnimationFrame(callback);
/*
	if(CantkRT.rt) {
		return window.setTimeout(callback, 10);
	}
	else {
		return window.requestAnimationFrame(callback);
	}
*/	
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

var C_ARROW_NONE   = 0;
var C_ARROW_NORMAL = 1;
var C_ARROW_CIRCLE = 2;
var C_ARROW_RECT   = 3;
var C_ARROW_DIAMOND  = 4;
var C_ARROW_TRI    = 5;
var C_ARROW_FILL_CIRCLE = 1 << 8 | C_ARROW_CIRCLE;
var C_ARROW_FILL_RECT   = 1 << 8 | C_ARROW_RECT;
var C_ARROW_FILL_DIAMOND  = 1 << 8 | C_ARROW_DIAMOND;
var C_ARROW_FILL_TRI    = 1 << 8 | C_ARROW_TRI;

function drawArrowHeaderNormal(canvas, size) {
	canvas.translate(-size/2, 0);
	canvas.moveTo(-size/2, -size/2);
	canvas.lineTo(size/2, 0);
	canvas.lineTo(-size/2, size/2);
	canvas.stroke();
	canvas.beginPath();

	return;
}

function drawArrowHeaderTri(canvas, size) {
	canvas.translate(-size/2, 0);
	canvas.moveTo(size/2, 0);
	canvas.lineTo(-size/2, -size/2);
	canvas.lineTo(-size/2, size/2);
	canvas.lineTo(size/2, 0);
	
	return;
}

function drawArrowHeaderCircle(canvas, size) {
	canvas.translate(-size/2, 0);
	canvas.arc(0, 0, size/2, Math.PI*2, 0);
	
	return;
}

function drawArrowHeaderRect(canvas, size) {
	canvas.translate(-size/2, 0);
	canvas.rect(-size/2, -size/2, size, size);
	
	return;
}

function drawArrowHeaderRRect(canvas, size) {
	canvas.translate(-size/2, 0);
	canvas.rotate(Math.PI/4);
	canvas.rect(-size/2, -size/2, size, size);
		
	return;
}

var arrow_draw_header = 
[
	null,
	drawArrowHeaderNormal,
	drawArrowHeaderCircle,
	drawArrowHeaderRect,
	drawArrowHeaderRRect,
	drawArrowHeaderTri
];

function drawArrow(canvas, type, start_p, end_p, a_size) {
	var size = 10;
	if(!canvas || !start_p || !end_p) return;
	var fill = type >> 8;
	
	type = type & 0xff;	
	if(type <= 0 || type >= arrow_draw_header.length) {
		return;
	}
	
	if(a_size) {
		size = a_size;
	}
	
	var k = (end_p.y - start_p.y)/(end_p.x - start_p.x)
	var angle = Math.atan(k);
	

	if(end_p.x < start_p.x) {
		angle = angle + Math.PI;
	}
	
	var fillStyle =  canvas.fillStyle;
	var strokeStyle = canvas.strokeStyle;
	
	canvas.save();
	
	canvas.translate(end_p.x, end_p.y);
	canvas.rotate(angle);
	
	canvas.beginPath();
	size = size + canvas.lineWidth - 1;
	arrow_draw_header[type](canvas, size);
	canvas.closePath();
	
	if(fill) {
		canvas.fillStyle = strokeStyle;
	}
	else {
		canvas.fillStyle = "White";
	}

	if(type > 1) {
		canvas.fill();
	}
	canvas.stroke();

	canvas.restore();
	
	canvas.fillStyle =  fillStyle;
	canvas.strokeStyle = strokeStyle;
	
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

if(isWebkit()) {
	drawNinePatchEx = function(context, image, s_x, s_y, s_w, s_h, x, y, w, h) {
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

		if(w < s_w && h < s_h) {
			context.drawImage(image, s_x, s_y, s_w, s_h, x, y, w, h);

			return;
		}

		tw = Math.floor(s_w/3);
		th = Math.floor(s_h/3);
		cw = s_w - tw - tw;
		ch = s_h - th - th;
		
		dcw = w - tw - tw;
		dch = h - th - th;

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
} else {
	drawNinePatchEx = function(context, image, s_x, s_y, s_w, s_h, x, y, w, h) {
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

		if(w < s_w && h < s_h) {
			context.drawImage(image, s_x, s_y, s_w, s_h, x, y, w, h);

			return;
		}

		tw = Math.floor(s_w/3);
		th = Math.floor(s_h/3);
		cw = s_w - tw - tw;
		ch = s_h - th - th;
		
		dcw = w - tw - tw;
		dch = h - th - th;

		/*draw four corner*/
		context.drawImage(image, s_x, s_y, tw, th, x, y, tw, th);
		context.drawImage(image, s_x+s_w-tw, s_y, tw, th, x+w-tw, y, tw, th);
		context.drawImage(image, s_x, s_y+s_h-th, tw, th, x, y+h-th, tw, th);
		context.drawImage(image, s_x+s_w-tw, s_y+s_h-th, tw, th, x+w-tw, y+h-th, tw, th);

		if(dcw > 0) {
			context.drawImage(image, s_x+tw, s_y, cw, th, x+tw-1, y, dcw+2, th);
			context.drawImage(image, s_x+tw, s_y+s_h-th, cw, th, x+tw-1, y+h-th, dcw+2, th);
		}

		if(dch > 0) {
			context.drawImage(image, s_x, s_y+th, tw, ch, x, y+th-0.5, tw, dch+1);
			context.drawImage(image, s_x+s_w-tw, s_y+th, tw, ch, x+w-tw, y+th-0.5, tw, dch+1);
		}

		//center
		if(dcw > 0 && dch > 0) {
			context.drawImage(image, s_x+tw, s_y+th, cw, ch, x+tw-1, y+th-1, dcw+2, dch+2);
		}

		return;
	}
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
	if(width <= 0 || !str) {
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

function cantkRestoreViewPort() {
	cantkInitViewPort(1);

	return;
}

function cantkSetViewPortWidth(width) {
	var value = "";
	var head = document.getElementsByTagName('head')[0];
	var meta = document.querySelector("meta[name=viewport]");

	if(!meta) {
		meta = document.createElement('meta');
		meta.name = 'viewport';
		head.appendChild(meta);
	}
	
	var content = 'width='+ width +'; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;';
	meta.setAttribute('content', content);

	return;
}

function cantkInitViewPort(scale) {
	var value = "";
	var meta = document.createElement('meta');
	var head = document.getElementsByTagName('head')[0];
	
	if(window.devicePixelRatio && window.devicePixelRatio > 2) {
		window.realDevicePixelRatio = window.devicePixelRatio;
		window.devicePixelRatio = 2;
	}

	var defaultRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;

	scale = scale ? scale : (1/defaultRatio);
	var scaleValues = "initial-scale="+scale+", minimum-scale="+scale+", maximum-scale="+scale+", user-scalable=0";

	if(isIPhone()) {
	  value = 'width=device-width, ' + scaleValues;
	}
	else if(isAndroid()) {
		var ver = browserVersion();
		if(ver < 537.00 || isWeiXin() || isWeiBo() || isQQ()) {
			window.devicePixelRatio = window.realDevicePixelRatio;
			value = 'target-densitydpi=device-dpi, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
		}
		else { 
			//target-densitydpi is not supported any longer in new version.
			value =  'width=device-width, ' + scaleValues; 
		}
	}
	else if(isFirefoxMobile()) {
      var vp = cantkGetViewPort();
	  value =  'width='+vp.width+', ' + scaleValues; 
	}
	else {
	  value =  'width=device-width, ' + scaleValues; 
	}

	meta.name = 'viewport';
	meta.content = value;

	console.log("viewport: " + value);
	head.appendChild(meta);

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
Locales = {};
Locales.getLanguageName = function() {
	var lang = "";
	if(navigator.language) {
		lang = navigator.language;
	}
	else if(navigator.userLanguage) {
		lang = navigator.userLanguage;
	}

	lang = lang.toLowerCase();

	return lang;
}

function cantkGetLocale() {
	return Locales.getLanguageName();
}
	
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
	return path.replace(/\\/g,'/').replace(/\/[^\/]*$/, '');
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

/*
 * JavaScript MD5 1.0.1
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 * 
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*jslint bitwise: true */
/*global unescape, define */

(function ($) {
    'use strict';

    /*
    * Add integers, wrapping at 2^32. This uses 16-bit operations internally
    * to work around bugs in some JS interpreters.
    */
    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
            msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
    * Bitwise rotate a 32-bit number to the left.
    */
    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    /*
    * These functions implement the four basic operations the algorithm uses.
    */
    function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }
    function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    /*
    * Calculate the MD5 of an array of little-endian words, and a bit length.
    */
    function binl_md5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << (len % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var i, olda, oldb, oldc, oldd,
            a =  1732584193,
            b = -271733879,
            c = -1732584194,
            d =  271733878;

        for (i = 0; i < x.length; i += 16) {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;

            a = md5_ff(a, b, c, d, x[i],       7, -680876936);
            d = md5_ff(d, a, b, c, x[i +  1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i +  2], 17,  606105819);
            b = md5_ff(b, c, d, a, x[i +  3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i +  4],  7, -176418897);
            d = md5_ff(d, a, b, c, x[i +  5], 12,  1200080426);
            c = md5_ff(c, d, a, b, x[i +  6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i +  7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i +  8],  7,  1770035416);
            d = md5_ff(d, a, b, c, x[i +  9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12],  7,  1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22,  1236535329);

            a = md5_gg(a, b, c, d, x[i +  1],  5, -165796510);
            d = md5_gg(d, a, b, c, x[i +  6],  9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14,  643717713);
            b = md5_gg(b, c, d, a, x[i],      20, -373897302);
            a = md5_gg(a, b, c, d, x[i +  5],  5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10],  9,  38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i +  4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i +  9],  5,  568446438);
            d = md5_gg(d, a, b, c, x[i + 14],  9, -1019803690);
            c = md5_gg(c, d, a, b, x[i +  3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i +  8], 20,  1163531501);
            a = md5_gg(a, b, c, d, x[i + 13],  5, -1444681467);
            d = md5_gg(d, a, b, c, x[i +  2],  9, -51403784);
            c = md5_gg(c, d, a, b, x[i +  7], 14,  1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i +  5],  4, -378558);
            d = md5_hh(d, a, b, c, x[i +  8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16,  1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i +  1],  4, -1530992060);
            d = md5_hh(d, a, b, c, x[i +  4], 11,  1272893353);
            c = md5_hh(c, d, a, b, x[i +  7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13],  4,  681279174);
            d = md5_hh(d, a, b, c, x[i],      11, -358537222);
            c = md5_hh(c, d, a, b, x[i +  3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i +  6], 23,  76029189);
            a = md5_hh(a, b, c, d, x[i +  9],  4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16,  530742520);
            b = md5_hh(b, c, d, a, x[i +  2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i],       6, -198630844);
            d = md5_ii(d, a, b, c, x[i +  7], 10,  1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i +  5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12],  6,  1700485571);
            d = md5_ii(d, a, b, c, x[i +  3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i +  1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i +  8],  6,  1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i +  6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21,  1309151649);
            a = md5_ii(a, b, c, d, x[i +  4],  6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i +  2], 15,  718787259);
            b = md5_ii(b, c, d, a, x[i +  9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return [a, b, c, d];
    }

    /*
    * Convert an array of little-endian words to a string
    */
    function binl2rstr(input) {
        var i,
            output = '';
        for (i = 0; i < input.length * 32; i += 8) {
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        }
        return output;
    }

    /*
    * Convert a raw string to an array of little-endian words
    * Characters >255 have their high-byte silently ignored.
    */
    function rstr2binl(input) {
        var i,
            output = [];
        output[(input.length >> 2) - 1] = undefined;
        for (i = 0; i < output.length; i += 1) {
            output[i] = 0;
        }
        for (i = 0; i < input.length * 8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
        }
        return output;
    }

    /*
    * Calculate the MD5 of a raw string
    */
    function rstr_md5(s) {
        return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
    }

    /*
    * Calculate the HMAC-MD5, of a key and some data (raw strings)
    */
    function rstr_hmac_md5(key, data) {
        var i,
            bkey = rstr2binl(key),
            ipad = [],
            opad = [],
            hash;
        ipad[15] = opad[15] = undefined;
        if (bkey.length > 16) {
            bkey = binl_md5(bkey, key.length * 8);
        }
        for (i = 0; i < 16; i += 1) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
        return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
    }

    /*
    * Convert a raw string to a hex string
    */
    function rstr2hex(input) {
        var hex_tab = '0123456789abcdef',
            output = '',
            x,
            i;
        for (i = 0; i < input.length; i += 1) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F) +
                hex_tab.charAt(x & 0x0F);
        }
        return output;
    }

    /*
    * Encode a string as utf-8
    */
    function str2rstr_utf8(input) {
        return unescape(encodeURIComponent(input));
    }

    /*
    * Take string arguments and return either raw or hex encoded strings
    */
    function raw_md5(s) {
        return rstr_md5(str2rstr_utf8(s));
    }
    function hex_md5(s) {
        return rstr2hex(raw_md5(s));
    }
    function raw_hmac_md5(k, d) {
        return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
    }
    function hex_hmac_md5(k, d) {
        return rstr2hex(raw_hmac_md5(k, d));
    }

    function md5(string, key, raw) {
        if (!key) {
            if (!raw) {
                return hex_md5(string);
            }
            return raw_md5(string);
        }
        if (!raw) {
            return hex_hmac_md5(key, string);
        }
        return raw_hmac_md5(key, string);
    }

    if (typeof define === 'function' && define.amd) {
        define(function () {
            return md5;
        });
    } else {
        $.md5 = md5;
    }
    window.md5 = md5;
    window.sum = md5;
}(this));

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
}

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

function canvasAttachManager(canvas, manager, app) {
	if(window.cantkRTV8) {
		window.pointer.emitPointers(canvas);
	}
	else if(!canvas.isNative) {
		window.pointer.emitPointers(canvas);
	}

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
			event = window.event || event ;
			if(EditorElement.imeOpen) return true;

			if(event && event.target && event.target.localName !== "canvas"){
				return cancelDefaultAction(event);
			}

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
	
//		console.log("onPointerDown.");
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
		
//		console.log("onPointerUp.");
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
			var target = e.target;
			if(target && target.tagName === "CANVAS") {
				var point = {};
				point.x = e.x + getScrollLeft();
				point.y = e.y + getScrollTop();

				manager.onPointerDown(point);
				manager.onLongPress(point);
				manager.onPointerUp(point);

				console.log("onGestureLongPress");
				return cancelDefaultAction(e);
			}
			else {
				return true;
			}
		}
	}

	canvas.addEventListener('gesturedoubletap', onGestureDoubleTap);
	canvas.addEventListener('gesturelongpress', onGestureLongPress);
	canvas.addEventListener('gesturescale', onGestureScale);
///////////////////////////////////////////////////////////////	
	var gViewPort = cantkGetViewPort();
	var gScreenHeight = screen.height;

	function handleInputMethodShow() {
//		console.log("input method show");
	}

	function handleInputMethodHide() {
//		console.log("input method hide");
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



/* Modernizr 2.5.3 (Custom Build) | MIT & BSD
 * Build: http://www.modernizr.com/download/#-touch-teststyles-prefixes
 */



window.Modernizr = (function( window, document, undefined ) {

    var version = '2.5.3',

    Modernizr = {},


    docElement = document.documentElement,

    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    inputElem  ,


    toString = {}.toString,

    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),



    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName, 


    injectElementWithStyles = function( rule, callback, nodes, testnames ) {

      var style, ret, node,
          div = document.createElement('div'),
                body = document.body, 
                fakeBody = body ? body : document.createElement('body');

      if ( parseInt(nodes, 10) ) {
                      while ( nodes-- ) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }

                style = ['&#173;','<style>', rule, '</style>'].join('');
      div.id = mod;
          (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if(!body){
                fakeBody.style.background = "";
          docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);
        !body ? fakeBody.parentNode.removeChild(fakeBody) : div.parentNode.removeChild(div);

      return !!ret;

    },
    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProperty;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProperty = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProperty = function (object, property) { 
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }


    if (!Function.prototype.bind) {
      Function.prototype.bind = function bind(that) {

        var target = this;

        if (typeof target != "function") {
            throw new TypeError();
        }

        var args = slice.call(arguments, 1),
            bound = function () {

            if (this instanceof bound) {

              var F = function(){};
              F.prototype = target.prototype;
              var self = new F;

              var result = target.apply(
                  self,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                  return result;
              }
              return self;

            } else {

              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );

            }

        };

        return bound;
      };
    }

    function setCss( str ) {
        mStyle.cssText = str;
    }

    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    function is( obj, type ) {
        return typeof obj === type;
    }

    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }


    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                            if (elem === false) return props[i];

                            if (is(item, 'function')){
                                return item.bind(elem || obj);
                }

                            return item;
            }
        }
        return false;
    }


    var testBundle = (function( styles, tests ) {
        var style = styles.join(''),
            len = tests.length;

        injectElementWithStyles(style, function( node, rule ) {
            var style = document.styleSheets[document.styleSheets.length - 1],
                                                    cssText = style ? (style.cssRules && style.cssRules[0] ? style.cssRules[0].cssText : style.cssText || '') : '',
                children = node.childNodes, hash = {};

            while ( len-- ) {
                hash[children[len].id] = children[len];
            }

                       Modernizr['touch'] = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch || (hash['touch'] && hash['touch'].offsetTop) === 9; 
                                }, len, tests);

    })([
                       ,['@media (',prefixes.join('touch-enabled),('),mod,')',
                                '{#touch{top:9px;position:absolute}}'].join('')           ],
      [
                       ,'touch'                ]);



    tests['touch'] = function() {
        return Modernizr['touch'];
    };



    for ( var feature in tests ) {
        if ( hasOwnProperty(tests, feature) ) {
                                    featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }
    setCss('');
    modElem = inputElem = null;


    Modernizr._version      = version;

    Modernizr._prefixes     = prefixes;

    Modernizr.testStyles    = injectElementWithStyles;
    return Modernizr;

})(this, this.document);
;

(function(exports) {
  var MOUSE_ID = 1;

  function Pointer(identifier, type, event) {
    this.screenX = event.screenX || 0;
    this.screenY = event.screenY || 0;
    this.pageX = event.pageX || 0;
    this.pageY = event.pageY || 0;
    this.x = event.x || 0;
    this.y = event.y || 0;
    this.clientX = event.clientX || 0;
    this.clientY = event.clientY || 0;
    this.tiltX = event.tiltX || 0;
    this.tiltY = event.tiltY || 0;
    this.pressure = event.pressure || 0.0;
    this.hwTimestamp = event.hwTimestamp || 0;
    this.pointerType = type;
    this.identifier = identifier;
  }

  var PointerTypes = {
    TOUCH: 'touch',
    MOUSE: 'mouse',
    PEN:   'pen'
  };

  function setMouse(mouseEvent) {
    mouseEvent.target.mouseEvent = mouseEvent;
  }

  function unsetMouse(mouseEvent) {
    mouseEvent.target.mouseEvent = null;
  }

  function setTouch(touchEvent) {
    touchEvent.target.touchList = touchEvent.targetTouches;
  }

  /**
   * Returns an array of all pointers currently on the screen.
   */
  function getPointerList() {
    // Note: "this" is the element.
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

  function createCustomEvent(eventName, target, payload) {
    //var event = document.createEvent('Event');
    //event.initEvent(eventName, true, true);
    var event = {};
    for (var k in payload) {
      event[k] = payload[k];
    }
    event.type = eventName;
    event.target = target;
    if(target.dispatchCustomEvent) {
		target.dispatchCustomEvent(event);
    }
    else {
    	target.dispatchEvent(event);
    }
  }

  /*************** Mouse event handlers *****************/

  function mouseDownHandler(event) {
    event.preventDefault();
    setMouse(event);
    var payload = {
      pointerType: 'mouse',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointerdown', event.target, payload);
  }

  function mouseMoveHandler(event) {
    event.preventDefault();
    //if (event.target.mouseEvent) {
    setMouse(event);
   //}
    var payload = {
      pointerType: 'mouse',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointermove', event.target, payload);
  }

  function mouseUpHandler(event) {
    event.preventDefault();
    //unsetMouse(event);
    setMouse(event);
    var payload = {
      pointerType: 'mouse',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointerup', event.target, payload);
  }

  /*************** Touch event handlers *****************/

  function touchStartHandler(event) {
    event.preventDefault();
    setTouch(event);
    var payload = {
      pointerType: 'touch',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointerdown', event.target, payload);
  }

  function touchMoveHandler(event) {
    event.preventDefault();
    setTouch(event);
    var payload = {
      pointerType: 'touch',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointermove', event.target, payload);
  }

  function touchEndHandler(event) {
    event.preventDefault();
    setTouch(event);
    var payload = {
      pointerType: 'touch',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointerup', event.target, payload);
  }

  function mouseOutHandler(event) {
    if (event.target.mouseEvent) {
      event.preventDefault();
      //unsetMouse(event);
      var payload = {
        pointerType: 'mouse',
        getPointerList: getPointerList.bind(this),
        originalEvent: event
      };
      createCustomEvent('pointerup', event.target, payload);
    }
  }

  /*************** MSIE Pointer event handlers *****************/

  function pointerDownHandler(event) {
    if (event.pointerType == 2) {
      event.textPointerType = PointerTypes.TOUCH;
    } else if (event.pointerType == 3) {
      event.textPointerType = PointerTypes.PEN;
    } else if (event.pointerType == 4) {
      event.textPointerType = PointerTypes.MOUSE;
    }
    if (event.textPointerType == PointerTypes.MOUSE) {
        event.target.msMouseDown = true;
    }
    if (!event.target.msPointerList) event.target.msPointerList = {};
    event.target.msPointerList[event.pointerId] = event;
    var payload = {
      pointerType: event.textPointerType,
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };

    createCustomEvent('pointerdown', event.target, payload);
  }

  function pointerMoveHandler(event) {
    if (event.pointerType == 2) {
      event.textPointerType = PointerTypes.TOUCH;
    } else if (event.pointerType == 3) {
      event.textPointerType = PointerTypes.PEN;
    } else if (event.pointerType == 4) {
      event.textPointerType = PointerTypes.MOUSE;
    }
    if (event.textPointerType == PointerTypes.MOUSE && !event.target.msMouseDown) {
      return;
    }
    if (!event.target.msPointerList) event.target.msPointerList = {};
    event.target.msPointerList[event.pointerId] = event;
    var payload = {
      pointerType: event.textPointerType,
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointermove', event.target, payload);
  }

  function pointerUpHandler(event) {
    if (event.target.msPointerList) {
      delete event.target.msPointerList[event.pointerId];
    }
    if (event.pointerType == 2) {
      event.textPointerType = PointerTypes.TOUCH;
    } else if (event.pointerType == 3) {
      event.textPointerType = PointerTypes.PEN;
    } else if (event.pointerType == 4) {
      event.textPointerType = PointerTypes.MOUSE;
    }
    if (event.textPointerType == PointerTypes.MOUSE) {
        event.target.msMouseDown = false;
    }
    var payload = {
      pointerType: event.textPointerType,
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointerup', event.target, payload);
  }

  /**
   * Causes the passed in element to broadcast pointer events instead
   * of mouse/touch/etc events.
   */
  function emitPointers(el) {
    if (!el.isPointerEmitter) {
      // Latch on to all relevant events for this element.
      if (isPointer()) {
        el.addEventListener('pointerdown', pointerDownHandler);
        el.addEventListener('pointermove', pointerMoveHandler);
        el.addEventListener('pointerup', pointerUpHandler);
      } else if (isMSPointer()) {
        el.addEventListener('MSPointerDown', pointerDownHandler);
        el.addEventListener('MSPointerMove', pointerMoveHandler);
        el.addEventListener('MSPointerUp', pointerUpHandler);
      } else {
        if (isTouch()) {
          el.addEventListener('touchstart', touchStartHandler);
          el.addEventListener('touchmove', touchMoveHandler);
          el.addEventListener('touchend', touchEndHandler);
        }

        if(!isAndroid()) {
			el.addEventListener('mousedown', mouseDownHandler);
			el.addEventListener('mousemove', mouseMoveHandler);
			el.addEventListener('mouseup', mouseUpHandler);
			// Necessary for the edge case that the mouse is down and you drag out of
			// the area.
			el.addEventListener('mouseout', mouseOutHandler);
        }
      }

      el.listeners = {};
      el.addEventListener = function(type, listener, useCapture) {
      	var listeners = el.listeners[type] ? el.listeners[type] : [];
      	listeners.push(listener);
      	el.listeners[type] = listeners;
//      	console.log("addEventListener: " + type);
      	return;
      }

      el.dispatchCustomEvent = function(event) {
      	var type = event.type;
      	var listeners = el.listeners[type] ? el.listeners[type] : [];

        for(var i = 0; i < listeners.length; i++) {
        	var iter = listeners[i];
        	iter(event);
        }

        return;
      }
      
      for(var type in Gesture._gestureHandlers) {
          var handler = Gesture._gestureHandlers[type];
		  if (handler) {
			handler(el);
		  }
      }

      el.isPointerEmitter = true;
    }
  }

  /**
   * @return {Boolean} Returns true iff this user agent supports touch events.
   */
  function isTouch() {
    return Modernizr.touch;
  }

  /**
   * @return {Boolean} Returns true iff this user agent supports MSIE pointer
   * events.
   */
  function isMSPointer() {
    return window.navigator.msPointerEnabled;
  }

   /**
   * @return {Boolean} Returns true iff this user agent supports pointer
   * events.
   */
  function isPointer() {
    return window.navigator.pointerEnabled;
  }

  /**
   * Option 1: Require emitPointers call on all pointer event emitters.
   */
  exports.pointer = {
    emitPointers: emitPointers
  };

  /**
   * Option 2: Replace addEventListener with a custom version.
   */
  function augmentAddEventListener(baseElementClass, customEventListener) {
    var oldAddEventListener = baseElementClass.prototype.addEventListener;
    baseElementClass.prototype.addEventListener = function(type, listener, useCapture) {
      customEventListener.call(this, type, listener, useCapture);
      oldAddEventListener.call(this, type, listener, useCapture);
    };
  }

//  function synthesizePointerEvents(type, listener, useCapture) {
//    if (type.indexOf('pointer') === 0) {
//      emitPointers(this);
//    }
//  }
//
//  // Note: Firefox doesn't work like other browsers... overriding HTMLElement
//  // doesn't actually affect anything. Special case for Firefox:
//  if (navigator.userAgent.match(/Firefox/)) {
//    // TODO: fix this for the general case.
//    augmentAddEventListener(HTMLDivElement, synthesizePointerEvents);
//    augmentAddEventListener(HTMLCanvasElement, synthesizePointerEvents);
//  } else {
//    augmentAddEventListener(HTMLElement, synthesizePointerEvents);
//  }

  exports._createCustomEvent = createCustomEvent;
  exports._augmentAddEventListener = augmentAddEventListener;
  exports.PointerTypes = PointerTypes;
})(window);

(function(exports) {

  function synthesizeGestureEvents(type, listener, useCapture) {
    if (type.indexOf('gesture') === 0) {
      var handler = Gesture._gestureHandlers[type];
      if (handler) {
        handler(this);
      } else {
        console.error('Warning: no handler found for {{evt}}.'
                      .replace('{{evt}}', type));
      }
    }
  }

  // Note: Firefox doesn't work like other browsers... overriding HTMLElement
  // doesn't actually affect anything. Special case for Firefox:
  //if (navigator.userAgent.match(/Firefox/)) {
  // TODO: fix this for the general case.
  //  window._augmentAddEventListener(HTMLDivElement, synthesizeGestureEvents);
  //  window._augmentAddEventListener(HTMLCanvasElement, synthesizeGestureEvents);
  //} else {
  //  window._augmentAddEventListener(HTMLElement, synthesizeGestureEvents);
  //}
  //window._augmentAddEventListener(HTMLCanvasElement, synthesizeGestureEvents);

  exports.Gesture = exports.Gesture || {};
  exports.Gesture._gestureHandlers = exports.Gesture._gestureHandlers || {};

})(window);

/**
 * Gesture recognizer for the `doubletap` gesture.
 *
 * Taps happen when an element is pressed and then released.
 */
(function(exports) {
  var DOUBLETAP_TIME = isMobile() ? 500 : 300;
  var WIGGLE_THRESHOLD = 30;

  /**
   * A simple object for storing the position of a pointer.
   */
  function PointerPosition(pointer) {
    this.x = pointer.clientX;
    this.y = pointer.clientY;
  }

  /**
   * calculate the squared distance of the given pointer from this 
   * PointerPosition's pointer
   */
  PointerPosition.prototype.calculateSquaredDistance = function(pointer) {
    var dx = this.x - pointer.clientX;
    var dy = this.y - pointer.clientY;
    return dx*dx + dy*dy;
  };

  function pointerDown(e) {
    var pointers = e.getPointerList();
    if (pointers.length != 1) return;
    var now = new Date();
    var rightButton = e.originalEvent && isRightMouseEvent(e.originalEvent);
    if (now - this.lastDownTime < DOUBLETAP_TIME && this.lastPosition && this.lastPosition.calculateSquaredDistance(pointers[0]) < WIGGLE_THRESHOLD * WIGGLE_THRESHOLD && !rightButton) {
      this.isDoubleTap = true;
      this.eTarget = e.target;
    }
    this.lastPosition = new PointerPosition(pointers[0]);
    this.lastDownTime = now;
  }
  
  function pointerUp(e) {
      if(this.isDoubleTap) {
		  this.isDoubleTap = false;
		  this.lastDownTime = 0;
		  this.lastPosition = null;

		  var payload = {
		  };
		  clearTimeout(this.longPressTimer);
		  window._createCustomEvent('gesturedoubletap', this.eTarget, payload);
      }
  }

  /**
   * Make the specified element create gesturetap events.
   */
  function emitDoubleTaps(el) {
    el.addEventListener('pointerdown', pointerDown);
    el.addEventListener('pointerup', pointerUp);
  }

  exports.Gesture._gestureHandlers.gesturedoubletap = emitDoubleTaps;

})(window);

/**
 * Gesture recognizer for the `longpress` gesture.
 *
 * Longpress happens when pointer is pressed and doesn't get released
 * for a while (without movement).
 */
(function(exports) {
  var LONGPRESS_TIME = 600;
  var WIGGLE_THRESHOLD = 5;

  /**
   * A simple object for storing the position of a pointer.
   */
  function PointerPosition(pointer) {
    this.x = pointer.clientX;
    this.y = pointer.clientY;
  }

  /**
   * calculate the squared distance of the given pointer from this 
   * PointerPosition's pointer
   */
  PointerPosition.prototype.calculateSquaredDistance = function(pointer) {
    var dx = this.x - pointer.clientX;
    var dy = this.y - pointer.clientY;
    return dx*dx + dy*dy;
  };


  function pointerDown(e) {

    // Something went down. Clear the last press if there was one.
    clearTimeout(this.longPressTimer);

    var pointers = e.getPointerList();

    // check that we only have one pointer down
    if(pointers.length === 1) {

      // cache the position of the pointer on the target
      e.target.longpressInitPosition = new PointerPosition(pointers[0]);

      // Start a timer.
      this.longPressTimer = setTimeout(function() {
        payload = {};
        window._createCustomEvent('gesturelongpress', e.target, payload);
      }, LONGPRESS_TIME);

    }
    
  }

  function pointerMove(e) {
    var pointers = e.getPointerList();
    
    if(e.pointerType === PointerTypes.MOUSE) {
      // if the pointer is a mouse we cancel the longpress 
      // as soon as it starts wiggling around
      clearTimeout(this.longPressTimer);
    }
    else if(pointers.length === 1) {
      // but if the pointer is something else we allow a 
      // for a bit of smudge space
      var pos = e.target.longpressInitPosition;
      
      if(pos && pos.calculateSquaredDistance(pointers[0]) > WIGGLE_THRESHOLD * WIGGLE_THRESHOLD) {
        clearTimeout(this.longPressTimer);
      }
    }
    
  }

  function pointerUp(e) {
    clearTimeout(this.longPressTimer);
  }

  /**
   * Make the specified element create gesturetap events.
   */
  function emitLongPresses(el) {
    el.addEventListener('pointerdown', pointerDown);
    el.addEventListener('pointermove', pointerMove);
    el.addEventListener('pointerup', pointerUp);
  }

  exports.Gesture._gestureHandlers.gesturelongpress = emitLongPresses;

})(window);

/**
 * Gesture recognizer for the `scale` gesture.
 *
 * Scale happens when two fingers are placed on the screen, and then
 * they move so the the distance between them is greater or less than a
 * certain threshold.
 */
(function(exports) {

  var SCALE_THRESHOLD = 0.2;

  function PointerPair(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  /**
   * Calculate the center of the two pointers.
   */
  PointerPair.prototype.center = function() {
    return [(this.p1.pageX + this.p2.pageX) / 2, (this.p1.pageY + this.p2.pageY) / 2];
  };

  /**
   * Calculate the distance between the two pointers.
   */
  PointerPair.prototype.span = function() {
    var dx = this.p1.pageX - this.p2.pageX;
    var dy = this.p1.pageY - this.p2.pageY;
    return Math.sqrt(dx*dx + dy*dy);
  };

  /**
   * Given a reference pair, calculate the scale multiplier difference.
   */
  PointerPair.prototype.scaleSince = function(referencePair) {
    var originalSpan = this.span();
    var referenceSpan = referencePair.span();
    if (referenceSpan === 0) {
      return 0;
    }
    else return originalSpan / referenceSpan;
  };

  function pointerDown(e) {
    var pointerList = e.getPointerList();
    // If there are exactly two pointers down,
    if (pointerList.length == 2) {
      // Record the initial pointer pair.
      e.target.scaleReferencePair = new PointerPair(pointerList[0],
                                                    pointerList[1]);
        var payload = {
          scale: 1,
          scaleStart: true
        };
        window._createCustomEvent('gesturescale', e.target, payload);
        this.isGestureScale = true;
    }
    else {
        this.isGestureScale = false;
    }
  }

  function pointerMove(e) {
    var pointerList = e.getPointerList();
    // If there are two pointers down, compare to the initial pointer pair.
    if (pointerList.length == 2 && e.target.scaleReferencePair) {
      var pair = new PointerPair(pointerList[0], pointerList[1]);
      // Compute the scaling value according to the difference.
      var scale = pair.scaleSince(e.target.scaleReferencePair);
      // If the movement is drastic enough:
      if (Math.abs(1 - scale) > SCALE_THRESHOLD) {
        // Create the scale event as a result.
        var payload = {
          scale: scale,
          centerX: (e.target.scaleReferencePair.p1.clientX + e.target.scaleReferencePair.p2.clientX) / 2,
          centerY: (e.target.scaleReferencePair.p1.clientY + e.target.scaleReferencePair.p2.clientY) / 2
        };
        window._createCustomEvent('gesturescale', e.target, payload);
      }
    }
  }

  function pointerUp(e) {
  	if(this.isGestureScale) {
        var payload = {
          scale: 1,
          scaleEnd: true
        };
        window._createCustomEvent('gesturescale', e.target, payload);
	}

    e.target.scaleReferencePair = null;
  }

  /**
   * Make the specified element create gesturetap events.
   */
  function emitScale(el) {
    el.addEventListener('pointerdown', pointerDown);
    el.addEventListener('pointermove', pointerMove);
    el.addEventListener('pointerup', pointerUp);
  }

  exports.Gesture._gestureHandlers.gesturescale = emitScale;

})(window);
/*!
 *  howler.js v2.0.0-beta
 *  howlerjs.com
 *
 *  (c) 2013-2015, James Simpson of GoldFire Studios
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
  setupAudioContext();

  // Create a master gain node.
  if (usingWebAudio) {
    var masterGain = (typeof ctx.createGain === 'undefined') ? ctx.createGainNode() : ctx.createGain();
    masterGain.gain.value = 1;
    masterGain.connect(ctx.destination);
  }

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

      // Set to false to disable the auto iOS enabler.
      self.iOSAutoEnable = true;

      // No audio is available on this system if this is set to true.
      self.noAudio = noAudio;

      // This will be true if the Web Audio API is available.
      self.usingWebAudio = usingWebAudio;

      // Expose the AudioContext when using Web Audio.
      self.ctx = ctx;

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
      
      self._codecs = {
        mp3: !!(mpegTest || audioTest.canPlayType('audio/mp3;').replace(/^no$/, '')),
        mpeg: !!mpegTest,
        opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ''),
        ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
        wav: !!audioTest.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ''),
        aac: !!audioTest.canPlayType('audio/aac;').replace(/^no$/, ''),
        m4a: !!(audioTest.canPlayType('audio/x-m4a;') || audioTest.canPlayType('audio/m4a;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
        mp4: !!(audioTest.canPlayType('audio/x-mp4;') || audioTest.canPlayType('audio/mp4;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
        weba: !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ''),
        webm: !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, '')
      };

		console.log("codec:" + JSON.stringify(self._codecs, null, "\t"));
      return self;
    },

    /**
     * iOS will only allow audio to be played after a user interaction.
     * Attempt to automatically unlock audio on the first user interaction.
     * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
     * @return {Howler}
     */
    _enableiOSAudio: function() {
      var self = this || Howler;

      // Only run this on iOS if audio isn't already eanbled.
      if (ctx && (self._iOSEnabled || !/iPhone|iPad|iPod/i.test(navigator.userAgent))) {
        return;
      }

      self._iOSEnabled = false;

      // Call this method on touch start to create and play a buffer,
      // then check if the audio actually played to determine if
      // audio has now been unlocked on iOS.
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
        setTimeout(function() {
          if ((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
            // Update the unlocked state and prevent this check from happening again.
            self._iOSEnabled = true;
            self.iOSAutoEnable = false;

            // Remove the touch start listener.
            window.removeEventListener('touchstart', unlock, false);
          }
        }, 0);
      };

      // Setup a touch start listener to attempt an unlock in.
      window.addEventListener('touchstart', unlock, false);

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
      self._ext = o.ext || null;
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
      self._loaded = false;
      self._sounds = [];
      self._endTimers = {};

      // Setup event listeners.
      self._onend = o.onend ? [{fn: o.onend}] : [];
      self._onfaded = o.onfaded ? [{fn: o.onfaded}] : [];
      self._onload = o.onload ? [{fn: o.onload}] : [];
      self._onloaderror = o.onloaderror ? [{fn: o.onloaderror}] : [];
      self._onpause = o.onpause ? [{fn: o.onpause}] : [];
      self._onplay = o.onplay ? [{fn: o.onplay}] : [];

      // Web Audio or HTML5 Audio?
      self._webAudio = usingWebAudio && !self._html5;

      // Automatically try to enable audio on iOS.
      if (typeof ctx !== 'undefined' && ctx && Howler.iOSAutoEnable) {
        Howler._enableiOSAudio();
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
        self._emit('loaderror');
        return;
      }

      // Make sure our source is in an array.
      if (typeof self._src === 'string') {
        self._src = [self._src];
      }

      // Loop through the sources and pick the first one that is compatible.
      for (var i=0; i<self._src.length; i++) {
        var ext, str;

        if (self._ext && self._ext[i]) {
          // If an extension was specified, use that instead.
          ext = self._ext[i];
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
          
          //tangide
          if(ext === "php") {
          	ext = str.extname();
          }
        }

        // Check if this extension is available.
        if (Howler.codecs(ext)) {
          url = self._src[i];
          break;
        }
        else {
        	console.log("not found codecs for:" + self._src[i]);
        }
      }

      if (!url) {
        self._emit('loaderror');
        return;
      }

      self._src = url;

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
      if (!self._loaded && !self._sprite[sprite]) {
        self.once('load', function() {
          self.play(self._soundById(sound._id) ? sound._id : undefined);
        });
        return sound._id;
      }

      // Don't play the sound if an id was passed and it is already playing.
      if (id && !sound._paused) {
        return sound._id;
      }

      // Determine how long to play for and where to start playing.
      var seek = sound._seek > 0 ? sound._seek : self._sprite[sprite][0] / 1000;
      var duration = ((self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000) - seek;

      // Create a timer to fire at the end of playback or the start of a new loop.
      var ended = function() {
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
          self._endTimers[sound._id] = setTimeout(ended, ((sound._stop - sound._start) * 1000) / Math.abs(self._rate));
        }

        // Mark the node as paused.
        if (self._webAudio && !loop) {
          sound._paused = true;
          sound._ended = true;
          sound._seek = sound._start || 0;
          self._clearTimer(sound._id);

          // Clean up the buffer source.
          sound._node.bufferSource = null;
        }

        // When using a sprite, end the track.
        if (!self._webAudio && !loop) {
          self.stop(sound._id);
        }
      };
      self._endTimers[sound._id] = setTimeout(ended, (duration * 1000) / Math.abs(self._rate));

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
            node.bufferSource.noteGrainOn(0, seek, duration);
          } else {
            node.bufferSource.start(0, seek, duration);
          }

          // Start a new timer if none is present.
          if (!self._endTimers[sound._id]) {
            self._endTimers[sound._id] = setTimeout(ended, (duration * 1000) / Math.abs(self._rate));
          }

          if (!args[1]) {
            setTimeout(function() {
              self._emit('play', sound._id);
            }, 0);
          }
        };

        if (self._loaded) {
          playWebAudio();
        } else {
          // Wait for the audio to load and then begin playback.
          self.once('load', playWebAudio);

          // Cancel the end timer.
          self._clearTimer(sound._id);
        }
      } else {
        // Fire this when the sound is ready to play to begin HTML5 Audio playback.
        var playHtml5 = function() {
          node.currentTime = seek;
          node.muted = sound._muted || self._muted || Howler._muted || node.muted;
          node.volume = sound._volume * Howler.volume();
          node.playbackRate = self._rate;
          setTimeout(function() {
            node.play();
            if (!args[1]) {
              self._emit('play', sound._id);
            }
          }, 0);
        };

        // Play immediately if ready, or wait for the 'canplaythrough'e vent.
        if (node.readyState === 4 || !node.readyState && navigator.isCocoonJS) {
          playHtml5();
        } else {
          var listener = function() {
            // Setup the new end timer.
            self._endTimers[sound._id] = setTimeout(ended, (duration * 1000) / Math.abs(self._rate));

            // Begin playback.
            playHtml5();

            // Clear this listener.
            node.removeEventListener('canplaythrough', listener, false);
          };
          node.addEventListener('canplaythrough', listener, false);

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

      // Wait for the sound to begin playing before pausing it.
      if (!self._loaded) {
        self.once('play', function() {
          self.pause(id);
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
          } else if (!isNaN(sound._node.duration)) {
            sound._node.pause();
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

      // Wait for the sound to begin playing before stopping it.
      if (!self._loaded) {
        if (typeof self._sounds[0]._sprite !== 'undefined') {
          self.once('play', function() {
            self.stop(id);
          });
        }

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

          if (self._webAudio && sound._node) {
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
          } else if (sound._node && !isNaN(sound._node.duration)) {
            sound._node.pause();
            sound._node.currentTime = sound._start || 0;
          }
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

      // Wait for the sound to begin playing before muting it.
      if (!self._loaded) {
        self.once('play', function() {
          self.mute(muted, id);
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
      } else if (args.length === 2) {
        vol = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // Update the volume or return the current volume.
      var sound;
      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
        // Wait for the sound to begin playing before changing the volume.
        if (!self._loaded) {
          self.once('play', function() {
            self.volume.apply(self, args);
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

            if (self._webAudio && sound._node) {
              sound._node.gain.setValueAtTime(vol * Howler.volume(), ctx.currentTime);
            } else if (sound._node) {
              sound._node.volume = vol * Howler.volume();
            }
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

      // Wait for the sound to play before fading.
      if (!self._loaded) {
        self.once('play', function() {
          self.fade(from, to, len, id);
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
          if (self._webAudio) {
            var currentTime = ctx.currentTime;
            var end = currentTime + (len / 1000);
            sound._volume = from;
            sound._node.gain.setValueAtTime(from, currentTime);
            sound._node.gain.linearRampToValueAtTime(to, end);

            // Fire the event when complete.
            setTimeout(function(id, sound) {
              setTimeout(function() {
                sound._volume = to;
                self._emit('faded', id);
              }, end - ctx.currentTime > 0 ? Math.ceil((end - ctx.currentTime) * 1000) : 0);
            }.bind(self, ids[i], sound), len);
          } else {
            var diff = Math.abs(from - to);
            var dir = from > to ? 'out' : 'in';
            var steps = diff / 0.01;
            var stepLen = len / steps;
            
            (function() {
              var vol = from;
              var interval = setInterval(function(id) {
                // Update the volume amount.
                vol += (dir === 'in' ? 0.01 : -0.01);

                // Make sure the volume is in the right bounds.
                vol = Math.max(0, vol);
                vol = Math.min(1, vol);

                // Round to within 2 decimal points.
                vol = Math.round(vol * 100) / 100;

                // Change the volume.
                self.volume(vol, id);

                // When the fade is complete, stop it and fire event.
                if (vol === to) {
                  clearInterval(interval);
                  self._emit('faded', id);
                }
              }.bind(self, ids[i]), stepLen);
            })();
          }
        }
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
          if (self._webAudio && sound._node) {
            sound._node.bufferSource.loop = loop;
          }
        }
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

      // Wait for the sound to load before seeking it.
      if (!self._loaded) {
        self.once('load', function() {
          self.seek.apply(self, args);
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
        } else {
          if (self._webAudio) {
            return (sound._seek + self.playing(id) ? ctx.currentTime - sound._playStart : 0);
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
     * @return {Number} Audio duration.
     */
    duration: function() {
      return this._duration;
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
          sounds[i]._node.removeEventListener('canplaythrough', sounds[i]._loadFn, false);
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
      self = null;

      return null;
    },

    /**
     * Listen to a custom event.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to call.
     * @param  {Number}   id    (optional) Only listen to events for this sound.
     * @return {Howl}
     */
    on: function(event, fn, id) {
      var self = this;
      var events = self['_on' + event];

      if (typeof fn === 'function') {
        events.push({id: id, fn: fn});
      }

      return self;
    },

    /**
     * Remove a custom event.
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
      } else {
        // Clear out all events of this type.
        events = [];
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

      // Create the listener method.
      var listener = function() {
        // Call the passed function.
        fn.apply(self, arguments);

        // Clear the listener.
        self.off(event, listener, id);
      };

      // Setup the event listener.
      self.on(event, listener, id);

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
      for (var i=0; i<events.length; i++) {
        if (!events[i].id || events[i].id === id) {
          setTimeout(function(fn) {
            fn.call(this, id, msg);
          }.bind(self, events[i].fn), 0);
        }
      }

      console.log("howler emit:" + event);
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
      self._seek = 0;
      self._paused = true;
      self._ended = true;

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
        self._node.addEventListener('canplaythrough', self._loadFn, false);

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
      self._seek = 0;
      self._paused = true;
      self._ended = true;
      self._sprite = null;

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

      if (!parent._loaded) {
        parent._loaded = true;
        parent._emit('load');
      }

      if (parent._autoplay) {
        parent.play();
      }

      // Clear the event listener.
      self._node.removeEventListener('canplaythrough', self._loadFn, false);
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

        xhr.crossOrigin = "Anonymous";
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
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

      console.log("to decodeAudioData: " + self._src + " length:" + arraybuffer.byteLength);
      ctx.decodeAudioData(arraybuffer, function(buffer) {
        if (buffer) {
          cache[self._src] = buffer;
          loadSound(self, buffer);
          console.log("load " + self._src + " duration:" + buffer.duration);
        }
        else {
          console.log("load " + self._src + " error buffer is null");
        }
      }, function() {
        self._emit('loaderror');
          console.log("load " + self._src + " error: decodeAudioData failed.");
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
      if (!self._loaded) {
        self._loaded = true;
        self._emit('load');
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
        console.log("AudioContext supported");
      } else if (typeof webkitAudioContext !== 'undefined') {
        ctx = new webkitAudioContext();
        console.log("webkitAudioContext supported");
      } else {
        usingWebAudio = false;
        console.log("Web Audio not supported");
      }
    } catch(e) {
      usingWebAudio = false;
      console.log(JSON.stringify(e));
    }

    if (!usingWebAudio) {
      if (typeof Audio !== 'undefined') {
        try {
          new Audio();
        } catch(e) {
          noAudio = true;
        }
      } else {
        noAudio = true;
      }
    }

    if(noAudio) {
    	console.log("No Audio Support.");
    }
    if(!usingWebAudio) {
    	console.log("Not Using WebAudio");
    }
  }

  // Add support for AMD (Asynchronous Module Definition) libraries such as require.js.
  if (typeof define === 'function' && define.amd) {
    define('howler', function() {
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
  }
})();

// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.3.3
var LZString = {
  
  
  // private property
  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  _f : String.fromCharCode,
  
  compressToBase64 : function (input) {
    if (input == null) return "";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    
    input = LZString.compress(input);
    
    while (i < input.length*2) {
      
      if (i%2==0) {
        chr1 = input.charCodeAt(i/2) >> 8;
        chr2 = input.charCodeAt(i/2) & 255;
        if (i/2+1 < input.length) 
          chr3 = input.charCodeAt(i/2+1) >> 8;
        else 
          chr3 = NaN;
      } else {
        chr1 = input.charCodeAt((i-1)/2) & 255;
        if ((i+1)/2 < input.length) {
          chr2 = input.charCodeAt((i+1)/2) >> 8;
          chr3 = input.charCodeAt((i+1)/2) & 255;
        } else 
          chr2=chr3=NaN;
      }
      i+=3;
      
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      
      output = output +
        LZString._keyStr.charAt(enc1) + LZString._keyStr.charAt(enc2) +
          LZString._keyStr.charAt(enc3) + LZString._keyStr.charAt(enc4);
      
    }
    
    return output;
  },
  
  decompressFromBase64 : function (input) {
    if (input == null) return "";
    var output = "",
        ol = 0, 
        output_,
        chr1, chr2, chr3,
        enc1, enc2, enc3, enc4,
        i = 0, f=LZString._f;
    
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    
    while (i < input.length) {
      
      enc1 = LZString._keyStr.indexOf(input.charAt(i++));
      enc2 = LZString._keyStr.indexOf(input.charAt(i++));
      enc3 = LZString._keyStr.indexOf(input.charAt(i++));
      enc4 = LZString._keyStr.indexOf(input.charAt(i++));
      
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      
      if (ol%2==0) {
        output_ = chr1 << 8;
        
        if (enc3 != 64) {
          output += f(output_ | chr2);
        }
        if (enc4 != 64) {
          output_ = chr3 << 8;
        }
      } else {
        output = output + f(output_ | chr1);
        
        if (enc3 != 64) {
          output_ = chr2 << 8;
        }
        if (enc4 != 64) {
          output += f(output_ | chr3);
        }
      }
      ol+=3;
    }
    
    return LZString.decompress(output);
    
  },

  compressToUTF16 : function (input) {
    if (input == null) return "";
    var output = "",
        i,c,
        current,
        status = 0,
        f = LZString._f;
    
    input = LZString.compress(input);
    
    for (i=0 ; i<input.length ; i++) {
      c = input.charCodeAt(i);
      switch (status++) {
        case 0:
          output += f((c >> 1)+32);
          current = (c & 1) << 14;
          break;
        case 1:
          output += f((current + (c >> 2))+32);
          current = (c & 3) << 13;
          break;
        case 2:
          output += f((current + (c >> 3))+32);
          current = (c & 7) << 12;
          break;
        case 3:
          output += f((current + (c >> 4))+32);
          current = (c & 15) << 11;
          break;
        case 4:
          output += f((current + (c >> 5))+32);
          current = (c & 31) << 10;
          break;
        case 5:
          output += f((current + (c >> 6))+32);
          current = (c & 63) << 9;
          break;
        case 6:
          output += f((current + (c >> 7))+32);
          current = (c & 127) << 8;
          break;
        case 7:
          output += f((current + (c >> 8))+32);
          current = (c & 255) << 7;
          break;
        case 8:
          output += f((current + (c >> 9))+32);
          current = (c & 511) << 6;
          break;
        case 9:
          output += f((current + (c >> 10))+32);
          current = (c & 1023) << 5;
          break;
        case 10:
          output += f((current + (c >> 11))+32);
          current = (c & 2047) << 4;
          break;
        case 11:
          output += f((current + (c >> 12))+32);
          current = (c & 4095) << 3;
          break;
        case 12:
          output += f((current + (c >> 13))+32);
          current = (c & 8191) << 2;
          break;
        case 13:
          output += f((current + (c >> 14))+32);
          current = (c & 16383) << 1;
          break;
        case 14:
          output += f((current + (c >> 15))+32, (c & 32767)+32);
          status = 0;
          break;
      }
    }
    
    return output + f(current + 32);
  },
  

  decompressFromUTF16 : function (input) {
    if (input == null) return "";
    var output = "",
        current,c,
        status=0,
        i = 0,
        f = LZString._f;
    
    while (i < input.length) {
      c = input.charCodeAt(i) - 32;
      
      switch (status++) {
        case 0:
          current = c << 1;
          break;
        case 1:
          output += f(current | (c >> 14));
          current = (c&16383) << 2;
          break;
        case 2:
          output += f(current | (c >> 13));
          current = (c&8191) << 3;
          break;
        case 3:
          output += f(current | (c >> 12));
          current = (c&4095) << 4;
          break;
        case 4:
          output += f(current | (c >> 11));
          current = (c&2047) << 5;
          break;
        case 5:
          output += f(current | (c >> 10));
          current = (c&1023) << 6;
          break;
        case 6:
          output += f(current | (c >> 9));
          current = (c&511) << 7;
          break;
        case 7:
          output += f(current | (c >> 8));
          current = (c&255) << 8;
          break;
        case 8:
          output += f(current | (c >> 7));
          current = (c&127) << 9;
          break;
        case 9:
          output += f(current | (c >> 6));
          current = (c&63) << 10;
          break;
        case 10:
          output += f(current | (c >> 5));
          current = (c&31) << 11;
          break;
        case 11:
          output += f(current | (c >> 4));
          current = (c&15) << 12;
          break;
        case 12:
          output += f(current | (c >> 3));
          current = (c&7) << 13;
          break;
        case 13:
          output += f(current | (c >> 2));
          current = (c&3) << 14;
          break;
        case 14:
          output += f(current | (c >> 1));
          current = (c&1) << 15;
          break;
        case 15:
          output += f(current | c);
          status=0;
          break;
      }
      
      
      i++;
    }
    
    return LZString.decompress(output);
    //return output;
    
  },


  
  compress: function (uncompressed) {
    if (uncompressed == null) return "";
    var i, value,
        context_dictionary= {},
        context_dictionaryToCreate= {},
        context_c="",
        context_wc="",
        context_w="",
        context_enlargeIn= 2, // Compensate for the first entry which should not count
        context_dictSize= 3,
        context_numBits= 2,
        context_data_string="", 
        context_data_val=0, 
        context_data_position=0,
        ii,
        f=LZString._f;
    
    for (ii = 0; ii < uncompressed.length; ii += 1) {
      context_c = uncompressed.charAt(ii);
      if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
        context_dictionary[context_c] = context_dictSize++;
        context_dictionaryToCreate[context_c] = true;
      }
      
      context_wc = context_w + context_c;
      if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
        context_w = context_wc;
      } else {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
          if (context_w.charCodeAt(0)<256) {
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1);
              if (context_data_position == 15) {
                context_data_position = 0;
                context_data_string += f(context_data_val);
                context_data_val = 0;
              } else {
                context_data_position++;
              }
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<8 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == 15) {
                context_data_position = 0;
                context_data_string += f(context_data_val);
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          } else {
            value = 1;
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1) | value;
              if (context_data_position == 15) {
                context_data_position = 0;
                context_data_string += f(context_data_val);
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<16 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == 15) {
                context_data_position = 0;
                context_data_string += f(context_data_val);
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == 15) {
              context_data_position = 0;
              context_data_string += f(context_data_val);
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
          
          
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        // Add wc to the dictionary.
        context_dictionary[context_wc] = context_dictSize++;
        context_w = String(context_c);
      }
    }
    
    // Output the code for w.
    if (context_w !== "") {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
        if (context_w.charCodeAt(0)<256) {
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1);
            if (context_data_position == 15) {
              context_data_position = 0;
              context_data_string += f(context_data_val);
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<8 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == 15) {
              context_data_position = 0;
              context_data_string += f(context_data_val);
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position == 15) {
              context_data_position = 0;
              context_data_string += f(context_data_val);
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<16 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == 15) {
              context_data_position = 0;
              context_data_string += f(context_data_val);
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        delete context_dictionaryToCreate[context_w];
      } else {
        value = context_dictionary[context_w];
        for (i=0 ; i<context_numBits ; i++) {
          context_data_val = (context_data_val << 1) | (value&1);
          if (context_data_position == 15) {
            context_data_position = 0;
            context_data_string += f(context_data_val);
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }
        
        
      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
    }
    
    // Mark the end of the stream
    value = 2;
    for (i=0 ; i<context_numBits ; i++) {
      context_data_val = (context_data_val << 1) | (value&1);
      if (context_data_position == 15) {
        context_data_position = 0;
        context_data_string += f(context_data_val);
        context_data_val = 0;
      } else {
        context_data_position++;
      }
      value = value >> 1;
    }
    
    // Flush the last char
    while (true) {
      context_data_val = (context_data_val << 1);
      if (context_data_position == 15) {
        context_data_string += f(context_data_val);
        break;
      }
      else context_data_position++;
    }
    return context_data_string;
  },
  
  decompress: function (compressed) {
    if (compressed == null) return "";
    if (compressed == "") return null;
    var dictionary = [],
        next,
        enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        entry = "",
        result = "",
        i,
        w,
        bits, resb, maxpower, power,
        c,
        f = LZString._f,
        data = {string:compressed, val:compressed.charCodeAt(0), position:32768, index:1};
    
    for (i = 0; i < 3; i += 1) {
      dictionary[i] = i;
    }
    
    bits = 0;
    maxpower = Math.pow(2,2);
    power=1;
    while (power!=maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
        data.position = 32768;
        data.val = data.string.charCodeAt(data.index++);
      }
      bits |= (resb>0 ? 1 : 0) * power;
      power <<= 1;
    }
    
    switch (next = bits) {
      case 0: 
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = 32768;
              data.val = data.string.charCodeAt(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 1: 
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = 32768;
              data.val = data.string.charCodeAt(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 2: 
        return "";
    }
    dictionary[3] = c;
    w = result = c;
    while (true) {
      if (data.index > data.string.length) {
        return "";
      }
      
      bits = 0;
      maxpower = Math.pow(2,numBits);
      power=1;
      while (power!=maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = 32768;
          data.val = data.string.charCodeAt(data.index++);
        }
        bits |= (resb>0 ? 1 : 0) * power;
        power <<= 1;
      }

      switch (c = bits) {
        case 0: 
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = 32768;
              data.val = data.string.charCodeAt(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }

          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 1: 
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = 32768;
              data.val = data.string.charCodeAt(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 2: 
          return result;
      }
      
      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }
      
      if (dictionary[c]) {
        entry = dictionary[c];
      } else {
        if (c === dictSize) {
          entry = w + w.charAt(0);
        } else {
          return null;
        }
      }
      result += entry;
      
      // Add w+entry[0] to the dictionary.
      dictionary[dictSize++] = w + entry.charAt(0);
      enlargeIn--;
      
      w = entry;
      
      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }
      
    }
  }
};

if( typeof module !== 'undefined' && module != null ) {
  module.exports = LZString
}

function strCompress(str) {
	var data = "";

	try {
		data = str ? LZString.compress(str) : "";
	}
	catch(e) {
		console.log("strCompress: " + e.message);
	}

	return data;
}

function strDecompress(data) {	
	var str = "";

	try {
		str = data ? LZString.decompress(data) : "";
	}
	catch(e) {
		console.log("strDecompress: " + e.message);
	}

//	if(data && str) {
//		console.log("decompress: " + str.length + " from " + data.length);
//	}

	return str;
}


/**
 * @fileoverview
 * - Using the 'QRCode for Javascript library'
 * - Fixed dataset of 'QRCode for Javascript library' for support full-spec.
 * - this library has no dependencies.
 * 
 * @author davidshimjs
 * @see <a href="http://www.d-project.com/" target="_blank">http://www.d-project.com/</a>
 * @see <a href="http://jeromeetienne.github.com/jquery-qrcode/" target="_blank">http://jeromeetienne.github.com/jquery-qrcode/</a>
 */
var QRCode;

(function () {
	//---------------------------------------------------------------------
	// QRCode for JavaScript
	//
	// Copyright (c) 2009 Kazuhiko Arase
	//
	// URL: http://www.d-project.com/
	//
	// Licensed under the MIT license:
	//   http://www.opensource.org/licenses/mit-license.php
	//
	// The word "QR Code" is registered trademark of 
	// DENSO WAVE INCORPORATED
	//   http://www.denso-wave.com/qrcode/faqpatent-e.html
	//
	//---------------------------------------------------------------------
	function QR8bitByte(data) {
		this.mode = QRMode.MODE_8BIT_BYTE;
		this.data = data;
		this.parsedData = [];

		// Added to support UTF-8 Characters
		for (var i = 0, l = this.data.length; i < l; i++) {
			var byteArray = [];
			var code = this.data.charCodeAt(i);

			if (code > 0x10000) {
				byteArray[0] = 0xF0 | ((code & 0x1C0000) >>> 18);
				byteArray[1] = 0x80 | ((code & 0x3F000) >>> 12);
				byteArray[2] = 0x80 | ((code & 0xFC0) >>> 6);
				byteArray[3] = 0x80 | (code & 0x3F);
			} else if (code > 0x800) {
				byteArray[0] = 0xE0 | ((code & 0xF000) >>> 12);
				byteArray[1] = 0x80 | ((code & 0xFC0) >>> 6);
				byteArray[2] = 0x80 | (code & 0x3F);
			} else if (code > 0x80) {
				byteArray[0] = 0xC0 | ((code & 0x7C0) >>> 6);
				byteArray[1] = 0x80 | (code & 0x3F);
			} else {
				byteArray[0] = code;
			}

			this.parsedData.push(byteArray);
		}

		this.parsedData = Array.prototype.concat.apply([], this.parsedData);

		if (this.parsedData.length != this.data.length) {
			this.parsedData.unshift(191);
			this.parsedData.unshift(187);
			this.parsedData.unshift(239);
		}
	}

	QR8bitByte.prototype = {
		getLength: function (buffer) {
			return this.parsedData.length;
		},
		write: function (buffer) {
			for (var i = 0, l = this.parsedData.length; i < l; i++) {
				buffer.put(this.parsedData[i], 8);
			}
		}
	};

	function QRCodeModel(typeNumber, errorCorrectLevel) {
		this.typeNumber = typeNumber;
		this.errorCorrectLevel = errorCorrectLevel;
		this.modules = null;
		this.moduleCount = 0;
		this.dataCache = null;
		this.dataList = [];
	}

	QRCodeModel.prototype={addData:function(data){var newData=new QR8bitByte(data);this.dataList.push(newData);this.dataCache=null;},isDark:function(row,col){if(row<0||this.moduleCount<=row||col<0||this.moduleCount<=col){throw new Error(row+","+col);}
	return this.modules[row][col];},getModuleCount:function(){return this.moduleCount;},make:function(){this.makeImpl(false,this.getBestMaskPattern());},makeImpl:function(test,maskPattern){this.moduleCount=this.typeNumber*4+17;this.modules=new Array(this.moduleCount);for(var row=0;row<this.moduleCount;row++){this.modules[row]=new Array(this.moduleCount);for(var col=0;col<this.moduleCount;col++){this.modules[row][col]=null;}}
	this.setupPositionProbePattern(0,0);this.setupPositionProbePattern(this.moduleCount-7,0);this.setupPositionProbePattern(0,this.moduleCount-7);this.setupPositionAdjustPattern();this.setupTimingPattern();this.setupTypeInfo(test,maskPattern);if(this.typeNumber>=7){this.setupTypeNumber(test);}
	if(this.dataCache==null){this.dataCache=QRCodeModel.createData(this.typeNumber,this.errorCorrectLevel,this.dataList);}
	this.mapData(this.dataCache,maskPattern);},setupPositionProbePattern:function(row,col){for(var r=-1;r<=7;r++){if(row+r<=-1||this.moduleCount<=row+r)continue;for(var c=-1;c<=7;c++){if(col+c<=-1||this.moduleCount<=col+c)continue;if((0<=r&&r<=6&&(c==0||c==6))||(0<=c&&c<=6&&(r==0||r==6))||(2<=r&&r<=4&&2<=c&&c<=4)){this.modules[row+r][col+c]=true;}else{this.modules[row+r][col+c]=false;}}}},getBestMaskPattern:function(){var minLostPoint=0;var pattern=0;for(var i=0;i<8;i++){this.makeImpl(true,i);var lostPoint=QRUtil.getLostPoint(this);if(i==0||minLostPoint>lostPoint){minLostPoint=lostPoint;pattern=i;}}
	return pattern;},createMovieClip:function(target_mc,instance_name,depth){var qr_mc=target_mc.createEmptyMovieClip(instance_name,depth);var cs=1;this.make();for(var row=0;row<this.modules.length;row++){var y=row*cs;for(var col=0;col<this.modules[row].length;col++){var x=col*cs;var dark=this.modules[row][col];if(dark){qr_mc.beginFill(0,100);qr_mc.moveTo(x,y);qr_mc.lineTo(x+cs,y);qr_mc.lineTo(x+cs,y+cs);qr_mc.lineTo(x,y+cs);qr_mc.endFill();}}}
	return qr_mc;},setupTimingPattern:function(){for(var r=8;r<this.moduleCount-8;r++){if(this.modules[r][6]!=null){continue;}
	this.modules[r][6]=(r%2==0);}
	for(var c=8;c<this.moduleCount-8;c++){if(this.modules[6][c]!=null){continue;}
	this.modules[6][c]=(c%2==0);}},setupPositionAdjustPattern:function(){var pos=QRUtil.getPatternPosition(this.typeNumber);for(var i=0;i<pos.length;i++){for(var j=0;j<pos.length;j++){var row=pos[i];var col=pos[j];if(this.modules[row][col]!=null){continue;}
	for(var r=-2;r<=2;r++){for(var c=-2;c<=2;c++){if(r==-2||r==2||c==-2||c==2||(r==0&&c==0)){this.modules[row+r][col+c]=true;}else{this.modules[row+r][col+c]=false;}}}}}},setupTypeNumber:function(test){var bits=QRUtil.getBCHTypeNumber(this.typeNumber);for(var i=0;i<18;i++){var mod=(!test&&((bits>>i)&1)==1);this.modules[Math.floor(i/3)][i%3+this.moduleCount-8-3]=mod;}
	for(var i=0;i<18;i++){var mod=(!test&&((bits>>i)&1)==1);this.modules[i%3+this.moduleCount-8-3][Math.floor(i/3)]=mod;}},setupTypeInfo:function(test,maskPattern){var data=(this.errorCorrectLevel<<3)|maskPattern;var bits=QRUtil.getBCHTypeInfo(data);for(var i=0;i<15;i++){var mod=(!test&&((bits>>i)&1)==1);if(i<6){this.modules[i][8]=mod;}else if(i<8){this.modules[i+1][8]=mod;}else{this.modules[this.moduleCount-15+i][8]=mod;}}
	for(var i=0;i<15;i++){var mod=(!test&&((bits>>i)&1)==1);if(i<8){this.modules[8][this.moduleCount-i-1]=mod;}else if(i<9){this.modules[8][15-i-1+1]=mod;}else{this.modules[8][15-i-1]=mod;}}
	this.modules[this.moduleCount-8][8]=(!test);},mapData:function(data,maskPattern){var inc=-1;var row=this.moduleCount-1;var bitIndex=7;var byteIndex=0;for(var col=this.moduleCount-1;col>0;col-=2){if(col==6)col--;while(true){for(var c=0;c<2;c++){if(this.modules[row][col-c]==null){var dark=false;if(byteIndex<data.length){dark=(((data[byteIndex]>>>bitIndex)&1)==1);}
	var mask=QRUtil.getMask(maskPattern,row,col-c);if(mask){dark=!dark;}
	this.modules[row][col-c]=dark;bitIndex--;if(bitIndex==-1){byteIndex++;bitIndex=7;}}}
	row+=inc;if(row<0||this.moduleCount<=row){row-=inc;inc=-inc;break;}}}}};QRCodeModel.PAD0=0xEC;QRCodeModel.PAD1=0x11;QRCodeModel.createData=function(typeNumber,errorCorrectLevel,dataList){var rsBlocks=QRRSBlock.getRSBlocks(typeNumber,errorCorrectLevel);var buffer=new QRBitBuffer();for(var i=0;i<dataList.length;i++){var data=dataList[i];buffer.put(data.mode,4);buffer.put(data.getLength(),QRUtil.getLengthInBits(data.mode,typeNumber));data.write(buffer);}
	var totalDataCount=0;for(var i=0;i<rsBlocks.length;i++){totalDataCount+=rsBlocks[i].dataCount;}
	if(buffer.getLengthInBits()>totalDataCount*8){throw new Error("code length overflow. ("
	+buffer.getLengthInBits()
	+">"
	+totalDataCount*8
	+")");}
	if(buffer.getLengthInBits()+4<=totalDataCount*8){buffer.put(0,4);}
	while(buffer.getLengthInBits()%8!=0){buffer.putBit(false);}
	while(true){if(buffer.getLengthInBits()>=totalDataCount*8){break;}
	buffer.put(QRCodeModel.PAD0,8);if(buffer.getLengthInBits()>=totalDataCount*8){break;}
	buffer.put(QRCodeModel.PAD1,8);}
	return QRCodeModel.createBytes(buffer,rsBlocks);};QRCodeModel.createBytes=function(buffer,rsBlocks){var offset=0;var maxDcCount=0;var maxEcCount=0;var dcdata=new Array(rsBlocks.length);var ecdata=new Array(rsBlocks.length);for(var r=0;r<rsBlocks.length;r++){var dcCount=rsBlocks[r].dataCount;var ecCount=rsBlocks[r].totalCount-dcCount;maxDcCount=Math.max(maxDcCount,dcCount);maxEcCount=Math.max(maxEcCount,ecCount);dcdata[r]=new Array(dcCount);for(var i=0;i<dcdata[r].length;i++){dcdata[r][i]=0xff&buffer.buffer[i+offset];}
	offset+=dcCount;var rsPoly=QRUtil.getErrorCorrectPolynomial(ecCount);var rawPoly=new QRPolynomial(dcdata[r],rsPoly.getLength()-1);var modPoly=rawPoly.mod(rsPoly);ecdata[r]=new Array(rsPoly.getLength()-1);for(var i=0;i<ecdata[r].length;i++){var modIndex=i+modPoly.getLength()-ecdata[r].length;ecdata[r][i]=(modIndex>=0)?modPoly.get(modIndex):0;}}
	var totalCodeCount=0;for(var i=0;i<rsBlocks.length;i++){totalCodeCount+=rsBlocks[i].totalCount;}
	var data=new Array(totalCodeCount);var index=0;for(var i=0;i<maxDcCount;i++){for(var r=0;r<rsBlocks.length;r++){if(i<dcdata[r].length){data[index++]=dcdata[r][i];}}}
	for(var i=0;i<maxEcCount;i++){for(var r=0;r<rsBlocks.length;r++){if(i<ecdata[r].length){data[index++]=ecdata[r][i];}}}
	return data;};var QRMode={MODE_NUMBER:1<<0,MODE_ALPHA_NUM:1<<1,MODE_8BIT_BYTE:1<<2,MODE_KANJI:1<<3};var QRErrorCorrectLevel={L:1,M:0,Q:3,H:2};var QRMaskPattern={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};var QRUtil={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:(1<<10)|(1<<8)|(1<<5)|(1<<4)|(1<<2)|(1<<1)|(1<<0),G18:(1<<12)|(1<<11)|(1<<10)|(1<<9)|(1<<8)|(1<<5)|(1<<2)|(1<<0),G15_MASK:(1<<14)|(1<<12)|(1<<10)|(1<<4)|(1<<1),getBCHTypeInfo:function(data){var d=data<<10;while(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G15)>=0){d^=(QRUtil.G15<<(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G15)));}
	return((data<<10)|d)^QRUtil.G15_MASK;},getBCHTypeNumber:function(data){var d=data<<12;while(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G18)>=0){d^=(QRUtil.G18<<(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(QRUtil.G18)));}
	return(data<<12)|d;},getBCHDigit:function(data){var digit=0;while(data!=0){digit++;data>>>=1;}
	return digit;},getPatternPosition:function(typeNumber){return QRUtil.PATTERN_POSITION_TABLE[typeNumber-1];},getMask:function(maskPattern,i,j){switch(maskPattern){case QRMaskPattern.PATTERN000:return(i+j)%2==0;case QRMaskPattern.PATTERN001:return i%2==0;case QRMaskPattern.PATTERN010:return j%3==0;case QRMaskPattern.PATTERN011:return(i+j)%3==0;case QRMaskPattern.PATTERN100:return(Math.floor(i/2)+Math.floor(j/3))%2==0;case QRMaskPattern.PATTERN101:return(i*j)%2+(i*j)%3==0;case QRMaskPattern.PATTERN110:return((i*j)%2+(i*j)%3)%2==0;case QRMaskPattern.PATTERN111:return((i*j)%3+(i+j)%2)%2==0;default:throw new Error("bad maskPattern:"+maskPattern);}},getErrorCorrectPolynomial:function(errorCorrectLength){var a=new QRPolynomial([1],0);for(var i=0;i<errorCorrectLength;i++){a=a.multiply(new QRPolynomial([1,QRMath.gexp(i)],0));}
	return a;},getLengthInBits:function(mode,type){if(1<=type&&type<10){switch(mode){case QRMode.MODE_NUMBER:return 10;case QRMode.MODE_ALPHA_NUM:return 9;case QRMode.MODE_8BIT_BYTE:return 8;case QRMode.MODE_KANJI:return 8;default:throw new Error("mode:"+mode);}}else if(type<27){switch(mode){case QRMode.MODE_NUMBER:return 12;case QRMode.MODE_ALPHA_NUM:return 11;case QRMode.MODE_8BIT_BYTE:return 16;case QRMode.MODE_KANJI:return 10;default:throw new Error("mode:"+mode);}}else if(type<41){switch(mode){case QRMode.MODE_NUMBER:return 14;case QRMode.MODE_ALPHA_NUM:return 13;case QRMode.MODE_8BIT_BYTE:return 16;case QRMode.MODE_KANJI:return 12;default:throw new Error("mode:"+mode);}}else{throw new Error("type:"+type);}},getLostPoint:function(qrCode){var moduleCount=qrCode.getModuleCount();var lostPoint=0;for(var row=0;row<moduleCount;row++){for(var col=0;col<moduleCount;col++){var sameCount=0;var dark=qrCode.isDark(row,col);for(var r=-1;r<=1;r++){if(row+r<0||moduleCount<=row+r){continue;}
	for(var c=-1;c<=1;c++){if(col+c<0||moduleCount<=col+c){continue;}
	if(r==0&&c==0){continue;}
	if(dark==qrCode.isDark(row+r,col+c)){sameCount++;}}}
	if(sameCount>5){lostPoint+=(3+sameCount-5);}}}
	for(var row=0;row<moduleCount-1;row++){for(var col=0;col<moduleCount-1;col++){var count=0;if(qrCode.isDark(row,col))count++;if(qrCode.isDark(row+1,col))count++;if(qrCode.isDark(row,col+1))count++;if(qrCode.isDark(row+1,col+1))count++;if(count==0||count==4){lostPoint+=3;}}}
	for(var row=0;row<moduleCount;row++){for(var col=0;col<moduleCount-6;col++){if(qrCode.isDark(row,col)&&!qrCode.isDark(row,col+1)&&qrCode.isDark(row,col+2)&&qrCode.isDark(row,col+3)&&qrCode.isDark(row,col+4)&&!qrCode.isDark(row,col+5)&&qrCode.isDark(row,col+6)){lostPoint+=40;}}}
	for(var col=0;col<moduleCount;col++){for(var row=0;row<moduleCount-6;row++){if(qrCode.isDark(row,col)&&!qrCode.isDark(row+1,col)&&qrCode.isDark(row+2,col)&&qrCode.isDark(row+3,col)&&qrCode.isDark(row+4,col)&&!qrCode.isDark(row+5,col)&&qrCode.isDark(row+6,col)){lostPoint+=40;}}}
	var darkCount=0;for(var col=0;col<moduleCount;col++){for(var row=0;row<moduleCount;row++){if(qrCode.isDark(row,col)){darkCount++;}}}
	var ratio=Math.abs(100*darkCount/moduleCount/moduleCount-50)/5;lostPoint+=ratio*10;return lostPoint;}};var QRMath={glog:function(n){if(n<1){throw new Error("glog("+n+")");}
	return QRMath.LOG_TABLE[n];},gexp:function(n){while(n<0){n+=255;}
	while(n>=256){n-=255;}
	return QRMath.EXP_TABLE[n];},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)};for(var i=0;i<8;i++){QRMath.EXP_TABLE[i]=1<<i;}
	for(var i=8;i<256;i++){QRMath.EXP_TABLE[i]=QRMath.EXP_TABLE[i-4]^QRMath.EXP_TABLE[i-5]^QRMath.EXP_TABLE[i-6]^QRMath.EXP_TABLE[i-8];}
	for(var i=0;i<255;i++){QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]]=i;}
	function QRPolynomial(num,shift){if(num.length==undefined){throw new Error(num.length+"/"+shift);}
	var offset=0;while(offset<num.length&&num[offset]==0){offset++;}
	this.num=new Array(num.length-offset+shift);for(var i=0;i<num.length-offset;i++){this.num[i]=num[i+offset];}}
	QRPolynomial.prototype={get:function(index){return this.num[index];},getLength:function(){return this.num.length;},multiply:function(e){var num=new Array(this.getLength()+e.getLength()-1);for(var i=0;i<this.getLength();i++){for(var j=0;j<e.getLength();j++){num[i+j]^=QRMath.gexp(QRMath.glog(this.get(i))+QRMath.glog(e.get(j)));}}
	return new QRPolynomial(num,0);},mod:function(e){if(this.getLength()-e.getLength()<0){return this;}
	var ratio=QRMath.glog(this.get(0))-QRMath.glog(e.get(0));var num=new Array(this.getLength());for(var i=0;i<this.getLength();i++){num[i]=this.get(i);}
	for(var i=0;i<e.getLength();i++){num[i]^=QRMath.gexp(QRMath.glog(e.get(i))+ratio);}
	return new QRPolynomial(num,0).mod(e);}};function QRRSBlock(totalCount,dataCount){this.totalCount=totalCount;this.dataCount=dataCount;}
	QRRSBlock.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]];QRRSBlock.getRSBlocks=function(typeNumber,errorCorrectLevel){var rsBlock=QRRSBlock.getRsBlockTable(typeNumber,errorCorrectLevel);if(rsBlock==undefined){throw new Error("bad rs block @ typeNumber:"+typeNumber+"/errorCorrectLevel:"+errorCorrectLevel);}
	var length=rsBlock.length/3;var list=[];for(var i=0;i<length;i++){var count=rsBlock[i*3+0];var totalCount=rsBlock[i*3+1];var dataCount=rsBlock[i*3+2];for(var j=0;j<count;j++){list.push(new QRRSBlock(totalCount,dataCount));}}
	return list;};QRRSBlock.getRsBlockTable=function(typeNumber,errorCorrectLevel){switch(errorCorrectLevel){case QRErrorCorrectLevel.L:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+0];case QRErrorCorrectLevel.M:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+1];case QRErrorCorrectLevel.Q:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+2];case QRErrorCorrectLevel.H:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+3];default:return undefined;}};function QRBitBuffer(){this.buffer=[];this.length=0;}
	QRBitBuffer.prototype={get:function(index){var bufIndex=Math.floor(index/8);return((this.buffer[bufIndex]>>>(7-index%8))&1)==1;},put:function(num,length){for(var i=0;i<length;i++){this.putBit(((num>>>(length-i-1))&1)==1);}},getLengthInBits:function(){return this.length;},putBit:function(bit){var bufIndex=Math.floor(this.length/8);if(this.buffer.length<=bufIndex){this.buffer.push(0);}
	if(bit){this.buffer[bufIndex]|=(0x80>>>(this.length%8));}
	this.length++;}};var QRCodeLimitLength=[[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],[929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]];
	
	function _isSupportCanvas() {
		return typeof CanvasRenderingContext2D != "undefined";
	}
	
	// android 2.x doesn't support Data-URI spec
	function _getAndroid() {
		var android = false;
		var sAgent = navigator.userAgent;
		
		if (/android/i.test(sAgent)) { // android
			android = true;
			aMat = sAgent.toString().match(/android ([0-9]\.[0-9])/i);
			
			if (aMat && aMat[1]) {
				android = parseFloat(aMat[1]);
			}
		}
		
		return android;
	}
	
	var svgDrawer = (function() {

		var Drawing = function (el, htOption) {
			this._el = el;
			this._htOption = htOption;
		};

		Drawing.prototype.draw = function (oQRCode) {
			var _htOption = this._htOption;
			var _el = this._el;
			var nCount = oQRCode.getModuleCount();
			var nWidth = Math.floor(_htOption.width / nCount);
			var nHeight = Math.floor(_htOption.height / nCount);

			this.clear();

			function makeSVG(tag, attrs) {
				var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
				for (var k in attrs)
					if (attrs.hasOwnProperty(k)) el.setAttribute(k, attrs[k]);
				return el;
			}

			var svg = makeSVG("svg" , {'viewBox': '0 0 ' + String(nCount) + " " + String(nCount), 'width': '100%', 'height': '100%', 'fill': _htOption.colorLight});
			svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
			_el.appendChild(svg);

			svg.appendChild(makeSVG("rect", {"fill": _htOption.colorDark, "width": "1", "height": "1", "id": "template"}));

			for (var row = 0; row < nCount; row++) {
				for (var col = 0; col < nCount; col++) {
					if (oQRCode.isDark(row, col)) {
						var child = makeSVG("use", {"x": String(row), "y": String(col)});
						child.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template")
						svg.appendChild(child);
					}
				}
			}
		};
		Drawing.prototype.clear = function () {
			while (this._el.hasChildNodes())
				this._el.removeChild(this._el.lastChild);
		};
		return Drawing;
	})();

	var useSVG = document.documentElement.tagName.toLowerCase() === "svg";

	// Drawing in DOM by using Table tag
	var Drawing = useSVG ? svgDrawer : !_isSupportCanvas() ? (function () {
		var Drawing = function (el, htOption) {
			this._el = el;
			this._htOption = htOption;
		};
			
		/**
		 * Draw the QRCode
		 * 
		 * @param {QRCode} oQRCode
		 */
		Drawing.prototype.draw = function (oQRCode) {
            var _htOption = this._htOption;
            var _el = this._el;
			var nCount = oQRCode.getModuleCount();
			var nWidth = Math.floor(_htOption.width / nCount);
			var nHeight = Math.floor(_htOption.height / nCount);
			var aHTML = ['<table style="border:0;border-collapse:collapse;">'];
			
			for (var row = 0; row < nCount; row++) {
				aHTML.push('<tr>');
				
				for (var col = 0; col < nCount; col++) {
					aHTML.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + nWidth + 'px;height:' + nHeight + 'px;background-color:' + (oQRCode.isDark(row, col) ? _htOption.colorDark : _htOption.colorLight) + ';"></td>');
				}
				
				aHTML.push('</tr>');
			}
			
			aHTML.push('</table>');
			_el.innerHTML = aHTML.join('');
			
			// Fix the margin values as real size.
			var elTable = _el.childNodes[0];
			var nLeftMarginTable = (_htOption.width - elTable.offsetWidth) / 2;
			var nTopMarginTable = (_htOption.height - elTable.offsetHeight) / 2;
			
			if (nLeftMarginTable > 0 && nTopMarginTable > 0) {
				elTable.style.margin = nTopMarginTable + "px " + nLeftMarginTable + "px";	
			}
		};
		
		/**
		 * Clear the QRCode
		 */
		Drawing.prototype.clear = function () {
			this._el.innerHTML = '';
		};
		
		return Drawing;
	})() : (function () { // Drawing in Canvas
		function _onMakeImage() {
			this._elImage.src = this._elCanvas.toDataURL("image/png");
			this._elImage.style.display = "block";
			this._elCanvas.style.display = "none";			
		}
		
		// Android 2.1 bug workaround
		// http://code.google.com/p/android/issues/detail?id=5141
		if (this._android && this._android <= 2.1) {
	    	var factor = 1 / window.devicePixelRatio;
	        var drawImage = CanvasRenderingContext2D.prototype.drawImage; 
	    	CanvasRenderingContext2D.prototype.drawImage = function (image, sx, sy, sw, sh, dx, dy, dw, dh) {
	    		if (("nodeName" in image) && /img/i.test(image.nodeName)) {
		        	for (var i = arguments.length - 1; i >= 1; i--) {
		            	arguments[i] = arguments[i] * factor;
		        	}
	    		} else if (typeof dw == "undefined") {
	    			arguments[1] *= factor;
	    			arguments[2] *= factor;
	    			arguments[3] *= factor;
	    			arguments[4] *= factor;
	    		}
	    		
	        	drawImage.apply(this, arguments); 
	    	};
		}
		
		/**
		 * Check whether the user's browser supports Data URI or not
		 * 
		 * @private
		 * @param {Function} fSuccess Occurs if it supports Data URI
		 * @param {Function} fFail Occurs if it doesn't support Data URI
		 */
		function _safeSetDataURI(fSuccess, fFail) {
            var self = this;
            self._fFail = fFail;
            self._fSuccess = fSuccess;

            // Check it just once
            if (self._bSupportDataURI === null) {
                var el = document.createElement("img");
                var fOnError = function() {
                    self._bSupportDataURI = false;

                    if (self._fFail) {
                        _fFail.call(self);
                    }
                };
                var fOnSuccess = function() {
                    self._bSupportDataURI = true;

                    if (self._fSuccess) {
                        self._fSuccess.call(self);
                    }
                };

                el.onabort = fOnError;
                el.onerror = fOnError;
                el.onload = fOnSuccess;
                el.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="; // the Image contains 1px data.
                return;
            } else if (self._bSupportDataURI === true && self._fSuccess) {
                self._fSuccess.call(self);
            } else if (self._bSupportDataURI === false && self._fFail) {
                self._fFail.call(self);
            }
		};
		
		/**
		 * Drawing QRCode by using canvas
		 * 
		 * @constructor
		 * @param {HTMLElement} el
		 * @param {Object} htOption QRCode Options 
		 */
		var Drawing = function (el, htOption) {
    		this._bIsPainted = false;
    		this._android = _getAndroid();
		
			this._htOption = htOption;
			this._elCanvas = document.createElement("canvas");
			this._elCanvas.width = htOption.width;
			this._elCanvas.height = htOption.height;
			el.appendChild(this._elCanvas);
			this._el = el;
			this._oContext = this._elCanvas.getContext("2d");
			this._bIsPainted = false;
			this._elImage = document.createElement("img");
			this._elImage.alt = "Scan me!";
			this._elImage.style.display = "none";
			this._el.appendChild(this._elImage);
			this._bSupportDataURI = null;
		};
			
		/**
		 * Draw the QRCode
		 * 
		 * @param {QRCode} oQRCode 
		 */
		Drawing.prototype.draw = function (oQRCode) {
            var _elImage = this._elImage;
            var _oContext = this._oContext;
            var _htOption = this._htOption;
            
			var nCount = oQRCode.getModuleCount();
			var nWidth = _htOption.width / nCount;
			var nHeight = _htOption.height / nCount;
			var nRoundedWidth = Math.round(nWidth);
			var nRoundedHeight = Math.round(nHeight);

			_elImage.style.display = "none";
			this.clear();
			
			for (var row = 0; row < nCount; row++) {
				for (var col = 0; col < nCount; col++) {
					var bIsDark = oQRCode.isDark(row, col);
					var nLeft = col * nWidth;
					var nTop = row * nHeight;
					_oContext.strokeStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight;
					_oContext.lineWidth = 1;
					_oContext.fillStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight;					
					_oContext.fillRect(nLeft, nTop, nWidth, nHeight);
					
					// 안티 앨리어싱 방지 처리
					_oContext.strokeRect(
						Math.floor(nLeft) + 0.5,
						Math.floor(nTop) + 0.5,
						nRoundedWidth,
						nRoundedHeight
					);
					
					_oContext.strokeRect(
						Math.ceil(nLeft) - 0.5,
						Math.ceil(nTop) - 0.5,
						nRoundedWidth,
						nRoundedHeight
					);
				}
			}
			
			this._bIsPainted = true;
		};
			
		/**
		 * Make the image from Canvas if the browser supports Data URI.
		 */
		Drawing.prototype.makeImage = function () {
			if (this._bIsPainted) {
				_safeSetDataURI.call(this, _onMakeImage);
			}
		};
			
		/**
		 * Return whether the QRCode is painted or not
		 * 
		 * @return {Boolean}
		 */
		Drawing.prototype.isPainted = function () {
			return this._bIsPainted;
		};
		
		/**
		 * Clear the QRCode
		 */
		Drawing.prototype.clear = function () {
			this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height);
			this._bIsPainted = false;
		};
		
		/**
		 * @private
		 * @param {Number} nNumber
		 */
		Drawing.prototype.round = function (nNumber) {
			if (!nNumber) {
				return nNumber;
			}
			
			return Math.floor(nNumber * 1000) / 1000;
		};
		
		return Drawing;
	})();
	
	/**
	 * Get the type by string length
	 * 
	 * @private
	 * @param {String} sText
	 * @param {Number} nCorrectLevel
	 * @return {Number} type
	 */
	function _getTypeNumber(sText, nCorrectLevel) {			
		var nType = 1;
		var length = _getUTF8Length(sText);
		
		for (var i = 0, len = QRCodeLimitLength.length; i <= len; i++) {
			var nLimit = 0;
			
			switch (nCorrectLevel) {
				case QRErrorCorrectLevel.L :
					nLimit = QRCodeLimitLength[i][0];
					break;
				case QRErrorCorrectLevel.M :
					nLimit = QRCodeLimitLength[i][1];
					break;
				case QRErrorCorrectLevel.Q :
					nLimit = QRCodeLimitLength[i][2];
					break;
				case QRErrorCorrectLevel.H :
					nLimit = QRCodeLimitLength[i][3];
					break;
			}
			
			if (length <= nLimit) {
				break;
			} else {
				nType++;
			}
		}
		
		if (nType > QRCodeLimitLength.length) {
			throw new Error("Too long data");
		}
		
		return nType;
	}

	function _getUTF8Length(sText) {
		var replacedText = encodeURI(sText).toString().replace(/\%[0-9a-fA-F]{2}/g, 'a');
		return replacedText.length + (replacedText.length != sText ? 3 : 0);
	}
	
	/**
	 * @class QRCode
	 * @constructor
	 * @example 
	 * new QRCode(document.getElementById("test"), "http://jindo.dev.naver.com/collie");
	 *
	 * @example
	 * var oQRCode = new QRCode("test", {
	 *    text : "http://naver.com",
	 *    width : 128,
	 *    height : 128
	 * });
	 * 
	 * oQRCode.clear(); // Clear the QRCode.
	 * oQRCode.makeCode("http://map.naver.com"); // Re-create the QRCode.
	 *
	 * @param {HTMLElement|String} el target element or 'id' attribute of element.
	 * @param {Object|String} vOption
	 * @param {String} vOption.text QRCode link data
	 * @param {Number} [vOption.width=256]
	 * @param {Number} [vOption.height=256]
	 * @param {String} [vOption.colorDark="#000000"]
	 * @param {String} [vOption.colorLight="#ffffff"]
	 * @param {QRCode.CorrectLevel} [vOption.correctLevel=QRCode.CorrectLevel.H] [L|M|Q|H] 
	 */
	QRCode = function (el, vOption) {
		this._htOption = {
			width : 256, 
			height : 256,
			typeNumber : 4,
			colorDark : "#000000",
			colorLight : "#ffffff",
			correctLevel : QRErrorCorrectLevel.H
		};
		
		if (typeof vOption === 'string') {
			vOption	= {
				text : vOption
			};
		}
		
		// Overwrites options
		if (vOption) {
			for (var i in vOption) {
				this._htOption[i] = vOption[i];
			}
		}
		
		if (typeof el == "string") {
			el = document.getElementById(el);
		}
	
		if(!el) {
			el = document.createElement("div");
		}

		this._android = _getAndroid();
		this._el = el;
		this._oQRCode = null;
		this._oDrawing = new Drawing(this._el, this._htOption);
		
		if (this._htOption.text) {
			this.makeCode(this._htOption.text);	
		}
	};
	
	/**
	 * Make the QRCode
	 * 
	 * @param {String} sText link data
	 */
	QRCode.prototype.makeCode = function (sText) {
		this._oQRCode = new QRCodeModel(_getTypeNumber(sText, this._htOption.correctLevel), this._htOption.correctLevel);
		this._oQRCode.addData(sText);
		this._oQRCode.make();
		this._el.title = sText;
		this._oDrawing.draw(this._oQRCode);			
		this.makeImage();
	};
	
	/*
	 *lxj: get the src url of image.
	 */
	QRCode.prototype.getImageSrc = function () {
		return this._oDrawing._elCanvas.toDataURL("image/png");
	}

	QRCode.makeImageDataURL = function(text, w, h) {
		var qrcode = new QRCode(null, {text:text, width:w, height:h});
		var src = qrcode.getImageSrc();

		qrcode._oDrawing._elImage = null;
		qrcode._oDrawing._elCanvas = null;
		qrcode._oDrawing = null;
		qrcode = null;

		return src;
	}

	/**
	 * Make the Image from Canvas element
	 * - It occurs automatically
	 * - Android below 3 doesn't support Data-URI spec.
	 * 
	 * @private
	 */
	QRCode.prototype.makeImage = function () {
		if (typeof this._oDrawing.makeImage == "function" && (!this._android || this._android >= 3)) {
			this._oDrawing.makeImage();
		}
	};
	
	/**
	 * Clear the QRCode
	 */
	QRCode.prototype.clear = function () {
		this._oDrawing.clear();
	};
	
	/**
	 * @name QRCode.CorrectLevel
	 */
	QRCode.CorrectLevel = QRErrorCorrectLevel;

	window.QRCode = QRCode;
})();

/*
 * File: app_base.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: the base application.
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function AppBase(canvasID, type) {
	this.win  = null;
	this.view = null;
	this.type = type;
	this.minHeight = 0;

	AppBase.type = type;

	this.getView = function() {
		return this.view;
	}

	this.setMinHeight = function(minHeight) {
		this.minHeight = minHeight;

		return;
	}

	this.exec = function(cmd) {
		cmd.doit();
		delete cmd;

		return;
	}

	this.init = function() {
		if(this.type === AppBase.TYPE_INLINE_EDITOR) {
			this.isInlineEdit = true;
		}
		else {
			this.isInlineEdit = false;
		}

		this.canvas	 = CantkRT.getMainCanvas();
		this.adjustCanvasSize();
		this.manager = WWindowManager.create(this, this.canvas);
		canvasAttachManager(this.canvas, this.manager, this);
		
		return;
	}

	this.onShapeSelected = function(shape) {

		return;
	}

	this.onSizeChanged = function() {
		return;
	}

	this.adjustCanvasSize = function() {
		var w = 0;
		var h = 0;
		var canvas = this.canvas;
		var view = cantkGetViewPort();
		
		switch(this.type) {
			case AppBase.TYPE_GENERAL: {
				w = view.width;
				h = view.height;
			}
			case AppBase.TYPE_WEBAPP: {
				w = view.width;
				h = view.height;
				break;
			}
			case AppBase.TYPE_PREVIEW: {
				w = view.width;
				h = view.height;
				this.setMinHeight(1500);
				break;
			}
			default: {
				if(!this.minHeight) {
					this.setMinHeight(800);
				}
				w  = view.width - 20;
				h = view.height;
				break;
			}
		}

		h = Math.max(h, this.minHeight);

		this.resizeCanvasTo(w, h);

		return;
	}
	
	this.resizeCanvasTo = function(w, h) {
		var canvas = this.canvas;

		canvas.width  = w;
		canvas.height = h;
		canvas.style.top = 0;
		canvas.style.left = 0;
		canvas.style.position = "absolute";

		return;
	}

	this.loadData = function(data)  {
		return this.view.loadFromJson(data);
	}

	this.exitApp = function() {
		console.log("exitApp");

		return;
	}

	this.init();

	return this;
}

AppBase.isDevApp = function() {
	return AppBase.type === AppBase.TYPE_PC_EDITOR 
		|| AppBase.type === AppBase.TYPE_MOBILE_EDITOR 
		|| AppBase.type === AppBase.TYPE_INLINE_EDITOR;
}

AppBase.TYPE_GENERAL = 0;
AppBase.TYPE_WEBAPP = 1;
AppBase.TYPE_PREVIEW = 2;
AppBase.TYPE_PC_VIEWER = 3;
AppBase.TYPE_PC_EDITOR = 4;
AppBase.TYPE_MOBILE_EDITOR = 5;
AppBase.TYPE_INLINE_EDITOR = 6;
/*
 * File: w_image.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: image adapter
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function WImage(src) {
	if(src) {
		this.setImageSrc(src);
	}

	return;
}

WImage.caches = {};
WImage.nullImage = new Image();
WImage.onload = function() {  }

WImage.prototype.initFromJson = function(src, json, onLoad) {
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

	this.rotated = info.rotated;
	if(info.trimmed) {
		rect.trimmed = true;
		rect.ox = info.spriteSourceSize.x;
		rect.oy = info.spriteSourceSize.y;
		rect.rw = info.sourceSize.w;
		rect.rh = info.sourceSize.h;
	}
	else {
		rect.trimmed = false;
		rect.ox = 0;
		rect.oy = 0;
		rect.rw = 0;
		rect.rh = 0;
	}

	var me = this;
	this.rect = rect;
	WImage.onload();
	ResLoader.loadImage(imageSrc, function(img) {
		me.image = img;
		if(onLoad) {
			onLoad(img);
		}
	});

	return;
}

WImage.prototype.initFromRowColIndex = function(src, rowcolIndex, onLoad) {
	var me = this;
	var rows = parseInt(rowcolIndex[1]);
	var cols = parseInt(rowcolIndex[2]);
	var index = parseInt(rowcolIndex[3]);
	rowcolIndex = null;

	this.image = ResLoader.loadImage(src, function(img) {
		var tileW = Math.round(img.width/cols);
		var tileH = Math.round(img.height/rows);
		var tileWmin = Math.floor(img.width/cols);
		var tileHmin = Math.floor(img.height/rows);
		var col = index%cols;
		var row = Math.floor(index/cols);

		me.rect = {};
		me.rect.x = col * tileW;
		me.rect.y = row * tileH;
		me.rect.w = tileWmin;
		me.rect.h = tileHmin;

		me.image = img;
		if(onLoad) {
			onLoad(img);
		}
		WImage.onload();
	});

	return;
}

WImage.prototype.initFromXYWH = function(src, xywh, onLoad) {
	var me = this;
	var x = parseInt(xywh[1]);
	var y = parseInt(xywh[2]);
	var w = parseInt(xywh[3]);
	var h = parseInt(xywh[4]);
	xywh = null;

	this.image = ResLoader.loadImage(src, function(img) {
		me.rect = {};
		me.rect.x = x;
		me.rect.y = y;
		me.rect.w = w;
		me.rect.h = h;

		me.image = img;
		if(onLoad) {
			onLoad(img);
		}
		WImage.onload();
	});

	return;
}

WImage.prototype.setImage = function(image) {
	this.image = image;
	
	return this;
}

WImage.prototype.setImageSrc = function(src, onLoad) {
	if(!src) {
		this.src = src;
		this.image = WImage.nullImage;

		return;
	}

	if(src.indexOf("data:") === 0) {	
		this.src = src;
		this.rect = null;
		this.image = CantkRT.createImage(src, onLoad);

		return;
	}

	src = ResLoader.toAbsURL(src);
	this.src = src;
	
	WImage.caches[src] = this;

	var me = this;
	var sharpOffset = src.indexOf("#");
	if(sharpOffset > 0) {
		var meta = src.substr(sharpOffset+1);
		var rowcolIndex = meta.match(/r([0-9]+)c([0-9]+)i([0-9]+)/i);
		var xywh = meta.match(/x([0-9]+)y([0-9]+)w([0-9]+)h([0-9]+)/i);

		if(!rowcolIndex && !xywh) {
			var jsonURL = src.substr(0, sharpOffset);
			ResLoader.loadJson(jsonURL, function(json) {
				me.initFromJson(src, json, onLoad);
			});
		}
		else {
			src = src.substr(0, sharpOffset);
			if(rowcolIndex) {
				this.initFromRowColIndex(src, rowcolIndex, onLoad);
			}
			if(xywh){
				this.initFromXYWH(src, xywh, onLoad);
			}

			rowcolIndex = null;
			xywh = null;
		}
	}
	else {
		this.image = ResLoader.loadImage(src, function(img) {
			me.rect = {};
			me.rect.x = 0;
			me.rect.y = 0;
			me.rect.w = img.width;
			me.rect.h = img.height;

			me.image = img;
			if(onLoad) {
				onLoad(img);
			}
			WImage.onload();
		});
	}

	return;
}

WImage.prototype.getImageRect = function() {
	if(!this.rect) {
		this.rect = {x:0, y:0, w:0, h:0};
	}
	
	if((!this.rect.w) && this.image) {
		this.rect.w = this.image.width;
		this.rect.h = this.image.height;
	}

	return this.rect;
}

WImage.prototype.getImageSrc = function() {
	return this.src;
}

WImage.prototype.getRealImageSrc = function() {
	return this.image ? this.image.src : this.src;
}

WImage.prototype.getImage = function() {
	var image = this.image;

	return (image && image.width > 0) ? image : null;
}

WImage.isValid = function(image) {
	return image && image.image && image.image.width && image.image.height;
}

WImage.create = function(src, onLoad) {
	var image = WImage.caches[src];
	if(image) {
		if(onLoad) {
			onLoad(image.getImage());
		}
	}
	else {
		image = new WImage();
		image.setImageSrc(src, onLoad);
	}

	return image;
}

WImage.createWithImage = function(img) {
	var image = new WImage();

	image.setImage(img);

	return image;
}

function cantkSetOnImageLoad(onImageLoad) {
	if(onImageLoad) {
		WImage.onload = onImageLoad;
	}

	return;
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

WImage.prototype.draw = function(canvas, display, x, y, dw, dh) {
	var image = this.getImage();
	var srcRect = this.getImageRect();

	return WImage.draw(canvas, image, display, x, y, dw, dh, srcRect);	
}

WImage.draw = function(canvas, image, display, x, y, dw, dh, srcRect) {
	if(!image) return;
	if(!srcRect) {
		srcRect = {};
		srcRect.x = 0;
		srcRect.y = 0;
		srcRect.w = image.width;
		srcRect.h = image.height;
	}

	if(!srcRect.ox) {
		srcRect.ox = 0;
	}
	if(!srcRect.oy) {
		srcRect.oy = 0;
	}
	if(!srcRect.rw) {
		srcRect.rw = srcRect.w;
	}
	if(!srcRect.rh) {
		srcRect.rh = srcRect.h;
	}

	var imageWidth  = srcRect.rw;
	var imageHeight = srcRect.rh;

	if(imageWidth <= 0 || imageHeight <= 0) {
		return;
	}

	var dx = 0;
	var dy = 0;
	var sw = srcRect.w;
	var sh = srcRect.h;
	var sx = srcRect.x;
	var sy = srcRect.y;
	var ox = srcRect.ox;
	var oy = srcRect.oy;

	if(srcRect.trimmed) {
		ox = srcRect.ox;
		oy = srcRect.oy;
	}

	switch(display) {
		case WImage.DISPLAY_CENTER: {
			dx = Math.floor(x + ((dw - imageWidth) >> 1)) + ox;
			dy = Math.floor(y + ((dh - imageHeight) >> 1)) + oy;

			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, sw, sh);
			break;
		}
		case WImage.DISPLAY_AUTO_SIZE_DOWN: {
			var scale = Math.min(Math.min(dw/imageWidth, dh/imageHeight), 1);
			var iw = imageWidth*scale;
			var ih = imageHeight*scale;

			dx = (dw - iw) >> 1;
			dy = (dh - ih) >> 1;
			dx += Math.round(ox*scale);
			dy += Math.round(oy*scale);
			dw = Math.round(sw*scale);
			dh = Math.round(sh*scale);

			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
			break;
		}
		case WImage.DISPLAY_SCALE: {
			var xScale = dw/imageWidth;
			var yScale = dh/imageHeight;

			dx = Math.round(x + ox*xScale);
			dy = Math.round(y + oy*yScale);
			dw = Math.round(sw*xScale);
			dh = Math.round(sh*yScale);

			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
			break;
		}
		case WImage.DISPLAY_AUTO: {
			var scale = Math.min(dw/imageWidth, dh/imageHeight);
			var iw = Math.round(imageWidth*scale);
			var ih = Math.round(imageHeight*scale);

			dx = x + ((dw - iw) >> 1);
			dy = y + ((dh - ih) >> 1);
			dx += Math.round(ox*scale);
			dy += Math.round(oy*scale);

			dw = Math.round(sw*scale);
			dh = Math.round(sh*scale);
			
			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
			break;
		}
		case WImage.DISPLAY_9PATCH: {
			dx = x + ox;
			dy = y + oy;
			dw -= (imageWidth - sw);
			dh -= (imageHeight - sh);
			if(imageWidth >= dw && imageHeight >= dh) {
				canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
			}
			else {
				drawNinePatchEx(canvas, image, sx, sy, sw, sh, dx, dy, dw, dh);
			}

			break;
		}
		case WImage.DISPLAY_SCALE_KEEP_RATIO: {
			var scale = Math.max(dw/imageWidth, dh/imageHeight);
			
			dx = Math.round(x + ox*scale);
			dy = Math.round(y + oy*scale);
			dw = Math.round(sw*scale);
			dh = Math.round(sh*scale);

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
				canvas.drawImage(image, sx, sy, sw, sh, dx, y, sw, sh);
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
				canvas.drawImage(image, sx, sy, sw, sh, x, dy, sw, sh);
				dy = dy + sh;
			}
			break;
		}
		case WImage.DISPLAY_FIT_WIDTH: {
			var scale = dw/imageWidth;

			dx = Math.round(x + ox*scale);
			dy = Math.round(y + oy*scale);
			dw = Math.round(sw*scale);
			dh = Math.round(sh*scale);

			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);

			break;
		}
		case WImage.DISPLAY_FIT_HEIGHT: {
			var scale = dh/imageHeight;

			dx = Math.round(x + ox*scale);
			dy = Math.round(y + oy*scale);
			dw = Math.round(sw*scale);
			dh = Math.round(sh*scale);

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
WWidget.TYPE_IMAGE_VIEW = "image-view";
WWidget.TYPE_TREE_VIEW = "tree-view";
WWidget.TYPE_TREE_ITEM = "tree-item";
WWidget.TYPE_ACCORDION = "accordion";
WWidget.TYPE_ACCORDION_ITEM = "accordion-item";
WWidget.TYPE_PROPERTY_TITLE = "property-title";
WWidget.TYPE_PROPERTY_SHEET = "property-sheet";
WWidget.TYPE_PROPERTY_SHEETS = "property-sheets";
WWidget.TYPE_VIEW_BASE = "view-base";
WWidget.TYPE_COMPONENT_MENU_ITEM = "menuitem.component";
WWidget.TYPE_WINDOW_MENU_ITEM = "menuitem.window";
WWidget.TYPE_MESSAGE_BOX = "messagebox";
WWidget.TYPE_ICON_TEXT = "icon-text";
WWidget.TYPE_BUTTON = "button";
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
WWidget.TYPE_COMBOBOX_POUP = "combobox-popup";
WWidget.TYPE_COMBOBOX_POUP_ITEM = "combobox-popup-item";
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
	this.imageDiplay = WImage.DISPLAY_9PATCH;
	this.borderStyle = WWidget.BORDER_STYLE_ALL;

	if(this.parent !== null) {
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
	return WWindowManager.getInstance().isClicked();
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
	return WWindowManager.getInstance().getCanvas2D();
}

WWidget.prototype.getCanvas = function() {
	return WWindowManager.getInstance().getCanvas();
}

WWidget.prototype.getLastPointerPoint = function() {
	return WWindowManager.getInstance().getLastPointerPoint();
}

WWidget.prototype.getTopWindow = function() {
	 return this.getWindow();
}

WWidget.prototype.getWindow = function() {
	 if(this.parent) {
		  return this.parent.getWindow();
	 }
	 
	 return this;
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
		widget.onChanging = null;
		widget.clickHandler = null;
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

WWidget.prototype.onRemoved = function() {
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

		canvas.textAlign = "center";
		canvas.textBaseline = "middle";
		canvas.font = style.font ? style.font : "10pt bold sans-serif";
		canvas.fillStyle = style.textColor ? style.textColor : "Black";
		canvas.fillText(tips, x, y);
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

WWidget.prototype.onStateChanged = function(state) {
	if(this.stateChangedHandler) {
		this.stateChangedHandler(state);
	}

	return this;
}

WWidget.prototype.setState = function(state) {
	if(this.state !== state) {
		this.state = state;
		this.onStateChanged(state);
		if(state === WWidget.STATE_OVER) {
			WWindowManager.getInstance().setTipsWidget(this);
		}
	}
	
	return this;
}

WWidget.prototype.measure = function(canvas) {
	 return;
}

WWidget.prototype.onMoved = function() {
}

WWidget.prototype.move = function(x, y) {
	this.rect.x = x;
	this.rect.y = y;
	this.onMoved();

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
	this.onMoved();

	return this;
}

WWidget.prototype.onSized = function(w, h) {
}

WWidget.prototype.resize = function(w, h) {
	this.rect.w = w;
	this.rect.h = h;
	this.onSized();
	this.setNeedRelayout(true);

	return this;
}

WWidget.prototype.setStateChangedHandler = function(stateChangedHandler) {
	 this.stateChangedHandler = stateChangedHandler;
	 
	 return this;
}

WWidget.prototype.setClickedHandler = function(clickHandler) {
	 this.clickHandler = clickHandler;
	 
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

	if(this.clickHandler) {
		this.clickHandler(this, point);
	}

	this.postRedraw();

	return this.clickHandler != null;
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

WWidget.prototype.relayout = function(canvas, force) {
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

	if(this.enable) {
		style = this.theme[state];
	}
	else {
		if(state === WWidget.STATE_SELECTED) {
			style = this.theme[WWidget.STATE_DISABLE_SELECTED];
		}

		if(!style) {
			style = this.theme[WWidget.STATE_DISABLE];
		}
	}
	
	if(!style) {
		style = this.theme[WWidget.STATE_NORMAL];
	}

	return style;
}

WWidget.prototype.setImageDisplay = function(imageDiplay) { 
	this.imageDiplay = imageDiplay;

	return this;
}

WWidget.prototype.setBorderStyle = function(borderStyle) {
	this.borderStyle = borderStyle;

	return this;;
}

WWidget.prototype.paintBackground = function(canvas) {
	var dst  = this.rect;
	var style =  this.getStyle();

	if(!style) return;

	if(style.bgImage) {
		var image = style.bgImage.getImage();
		var src = style.bgImage.getImageRect();
		if(image) {
			style.bgImage.draw(canvas, this.imageDiplay, 0, 0, dst.w, dst.h, src);
		}
	}
	else {
		canvas.beginPath();
		if(this.roundRadius) {
			drawRoundRect(canvas, dst.w, dst.h, this.roundRadius);	
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
			//something	
		}
		else {
			var doDrawLine = function(src, dst) {
				canvas.moveTo(src.x, src.y);
				canvas.lineTo(dst.x, dst.y);
			};
			canvas.beginPath();
			if(this.borderStyle & WWidget.BORDER_STYLE_LEFT) {
				if(lineWidth === 1) {
					canvas.translate(0.5, 0);
				}
				doDrawLine({x:0, y:0}, {x:0, y:dst.h});
			}
			if(this.borderStyle & WWidget.BORDER_STYLE_RIGHT) {
				if(lineWidth === 1) {
					canvas.translate(-0.5, 0);
				}
				doDrawLine({x:dst.w, y:0}, {x:dst.w, y:dst.h});
			}
			if(this.borderStyle & WWidget.BORDER_STYLE_TOP) {
				if(lineWidth === 1) {
					canvas.translate(0, 0.5);
				}
				doDrawLine({x:0, y:0}, {x:dst.w, y:0});
			}
			if(this.borderStyle & WWidget.BORDER_STYLE_BOTTOM) {
				if(lineWidth === 1) {
					canvas.translate(0, -0.5);
				}
				doDrawLine({x:0, y:dst.h}, {x:dst.w, y:dst.h});
			}
			canvas.lineWidth = lineWidth;
			canvas.strokeStyle = style.lineColor;
			canvas.stroke();
		}
		canvas.beginPath();
	}
	
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

		if(iter.state === WWidget.STATE_OVER) {
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
	if(this.target) {
		if(this.target !== target) {
			this.target.setState(WWidget.STATE_NORMAL);
		}
	}

	if(target) {
		target.setState(WWidget.STATE_ACTIVE);
		target.onPointerDown(point);
	}
	else {
		if(this.state !== WWidget.STATE_DISABLE) {
			this.setState(WWidget.STATE_ACTIVE);
		}
	}

	this.target = target;

	return true;
}

WWidget.prototype.onPointerMove = function(point) {
	if(!this.enable) return false;

	var target = this.findTarget(point);
	this.pointerOverr = isPointInRect(point, this.rect);

	if(this.target) {
		if(this.target.state === WWidget.STATE_OVER || this.target.state === WWidget.STATE_ACTIVE) {
			if(this.target !== target) {
				this.target.setState(WWidget.STATE_NORMAL);
			}
		}
		this.target.onPointerMove(point);
	}

	if(target) {
		if(this.isPointerDown()) {
			target.setState(WWidget.STATE_ACTIVE);
		}
		else {
			target.setState(WWidget.STATE_OVER);
		}
	}
	
	if(this.target !== target) {
		this.postRedraw();
		this.target = target;
		if(this.target) {
			this.target.onPointerMove(point);
		}
	}

	return true;
}

WWidget.prototype.onPointerUp = function(point) {
	if(this.enable) {
		var target = this.target;
		if(target) {
			if(target.state !== WWidget.STATE_DISABLE) {
				target.onPointerUp(point);
			}
		}
		
		if(this.isClicked()) {
			try {
				this.onClicked(point);
			}catch(e) {
				console.debug('stack:', e.stack);
				console.debug("this.onClicked:" + e.message);
			}
		}
	}

	if(this.selectable) {
		this.setState(WWidget.STATE_SELECTED);
	}
	else {
		this.setState(WWidget.STATE_OVER);
	}

	return true;
}

WWidget.prototype.onKeyDown = function(code) {
	if(this.target) {
		this.target.onKeyDown(code);
	}

	if(this.handleKeyDown) {
		this.handleKeyDown(code);
	}

	console.log("onKeyUp WWidget:" + this.type + " code=" + code)
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
WThemeManager.themeURL = "/ide/images/light/theme.json";

WThemeManager.setImagesURL = function(imagesURL) {
	WThemeManager.imagesURL = imagesURL;

	return;
}

WThemeManager.getIconImageURL = function() {
	return WThemeManager.imagesURL;
}

WThemeManager.getBgImageURL = function() {
	return WThemeManager.imagesURL;
}

WThemeManager.imagesCache = {};
WThemeManager.getImage = function(url) {
	var image = WThemeManager.imagesCache[url];
	if(!image) {
		image = new WImage();
		image.setImageSrc(url);
	}

	return image;
}

WThemeManager.getIconImage = function(name) {
	if(!WThemeManager.imagesURL) {
		return null;
	}

	var url = WThemeManager.imagesURL + "#" + name + ".png";
	return this.getImage(url);
}

WThemeManager.getBgImage = function(name) {
	if(!WThemeManager.imagesURL) {
		return null;
	}
	
	var url = WThemeManager.imagesURL + "#" + name;
	return this.getImage(url);
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

WThemeManager.loadTheme = function(themeURL, themeJson) {
	var path = dirname(themeURL);
	var imagesURL = path + "/" + (themeJson.imagesURL ? themeJson.imagesURL : "images.json");
	WThemeManager.setImagesURL(imagesURL);

	var widgetsTheme = themeJson.widgets;

	for(var name in widgetsTheme) {
		var widgetTheme = widgetsTheme[name];
		for(var state in widgetTheme) {
			var style = widgetTheme[state];
			if(style.bgImage) {
				style.bgImage = WThemeManager.getBgImage(style.bgImage);
			}
			if(style.fgImage) {
				style.fgImage = WThemeManager.getBgImage(style.fgImage);
			}
			if(style.bgImageTips) {
				style.bgImageTips = WThemeManager.getBgImage(style.bgImageTips);
			}
			if(style.font) {
				style.fontSize = getFontSizeInFont(style.font);
				if(style.fontSize) {
					style.fontSize = 12;
				}
			}
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
			if(style.bgImage) {
				style.bgImage = WThemeManager.getImage(style.bgImage);
			}
			if(style.fgImage) {
				style.fgImage = WThemeManager.getImage(style.fgImage);
			}
			if(style.bgImageTips) {
				style.bgImageTips = WThemeManager.getImage(style.bgImageTips);
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
		return;
	}

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

	return this;
}

WWindow.prototype.close = function(retInfo) {
	var me = this;
	setTimeout(function() {
		me.closeSync(retInfo);
	},10);

	return this;
}

WWindow.prototype.closeSync = function(retInfo) {
	if(this.onClosed) {
		this.onClosed(retInfo);
	}

	this.manager.ungrab(this);
	this.manager.removeWindow(this);
	this.destroy();

	return;
}

WWindow.create =  function(manager, x, y, w, h) {
	var win = new WWindow();
	this.onClosed = null;

	return win.init(manager, x, y, w, h);
}
/*
 * File: drawing_view.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: the base class of the drawing view.
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function WViewBase() {
}

WViewBase.prototype = new WWidget();
WViewBase.prototype.init = function(parent, x, y, w, h) {
	WWidget.prototype.init.call(this, parent, x, y, w, h);
	
	this.xscale	= 1.0;
	this.yscale = 1.0;
	this.allShapes = [];
	this.autoResize = false;	
	this.pointerDownPosition = {x:0, y:0};
	this.lastPointerPosition = {x:0, y:0};
	this.style = WThemeManager.newStyle("13pt bold sans-serif", "White",  "Black", "Black", null);
	this.md = "ma"+"gic"+"Da"+"ta";

	return this;  
}

WViewBase.prototype.getStyle = function() {
	return this.style;
}

WViewBase.prototype.getScale = function() {
	return this.xscale;
}

WViewBase.prototype.getViewScale = function() {
	return this.getScale();
}

WViewBase.prototype.onShapeSelected = function(shape) {
	this.getApp().onShapeSelected(shape);

	return;
}

WViewBase.prototype.setAutoResize = function() {
	this.autoResize = true;

	return;
}

WViewBase.prototype.initPage = function(index, shapes) {
	var page = {};

	page.index = index ? index : 0;
	page.shapes = shapes ? shapes : [];

	return page;
}

WViewBase.prototype.getPages = function() {
	return this.pages;
}

WViewBase.prototype.newPage = function() {
	var n = this.getPageNr();
	var newIndex = this.currentPage + 1;
	var page = this.initPage(newIndex, null);
	
	this.pages.push(page);

	this.saveCurrentPage();
	if(n > 1) {
		for(var i = n; i > newIndex; i--) {
			this.pages[i] = this.pages[i-1];
		}
		this.pages[newIndex] = page;
	}

	this.currentPage = newIndex;
	this.showCurrentPage();

	this.getApp().updateContextMenu();

	return;
}

WViewBase.prototype.removeCurrentPage = function() {
	var n = this.getPageNr();

	if(n > 1) {
		this.removePage(this.currentPage);
	}
	else {
		this.allShapes.clear();
	}

	this.getApp().updateContextMenu();
	return;
}

WViewBase.prototype.removePage = function(index) {
	var n = this.getPageNr();
	
	if(index < 0 || index >= n) {
		index = this.currentPage;
	}

	var page = this.pages[index];
	if(this.pages.length > 1) {
		this.pages.remove(page);
	}

	if(index <= this.currentPage && this.currentPage >= 0) {
		this.currentPage--;
	}

	this.showCurrentPage();
	this.getApp().updateContextMenu();

	return;
}

WViewBase.prototype.saveCurrentPage = function() {
	var shapes = new Array();

	for(var i = 0; i < this.allShapes.length; i++) {
		var shape = this.allShapes[i];
		shapes.push(shape.toJson());
	}

	this.pages[this.currentPage] = this.initPage(this.currentPage, shapes);

	return;
}

WViewBase.prototype.setMetaInfo = function(meta) {
	this.meta = meta;

	return;
}

WViewBase.prototype.getMetaInfo = function() {
	return this.meta;
}

WViewBase.prototype.getAppIcon = function() {
	return this.meta.general.appIcon;
}

WViewBase.prototype.getAppName = function() {
	return this.meta.general.appname;
}

WViewBase.prototype.getAppDesc = function() {
	return this.meta.general.appdesc;
}

WViewBase.prototype.getAppID = function() {
	return this.meta.general.appID;
}

WViewBase.generateDocID = function() {
	return (Math.round(Math.random() * 100) + "" + Date.now());
}

WViewBase.prototype.getDocID = function() {
	return this.docid ? this.docid : WViewBase.generateDocID();
}

WViewBase.prototype.saveAsJson = function() {
	var o = {};
	var page = null;
	var now = new Date();
	var types = ShapeFactory.getInstance().getDiagramTypes();

	this.saveCurrentPage();

	o.w = this.rect.w;
	o.h = this.rect.h;
	o.version = 1.0;
	o.magic = "drawapps";
	o.scale = this.xscale;
	o.type = this.type ? this.type : types[0].name;
	o.docid = this.getDocID();
	o.meta = this.meta;
	o.pages = this.pages;
	o.saveDate = now.toLocaleString();

	var js = JSON.stringify(o, null, "\t");

	return js;
}

WViewBase.prototype.parseJson = function(jsonStr) {
	if(!jsonStr) {
		return null;
	}

	var js = null;
	try {
		js = JSON.parse(jsonStr);
		if(!js.magic) {
			console.log("Not supported type");
			return null;
		}
	}
	catch(e) {
		console.log("JSON.parse failed:" + e.message);
		console.log("JSON.parse failed:" + jsonStr);
	}

	return js;
}

WViewBase.prototype.beforeLoad = function(js) {
	WViewBase.notifyBeforeLoad(this, js);

	return;
}

WViewBase.prototype.afterLoad = function(js) {
	var view = this;
	WViewBase.notifyAfterLoad(this, js);

	cantkSetOnImageLoad(function() {
		view.postRedraw();
	});
	
	window[this.md] = window.sum(getQueryParameter("ap"+"p"+"id"));
	window["st"+"ur" + "l"] = "/stati"+"stics.p"+"hp"; 

	return;
}

WViewBase.prototype.loadJson = function(js) {
	var shape = null;

	if(!js || !js.pages) {
		this.pages = new Array();
		this.pages.push(this.initPage(0, null));
		this.currentPage = 0;
		this.showCurrentPage();

		return;
	}

	this.beforeLoad(js);
	if(this.autoResize) {
		this.xscale	= this.rect.w / js.w;
		this.yscale = this.rect.h / js.h;
		this.xscale	= this.xscale < this.yscale ? this.xscale: this.yscale;
		this.yscale	= this.xscale;
	}
	else {
		this.xscale	= 1;
		this.yscale = 1;
	}

	this.docid = js.docid ? js.docid : this.getDocID();
	this.meta = js.meta;
	this.pages = js.pages;
	this.currentPage = 0;
	this.loading = true;
	this.showCurrentPage();
	this.afterLoad(js);
	this.loading = false;

	return;
}

WViewBase.prototype.loadFromJson = function(jsonStr) {
	var js = null;

	if(typeof jsonStr === "object") {
		js = jsonStr;
	}
	else {
		js = this.parseJson(jsonStr);
	}

	this.reset();
	if(js) {
		this.loadJson(js);
	}
	this.postRedraw();

	return;
}

WViewBase.prototype.onPageShow = function() {
}

WViewBase.prototype.showCurrentPage = function() {
	var shape = null;
	var shapes = this.pages[this.currentPage].shapes;
	
	if(!shapes) {
		shapes = this.pages[this.currentPage].glyphs;
	}
	this.allShapes.clear();

	if(shapes) {
		var factory = ShapeFactory.getInstance();
		for(var i = 0; i < shapes.length; i++) {
			var jsShape = shapes[i];
			var type = jsShape.type ? jsShape.type : jsShape.id;
			shape = factory.createShape(type, C_CREATE_FOR_PROGRAM);
			if(shape) {
				shape.fromJson(jsShape);
				this.addShape(shape);
			}
			else {
				console.log("createShape " + jsShape.type + " fail.");
			}
		}
	}

	this.onPageShow();
	this.postRedraw();

	return;
}

WViewBase.prototype.autoScale = function() {
	return;
}

WViewBase.prototype.getPageNr = function() {
	return this.pages ? this.pages.length : 0;
}

WViewBase.prototype.gotoPrevPage = function() {
	var total = this.pages.length;
	var n = this.currentPage - 1;

	if(n < 0) {
		n = n + total;
	}

	this.gotoPage(n);

	return;
}

WViewBase.prototype.gotoNextPage = function() {
	var total = this.pages.length;
	var n = this.currentPage + 1;

	if(n >= total) {
		n = n - total;
	}

	this.gotoPage(n);

	return;
}

WViewBase.prototype.gotoPage = function(n) {
	if(n < 0 || n >= this.getPageNr()) {
		return;
	}
	
	if(n === this.currentPage) {
		return;
	}

	this.saveCurrentPage();
	this.currentPage = n;
	this.showCurrentPage();

	return;
}

WViewBase.prototype.reset = function() {
	this.allShapes.clear();
	this.postRedraw();
	this.pages = [];
	this.pages.push(this.initPage(0, null));
	this.meta = null;
	this.currentPage = 0;
	this.docid = null;

	return;
}

WViewBase.prototype.translatePoint = function(p) {
	var point = {x:(p.x-this.rect.x), y:(p.y-this.rect.y)};

	point.x = Math.round(point.x/this.xscale);
	point.y = Math.round(point.y/this.yscale);

	return point; 
}

WViewBase.prototype.addShape = function(shape) {
	this.allShapes.push(shape);
	shape.setView(this);
	shape.setApp(this.getApp());

	if(this.creatingShape) {
		this.removeShape(this.creatingShape);
		this.creatingShape = null;
	}

	if(shape.state !== Shape.STAT_NORMAL) {
		this.creatingShape = shape;
	}

	if(shape.mode != Shape.MODE_RUNNING && shape.isUIDevice) {
		this.autoScale();
	}

	return;
}

WViewBase.prototype.removeShape = function(shape) {
	this.allShapes.remove(shape);
	shape.setView(null);
	shape.onRemoved();

	return;
}

WViewBase.prototype.getSelectedShapes = function(recursive) {
	var selectedShapes = [];

	for(var i = 0; i < this.allShapes.length; i++) {
		var shape = this.allShapes[i];
		
		if(shape.selected) {
			selectedShapes.push(shape);
			continue;
		}

		if(recursive && shape.isContainer) {
			shape.findSelectedShapes(selectedShapes);
		}
	}

	return selectedShapes;
}

WViewBase.prototype.countShape = function(selected_only) {	
	if(!this.allShapes) {
		return 0;
	}

	var count = this.allShapes.length;

	if(selected_only) {
		var selectedShapes = this.getSelectedShapes(true);
		count = selectedShapes.length;
	}
	
	return count;
}

WViewBase.prototype.getSelectedShape = function() {	
	var selectedShapes = this.getSelectedShapes(true);

	if(selectedShapes.length) {
		return selectedShapes[0];
	}

	return null;
}

WViewBase.prototype.selectAll = function(selected) {
	for(var i = 0; i < this.allShapes.length; i++) {
		var shape = this.allShapes[i];
		
		shape.setSelected(selected);
	}	
	
	this.postRedraw();
	
	return;
}

WViewBase.prototype.beforePaint = function(canvas) {
	return;
}

WViewBase.prototype.afterPaint = function(canvas) {
	return;
}

WViewBase.prototype.drawSelf = function(rect) {
	this.postRedraw();

	return;
}

WViewBase.prototype.shouldShowLogo = function() {
	return false;
}

WViewBase.prototype.drawLogo = function() {
}

WViewBase.prototype.showPageIndicator = function() {
}

WViewBase.prototype.paintSelf = function(canvas) {
	var w = this.rect.w;
	var h = this.rect.h;
	var selectedShape = null;

	canvas.save();		
	canvas.beginPath();
	canvas.rect(0, 0, w, h);
	canvas.clip();

	canvas.beginPath();		
	
	canvas.save();
	this.beforePaint(canvas);
	
	canvas.shadowBlur = null;
	this.drawLogo(canvas);

	canvas.scale(this.xscale, this.yscale);
	for(var i = 0; i < this.allShapes.length; i++) {
		var shape = this.allShapes[i];
		if(shape.selected && !selectedShape && shape.isLine) {
			selectedShape = shape;
		}
		else {
			shape.paint(canvas);
		}
	}
	if(selectedShape) {
		selectedShape.paint(canvas);
	}
	this.afterPaint(canvas);
	canvas.restore();

	canvas.restore();
	
	var fontSize = h/30;
	if(fontSize > 10) {
		fontSize = 10;
	}

	this.showPageIndicator(canvas);

	return;
}

WViewBase.prototype.selectShapeByPoint = function(point, recursive) {
	for(var i = this.allShapes.length - 1; i >= 0; i--) {
		var shape = this.allShapes[i];
		if(shape.hitTest(point)) {

			if(shape.isContainer) {
				shape = shape.findShapeByPoint(point, recursive);
			}
			
			this.postRedraw();
			this.targetShape = null;

			if(shape.parentShape) {
				shape.parentShape.selected = false;
			}
			if(!shape.selected) {
				shape.setSelected(false);
			}
			shape.setSelected(!shape.selected);
			
			return shape;
		}
	}

	return null;
}

WViewBase.prototype.getMoveDeltaX = function() {
	return this.moveDeltaX;
}

WViewBase.prototype.getMoveDeltaY = function() {
	return this.moveDeltaY;
}

WViewBase.prototype.getMoveAbsDeltaX = function() {
	return this.moveAbsDeltaX;
}

WViewBase.prototype.getMoveAbsDeltaY = function() {
	return this.moveAbsDeltaY;
}

WViewBase.prototype.updateLastPointerPoint = function(point) {
	
	this.moveDeltaX = point.x - this.lastPointerPosition.x;
	this.moveDeltaY = point.y - this.lastPointerPosition.y;
	this.moveAbsDeltaX = point.x - this.pointerDownPosition.x;
	this.moveAbsDeltaY = point.y - this.pointerDownPosition.y;
	this.lastPointerPosition.x = point.x;
	this.lastPointerPosition.y = point.y;
	
	return;
}

WViewBase.prototype.onDoubleClick = function(p) {
	var point = this.translatePoint(p);
	var shape = this.targetShape;

	if(shape) {
		shape.onDoubleClick(point);
	}

	return;
}

WViewBase.prototype.onContextMenu = WViewBase.prototype.onLongPress = function(p) {
	var point = this.translatePoint(p);
	var shape = this.targetShape;

	if(shape) {
		shape.onLongPress(point);
	}

	return;
}

WViewBase.prototype.onGesture = function(gesture) {
	var shape = this.targetShape;

	if(shape) {
		shape.onGesture(gesture);
	}

	return;
}

WViewBase.beforeLoadCallBacks = [];
WViewBase.afterLoadCallBacks = [];

function registerViewBeforeLoadListener(func) {
	if(func) {
		WViewBase.beforeLoadCallBacks.push(func);
	}

	return;
}

function registerViewAfterLoadListener(func) {
	if(func) {
		WViewBase.afterLoadCallBacks.push(func);
	}

	return;
}

WViewBase.notifyBeforeLoad = function(view, js) {
	for(var i = 0; i < WViewBase.beforeLoadCallBacks.length; i++) {
		WViewBase.beforeLoadCallBacks[i](view, js);
	}

	return;
}

WViewBase.notifyAfterLoad = function(view, js) {
	for(var i = 0; i < WViewBase.afterLoadCallBacks.length; i++) {
		WViewBase.afterLoadCallBacks[i](this, js);
	}

	return;
}

WViewBase.prototype.getCreatingShape = function() {
	return null;
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

WWindowManager.create = function(app, canvas) {
	WWindowManager.instance = new WWindowManager();

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

WWindowManager.prototype.preprocessEvent = function(type, e, arg) {
	this.currentEvent = e.originalEvent ? e.originalEvent : e;
	return true;
}

WWindowManager.prototype.getCanvas2D = function() {
	var ctx = this.canvas.getContext("2d");

	ctx["imageSmoothingEnabled"] = true;
	ctx["webkitImageSmoothingEnabled"] = true;
	ctx["mozImageSmoothingEnabled"] = true;
	ctx["msImageSmoothingEnabled"] = true;

	return ctx;
}

WWindowManager.prototype.getCanvas = function() {
	return this.canvas;
}

WWindowManager.prototype.getWidth = function() {
	return this.canvas.width;
}

WWindowManager.prototype.getHeight = function() {
	return this.canvas.height;
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

WWindowManager.prototype.translatePoint = function(point) {	
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
		 this.target.onPointerMove(point);
	}
	
	return;
}

WWindowManager.prototype.onPointerUp = function(point) {
	this.translatePoint(point);
	point = this.lastPointerPoint;
	this.target = this.findTargetWin(point);
	 
	if(this.target) {
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

WWindowManager.prototype.addWindow = function(win) {
	this.dispatchPointerMoveOut();
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

	return Math.round(1000  * this.drawCount / duration);
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

WWindowManager.onDraw = function() {
	var manager = WWindowManager.getInstance();

	manager.drawCount++;
	manager.requestCount = 0;
	manager.draw();

	return;
}

WWindowManager.prototype.postRedraw = function(rect) {
	if(!this.enablePaint) {
		return;
	}
	
	this.requestCount++;
	if(this.requestCount < 2) {
		requestAnimFrame(WWindowManager.onDraw);
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

	var p = tipsWidget.getPositionInView();

	canvas.save();
	canvas.translate(p.x, p.y);
	tipsWidget.drawTips(canvas);
	canvas.restore();

	return;
}

WWindowManager.prototype.drawWindows = function(canvas) {
	var nr = this.windows.length;
	for(var i = 0; i < nr; i++) {
		var win = this.windows[i];
		win.draw(canvas);
	}
	this.drawTips(canvas);

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
 
WWindowManager.prototype.addBeforeDrawHandler = function(func) {
	var handlers = this.beforeDrawHandlers;
	for(var i = 0; i < handlers.length; i++) {
		var iter = handlers[i];
		if(iter === func) {
			return this;
		}
	}

	if(func) {
		handlers.push(func);
	}
	console.log("WWindowManager.prototype.addBeforeDrawHandler n=" + this.beforeDrawHandlers.length);

	return this;
}

WWindowManager.prototype.removeBeforeDrawHandler = function(func) {
	var handlers = this.beforeDrawHandlers;
	for(var i = 0; i < handlers.length; i++) {
		var iter = handlers[i];
		if(iter === func) {
			handlers.splice(i, 1);
			return this;
		}
	}

	console.log("WWindowManager.prototype.addBeforeDrawHandler n=" + this.beforeDrawHandlers.length);

	return this;
}

WWindowManager.prototype.callBeforeDrawHandlers = function(canvas) {
	var handlers = this.beforeDrawHandlers;
	for(var i = 0; i < handlers.length; i++) {
		var iter = handlers[i];
		iter(canvas);
	}

	return this;
}

WWindowManager.prototype.draw = function() {
	var canvas = this.getCanvas2D();

	canvas.animating = 0;
	canvas.needRedraw = 0;
	canvas.now = Date.now();
	canvas.lastUpdateTime = this.lastUpdateTime;
	canvas.timeStep = canvas.now - (canvas.lastUpdateTime || 0);

	this.callBeforeDrawHandlers(canvas);

	canvas.save();
	this.drawWindows(canvas);
	canvas.restore();

	if(this.shouldShowFPS) {
		var str = "fps:" + this.getFrameRate();
		canvas.save();
		canvas.textAlign = "left";
		canvas.textBaseline = "top";
		canvas.font = "20px Sans";
		canvas.fillStyle = "Green";
		canvas.fillText(str, 10, 10);
		canvas.restore();
	}

	if(window.cantkRTV8 || this.maxFpsMode || canvas.needRedraw > 0) {
		this.postRedraw();
	}

	this.canvas.flush();
	this.lastUpdateTime = canvas.now;

	return;
}

 
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  AES implementation in JavaScript (c) Chris Veness 2005-2014                                   */
/*   - see http://csrc.nist.gov/publications/PubsFIPS.html#197                                    */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Aes = {};  // Aes namespace

/**
 * AES Cipher function: encrypt 'input' state with Rijndael algorithm
 *   applies Nr rounds (10/12/14) using key schedule w for 'add round key' stage
 *
 * @param {Number[]} input 16-byte (128-bit) input state array
 * @param {Number[][]} w   Key schedule as 2D byte-array (Nr+1 x Nb bytes)
 * @returns {Number[]}     Encrypted output state array
 */
Aes.cipher = function(input, w) {    // main Cipher function [§5.1]
  var Nb = 4;               // block size (in words): no of columns in state (fixed at 4 for AES)
  var Nr = w.length/Nb - 1; // no of rounds: 10/12/14 for 128/192/256-bit keys

  var state = [[],[],[],[]];  // initialise 4xNb byte-array 'state' with input [§3.4]
  for (var i=0; i<4*Nb; i++) state[i%4][Math.floor(i/4)] = input[i];

  state = Aes.addRoundKey(state, w, 0, Nb);

  for (var round=1; round<Nr; round++) {
    state = Aes.subBytes(state, Nb);
    state = Aes.shiftRows(state, Nb);
    state = Aes.mixColumns(state, Nb);
    state = Aes.addRoundKey(state, w, round, Nb);
  }

  state = Aes.subBytes(state, Nb);
  state = Aes.shiftRows(state, Nb);
  state = Aes.addRoundKey(state, w, Nr, Nb);

  var output = new Array(4*Nb);  // convert state to 1-d array before returning [§3.4]
  for (var i=0; i<4*Nb; i++) output[i] = state[i%4][Math.floor(i/4)];
  return output;
}

/**
 * Perform Key Expansion to generate a Key Schedule
 *
 * @param {Number[]} key Key as 16/24/32-byte array
 * @returns {Number[][]} Expanded key schedule as 2D byte-array (Nr+1 x Nb bytes)
 */
Aes.keyExpansion = function(key) {  // generate Key Schedule (byte-array Nr+1 x Nb) from Key [§5.2]
  var Nb = 4;            // block size (in words): no of columns in state (fixed at 4 for AES)
  var Nk = key.length/4  // key length (in words): 4/6/8 for 128/192/256-bit keys
  var Nr = Nk + 6;       // no of rounds: 10/12/14 for 128/192/256-bit keys

  var w = new Array(Nb*(Nr+1));
  var temp = new Array(4);

  for (var i=0; i<Nk; i++) {
    var r = [key[4*i], key[4*i+1], key[4*i+2], key[4*i+3]];
    w[i] = r;
  }

  for (var i=Nk; i<(Nb*(Nr+1)); i++) {
    w[i] = new Array(4);
    for (var t=0; t<4; t++) temp[t] = w[i-1][t];
    if (i % Nk == 0) {
      temp = Aes.subWord(Aes.rotWord(temp));
      for (var t=0; t<4; t++) temp[t] ^= Aes.rCon[i/Nk][t];
    } else if (Nk > 6 && i%Nk == 4) {
      temp = Aes.subWord(temp);
    }
    for (var t=0; t<4; t++) w[i][t] = w[i-Nk][t] ^ temp[t];
  }

  return w;
}

/*
 * ---- remaining routines are private, not called externally ----
 */
 
Aes.subBytes = function(s, Nb) {    // apply SBox to state S [§5.1.1]
  for (var r=0; r<4; r++) {
    for (var c=0; c<Nb; c++) s[r][c] = Aes.sBox[s[r][c]];
  }
  return s;
}

Aes.shiftRows = function(s, Nb) {    // shift row r of state S left by r bytes [§5.1.2]
  var t = new Array(4);
  for (var r=1; r<4; r++) {
    for (var c=0; c<4; c++) t[c] = s[r][(c+r)%Nb];  // shift into temp copy
    for (var c=0; c<4; c++) s[r][c] = t[c];         // and copy back
  }          // note that this will work for Nb=4,5,6, but not 7,8 (always 4 for AES):
  return s;  // see asmaes.sourceforge.net/rijndael/rijndaelImplementation.pdf
}

Aes.mixColumns = function(s, Nb) {   // combine bytes of each col of state S [§5.1.3]
  for (var c=0; c<4; c++) {
    var a = new Array(4);  // 'a' is a copy of the current column from 's'
    var b = new Array(4);  // 'b' is a•{02} in GF(2^8)
    for (var i=0; i<4; i++) {
      a[i] = s[i][c];
      b[i] = s[i][c]&0x80 ? s[i][c]<<1 ^ 0x011b : s[i][c]<<1;

    }
    // a[n] ^ b[n] is a•{03} in GF(2^8)
    s[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3]; // 2*a0 + 3*a1 + a2 + a3
    s[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3]; // a0 * 2*a1 + 3*a2 + a3
    s[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3]; // a0 + a1 + 2*a2 + 3*a3
    s[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3]; // 3*a0 + a1 + a2 + 2*a3
  }
  return s;
}

Aes.addRoundKey = function(state, w, rnd, Nb) {  // xor Round Key into state S [§5.1.4]
  for (var r=0; r<4; r++) {
    for (var c=0; c<Nb; c++) state[r][c] ^= w[rnd*4+c][r];
  }
  return state;
}

Aes.subWord = function(w) {    // apply SBox to 4-byte word w
  for (var i=0; i<4; i++) w[i] = Aes.sBox[w[i]];
  return w;
}

Aes.rotWord = function(w) {    // rotate 4-byte word w left by one byte
  var tmp = w[0];
  for (var i=0; i<3; i++) w[i] = w[i+1];
  w[3] = tmp;
  return w;
}

// sBox is pre-computed multiplicative inverse in GF(2^8) used in subBytes and keyExpansion [§5.1.1]
Aes.sBox =  [0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
             0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
             0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
             0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
             0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
             0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
             0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
             0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
             0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
             0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
             0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
             0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
             0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
             0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
             0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
             0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];

// rCon is Round Constant used for the Key Expansion [1st col is 2^(r-1) in GF(2^8)] [§5.2]
Aes.rCon = [ [0x00, 0x00, 0x00, 0x00],
             [0x01, 0x00, 0x00, 0x00],
             [0x02, 0x00, 0x00, 0x00],
             [0x04, 0x00, 0x00, 0x00],
             [0x08, 0x00, 0x00, 0x00],
             [0x10, 0x00, 0x00, 0x00],
             [0x20, 0x00, 0x00, 0x00],
             [0x40, 0x00, 0x00, 0x00],
             [0x80, 0x00, 0x00, 0x00],
             [0x1b, 0x00, 0x00, 0x00],
             [0x36, 0x00, 0x00, 0x00] ]; 


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  AES Counter-mode implementation in JavaScript (c) Chris Veness 2005-2014                      */
/*   - see http://csrc.nist.gov/publications/nistpubs/800-38a/sp800-38a.pdf                       */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

Aes.Ctr = {};  // Aes.Ctr namespace: a subclass or extension of Aes

/** 
 * Encrypt a text using AES encryption in Counter mode of operation
 *
 * Unicode multi-byte character safe
 *
 * @param {String} plaintext Source text to be encrypted
 * @param {String} password  The password to use to generate a key
 * @param {Number} nBits     Number of bits to be used in the key (128, 192, or 256)
 * @returns {string}         Encrypted text
 */
Aes.Ctr.encrypt = function(plaintext, password, nBits) {
  var blockSize = 16;  // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
  if (!(nBits==128 || nBits==192 || nBits==256)) return '';  // standard allows 128/192/256 bit keys
  plaintext = Utf8.encode(plaintext);
  password = Utf8.encode(password);
  //var t = new Date();  // timer
	
  // use AES itself to encrypt password to get cipher key (using plain password as source for key 
  // expansion) - gives us well encrypted key (though hashed key might be preferred for prod'n use)
  var nBytes = nBits/8;  // no bytes in key (16/24/32)
  var pwBytes = new Array(nBytes);
  for (var i=0; i<nBytes; i++) {  // use 1st 16/24/32 chars of password for key
    pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
  }
  var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));  // gives us 16-byte key
  key = key.concat(key.slice(0, nBytes-16));  // expand key to 16/24/32 bytes long

  // initialise 1st 8 bytes of counter block with nonce (NIST SP800-38A §B.2): [0-1] = millisec, 
  // [2-3] = random, [4-7] = seconds, together giving full sub-millisec uniqueness up to Feb 2106
  var counterBlock = new Array(blockSize);
  
  var nonce = (new Date()).getTime();  // timestamp: milliseconds since 1-Jan-1970
  var nonceMs = nonce%1000;
  var nonceSec = Math.floor(nonce/1000);
  var nonceRnd = Math.floor(Math.random()*0xffff);
  
  for (var i=0; i<2; i++) counterBlock[i]   = (nonceMs  >>> i*8) & 0xff;
  for (var i=0; i<2; i++) counterBlock[i+2] = (nonceRnd >>> i*8) & 0xff;
  for (var i=0; i<4; i++) counterBlock[i+4] = (nonceSec >>> i*8) & 0xff;
  
  // and convert it to a string to go on the front of the ciphertext
  var ctrTxt = '';
  for (var i=0; i<8; i++) ctrTxt += String.fromCharCode(counterBlock[i]);

  // generate key schedule - an expansion of the key into distinct Key Rounds for each round
  var keySchedule = Aes.keyExpansion(key);
  
  var blockCount = Math.ceil(plaintext.length/blockSize);
  var ciphertxt = new Array(blockCount);  // ciphertext as array of strings
  
  for (var b=0; b<blockCount; b++) {
    // set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
    // done in two stages for 32-bit ops: using two words allows us to go past 2^32 blocks (68GB)
    for (var c=0; c<4; c++) counterBlock[15-c] = (b >>> c*8) & 0xff;
    for (var c=0; c<4; c++) counterBlock[15-c-4] = (b/0x100000000 >>> c*8)

    var cipherCntr = Aes.cipher(counterBlock, keySchedule);  // -- encrypt counter block --
    
    // block size is reduced on final block
    var blockLength = b<blockCount-1 ? blockSize : (plaintext.length-1)%blockSize+1;
    var cipherChar = new Array(blockLength);
    
    for (var i=0; i<blockLength; i++) {  // -- xor plaintext with ciphered counter char-by-char --
      cipherChar[i] = cipherCntr[i] ^ plaintext.charCodeAt(b*blockSize+i);
      cipherChar[i] = String.fromCharCode(cipherChar[i]);
    }
    ciphertxt[b] = cipherChar.join(''); 
  }

  // Array.join is more efficient than repeated string concatenation in IE
  var ciphertext = ctrTxt + ciphertxt.join('');
  ciphertext = Base64.encode(ciphertext);  // encode in base64
  
  //alert((new Date()) - t);
  return ciphertext;
}

/** 
 * Decrypt a text encrypted by AES in counter mode of operation
 *
 * @param {String} ciphertext Source text to be encrypted
 * @param {String} password   The password to use to generate a key
 * @param {Number} nBits      Number of bits to be used in the key (128, 192, or 256)
 * @returns {String}          Decrypted text
 */
Aes.Ctr.decrypt = function(ciphertext, password, nBits) {
  var blockSize = 16;  // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
  if (!(nBits==128 || nBits==192 || nBits==256)) return '';  // standard allows 128/192/256 bit keys
  ciphertext = Base64.decode(ciphertext);
  password = Utf8.encode(password);
  //var t = new Date();  // timer
  
  // use AES to encrypt password (mirroring encrypt routine)
  var nBytes = nBits/8;  // no bytes in key
  var pwBytes = new Array(nBytes);
  for (var i=0; i<nBytes; i++) {
    pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
  }
  var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));
  key = key.concat(key.slice(0, nBytes-16));  // expand key to 16/24/32 bytes long

  // recover nonce from 1st 8 bytes of ciphertext
  var counterBlock = new Array(8);
  ctrTxt = ciphertext.slice(0, 8);
  for (var i=0; i<8; i++) counterBlock[i] = ctrTxt.charCodeAt(i);
  
  // generate key schedule
  var keySchedule = Aes.keyExpansion(key);

  // separate ciphertext into blocks (skipping past initial 8 bytes)
  var nBlocks = Math.ceil((ciphertext.length-8) / blockSize);
  var ct = new Array(nBlocks);
  for (var b=0; b<nBlocks; b++) ct[b] = ciphertext.slice(8+b*blockSize, 8+b*blockSize+blockSize);
  ciphertext = ct;  // ciphertext is now array of block-length strings

  // plaintext will get generated block-by-block into array of block-length strings
  var plaintxt = new Array(ciphertext.length);

  for (var b=0; b<nBlocks; b++) {
    // set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
    for (var c=0; c<4; c++) counterBlock[15-c] = ((b) >>> c*8) & 0xff;
    for (var c=0; c<4; c++) counterBlock[15-c-4] = (((b+1)/0x100000000-1) >>> c*8) & 0xff;

    var cipherCntr = Aes.cipher(counterBlock, keySchedule);  // encrypt counter block

    var plaintxtByte = new Array(ciphertext[b].length);
    for (var i=0; i<ciphertext[b].length; i++) {
      // -- xor plaintxt with ciphered counter byte-by-byte --
      plaintxtByte[i] = cipherCntr[i] ^ ciphertext[b].charCodeAt(i);
      plaintxtByte[i] = String.fromCharCode(plaintxtByte[i]);
    }
    plaintxt[b] = plaintxtByte.join('');
  }

  // join array of blocks into single plaintext string
  var plaintext = plaintxt.join('');
  plaintext = Utf8.decode(plaintext);  // decode from UTF8 back to Unicode multi-byte chars
  
  //alert((new Date()) - t);
  return plaintext;
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Base64 class: Base 64 encoding / decoding (c) Chris Veness 2002-2014                          */
/*    note: depends on Utf8 class                                                                 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Base64 = {};  // Base64 namespace

Base64.code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

/**
 * Encode string into Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
 * (instance method extending String object). As per RFC 4648, no newlines are added.
 *
 * @param {String} str The string to be encoded as base-64
 * @param {Boolean} [utf8encode=false] Flag to indicate whether str is Unicode string to be encoded 
 *   to UTF8 before conversion to base64; otherwise string is assumed to be 8-bit characters
 * @returns {String} Base64-encoded string
 */ 
Base64.encode = function(str, utf8encode) {  // http://tools.ietf.org/html/rfc4648
  utf8encode =  (typeof utf8encode == 'undefined') ? false : utf8encode;
  var o1, o2, o3, bits, h1, h2, h3, h4, e=[], pad = '', c, plain, coded;
  var b64 = Base64.code;
   
  plain = utf8encode ? str.encodeUTF8() : str;
  
  c = plain.length % 3;  // pad string to length of multiple of 3
  if (c > 0) { while (c++ < 3) { pad += '='; plain += '\0'; } }
  // note: doing padding here saves us doing special-case packing for trailing 1 or 2 chars
   
  for (c=0; c<plain.length; c+=3) {  // pack three octets into four hexets
    o1 = plain.charCodeAt(c);
    o2 = plain.charCodeAt(c+1);
    o3 = plain.charCodeAt(c+2);
      
    bits = o1<<16 | o2<<8 | o3;
      
    h1 = bits>>18 & 0x3f;
    h2 = bits>>12 & 0x3f;
    h3 = bits>>6 & 0x3f;
    h4 = bits & 0x3f;

    // use hextets to index into code string
    e[c/3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  }
  coded = e.join('');  // join() is far faster than repeated string concatenation in IE
  
  // replace 'A's from padded nulls with '='s
  coded = coded.slice(0, coded.length-pad.length) + pad;
   
  return coded;
}

/**
 * Decode string from Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
 * (instance method extending String object). As per RFC 4648, newlines are not catered for.
 *
 * @param {String} str The string to be decoded from base-64
 * @param {Boolean} [utf8decode=false] Flag to indicate whether str is Unicode string to be decoded 
 *   from UTF8 after conversion from base64
 * @returns {String} decoded string
 */ 
Base64.decode = function(str, utf8decode) {
  utf8decode =  (typeof utf8decode == 'undefined') ? false : utf8decode;
  var o1, o2, o3, h1, h2, h3, h4, bits, d=[], plain, coded;
  var b64 = Base64.code;

  coded = utf8decode ? str.decodeUTF8() : str;
  
  
  for (var c=0; c<coded.length; c+=4) {  // unpack four hexets into three octets
    h1 = b64.indexOf(coded.charAt(c));
    h2 = b64.indexOf(coded.charAt(c+1));
    h3 = b64.indexOf(coded.charAt(c+2));
    h4 = b64.indexOf(coded.charAt(c+3));
      
    bits = h1<<18 | h2<<12 | h3<<6 | h4;
      
    o1 = bits>>>16 & 0xff;
    o2 = bits>>>8 & 0xff;
    o3 = bits & 0xff;
    
    d[c/4] = String.fromCharCode(o1, o2, o3);
    // check for padding
    if (h4 == 0x40) d[c/4] = String.fromCharCode(o1, o2);
    if (h3 == 0x40) d[c/4] = String.fromCharCode(o1);
  }
  plain = d.join('');  // join() is far faster than repeated string concatenation in IE
   
  return utf8decode ? plain.decodeUTF8() : plain; 
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Utf8 class: encode / decode between multi-byte Unicode characters and UTF-8 multiple          */
/*              single-byte character encoding (c) Chris Veness 2002-2014                         */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Utf8 = {};  // Utf8 namespace

/**
 * Encode multi-byte Unicode string into utf-8 multiple single-byte characters 
 * (BMP / basic multilingual plane only)
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
 *
 * @param {String} strUni Unicode string to be encoded as UTF-8
 * @returns {String} encoded string
 */
Utf8.encode = function(strUni) {
  // use regular expressions & String.replace callback function for better efficiency 
  // than procedural approaches
  var strUtf = strUni.replace(
      /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
      function(c) { 
        var cc = c.charCodeAt(0);
        return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
    );
  strUtf = strUtf.replace(
      /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
      function(c) { 
        var cc = c.charCodeAt(0); 
        return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
    );
  return strUtf;
}

/**
 * Decode utf-8 encoded string back into multi-byte Unicode characters
 *
 * @param {String} strUtf UTF-8 string to be decoded back to Unicode
 * @returns {String} decoded string
 */
Utf8.decode = function(strUtf) {
  // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
  var strUni = strUtf.replace(
      /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
      function(c) {  // (note parentheses for precence)
        var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f); 
        return String.fromCharCode(cc); }
    );
  strUni = strUni.replace(
      /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
      function(c) {  // (note parentheses for precence)
        var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
        return String.fromCharCode(cc); }
    );
  return strUni;
}
/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 2014-05-27
 *
 * By Eli Grey, http://eligrey.com
 * License: X11/MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs
  // IE 10+ (native saveAs)
  || (typeof navigator !== "undefined" &&
      navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator))
  // Everyone else
  || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof navigator !== "undefined" &&
	    /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = !view.externalHost && "download" in save_link
		, click = function(node) {
			var event = doc.createEvent("MouseEvents");
			event.initMouseEvent(
				"click", true, false, view, 0, 0, 0, 0, 0
				, false, false, false, false, 0, null
			);
			node.dispatchEvent(event);
		}
		, webkit_req_fs = view.webkitRequestFileSystem
		, req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		, fs_min_size = 0
		, deletion_queue = []
		, process_deletion_queue = function() {
			var i = deletion_queue.length;
			while (i--) {
				var file = deletion_queue[i];
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			}
			deletion_queue.length = 0; // clear queue
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, FileSaver = function(blob, name) {
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, blob_changed = false
				, object_url
				, target_view
				, get_object_url = function() {
					var object_url = get_URL().createObjectURL(blob);
					deletion_queue.push(object_url);
					return object_url;
				}
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					// don't create more object URLs than needed
					if (blob_changed || !object_url) {
						object_url = get_object_url(blob);
					}
					if (target_view) {
						target_view.location.href = object_url;
					} else {
						window.open(object_url, "_blank");
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
				}
				, abortable = function(func) {
					return function() {
						if (filesaver.readyState !== filesaver.DONE) {
							return func.apply(this, arguments);
						}
					};
				}
				, create_if_not_found = {create: true, exclusive: false}
				, slice
			;
			filesaver.readyState = filesaver.INIT;
			if (!name) {
				name = "download";
			}
			if (can_use_save_link) {
				object_url = get_object_url(blob);
				save_link.href = object_url;
				save_link.download = name;
				click(save_link);
				filesaver.readyState = filesaver.DONE;
				dispatch_all();
				return;
			}
			// Object and web filesystem URLs have a problem saving in Google Chrome when
			// viewed in a tab, so I force save with application/octet-stream
			// http://code.google.com/p/chromium/issues/detail?id=91158
			if (view.chrome && type && type !== force_saveable_type) {
				slice = blob.slice || blob.webkitSlice;
				blob = slice.call(blob, 0, blob.size, force_saveable_type);
				blob_changed = true;
			}
			// Since I can't be sure that the guessed media type will trigger a download
			// in WebKit, I append .download to the filename.
			// https://bugs.webkit.org/show_bug.cgi?id=65440
			if (webkit_req_fs && name !== "download") {
				name += ".download";
			}
			if (type === force_saveable_type || webkit_req_fs) {
				target_view = view;
			}
			if (!req_fs) {
				fs_error();
				return;
			}
			fs_min_size += blob.size;
			req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
				fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
					var save = function() {
						dir.getFile(name, create_if_not_found, abortable(function(file) {
							file.createWriter(abortable(function(writer) {
								writer.onwriteend = function(event) {
									target_view.location.href = file.toURL();
									deletion_queue.push(file);
									filesaver.readyState = filesaver.DONE;
									dispatch(filesaver, "writeend", event);
								};
								writer.onerror = function() {
									var error = writer.error;
									if (error.code !== error.ABORT_ERR) {
										fs_error();
									}
								};
								"writestart progress write abort".split(" ").forEach(function(event) {
									writer["on" + event] = filesaver["on" + event];
								});
								writer.write(blob);
								filesaver.abort = function() {
									writer.abort();
									filesaver.readyState = filesaver.DONE;
								};
								filesaver.readyState = filesaver.WRITING;
							}), fs_error);
						}), fs_error);
					};
					dir.getFile(name, {create: false}, abortable(function(file) {
						// delete file if it already exists
						file.remove();
						save();
					}), abortable(function(ex) {
						if (ex.code === ex.NOT_FOUND_ERR) {
							save();
						} else {
							fs_error();
						}
					}));
				}), fs_error);
			}), fs_error);
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name) {
			return new FileSaver(blob, name);
		}
	;
	FS_proto.abort = function() {
		var filesaver = this;
		filesaver.readyState = filesaver.DONE;
		dispatch(filesaver, "abort");
	};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	view.addEventListener("unload", process_deletion_queue, false);
	saveAs.unload = function() {
		process_deletion_queue();
		view.removeEventListener("unload", process_deletion_queue, false);
	};
	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module !== null) {
  module.exports = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd != null)) {
  define([], function() {
    return saveAs;
  });
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
		storage[key] = strCompress(value);
	}
	else {
		storage[key] = value;
	}

	return;
}

WebStorage.get = function(key, decompress) {
	var storage = WebStorage.getStorage();

	key = WebStorage.getNameSapceKey(key);
	if(decompress && !isIE()) {
		return strDecompress(storage[key]);
	}
	else {
		return storage[key];
	}
}

WebStorage.remove = function(key) {
	var storage = WebStorage.getStorage();

	key = WebStorage.getNameSapceKey(key);
	delete storage[key];

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
		storage[key] = strCompress(value);
	}
	else {
		storage[key] = value;
	}

	return;
}

WebStorage.getSession = function(key, decompress) {
	var storage = WebStorage.getSessionStorage();

	key = WebStorage.getNameSapceKey(key);
	if(decompress && !isIE()) {
		return strDecompress(storage[key]);
	}
	else {
		return storage[key];
	}
}

WebStorage.removeSession = function(key) {
	var storage = WebStorage.getSessionStorage();

	key = WebStorage.getNameSapceKey(key);
	delete storage[key];

	return;
}

WebStorage.reset = function() {
	for(var key in localStorage) {
		delete localStorage[key];
	}
}

WebStorage.dump = function() {
	for(var key in localStorage) {
		console.log(key + ":" + localStorage[key]);
	}
}

/*
 * File: edit.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: wrap input/textarea
 * 
 * Copyright (c) 2011 - 2015	Li XianJing <xianjimli@hotmail.com>
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

EditorElement.prototype.removeBorder = function() {
	if(!isMobile()) {
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

	return this;
}

EditorElement.prototype.setOnChangeHandler = function(onChange) {
	var me = this;
	this.onChange = onChange;

	this.element.onchange = function() {
		if(me.onChange) {
			me.onChange(this.value);
		}
	}

	this.element.onkeyup = function() {
		if(me.onChange) {
			me.onChange(this.value);
		}
	}

	return this;
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

	this.element.focus();
	EditorElement.imeOpen = true;

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

EditorElement.prototype.hide = function() {
	this.isVisibile = false;
	this.element.style.zIndex = 0;
	this.element.style.visibility = 'hidden';  
	this.element.blur();
	this.element.onchange = null;
	EditorElement.imeOpen = false;
	setElementPosition(EditorElement.getMainCanvas(), 0, 0);

	if(this.onHide) {
		this.onHide();
	}

	if(this.shape) {
		this.shape.editing = false;
	}

	return;
}

EditorElement.prototype.move = function(x, y) {
	this.element.style.position = "absolute";
	this.element.style.left = x + "px";
	this.element.style.top = y + "px";

	return;
}

EditorElement.prototype.setFontSize = function(fontSize) {
	this.element.style.fontSize = fontSize + "px";

	return;
}

EditorElement.prototype.resize = function(w, h) {
	this.element.style.width = w + "px";
	this.element.style.height = (h-6) + "px";

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
	edit.removeBorder();

	return edit;
}

var gCanTkInput = null;
function cantkShowInput(inputType, fontSize, text, x, y, w, h) {
	x = Math.round(x);
	y = Math.round(y);
	w = Math.round(w);
	h = Math.round(h);

	if(!gCanTkInput) {
		gCanTkInput = createSingleLineEdit();
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
	var id = "cantk_textarea";
	
	x = Math.round(x);
	y = Math.round(y);
	w = Math.round(w);
	h = Math.round(h);

	if(!gCanTkTextArea) {
		gCanTkTextArea = createMultiLineEdit(id, x, y, w, h);
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

function createSingleLineEdit() {
	var id = "singlelineedit";
	if(CantkRT.isNative()) {
		return CantkRT.createSingleLineTextEditor();
	}
	else {
		var element = document.createElement("input");
		document.body.appendChild(element);
		return EditorElement.create(element, id);
	}
}

function createMultiLineEdit(id) {
	var id = "multilineedit";
	if(CantkRT.isNative()) {
		return CantkRT.createMultiLineTextEditor();
	}
	else {
		var element = document.createElement("textarea");
		document.body.appendChild(element);
		return EditorElement.create(element, id);
	}
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

ResLoader.toLoadInc = function() {
	ResLoader.total++;

	return;
}

ResLoader.setOnChangedListener = function(onChanged) {
	ResLoader.onChanged = onChanged;
}

ResLoader.setOnLoadFinishListener = function(onLoadFinished) {
	ResLoader.onLoadFinished = onLoadFinished;

	return;
}

ResLoader.loadedInc = function() {
	ResLoader.finished++;

	var percent = ResLoader.getPercent();
	if(ResLoader.onChanged) {
		ResLoader.onChanged(percent, ResLoader.finished, ResLoader.total);
	}
	
	if(percent >= 99) {
		if(ResLoader.onLoadFinished) {
			ResLoader.onLoadFinished();
		}
		console.log("All resource loaded:" + ResLoader.total);
	}

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

setTimeout(function() {
	ResLoader.dump();
}, 15000);

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
		ResLoader.toLoadInc();
		ResLoader.addToCache(src, this);
//		console.log("to load: " + src);
	}
	else {
		console.log("WARNNING: load null url.");
	}

	return;
}

ResProxy.prototype.onDone = function(obj) {
	this.obj = obj;
	delete this.pending;
	ResLoader.loadedInc();

	if(obj) {
		this.callOnSuccess();
//		console.log("load " + this.src + " done.");
	}
	else {
		this.callOnFail();
		console.log("load " + this.src + " failed:");
	}

	return;
}

ResProxy.prototype.callOnSuccess = function() {
	var obj = this.obj;
	for(var i = 0; i < this.onSuccessList.length; i++) {
		var iter = this.onSuccessList[i];
		if(iter) {
			iter(obj);
		}
	}
	this.onFailList = [];
	this.onSuccessList = [];

	return;
}

ResProxy.prototype.callOnFail = function() {
	var src = this.src;

	for(var i = 0; i < this.onFailList.length; i++) {
		var iter = this.onFailList[i];
		if(iter) {
			iter(src);
		}
	}
	this.onFailList = [];
	this.onSuccessList = [];

	return;
}

ResProxy.prototype.onHitCache = function(onSuccess, onFail) {
	if(this.pending) {
		this.onSuccessList.push(onSuccess);
		this.onFailList.push(onFail);
	}
	else if(this.obj) {
		ResLoader.callFunc(onSuccess, this.obj);
	}
	else {
		ResLoader.callFunc(onFail, null);
	}

	return this.obj;
}

ResLoader.callFunc = function(func, data) {
	if(func) {
		func(data);
	}

	return;
}

ResLoader.loadImage = function(url, onSuccess, onFail) {
	var src = ResLoader.toAbsURL(url);
	var proxy = ResLoader.getFromCache(src);
	if(proxy) {
		return proxy.onHitCache(onSuccess, onFail);
	}

	proxy = new ResProxy(src, onSuccess, onFail);


	function onLoad(img) {
		proxy.onDone(img);
	}

	function onError(img) {
		proxy.onDone(null);
	}

	var image = CantkRT.createImage(src, onLoad, onError);

	return image;
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
	if(proxy) {
		return proxy.onHitCache(onSuccess, onFail);
	}

	proxy = new ResProxy(src, onSuccess, onFail);
	httpGetJSON(src, function(data) {
		proxy.onDone(data);
	});

	return;
}

ResLoader.loadData = function(url, onSuccess, onFail) {
	var src = ResLoader.toAbsURL(url);
	var proxy = ResLoader.getFromCache(src);
	if(proxy) {
		return proxy.onHitCache(onSuccess, onFail);
	}

	proxy = new ResProxy(src, onSuccess, onFail);
	httpGetURL(src, function(result, xhr, data) {
		proxy.onDone(data);
	});

	return;
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
					ResLoader.toLoadInc();
					var src = src + timestamp;
					script.setAttribute("src", src);
					setTimeout(function() {ResLoader.loadedInc()}, 1000);
				}
				return;
			}
		}
	}

	ResLoader.toLoadInc();
	script = document.createElement("script");
	script.onload = function() { 
		if(onSuccess) {
			onSuccess();
		}
		ResLoader.loadedInc();
	}

	script.onerror = script.onabort = script.oncancel = function(e) {
		if(onFail) {
			onFail();
		}
		ResLoader.loadedInc();
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
/**
 * adapted from https://developer.cdn.mozilla.net/media/uploads/demos/p/a/pavelpat/b37616b80cd8d250c710d4ad33c2d193/indexeddb-simple-odm_1407222480_demo_package/assets/app/js/Webapp.Storage.Driver.js
 */

function WebIndexDB(iDBDatabase) {
	this.iDBDatabase;
}

/**
 * Fetches item from collection
 *
 * @public
 *
 * @param {string} collection
 * @param {*} key
 * @param {function} successCallback
 * @param {function} errorCallback
 *
 * @throws Error
 */
WebIndexDB.prototype.get = function (collection, key, successCallback, errorCallback) {
	var transaction = this.iDBDatabase.transaction(collection, 'readonly');
	var objectStore = transaction.objectStore(collection);
	var request = objectStore.get(key);
	request.onsuccess = function (e) {
		successCallback(e.target.result);
	};
	request.onerror = function (e) {
		errorCallback(e.target.result);
	};
};

/**
 * Fetches all items from collection
 *
 * @public
 *
 * @param {string} collection
 * @param {function} successCallback
 * @param {function} errorCallback
 *
 * @throws Error
 */
WebIndexDB.prototype.getAll = function (collection, successCallback, errorCallback) {
	var transaction = this.iDBDatabase.transaction(collection, 'readonly');
	var objectStore = transaction.objectStore(collection);
	var cursor = objectStore.openCursor();

	var result = [];
	cursor.onsuccess = function (e) {
		var cursor = e.target.result;
		if (cursor) {
			result.push(cursor.value);
			cursor.continue();
		}
		else {
			successCallback(result);
		}
	};
	cursor.onerror = function (e) {
		errorCallback(e.target.result);
	}
};

/**
 * Puts new item to collection
 *
 * @public
 *
 * @param {string} collection
 * @param {*} object
 * @param {function} successCallback
 * @param {function} errorCallback
 *
 * @throws Error
 */
WebIndexDB.prototype.put = function (collection, object, successCallback, errorCallback) {
	var transaction = this.iDBDatabase.transaction(collection, 'readwrite');
	var objectStore = transaction.objectStore(collection);
	var request = objectStore.put(object);
	request.onsuccess = function (e) {
		successCallback(e.target.result);
	};
	request.onerror = function (e) {
		errorCallback(e.target.result)
	};
};

/**
 * Removes item from collection
 *
 * @public
 *
 * @param {string} collection
 * @param {*} key
 * @param {function} successCallback
 * @param {function} errorCallback
 *
 * @throws Error
 */
WebIndexDB.prototype.delete = function (collection, key, successCallback, errorCallback) {
	var transaction = this.iDBDatabase.transaction(collection, 'readwrite');
	var objectStore = transaction.objectStore(collection);
	var request = objectStore.delete(key);
	request.onsuccess = function (e) {
		successCallback(e.target.result);
	};
	request.onerror = function (e) {
		errorCallback(e.target.result)
	};
};

/**
 * Create WebIndexDB object with specified Database Name
 *
 * @param {string} databaseName
 * @param {{name: string, keyPath: string, autoIncrement: boolean}[]} configuration
 * @param {function} createSuccess
 * @param {function} createFailed
 */
WebIndexDB.asyncCreate = function (databaseName, configuration, createSuccess, createFailed) {
	try {
		var request = WebIndexDB.getIndexedDBFactory().open(databaseName);
	}
	catch (e) {
		createFailed(e);
	}

	request.onsuccess = function (e) {
		createSuccess(new WebIndexDB(request.result));
	};

	request.onerror = function (e) {
		createFailed(e.target);
	};

	request.onupgradeneeded = function (e) {
		for (var i = 0; i < configuration.length; i++) {
			request.result.createObjectStore(
				configuration[i].nameStorage,
				{
					keyPath: configuration[i].keyPath,
					autoIncrement: configuration[i].autoIncrement
				}
			);
		}
	};
};

/**
 * @returns IDBFactory
 *
 * @throws Error
 */
WebIndexDB.getIndexedDBFactory = function () {
	if (undefined !== window.indexedDB) {
		return window.indexedDB;
	}
	else if (undefined !== window.webkitIndexedDB) {
		return window.webkitIndexedDB;
	}
	else if (undefined !== window.mozIndexedDB) {
		return window.mozIndexedDB;
	}
	else if (undefined !== window.msIndexedDB) {
		return window.msIndexedDB;
	}

	throw new Error("Could not access IndexedDB Factory");
};

WebIndexDB.test = function() {
	
}

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
	this.endPoint = {x:x, y:y};
	this.duration = 0;
	this.paths = [];

	return;
}

PathAnimation.prototype.getStartPoint = function() {
	return this.startPoint;
}

PathAnimation.prototype.getEndPoint = function() {
	return this.endPoint;
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
}

/*
 * File: command_history.js 
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: command history
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function Command() {
	this.count = 0;
	
	this.doit = function() {
		this.count = this.count + 1;
		console.log("command: doit " + this.count);
		
		return;
	}
	
	this.undo = function() {
		this.count = this.count - 1;
		console.log("command: undo " + this.count);
		
		return;
	}	
}

function CompositeCommand() {
}

CompositeCommand.prototype.init = function() {
	this.cmds = [];

	return this;
}

CompositeCommand.prototype.addCommand = function(cmd) {
	this.cmds.push(cmd);

	return this;
}
	
CompositeCommand.prototype.destroy = function() {
	return this.clear();
}

CompositeCommand.prototype.clear = function() {
	this.cmds.clear();
	
	return this;
}
	
CompositeCommand.prototype.doit = function() {
	for(var i = 0; i < this.cmds.length; i++) {
		var cmd = this.cmds[i];
		cmd.doit();
	}
	
	return this;
}
	
CompositeCommand.prototype.undo = function() {
	for(var i = 0; i < this.cmds.length; i++) {
		var cmd = this.cmds[i];
		cmd.undo();
	}
	
	return this;
}	

CompositeCommand.create = function() {
	var cmd = new CompositeCommand();

	return cmd.init();
}

function CommandHistory() {
	this.listeners = new Array();
	this.redos = [];
	this.undos = [];

	this.maxUndos = 20;

	this.setMaxUndos= function(maxUndos) {
		this.maxUndos = maxUndos;

		return;
	}

	this.clear = function () {
		this.redos.clear();
		this.undos.clear();

		return;
	}

	this.notify = function() {
		for(var i = 0; i < this.listeners.length; i++) {
			var listener = this.listeners[i];
			listener.onChanged(this.redos.length, this.undos.length);
		}
		
		return;
	}
	
	this.exec = function(cmd) {
		cmd.doit();
		
		this.undos.push(cmd);
		this.redos.clear();
		this.notify();
	
		if(this.undos.length > this.maxUndos) {
//			console.log("Max Undos reached: " + this.maxUndos + " remove this first one.");
			var cmd = this.undos.shift();
			delete cmd;
		}

		return;
	}
	
	this.redo = function() {
		if(this.redos.length > 0) {
			var cmd = this.redos.pop();
			cmd.doit();
			this.undos.push(cmd);
			this.notify();
		}

		return;
	}
	
	this.undo = function() {
		if(this.undos.length > 0) {
			var cmd = this.undos.pop();
			cmd.undo();
			this.redos.push(cmd);
			this.notify();
		}
		
		return;
	}
	
	this.countRedo = function() {
		return this.redos.length;
	}
	
	this.countUndo = function() {
		return this.undos.length;
	}
	
	this.addListener = function(listener) {
		this.listeners.push(listener);
		
		return;
	}
	
	this.removeListener = function(listener) {
		this.listeners.remove(listener);
		
		return;
	}
	
	return;
}
