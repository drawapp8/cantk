/*
 * File:   ui-toolbar.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Toolbar
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIToolBar() {
	return;
}

UIToolBar.prototype = new UIElement();
UIToolBar.prototype.isUIToolBar = true;

UIToolBar.prototype.initUIToolBar = function(type, atTop, h, bg) {
	this.initUIElement(type);	

	this.xAttr = UIElement.X_LEFT_IN_PARENT;
	this.widthAttr = UIElement.WIDTH_FILL_PARENT;
	this.yAttr = atTop ? UIElement.Y_TOP_IN_PARENT : UIElement.Y_BOTTOM_IN_PARENT;

	this.setDefSize(200, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.setSizeLimit(100, 50, 2000, 200);

	return this;
}

UIToolBar.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUILabel || shape.isUIImage || shape.isUIButton || shape.isUIGroup 
	|| shape.isUIButtonGroup || shape.isUIEdit || shape.isUIImageButton
	|| shape.isUICheckBox || shape.isUIRadioBox || shape.isUIProgressBar || shape.isUISwitch 
	|| shape.isUILedDigits || shape.isUIGroup || shape.isUILayout || shape.isUIWaitBar || shape.isUIColorBar) {
		return true;
	}

	return false;
}

UIToolBar.prototype.paintSelfOnly =function(canvas) {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);

	if(!image) {
		canvas.beginPath();
		canvas.fillStyle = this.style.fillColor;
		canvas.fillRect(0, 0, this.w, this.h);
	}

	return;
}

function UIToolBarCreator(type, atTop, h, bg) {
	var args = [type, "ui-toolbar", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIToolBar();
		return g.initUIToolBar(type, atTop, h, bg);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIToolBarCreator("ui-toolbar", true, 85, null));

