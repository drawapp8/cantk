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

