/*
 * File:   ui-window-loading.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Loading Window
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UILoadingWindow() {
	return;
}

UILoadingWindow.prototype = new UINormalWindow();
UILoadingWindow.prototype.isUILoadingWindow = true;

UILoadingWindow.prototype.getImageResources = function() {
	return this.imageResources ? this.imageResources : "";
}

UILoadingWindow.prototype.getAudioResources = function() {
	return this.audioResources ? this.audioResources : "";
}

UILoadingWindow.prototype.setImageResources = function(imageResources) {
	this.imageResources = imageResources;

	return;
}

UILoadingWindow.prototype.setAudioResources = function(audioResources) {
	this.audioResources = audioResources;

	return;
}

UILoadingWindow.prototype.loadAudioResources = function(onProgress) {
	var win = this;
	var arr = this.audioResources.split("\n");

	for(var i = 0; i < arr.length; i++) {
		var iter = arr[i];
		if(!iter) {
			continue;
		}

		console.log("Loading " + iter);
		this.resources.totalResouces++;
		this.resources.loadingResouces++;

		var audio = new Audio();
		audio.preload = "auto";
		
		function onAudioLoad(e) {
			win.resources.loadingResouces--;
			onProgress(win.resources.totalResouces, win.resources.loadingResouces, true, this.src);
		}
		
		audio.addEventListener('canplaythrough', onAudioLoad, true);
		audio.onerror = function(e) {
			win.resources.loadingResouces--;
			win.resources.failedResouces++;
			onProgress(win.resources.totalResouces, win.resources.loadingResouces, false, this.src);
		}
		audio.src = iter;
		audio.load();

		win.resources.audios.push(audio);
	}

	return;
}

UILoadingWindow.prototype.loadImageResources = function(onProgress) {
	var win = this;
	var arr = this.imageResources.split("\n");

	for(var i = 0; i < arr.length; i++) {
		var iter = arr[i];
		if(!iter) {
			continue;
		}

		console.log("Loading " + iter);
		this.resources.totalResouces++;
		this.resources.loadingResouces++;

		var image = new Image();
		image.onload = function(e) {
			win.resources.loadingResouces--;
			onProgress(win.resources.totalResouces, win.resources.loadingResouces, true, this.src);
		}
		
		image.onerror = function(e) {
			win.resources.loadingResouces--;
			win.resources.failedResouces++;
			onProgress(win.resources.totalResouces, win.resources.loadingResouces, false, this.src);
		}
		image.src = iter;

		win.resources.images.push(image);
	}

	return;
	
}

UILoadingWindow.prototype.loadResources = function(onProgress) {
	this.resources = {};
	this.resources.audios = [];
	this.resources.images = [];
	this.resources.totalResouces = 0;
	this.resources.failedResouces = 0;
	this.resources.loadingResouces = 0;

	if(this.imageResources) {
		this.loadImageResources(onProgress);
	}

	if(this.audioResources) {
		this.loadAudioResources(onProgress);
	}

	if(!this.resources.totalResouces) {
		onProgress(1, 0, false, "");
	}

	return;
}

function UILoadingWindowCreator(bg) {
	var args = ["ui-window-loading", "ui-window-loading", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UILoadingWindow();
		
		g.initUIWindow(this.type, 0, 0, 100, 100, bg);
		g.widthAttr = UIElement.WIDTH_FILL_PARENT;
		g.heightAttr = UIElement.HEIGHT_FILL_PARENT;
		g.windowType = "splash";
		g.animHint = "none";
		g.duration = 30000;

		return g;
	}
	
	return;
}
