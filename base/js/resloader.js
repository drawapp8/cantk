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

ResLoader.loadedInc = function() {
	ResLoader.finished++;

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

ResLoader.getFromCache = function(src) {
	return ResLoader.cache[src];
}

ResLoader.resRoot = null;
ResLoader.setResRoot = function(resRoot) {
	ResLoader.resRoot = resRoot;

	return;
}

ResLoader.toAbsURL = function(url) {
	if(!url || url.indexOf("://") > 0) {
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

	//var audio = new Audio();
	var audio = document.createElement('audio');
	document.body.appendChild(audio);

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

ResLoader.loadScript = function(src, force, onSuccess, onFail) {
	var script = null;
	var scripts = document.scripts;
	var node = document.head ? document.head : document.body;
	var timestamp = "timestamp=" + Date.now();
	if(src.indexOf("?") < 0) {
		timestamp = "?" + timestamp;
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
