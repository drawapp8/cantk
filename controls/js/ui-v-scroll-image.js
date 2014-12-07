/*
 * File:   ui-v-scroll-image.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Vertical Scrollable Image
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIVScrollImage() {
	return;
}

UIVScrollImage.prototype = new UIVScrollView();

UIVScrollImage.prototype.initUIVScrollImage = function(type) {
	this.initUIVScrollView(type, 0, null, null);	
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.widthAttr = UIElement.WIDTH_SCALE;
	this.heightAttr = UIElement.HEIGHT_SCALE;
	this.setSize(200, 200);
	
	this.setImage("option_image_0", null);
	this.setImage("option_image_1", null);
	this.setImage("option_image_2", null);
	this.setImage("option_image_3", null);
	this.setImage("option_image_4", null);
	this.setImage("option_image_5", null);
	this.setImage("option_image_6", null);
	this.setImage("option_image_7", null);
	this.setImage("option_image_8", null);
	this.setImage("option_image_9", null);
	this.setImage("option_image_10", null);
	this.setImage("option_image_11", null);
	this.setImage("option_image_12", null);
	this.setImage("option_image_13", null);
	this.setImage("option_image_14", null);

	return this;
}

UIVScrollImage.prototype.drawBgImage = function(canvas) {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);
	if(!image || !image.height) {
		canvas.fillStyle = this.style.fillColor;
		canvas.fillRect(0, 0, this.w, this.h);
		return;
	}
	var scale = this.w/image.width;
	var range = image.height * scale;

	var x = 0; 
	var y = this.offset/scale;
	var w = image.width;
	var h = Math.min(this.h/scale, image.height-y);
	var dx = 0; 
	var dy = 0;
	var dw = this.w; 
	var dh = h * scale;

	canvas.drawImage(image, x, y, w, h, dx, dy, dw, dh);

	return;
}

UIVScrollImage.prototype.getScrollRange = function() {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);
	if(image && image.height && image.width) {
		var scale = this.w/image.width;

		return scale * image.height + 60;
	}
	else {
		return this.h;
	}
}

UIVScrollImage.prototype.afterPaintChildren = function(canvas) {
	this.drawScrollBar(canvas);

	if(this.mode === Shape.MODE_EDITING) {
		this.drawPageDownUp(canvas);
	}

	return;
}

function UIVScrollImageCreator() {
	var args = ["ui-v-scroll-image", "ui-v-scroll-image", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIVScrollImage();
		return g.initUIVScrollImage(this.type);
	}
	
	return;
}
