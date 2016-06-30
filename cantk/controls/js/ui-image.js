/*
 * File:   ui-image.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Image
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */


/**
 * @class UIImage
 * @extends UIElement
 * 用来显示一张图片。UIImage可以设置多张图片，但只有一张是当前显示的图片，其它图片是备用图片(目前为15张，可以增加)。可以用setValue把指定的备用图片设置为当前图片。
 *
 * 注意：getValue返回setValue设置的值，如果没有调用过setValue，getValue返回-1。
 *
 * 把第一张备用图片设置为当前图片(可以在UIImage的图片属性页中设置备用图片)：
 *
 *     @example small frame
 *     this.setImage(0);
 *
 * 或者：
 *
 *     @example small frame
 *     this.setValue(0);
 *
 */
function UIImage() {
	return;
}

UIImage.prototype = new UIElement();
UIImage.prototype.isUIImage = true;

UIImage.prototype.saveProps = ["keepSizeWithImage"];
UIImage.prototype.initUIImage = function(type, w, h, bg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_INPUT);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
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
	this.setCanRectSelectable(false, true);
	this.addEventNames(["onUpdateTransform"]);

	this.scaleX = 1;
	this.scaleY = 1;
	this.drawText = null;
	this.beforePaint = null;
	this.afterPaint = null;
	this.highlightConfig = null;

	return this;
}

UIImage.prototype.setValue = function(value) {
	this.v = value;
	return this.setImageSrc(value);
}

UIImage.prototype.getValue = function() {
	return (this.v !== undefined) ? this.v : -1;
}

UIImage.prototype.setImageSrc = function(value) {
	this.setImage(UIElement.IMAGE_DEFAULT, value);

	return this;
}

UIImage.prototype.getImageSrc = function(type) {
	return this.getImageSrcByType(type ? type : UIElement.IMAGE_DEFAULT);
}

UIImage.prototype.getHtmlImage = function(type) {
	return this.getHtmlImageByType(type ? type : UIElement.IMAGE_DEFAULT);
}

UIImage.prototype.getImageSrcRect = function() {
	var image = this.getImageByType(UIElement.IMAGE_DEFAULT);
	if(this.srcRect) {
		return this.srcRect;
	}
	else if(image) {
		return image.getImageRect();
	}
	else {
		return null;
	}
}

UIImage.prototype.setImageSrcRect = function(x, y, w, h) {
	this.srcRect = {};
	this.srcRect.x = x;
	this.srcRect.y = y;
	this.srcRect.w = w;
	this.srcRect.h = h;

	return;
}

UIImage.prototype.fitToImage = function() {
	var srcRect = this.getImageSrcRect();
	if(srcRect && srcRect.w && srcRect.h) {
		this.w = srcRect.rw || srcRect.w;
		this.h = srcRect.rh || srcRect.h;
	}

	return;
}

UIImage.prototype.fixChildSize = function() {
	return;
}

UIImage.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;

function UIImageCreator(type) {
	var args = [type, "ui-image", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImage();
		return g.initUIImage(this.type, 200, 200, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIImageCreator("ui-image"));
ShapeFactoryGet().addShapeCreator(new UIImageCreator("ui-icon"));

//for compatible
UIImage.prototype.setBorderStyle = function(borderColor, borderWidth) {
	return;
}

UIImage.prototype.setClickedStyle = function(type, param) {

	return;
}

UIImage.prototype.getBgImage = function() {
	return this.images.default_bg;
}

UIImage.prototype.drawTextTips = function(canvas) {
}

UIImage.prototype.paintSelfFast = function(canvas) {
	var opacity = this.opacity;
	var px = this.w * this.pivotX;
	var py = this.h * this.pivotY;
	
	canvas.save();
	if(opacity !== 1) {
		canvas.globalAlpha *=  opacity;
	}

	canvas.translate(this._left, this._top);
	canvas.translate(px, py);
	canvas.scale(this.scaleX, this.scaleY);
	canvas.rotate(this.rotation);
	canvas.translate(-px, -py);

	this.drawBgImage(canvas);
	canvas.restore();
}

