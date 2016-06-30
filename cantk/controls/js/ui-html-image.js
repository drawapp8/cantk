/*
 * File:   ui-html-image.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Html Image
 * 
 * Copyright (c) 2015 Tangram HD Inc.
 * 
 */

function UIHtmlImage() {
	return;
}

UIHtmlImage.prototype = new UIHtml();
UIHtmlImage.prototype.isUIHtmlImage = true;

UIHtmlImage.prototype.getHtmlContent = function() {
	var scale = this.getRealScale();
	var w = Math.round(scale * this.w);
	var h = Math.round(scale * this.h);
	var src = this.getImageSrcByType(UIElement.IMAGE_DEFAULT); 
	var str = '<img src="' + src + '" width=' + w + ' height=' + h + '>';

	return str;
}

UIHtmlImage.prototype.initUIHtmlImage = function(type) {
	this.initUIHtml(type, 400, 300);
	this.setImage(UIElement.IMAGE_DEFAULT, null);

	return this;
}

function UIHtmlImageCreator() {
	var args = ["ui-html-image", "ui-html-image", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIHtmlImage();
		return g.initUIHtmlImage(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIHtmlImageCreator());

