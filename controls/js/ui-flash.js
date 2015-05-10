/*
 * File:   ui-flash.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Flash 
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIFlash() {
	return;
}

UIFlash.prototype = new UIHtml();
UIFlash.prototype.isUIFlash = true;

UIFlash.prototype.getHtmlContent = function() {
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	var src = this.value ? this.value : "";

	var html = '<object type="application/x-shockwave-flash" width="'+w+'" height="'+h+'"> <param name="movie" value="'+src+'" /> <param name="quality" value="high" /></object>';

	return html;
}

UIFlash.prototype.initUIFlash = function(type) {
	this.initUIHtml(type, 400, 300);
	this.setValue("test/5.swf");
	this.setImage(UIElement.IMAGE_DEFAULT, null);

	return this;
}

function UIFlashCreator() {
	var args = ["ui-flash", "ui-flash", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIFlash();
		return g.initUIFlash(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIFlashCreator());

