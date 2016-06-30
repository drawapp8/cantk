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


