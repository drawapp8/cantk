/*
 * File:   ui-check-box.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Check Box
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UICheckBox
 * @extends UIElement
 * 多选按钮。可以用setValue来勾选/去勾选，用getValue来判断是否勾选。
 *
 */

/**
 * @event onChanged
 * 勾选状态变化时触发本事件。
 * @param {Boolean} value true表示勾选，false表示未勾选。
 */
function UICheckBox() {
	return;
}

UICheckBox.prototype = new UIElement();
UICheckBox.prototype.isUICheckBox = true;

UICheckBox.prototype.initUICheckBox = function(type) {
	this.initUIElement(type);	

	this.setDefSize(100, 100);
	this.setTextType(Shape.TEXT_INPUT);
	this.images.display = UIElement.IMAGE_DISPLAY_SCALE;

	this.setImage(UIElement.IMAGE_CHECKED_FG, null);
	this.setImage(UIElement.IMAGE_UNCHECK_FG, null);

	this.addEventNames(["onChanged", "onUpdateTransform"]);
	this.value = false;

	return this;
}

UICheckBox.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIImage || shape.isUILabel;
}

UICheckBox.prototype.getValue = function() {
	return this.value;
}

UICheckBox.prototype.setValue = function(value, notify) {
	if(this.value != value) {
		this.value = value;
		if(notify) {
			this.callOnChangedHandler(this.value);
		}
	}

	return this;
}

UICheckBox.prototype.getBgImage = function() {
	return this.getImageByType(this.getValue() ? UIElement.IMAGE_CHECKED_FG : UIElement.IMAGE_UNCHECK_FG);
}

UICheckBox.prototype.getTextColor = function(canvas) {
	return this.getValue() ? this.style.textColorOn : this.style.textColor;
}

UICheckBox.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}
	
	this.setValue(!this.getValue(), true);
	this.callOnClickHandler(point);

	return;
}

function UICheckBoxCreator() {
	var args = ["ui-checkbox", "ui-checkbox", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UICheckBox();
		return g.initUICheckBox(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UICheckBoxCreator());

