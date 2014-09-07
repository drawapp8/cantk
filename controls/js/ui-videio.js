/*
 * File:   ui-vedio.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Vedio 
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIVideo() {
	return;
}

UIVideo.prototype = new UIHtml();
UIVideo.prototype.isUIVideo = true;

UIVideo.prototype.getHtmlContent = function() {
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	var src = this.value ? this.value : "";
	var loop = this.loop ? 'loop="loop" ' : "";
	var autoPlay = this.autoPlay ? 'autoplay="true" ' : "";
	var showControls = this.showControls ? 'controls="controls" ' :"";

	var html = '<video width="'+w+'" height="'+h+'" preload="true" '+ showControls + loop + autoPlay + 'src="'+src+'"></video>';

	return html;
}

UIVideo.prototype.beforeHideHTML = function() {
	video = this.getVideoElement();
	if(video.src && !video.puased) {
		video.pause();
	}

	return;
}

UIVideo.prototype.getVideoElement = function() {
	if(this.element) {
		var video = this.element.getElementsByTagName("video");
		return video.length ? video[0] : null;
	}

	return null;
}

UIVideo.prototype.setShowControls = function(value) {
	this.showControls = value;

	return;
}

UIVideo.prototype.isShowControls = function() {
	return this.showControls;
}

UIVideo.prototype.setLoop = function(value) {
	this.loop = value;

	return;
}

UIVideo.prototype.isLoop = function() {
	return this.loop;
}

UIVideo.prototype.setAutoPlay = function(value) {
	this.autoPlay = value;

	return;
}

UIVideo.prototype.isAutoPlay = function() {
	return this.autoPlay;
}

UIVideo.prototype.initUIVideo = function(type) {
	this.initUIHtml(type, 400, 300);
	this.setValue("http://www.w3school.com.cn/i/movie.ogg");
	this.setImage(CANTK_IMAGE_DEFAULT, null);

	return this;
}

function UIVideoCreator() {
	var args = ["ui-video", "ui-video", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIVideo();
		return g.initUIVideo(this.type);
	}
	
	return;
}

