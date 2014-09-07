/*
 * File:   ui-status-bar.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Status Bar 
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIStatusBar() {
	return;
}

UIStatusBar.prototype = new UIElement();
UIStatusBar.prototype.isUIStatusBar = true;

UIStatusBar.prototype.initUIStatusBar = function(type, w, h, bg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setImage(CANTK_IMAGE_DEFAULT, bg);
	this.images.display = CANTK_IMAGE_DISPLAY_SCALE;
	this.widthAttr = C_WIDTH_FILL_PARENT;

	return this;
}

UIStatusBar.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUILabel || shape.isUIImage || shape.isUIButton) {
		return true;
	}

	return false;
}

UIStatusBar.prototype.afterChildAppended = function(shape) {
	shape.yAttr = C_Y_MIDDLE_IN_PARENT;
	if(this.type === "ui-menu-bar") {
		shape.hideSelectMark = true;
		shape.textType = C_SHAPE_TEXT_NONE;
		this.hideSelectMark = true;
	}

	return true;
}

UIStatusBar.prototype.beforeRelayoutChild = function(shape) {
	shape.yAttr = C_Y_MIDDLE_IN_PARENT;

	return true;
}

function UIStatusBarCreator(type, w, h, bg) {
	var args = [type, "ui-status-bar", null, true];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIStatusBar();
		return g.initUIStatusBar(this.type, w, h, bg);
	}
	
	return;
}

