/*
 * File:   ui-radio-box.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Radio Box
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIRadioBox() {
	return;
}

UIRadioBox.prototype = new UICheckBox();
UIRadioBox.prototype.isUIRadioBox = true;

UIRadioBox.prototype.initUIRadioBox = function(type, w, h, onFocusedImg, onActiveImg, onImg, offFocusedImg, offActiveImg, offImg) {
	return this.initUICheckBox(type, w, h, onFocusedImg, onActiveImg, onImg, offFocusedImg, offActiveImg, offImg)
}

UIRadioBox.prototype.setParent = function(parentShape) {
	this.parentShape = parentShape;

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

function UIRadioBoxCreator(w, h, onFocusedImg, onActiveImg, onImg, offFocusedImg, offActiveImg, offImg) {
	var args = ["ui-radiobox", "ui-radiobox", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIRadioBox();
		g.initUIRadioBox(this.type, w, h, onFocusedImg, onActiveImg, onImg, offFocusedImg, offActiveImg, offImg);

		return g;
	}
	
	return;
}

