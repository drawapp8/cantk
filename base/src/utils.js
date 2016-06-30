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


