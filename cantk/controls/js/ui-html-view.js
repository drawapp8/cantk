/*
 * File:   ui-html-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  HTML View
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIHtmlView() {
	return;
}

UIHtmlView.prototype = new UIHtml();
UIHtmlView.prototype.isUIHtmlView = true;

UIHtmlView.prototype.getHtmlContent = function() {
	var html = "<p>hello html view";
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	var url = this.getUrl();
	var content = this.getValue();

	if(url) {
		html = '<iframe seamless="seamless" scrolling="yes" width="'+w+'" height="'+h+'" src="'+url+'"></iframe>';
	}
	else if(content) {
		html = content;
	}

	return html;
}

UIHtmlView.prototype.setText = function(text) {
	this.text = text;

	return;
}


UIHtmlView.prototype.getValue = function() {
	return this.text ? this.text : "";
}

UIHtmlView.prototype.setValue = function(text) {
	this.text = text;

	return;
}

UIHtmlView.prototype.getUrl = function() {
	return this.url ? this.url : "";
}

UIHtmlView.prototype.setUrl = function(url) {
	this.url = url;

	return;
}

UIHtmlView.prototype.paintSelfOnly = function(canvas) {
	if(!this.htmlVisible) {
		var x = this.w >> 1;
		var y = this.h >> 1;
		var str = dappGetText("HtmlView");
		canvas.textBaseline = "middle";
		canvas.textAlign = "center";
		canvas.font = this.style.getFont();
		canvas.fillStyle = this.style.textColor;
		canvas.fillText(str, x, y);
	}

	return;
}

UIHtmlView.prototype.initUIHtmlView = function(type) {
	this.initUIHtml(type, 400, 300);
	this.setValue("<p>hello html view");
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.setScrollable(true);

	return this;
}

function UIHtmlViewCreator() {
	var args = ["ui-html-view", "ui-html-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIHtmlView();
		return g.initUIHtmlView(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIHtmlViewCreator());


