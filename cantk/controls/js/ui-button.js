/*
 * File:   ui-button.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Button
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIButton
 * @extends UIElement
 * 按钮。被点击后触发一个回调函数。可以设置按钮在不同状态下的图片。
 *
 * * UIElement.IMAGE_NORMAL 正常时的图片。
 * * UIElement.IMAGE_ACTIVE 按下时的图片。
 * * UIElement.IMAGE_FOCUSED 得到焦点时的图片。
 * * UIElement.IMAGE_DISABLE 禁用时的图片。
 * * "option_image_0" 备用图片0
 * * "option_image_1" 备用图片1
 * * "option_image_2" 备用图片2
 * * "option_image_3" 备用图片3
 * ...
 * * "option_image_14" 备用图片14
 *
 * 注：备用图片在IDE的图片属性页的图片用途里显示为"图片_X"
 *
 */

function UIButton() {
	return;
}

UIButton.prototype = new UIElement();
UIButton.prototype.isUIButton = true;

UIButton.prototype.initUIButton = function(type, w, h) {
	this.initUIElement(type);	

	this.setMargin(5, 5);
	this.setDefSize(w, h);
	this.setSizeLimit(20, 20);
	this.setAutoScaleFontSize(true);
	this.setTextType(Shape.TEXT_INPUT);
	this.images.display = UIElement.IMAGE_DISPLAY_9PATCH;
	this.setImage(UIElement.IMAGE_ACTIVE, null);
	this.setImage(UIElement.IMAGE_NORMAL, null);
	this.setImage(UIElement.IMAGE_DISABLE, null);
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
	this.addEventNames(["onUpdateTransform"]); 

	return this;
}

UIButton.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;

UIButton.prototype.paintSelfOnly =function(canvas) {
	if(this.pointerDown) {
		var image = this.getHtmlImageByType(UIElement.IMAGE_ACTIVE);

		if(!image) {
			canvas.fillStyle = this.style.fillColor;
			canvas.fillRect(0, 0, this.w, this.h);
		}
	}

	return;
}

function UIButtonCreator(w, h) {
	var args = ["ui-button", "ui-button", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIButton();
		return g.initUIButton(this.type, w, h);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIButtonCreator(120, 60));

