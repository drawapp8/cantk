/*
 * File:   ui-radio-box.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Radio Box
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIRadioBox
 * @extends UICheckBox
 * 单选按钮。可以用setValue来勾选/去勾选，用getValue来判断是否勾选。
 *
 */
function UIRadioBox() {
	return;
}

UIRadioBox.prototype = new UICheckBox();
UIRadioBox.prototype.isUIRadioBox = true;

UIRadioBox.prototype.initUIRadioBox = function(type) {
	return this.initUICheckBox(type)
}

UIRadioBox.prototype.setParent = function(parentShape) {
	UIElement.prototype.setParent.call(this, parentShape);

	if(this.value) {
		this.setChecked();
	}

	return this;
}

UIRadioBox.prototype.onFromJsonDone = function() {
	if(this.value) {
		this.setChecked();
	}

	return this;
}

UIRadioBox.prototype.setChecked = function() {
	var parentShape = this.getParent();

	if(parentShape) {
		for(var i = 0; i < parentShape.children.length; i++) {
			var shape = parentShape.children[i];
			if(shape.isUIRadioBox) {
				shape.setValue(false);
			}
		}
	}

	this.setValue(true);

	return this;
}

UIRadioBox.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}
	
	this.setChecked();
	
	return this.callOnClickHandler(point);
}

function UIRadioBoxCreator(w, h) {
	var args = ["ui-radiobox", "ui-radiobox", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIRadioBox();
		g.initUIRadioBox(this.type);

		return g;
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIRadioBoxCreator(50, 50, null, null, null, null, null, null));

