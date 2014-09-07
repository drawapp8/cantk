/*
 * File:   ui-toolbar.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Toolbar
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIToolBar() {
	return;
}

UIToolBar.prototype = new UIElement();
UIToolBar.prototype.isUIToolBar = true;

UIToolBar.prototype.initUIToolBar = function(type, atTop, h, bg) {
	this.initUIElement(type);	

	this.xAttr = C_X_LEFT_IN_PARENT;
	this.widthAttr = C_WIDTH_FILL_PARENT;
	this.yAttr = atTop ? C_Y_TOP_IN_PARENT : C_Y_BOTTOM_IN_PARENT;

	this.setDefSize(200, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setImage(CANTK_IMAGE_DEFAULT, bg);
	this.setSizeLimit(100, 50, 2000, 200);

	return this;
}

UIToolBar.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUILabel || shape.isUIImage || shape.isUIButton || shape.isUIGroup || shape.isUIButtonGroup || shape.isUIEdit
	|| shape.isUICheckBox || shape.isUIRadioBox || shape.isUIProgressBar || shape.isUISwitch 
	|| shape.isUILedDigits || shape.isUIGroup || shape.isUILayout || shape.isUIWaitBar || shape.isUIColorBar) {
		return true;
	}

	return false;
}

UIToolBar.prototype.paintSelfOnly =function(canvas) {
	var image = this.getHtmlImageByType(CANTK_IMAGE_DEFAULT);

	if(!image) {
		canvas.beginPath();
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
